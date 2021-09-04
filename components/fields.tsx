import { useCallback } from "react";
import { useEffect } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { calcNetTotal } from "../lib/basicCalculattions";
import { formatUpdateVariantStockOnDelete } from "../lib/format-data";
import { formatValue } from "../lib/format-value";
import { useDeleteProductPurchaseMutation } from "../lib/hooks/mutation/delete-product-purchase";
import { useUpdateSingleVariantStockMutation } from "../lib/hooks/mutation/update-variant";
import { Message, UpdateVariantStockInput } from "../types/types";
import { NumberField } from "./number-field";
interface FieldProps {
  control: any;
  register: Function;
  setValue: Function;
  getValues: Function;
  variant: any;
  status: string;
  action: "create" | "update";
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
}: FieldProps) => {
  let initialFieldValues: any = [];
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const [deleteProductPurchase, deleteResult] =
    useDeleteProductPurchaseMutation();

  const [updateVariantStock, updateResult] =
    useUpdateSingleVariantStockMutation();

  // Grab previous values on update
  action === "update" &&
    (initialFieldValues = fields?.map((field) =>
      Object.fromEntries(Object.entries(field))
    ));

  const deletePurchaseProductMutation = useCallback(
    async (productPurchaseId: string): Promise<Message> => {
      try {
        const res = await deleteProductPurchase({
          variables: { id: productPurchaseId },
        });
        return { type: "delete product purchase", ok: true, data: res.data };
      } catch (error) {
        return { type: "delete product purchase", ok: false, error };
      }
    },
    [deleteProductPurchase]
  );

  const updateSingleVariantStockMutation = useCallback(
    async (
      updateVariantStockInput: UpdateVariantStockInput
    ): Promise<Message> => {
      try {
        const res = await updateVariantStock({
          variables: { updateVariantStockInput },
        });
        return {
          type: "update variant stock on delete",
          ok: true,
          data: res.data,
        };
      } catch (error) {
        return { type: "update variant stock on delete", ok: false, error };
      }
    },
    [updateVariantStock]
  );

  const runDeleteProductPurchaseEffect = useCallback(
    async (id: string) => {
      const {
        ok,
        type,
        error,
        data: deleteData,
      } = await deletePurchaseProductMutation(id);

      if (ok) {
        const updateVariantStockInput =
          formatUpdateVariantStockOnDelete(deleteData);

        const { ok, type, error, data } =
          await updateSingleVariantStockMutation(updateVariantStockInput);
        ok ? console.log(type, data) : console.log(type, error?.message);
      }
    },
    [deletePurchaseProductMutation, updateSingleVariantStockMutation]
  );

  const handleDelete = async (index: number) => {
    // remove from list on create
    if (action === "create") {
      remove(index);
    }

    // delete the product purchase from db on update and list
    if (action === "update") {
      let productPurchaseId: string;

      productPurchaseId = initialFieldValues[index]?.sku.split("-")[0];

      if (confirm("Are you sure you want to delete this Product Purchase")) {
        runDeleteProductPurchaseEffect(productPurchaseId);
        remove(index);
      }
    }
  };

  useEffect(() => {
    if (variant) {
      append(variant);
    }
  }, [append, variant]);

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
              onClick={() => handleDelete(index)}
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
