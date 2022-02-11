import { DocumentNode } from "@apollo/client";
import { useState } from "react";
import { useEffect } from "react";
import {
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
  useGlobalFilter,
} from "react-table";
import { Action } from "./action";
import { SearchTable } from "./search-table";
import { IndeterminateCheckbox } from "./table-checkbox";

interface TableProps {
  columns: any[];
  data: object[];
  children?: React.ReactNode;
  loading?: boolean;
  pageCount?: any;
  fetchData?: any;
  entriesCount: number;
  searchQuery: DocumentNode;
  setData: Function;
  name: string;
  type: "SERVER" | "CLIENT";
  dataType: "sale" | "purchase"
}

export const Table = ({
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  entriesCount,
  searchQuery,
  setData,
  name,
  type,
  dataType,
}: TableProps) => {
  const [drop, setDrop] = useState(false)
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    setHiddenColumns,
    setGlobalFilter,
    allColumns,
    getToggleHideAllColumnsProps,
    state: { pageIndex, pageSize, selectedRowIds, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: type === "SERVER" ? true : false, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      ...(type === "SERVER" && { pageCount: controlledPageCount }),
      autoResetSortBy: false,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          // eslint-disable-next-line react/display-name
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          // eslint-disable-next-line react/display-name
          Cell: ({ row }) => (
            <div className="pl-5">
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
        {
          id: "action",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          // eslint-disable-next-line react/display-name
          Header: () => <div>Action</div>,
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          // eslint-disable-next-line react/display-name
          Cell: ({ row }) => (
            <div>
              <Action dataType={dataType} id={row.values["id"]} actions={["VIEW", "EDIT"]} />
            </div>
          ),
        },
      ]);
    }
  );

  
  useEffect(() => {
    setHiddenColumns(['id'])
    console.log(selectedRowIds);
    if (type === "SERVER") fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize, selectedRowIds, setHiddenColumns, type]);
  return (
    <div className="mx-5 mt-4">
      <div className="flex flex-row justify-between">
        <div>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <p className="inline-block ml-2">Records</p>
        </div>
        <SearchTable
          query={searchQuery}
          setData={setData}
          name={name}
          filter={globalFilter}
          setFilter={setGlobalFilter}
          type={type}
        />
        <div>export options</div>
        <div>
          <div>
            <IndeterminateCheckbox {...getToggleHideAllColumnsProps({"onChange": () => setDrop(!drop)})} /> columns
          </div>
          {drop && allColumns.map((column) => (
            <div key={column.id}>
              {column.id !== "id" &&
                column.id !== "selection" &&
                column.id !== "action" && (
                  <label>
                    <input type="checkbox" {...column.getToggleHiddenProps(false)} />{" "}
                    {column.id}
                  </label>
                )}
            </div>
          ))}
        </div>
      </div>
      {loading && <p>Loading...</p>}
      <table
        className="table-auto bg-white mt-5 divide-y-2 divide-gray-200"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // eslint-disable-next-line react/jsx-key
                <th
                  className="font-normal text-gray-500 text-sm"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                  {!["selection", "action"].includes(column.id) ? (
                    <div className="inline-block">
                      <span
                        className={`font-extralight ${
                          column.isSorted
                            ? column.isSortedDesc
                              ? "text-gray-400"
                              : "text-gray-900"
                            : "text-gray-400"
                        }`}
                      >
                        &uarr;
                      </span>
                      <span
                        className={`font-extralight  ${
                          column.isSorted
                            ? column.isSortedDesc
                              ? "text-gray-900"
                              : "text-gray-400"
                            : "text-gray-400"
                        }`}
                      >
                        &darr;
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y-2 space-y-2 mt-1" {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/jsx-key
              <tr
                className="items-center text-sm font-light py-2"
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <td className="pr-5 text-center" {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <div className="flex flex-row justify-between font-light text-xs mt-2">
        <span>
          Showing {page.length ? pageSize * pageIndex + 1 : page.length} -{" "}
          {pageIndex + 1 >= pageCount
            ? rows.length
            : page.length * (pageIndex + 1)}{" "}
          of {rows.length} results
        </span>
        <button
          className="bg-gray-200 border-[1px] border-gray-700 w-5 rounded-sm disabled:opacity-40"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>{" "}
        <button
          className="bg-gray-200 border-[1px] border-gray-700 w-5 rounded-sm disabled:opacity-40"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {"<"}
        </button>{" "}
        <button
          className="bg-gray-200 border-[1px] border-gray-700 w-5 rounded-sm disabled:opacity-40"
          onClick={() => nextPage()}
          disabled={!canNextPage}
          type="button"
        >
          {">"}
        </button>{" "}
        <button
          className="bg-gray-200 border-[1px] border-gray-700 w-5 rounded-sm disabled:opacity-40"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            className="w-5"
          />
        </span>{" "}
      </div>
    </div>
  );
};
