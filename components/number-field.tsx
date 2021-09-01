import { useEffect, useState } from "react";

interface NumberFieldProps {
  name: string;
  index: number;
  setValue: Function;
  register: Function;
  initialValue: number;
}

export const NumberField = ({
  name,
  setValue,
  index,
  register,
  initialValue,
}: NumberFieldProps) => {
  const [isEditing, setIsEditting] = useState(false);
  const [value, giveValue] = useState(initialValue || "");

  const onChange = (event: any) => {
    giveValue(event.target.value);
    setValue(`variants.${index}.${name}`, parseInt(event.target.value));
  };

  const toCurrency = (number: any) => {
    const formatter = new Intl.NumberFormat("yo-NG", {
      style: "decimal",
      currency: "NGN",
      maximumFractionDigits: 2,
      minimumFractionDigits: name === "quantity" ? 0 : 2,
    });

    return formatter.format(number);
  };

  const toggleEditing = () => {
    setIsEditting(!isEditing);
  };

  useEffect(() => {
    register(`variants.${index}.${name}`);
  }, [index, name, register]);

  return (
    <div>
      {isEditing ? (
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          onBlur={toggleEditing}
          className="bg-gray-100 text-center w-48"
        />
      ) : (
        <input
          type="text"
          name={name}
          value={toCurrency(value)}
          onFocus={toggleEditing}
          readOnly
          className="bg-gray-100 text-center w-48"
        />
      )}
    </div>
  );
};
