import { DocumentNode, useLazyQuery } from "@apollo/client";
import { debounce } from "lodash";
import { useState } from "react";
import { useAsyncDebounce } from "react-table";
import { CLIENT_SIDE_FILTERING_LIMIT } from "../lib/constants";

interface SearchTableProps {
  query: DocumentNode;
  name: string;
  setData: Function;
  filter: string;
  setFilter: Function;
  type: "SERVER" | "CLIENT";
}

export const SearchTable = ({
  query,
  setData,
  name,
  filter,
  setFilter,
  type,
}: SearchTableProps) => {
  const [value, setValue] = useState(filter);
  const [findItems, { loading, error, data }] = useLazyQuery(query, {
    fetchPolicy: "no-cache",
  });
  const findItemsDelay = debounce(findItems, 350);
  const onChange = debounce((value) => {
    setFilter(value || undefined);
  }, 200);

  const handleChange = (e: any) => {
    setValue(e.target.value);
    type === "CLIENT"
      ? onChange(e.target.value)
      : findItemsDelay({ variables: { searchTerm: e.target.value } });
    data && setData(data?.[name]);
    console.log(data, data?.[name]);
  };
  return (
    <div>
      <input
        type="search"
        name="purchases"
        id="purchases"
        value={value || ""}
        onChange={(e) => handleChange(e)}
        className="w-full px-2 py-1 rounded-lg"
        placeholder="search table here..."
      />
    </div>
  );
};
