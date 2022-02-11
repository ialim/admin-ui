import { useCallback, useState } from "react";
import { useEffect } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { calcNetTotal } from "../lib/basicCalculattions";
import { formatValue } from "../lib/format-value";
import { NumberField } from "./number-field";
interface FieldProps {
  control: any;
  register: Function;
  setValue: Function;
  getValues: Function;
  variant: any;
  status: string;
  action: "create" | "update";
  setDeleteProductPurchaseIds?: Function;
}

type WatchValues = { index: number; initialValues?: any } & Pick<
  FieldProps,
  "setValue" | "control" | "action"
>;

const GetWatchValues = ({
  index,
  control,
  setValue,
  initialValues,
  action,
}: WatchValues) => {
  const [variants] = useWatch({
    control,
    name: ["variants"],
  });

  const { quantity, cost, discount, received } = variants[index];

  console.log(quantity, cost, discount);
  const [tax, subTotal] = calcNetTotal(quantity, cost, discount);

  useEffect(() => {
    if (action === "create" && received > quantity) {
      alert("Received value cannot be greater than the expected quantity");
    }
    if (
      action === "update" &&
      initialValues &&
      initialValues[index]?.received + received > quantity
    ) {
      alert("Received value cannot be greater than the expected quantity");
    }
    setValue(`variants.${index}.tax`, tax);
    setValue(`variants.${index}.total`, subTotal);
  }, [
    action,
    index,
    initialValues,
    quantity,
    received,
    setValue,
    subTotal,
    tax,
  ]);

  return (
    <>
      <td className="pr-5">
        <span className="text-center font-medium w-32">{formatValue(tax)}</span>
      </td>
      <td className="pr-5 ">
        <span className="text-center font-medium w-32">
          {formatValue(subTotal)}
        </span>
      </td>
    </>
  );
};

let renderCount = 0;

export const Fields = ({
  control,
  register,
  setValue,
  getValues,
  variant,
  status,
  action,
  setDeleteProductPurchaseIds,
}: FieldProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const [initialFieldValues, setInitialFieldValues] = useState<any>(() =>
    fields?.map((field) => Object.fromEntries(Object.entries(field)))
  );

  const handleDelete = async (index: number, fieldId: string, e: any) => {
    e.preventDefault();
    // remove from list on create
    if (action === "create") {
      remove(index);
    }

    // delete the product purchase from db on update and list
    if (action === "update") {
      let productPurchaseId: string;

      const initialFieldValueIds = initialFieldValues.map(
        (value: any) => value.id
      );

      console.log(initialFieldValues, initialFieldValueIds, fieldId);

      productPurchaseId =
        initialFieldValues[initialFieldValueIds.indexOf(fieldId)]?.sku.split(
          "-"
        )[0];

      const response = confirm(
        "Are you sure you want to delete this Product Purchase"
      )
        ? true
        : false;
      if (response) {
        remove(index);
        initialFieldValues.splice(initialFieldValueIds.indexOf(fieldId), 1);
        productPurchaseId &&
          setDeleteProductPurchaseIds &&
          setDeleteProductPurchaseIds((arr: string[]) => [
            ...arr,
            productPurchaseId,
          ]);
      }
    }
  };

  const handleAlreadyExistingItem = useCallback(
    (variant: any) => {
      const fieldIds = fields.map((field) => field.id);
      if (!fieldIds.includes(variant?.id)) append(variant);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [append]
  );

  useEffect(() => {
    if (variant) {
      handleAlreadyExistingItem(variant);
    }
  }, [handleAlreadyExistingItem, variant]);

  return (
    <>
      {fields.map((field, index) => (
        <tr className="items-center text-sm font-light py-2" key={field.id}>
          <td className="pr-5">
            {getValues(`variants.${index}.name`) ||
              initialFieldValues[index]?.name}
          </td>
          <td className="pr-5">
            {getValues(`variants.${index}.itemcode`) ||
              Math.ceil(Math.random() * 100000)}
          </td>
          <td className="pr-5">
            <NumberField
              initialValue={Number(initialFieldValues[index]?.barcode || "")}
              name="barcode"
              register={register}
              setValue={setValue}
              index={index}
            />
          </td>
          <td className="pr-5">
            <NumberField
              initialValue={Number(initialFieldValues[index]?.quantity || "0")}
              name="quantity"
              register={register}
              setValue={setValue}
              index={index}
            />
          </td>
          {status === "partial" ? (
            <td className="pr-5">
              <NumberField
                initialValue={Number(
                  initialFieldValues[index]?.received || "0"
                )}
                name="received"
                register={register}
                setValue={setValue}
                index={index}
                max={getValues(`variants.${index}.quantity`)}
              />
            </td>
          ) : null}
          <td className="pr-5">
            <NumberField
              initialValue={Number(initialFieldValues[index]?.cost || "0")}
              name="cost"
              register={register}
              setValue={setValue}
              index={index}
            />
          </td>
          <td className="pr-5">
            <NumberField
              initialValue={Number(initialFieldValues[index]?.discount || "0")}
              name="discount"
              register={register}
              setValue={setValue}
              index={index}
            />
          </td>
          <GetWatchValues
            index={index}
            control={control}
            setValue={setValue}
            initialValues={initialFieldValues}
            action={action}
          />
          <td className="text-center">
            <button
              className="px-3 py-2 rounded-md bg-red-600 text-center font-semibold text-sm text-white"
              onClick={(e) => handleDelete(index, field.id, e)}
            >
              Delete
            </button>
          </td>
          {console.log("Render count Invoice Fields: ", renderCount++)}
        </tr>
      ))}
    </>
  );
};
