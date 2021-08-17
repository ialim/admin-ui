import { useEffect } from "react";
import { usePagination, useRowSelect, useSortBy, useTable } from "react-table";
import { Action } from "./action";
import { IndeterminateCheckbox } from "./table-checkbox";

interface TableProps {
  columns: any[];
  data: object[];
  children?: React.ReactNode;
  loading?: boolean;
  pageCount?: any;
  fetchData?: any;
}

export const Table = ({
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
}: TableProps) => {
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
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: controlledPageCount,
    },
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
            <div>
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
              <Action id={row.id} actions={["VIEW", "EDIT"]} />
            </div>
          ),
        },
      ]);
    }
  );

  useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);
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
        <div>Search</div>
        <div>export options</div>
      </div>
      {loading && <p>Loading...</p>}
      <table
        className="flex flex-col bg-white mt-5 h-24 w-full divide-y-2 divide-gray-200"
        {...getTableProps()}
      >
        <thead className="w-full">
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <tr
              className="flex flex-row justify-between px-3"
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                // eslint-disable-next-line react/jsx-key
                <th
                  className="flex flex-row justify-between py-3 text-left"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                  {!["selection", "action"].includes(column.id) ? (
                    <div>
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
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/jsx-key
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
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
          Showing {page.length ? page.length * pageIndex + 1 : page.length} -{" "}
          {page.length * (pageIndex + 1)} of ~{controlledPageCount * pageSize}{" "}
          results
        </span>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
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
