import { DocumentNode, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { ErrorMessage } from "./error-message";

interface QuerySelectionProps {
  isOpen: any;
  getMenuProps: any;
  highlightedIndex: number;
  getItemProps: any;
  getInputProps: any;
  getComboboxProps: any;
  setAllItems: any;
  setInputItems: any;
  itemToString: any;
  inputItems: any;
  searchQuery: DocumentNode;
  keyName: string;
}

export const QuerySelection = ({
  isOpen,
  getMenuProps,
  highlightedIndex,
  getItemProps,
  getInputProps,
  getComboboxProps,
  setAllItems,
  setInputItems,
  itemToString,
  inputItems,
  searchQuery,
  keyName,
}: QuerySelectionProps) => {
  const { loading, error, data } = useQuery(searchQuery);

  useEffect(() => {
    if (data) {
      const options = data[keyName] || [];
      setAllItems(options);
      setInputItems(options);
    }
  }, [data, keyName, setAllItems, setInputItems]);

  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="px-2 border-2 mt-1 py-3 rounded-md absolute bg-gray-50 z-30 w-full">
      <div {...getComboboxProps()}>
        <input
          className="w-full rounded-md border-2 px-2"
          {...getInputProps()}
        />
      </div>
      <ul className="mt-1 text-gray-400" {...getMenuProps()}>
        {isOpen && loading ? (
          <li>...Loading</li>
        ) : (
          isOpen &&
          inputItems.map((item: any, index: number) => (
            <li
              style={
                highlightedIndex === index
                  ? { backgroundColor: "#bde4ff", color: "indigo" }
                  : {}
              }
              {...getItemProps({ item, index })}
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
