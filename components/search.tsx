import { gql, useLazyQuery } from "@apollo/client";
import { resetIdCounter, useCombobox } from "downshift";
import { debounce } from "lodash";
import { useRouter } from "next/router";

const SEARCH_PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS_QUERY($searchTerm: String) {
    searchItems: allProducts(
      where: {
        OR: [
          { name_contains_i: $searchTerm }
          { description_contains_i: $searchTerm }
        ]
      }
    ) {
      id
      name
      slug
      featuredAsset {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export const Search = () => {
  const router = useRouter();
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
      router.push({
        pathname: `/product/${selectedItem.slug}/${selectedItem.id}`,
      });
    },
    itemToString: (item: any) => item?.name || "",
  });
  return (
    <div className="mx-5">
      <div
        {...getComboboxProps()}
        className="flex flex-row rounded-lg shadow-lg"
      >
        <input
          {...getInputProps({
            type: "search",
            placeholder: "Search for a product here...",
            id: "search",
          })}
          className="w-full px-5 py-3 rounded-lg"
        />
      </div>
      <ul className="flex flex-col absolute z-10 space-y-3 bg-gray-50 w-96 mt-1 rounded-md shadow-md" {...getMenuProps()}>
        {isOpen &&
          items?.map((item: any, index: number) => (
            <li
              {...getItemProps({ item, index })}
              key={item?.id}
              className={`py-2 pl-11 ${highlightedIndex === index ? "hover:bg-gray-300" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item?.featuredAsset?.image?.publicUrlTransformed}
                alt=""
                className="w-12"
              />
              {item?.name}
            </li>
          ))}
        {isOpen && !items.length && !loading && (
          <li>Sorry, No Item found for the {inputValue}</li>
        )}
      </ul>
    </div>
  );
};
