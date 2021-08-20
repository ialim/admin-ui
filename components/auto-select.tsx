import { DocumentNode } from "@apollo/client";
import { useCombobox } from "downshift";
import { useEffect, useRef } from "react";
import { forwardRef, useState } from "react";
import { SVG } from "../public/svg";
import { QuerySelection } from "./query-selection";

type ButtonProps = JSX.IntrinsicElements["button"];

type AutoSelectProps = {
  searchQuery: DocumentNode;
  title: string;
  keyName: string;
  setValue: any;
} & ButtonProps;

export const AutoSelect = forwardRef<HTMLButtonElement, AutoSelectProps>(
  ({ searchQuery, title, keyName, setValue, name, ...rest }, ref) => {
    const [drop, setDrop] = useState(false);
    const [selelected, setSelected] = useState("");
    const [allItems, setAllItems] = useState([]);
    const [inputItems, setInputItems] = useState([]);
    const { down } = SVG;

    const onClick = () => {
      toggleMenu();
      setDrop(!drop);
    };

    const itemToString = (item: any) => (item ? item.name : "");

    const {
      isOpen,
      getMenuProps,
      highlightedIndex,
      getItemProps,
      getInputProps,
      getComboboxProps,
      toggleMenu,
    } = useCombobox({
      items: inputItems,
      itemToString,
      onInputValueChange: ({ inputValue }) => {
        setInputItems(
          allItems.filter((item) =>
            itemToString(item)
              .toLowerCase()
              .startsWith(inputValue?.toLowerCase())
          )
        );
      },
      onSelectedItemChange: ({ selectedItem }) => {
        setSelected(itemToString(selectedItem));
        setDrop(!drop);
      },
    });

    useEffect(() => {
      if (!isOpen) {
        setDrop(false)
        setValue(name, selelected)
      }
    }, [isOpen, name, selelected, setValue])

    return (
      <div className="relative">
        <button
          onClick={onClick}
          title={title}
          value={selelected}
          className="w-full rounded-md shadow-sm text-gray-400 py-2 px-2 flex justify-between text-left mt-1 border-gray-400 border-[1px]"
          ref={ref}
          type="button"
        >
          {selelected ? (
            <span className="text-left text-indigo-800">{selelected}</span>
          ) : (
            <span className="text-left">{title}</span>
          )}
          <span className="inline-block align-middle">{down}</span>
        </button>
        {drop && (
          <QuerySelection
            isOpen={isOpen}
            getMenuProps={getMenuProps}
            highlightedIndex={highlightedIndex}
            getItemProps={getItemProps}
            getInputProps={getInputProps}
            getComboboxProps={getComboboxProps}
            setAllItems={setAllItems}
            setInputItems={setInputItems}
            itemToString={itemToString}
            inputItems={inputItems}
            searchQuery={searchQuery}
            keyName={keyName}
          />
        )}
      </div>
    );
  }
);
