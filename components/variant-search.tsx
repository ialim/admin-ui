import { gql, useLazyQuery } from "@apollo/client";
import { resetIdCounter, useCombobox } from "downshift";
import { debounce } from "lodash";
import { Variant } from "../types/types";

const SEARCH_PRODUCTS_QUERY = gql`
  query SEARCH_VARIANT_QUERY($searchTerm: String) {
    searchItems: allProductVariants(where: { name_contains_i: $searchTerm }) {
      id
      itemcode
      name
    }
  }
`;

interface VariantSearchProps {
  updateVariant: any;
}

export const VariantSearch = ({ updateVariant }: VariantSearchProps) => {
  resetIdCounter();
  const [findItems, { loading, error, data }] = useLazyQuery(
    SEARCH_PRODUCTS_QUERY,
    { fetchPolicy: "no-cache" }
  );
  const items: any = data?.searchItems || [];
  const findItemsDelay = debounce(findItems, 350);
  const {
    isOpen,
    inputValue,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    reset,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items,
    onInputValueChange() {
      findItemsDelay({
        variables: {
          searchTerm: inputValue,
        },
      });
    },
    onSelectedItemChange({ selectedItem }) {
      console.log("Selected item change: ", selectedItem);
      const variant: Variant = {
        id: "",
        itemcode: 0,
        name: "",
        barcode: "",
        quantity: 0,
        received: 0,
        cost: 0,
        discount: 0,
        sku: "",
        total: 0,
        tax: 0,
      };
      if (selectedItem) {
        variant.id = selectedItem.id || "";
        variant.itemcode = selectedItem?.itemcode || 0;
        variant.name = selectedItem?.name || "";
        console.log("In search: ",variant)
        updateVariant(variant);
      }
      setTimeout(() => reset(), 1000);
    },
    itemToString: (item: any) => `(${item?.itemcode}) ${item?.name}` || "",
  });
  return (
    <div className="mt-1">
      <div
        {...getComboboxProps()}
        className="flex flex-row shadow-lg border-[1px] rounded-md border-gray-400"
      >
        <input
          {...getInputProps({
            type: "search",
            placeholder: "Search for a product variant here...",
            id: "search",
          })}
          className="w-full px-2 py-2 rounded-lg"
        />
      </div>
      <ul
        className="flex flex-col absolute z-10 space-y-3 bg-gray-50 w-96 mt-1 rounded-md shadow-md"
        {...getMenuProps()}
      >
        {isOpen &&
          items?.map((item: any, index: number) => (
            <li
              {...getItemProps({ item, index })}
              key={item?.id}
              className={`py-2 text-sm pl-2 ${
                highlightedIndex === index ? "hover:bg-gray-300" : ""
              }`}
            >
              {`(${item?.itemcode}) ${item?.name}`}
            </li>
          ))}
        {isOpen && !items.length && !loading && (
          <li>Sorry, No Item found for the {inputValue}</li>
        )}
      </ul>
    </div>
  );
};
