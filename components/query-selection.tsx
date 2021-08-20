import { DocumentNode, useQuery } from "@apollo/client";
import { useCombobox } from "downshift";
import { useEffect } from "react";
import { ErrorMessage } from "./error-message";

interface QuerySelectionProps {
  allItems: any;
  setAllItems: any;
  setInputItems: any;
  setDrop: any;
  setSelected:any;
  inputItems: any;
  searchQuery: DocumentNode;
  keyName: string;
  drop: boolean;
}

export const QuerySelection = ({
  allItems,
  setDrop,
  setAllItems,
  setInputItems,
  setSelected,
  inputItems,
  searchQuery,
  keyName,
  drop,
}: QuerySelectionProps) => {
  const { loading, error, data } = useQuery(searchQuery);

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
        allItems.filter((item: any) =>
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
    if (data) {
      const options = data[keyName] || [];
      setAllItems(options);
      setInputItems(options);
    }
    if(drop && !isOpen) toggleMenu()
  }, [data, drop, isOpen, keyName, setAllItems, setInputItems, toggleMenu]);

  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="px-2 border-2 mt-1 py-3 rounded-md absolute bg-gray-50 z-30 w-full">
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: "search",
            id: "search",
          })}
          className="w-full rounded-md border-2 px-2"
        />
      </div>
      <ul className="mt-1 text-gray-400" {...getMenuProps()}>
        {isOpen && loading ? (
          <li>...Loading</li>
        ) : (
          isOpen &&
          inputItems.map((item: any, index: number) => (
            <li
              {...getItemProps({ item, index })}
              className={`
                ${
                  highlightedIndex === index ? "bg-gray-300 text-indigo-800" : ""
                }`}
              key={`${item}${index}`}
            >
              {itemToString(item)}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
