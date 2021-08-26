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
}

type WatchValues = { index: number } & Pick<FieldProps, "setValue" | "control">;

const GetWatchValues = ({ index, control, setValue }: WatchValues) => {
  const [variants] = useWatch({
    control,
    name: ["variants"],
  });

  const { quantity, cost, discount } = variants[index];

  console.log(quantity, cost, discount);
  const [tax, subTotal] = calcNetTotal(quantity, cost, discount);

  useEffect(() => {
    setValue(`variants.${index}.tax`, tax);
    setValue(`variants.${index}.total`, subTotal);
  }, [index, setValue, subTotal, tax]);

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
}: FieldProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  useEffect(() => {
    if (variant) {
      append(variant);
    }
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
              className="bg-gray-100 text-center w-48"
              type="text"
              {...register(`variants.${index}.barcode`, {})}
              defaultValue={0}
            />
          </td>
          <td className="pr-5">
            <NumberField
              name="quantity"
              register={register}
              setValue={setValue}
              index={index}
            />
          </td>
          {status === "partial" ? (
            <td className="pr-5">
              <input
                className="bg-gray-100 text-center w-48"
                type="number"
                defaultValue={0}
              />
            </td>
          ) : null}
          <td className="pr-5">
            <NumberField
              name="cost"
              register={register}
              setValue={setValue}
              index={index}
            />
          </td>
          <td className="pr-5">
            <NumberField
              name="discount"
              register={register}
              setValue={setValue}
              index={index}
            />
          </td>
          <GetWatchValues index={index} control={control} setValue={setValue} />
          <td className="text-center">
            <button
              className="px-3 py-2 rounded-md bg-red-600 text-center font-semibold text-sm text-white"
              onClick={() => remove(index)}
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
