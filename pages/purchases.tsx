import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "../components/button";
import { ErrorMessage } from "../components/error-message";
import { Table } from "../components/table";
import { SVG } from "../public/svg";
import { format } from "date-fns";
import {
  ALL_PURCHASES_QUERY,
  CLIENT_SIDE_FILTERING_LIMIT,
  SEARCH_PURCHASE_QUERY,
} from "../lib/constants";

const PURCHASES_COUNT_QUERY = gql`
  query PURCHASES_COUNT_QUERY {
    purchasesCount
  }
`;

const ALL_PURCHASES_PAGINATED = gql`
  query ALL_PURCHASES_PAGINATED($skip: Int, $first: Int) {
    allPurchases(skip: $skip, first: $first) {
      id
      created_at
      reference_no
    }
  }
`;

const Purchase = () => {
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const fetchIdRef = useRef(0);
  const { documents } = SVG;

  const {
    loading: countLoading,
    error: countError,
    data: countData,
  } = useQuery(PURCHASES_COUNT_QUERY);
  const { purchasesCount } = countData ? countData : 0;
  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "created_at",
        Cell: ({ value }: any) => {
          return format(new Date(value), "dd/MM/yyyy");
        },
      },
      {
        Header: "Reference No",
        accessor: "reference_no",
      },
    ],
    []
  );

  const QUERY =
    purchasesCount < CLIENT_SIDE_FILTERING_LIMIT
      ? ALL_PURCHASES_QUERY
      : ALL_PURCHASES_PAGINATED;

  const [
    findItems,
    { loading: queryLoading, error: queryError, data: queryData },
  ] = useLazyQuery(QUERY);

  const clientData = useMemo(() => {
    findItems();
    console.log(queryData, queryData?.allPurchases, queryLoading, queryError)
    return queryData?.allPurchases || [];
  }, [findItems, queryData, queryError, queryLoading]);

  const fetchData = useCallback(
    ({ pageSize, pageIndex }) => {
      // Give this fetch an ID
      const fetchId = ++fetchIdRef.current;

      // We'll even set a delay to simulate a server here
      if (fetchId === fetchIdRef.current) {
        let variables = {
          skip: (pageIndex + 1) * pageSize - pageSize,
          first: pageSize,
        };
        findItems({ variables });
        setData(queryData?.allPurchases || []);
        setPageCount(Math.ceil(purchasesCount / pageSize));
      }
    },
    [findItems, purchasesCount, queryData]
  );

  if (countLoading) return <p>Loading...</p>;
  return (
    <div>
      <Button href="/add-purchases">+ Add Purchase</Button>
      <Button href="#">
        <span className="inline-block mr-2">{documents}</span>Import Purchase
      </Button>
      <ErrorMessage error={countError || queryError} />
      <Table
        columns={columns}
        data={purchasesCount < CLIENT_SIDE_FILTERING_LIMIT ? clientData : data}
        fetchData={fetchData}
        pageCount={pageCount}
        loading={queryLoading}
        entriesCount={purchasesCount}
        searchQuery={SEARCH_PURCHASE_QUERY}
        setData={setData}
        name="searchPurchases"
        type={
          purchasesCount < CLIENT_SIDE_FILTERING_LIMIT ? "CLIENT" : "SERVER"
        }
      />
    </div>
  );
};

export default Purchase;
