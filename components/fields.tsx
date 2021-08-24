import { useEffect } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { calcNetTotal } from "../lib/basicCalculattions";

interface FieldProps {
  control: any;
  register: any;
  setValue: any;
  getValues: any;
  variant: any;
  setVariants: any;
  variants: any[];
}

type WatchValues = { index: number; setVariants: any } & Partial<FieldProps>;

const GetWatchValues = ({
  index,
  control,
  setValue,
  setVariants,
}: WatchValues) => {
  const variants = useWatch({
    control,
    name: "variants",
  });

  const { quantity, cost, discount } = variants[index];

  console.log(quantity, cost, discount);
  const [tax, subTotal] = calcNetTotal(quantity, cost, discount);

  setVariants(variants);

  useEffect(() => {
    setValue(`variants.${index}.tax`, tax);
    setValue(`variants.${index}.total`, subTotal);
  }, [index, setValue, subTotal, tax]);

  return <></>;
};

export const Fields = ({
  control,
  register,
  setValue,
  getValues,
  variant,
  setVariants,
  variants,
}: FieldProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  useEffect(() => {
    append(variant);
  }, [append, variant]);

  return (
    <>
      {fields.map((field, index) => (
        <tr className="items-center text-sm font-light py-2" key={field.id}>
          <td className="pr-5">{getValues(`variants.${index}.name`)}</td>
          <td className="pr-5">
            {getValues(`variants.${index}.itemcode`) ||
              Math.ceil(Math.random() * 100000)}
          </td>
          <td className="pr-5">
            <input
              className="bg-gray-100"
              type="number"
              {...register(`variants.${index}.barcode`, {
                valueAsNumber: true,
              })}
              defaultValue={0}
            />
          </td>
          <td className="pr-5">
            <input
              className="bg-gray-100"
              type="number"
              {...register(`variants.${index}.quantity`, {
                valueAsNumber: true,
              })}
              defaultValue={0}
            />
          </td>
          <td className="pr-5">
            <input className="bg-gray-100" type="number" />
          </td>
          <td className="pr-5">
            <input
              className="bg-gray-100"
              type="number"
              {...register(`variants.${index}.cost`, {
                valueAsNumber: true,
              })}
              defaultValue={0}
            />
          </td>
          <td className="pr-5">
            <input
              className="bg-gray-100"
              type="number"
              {...register(`variants.${index}.discount`, {
                valueAsNumber: true,
              })}
              defaultValue={0}
            />
          </td>
          <td className="pr-5">
            <input
              type="number"
              className="hidden"
              defaultValue={0}
              {...register(`variants.${index}.tax`)}
              readOnly
            />
            {variants[index]?.tax.toFixed(2)}
          </td>
          <td className="pr-5">
            <input
              type="number"
              className="hidden"
              defaultValue={0}
              {...register(`variants.${index}.total`)}
              readOnly
            />
            {variants[index]?.total.toFixed(2)}
          </td>
          <td>
            <button
              className="px-3 py-2 rounded-md bg-red-600 text-center font-semibold text-sm text-white"
              onClick={() => remove(index)}
            >
              Delete
            </button>
          </td>
          {console.log("Total: ", getValues(`variants.${index}.total`))}
          <GetWatchValues
            index={index}
            control={control}
            setValue={setValue}
            setVariants={setVariants}
          />
        </tr>
      ))}
    </>
  );
};
