import { DocumentNode } from "@apollo/client";
import { useEffect } from "react";
import { forwardRef, useState } from "react";
import { SVG } from "../public/svg";
import { queryOption } from "../types/types";
import { QuerySelection } from "./query-selection";

type ButtonProps = JSX.IntrinsicElements["button"];

type AutoSelectProps = {
  searchQuery: DocumentNode;
  title: string;
  keyName: string;
  setValue: any;
  setDefaultValue?: queryOption;
} & ButtonProps;

export const AutoSelect = forwardRef<HTMLButtonElement, AutoSelectProps>(
  ({ searchQuery, title, keyName, setValue, name, setDefaultValue, ...rest }, ref) => {
    const [drop, setDrop] = useState(false);
    const [selelected, setSelected] = useState(setDefaultValue);
    const [allItems, setAllItems] = useState([]);
    const [inputItems, setInputItems] = useState([]);
    const { down } = SVG;

    const onClick = () => {
      setDrop(!drop);
    };

    useEffect(() => {
      if (drop === false) {
        setValue(name, selelected);
      }
    }, [drop, name, selelected, setValue]);

    return (
      <div className="relative">
        <button
          onClick={onClick}
          title={title}
          value={selelected?.name}
          className="w-full rounded-md shadow-sm text-gray-400 py-2 px-2 flex justify-between text-left mt-1 border-gray-400 border-[1px]"
          ref={ref}
          type="button"
        >
          {selelected?.name ? (
            <span className="text-left text-indigo-800">{selelected.name}</span>
          ) : (
            <span className="text-left">{title}</span>
          )}
          <span className="inline-block align-middle">{down}</span>
        </button>
        {drop && (
          <QuerySelection
            drop={drop}
            allItems={allItems}
            setAllItems={setAllItems}
            setDrop={setDrop}
            setInputItems={setInputItems}
            setSelected={setSelected}
            inputItems={inputItems}
            searchQuery={searchQuery}
            keyName={keyName}
          />
        )}
      </div>
    );
  }
);

AutoSelect.displayName = "Selection";
