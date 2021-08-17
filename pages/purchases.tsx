import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "../components/button";
import { ErrorMessage } from "../components/error-message";
import { Table } from "../components/table";
import { SVG } from "../public/svg";

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
      },
      {
        Header: "Reference No",
        accessor: "reference_no",
      },
    ],
    []
  );

  const [
    findItems,
    { loading: queryLoading, error: queryError, data: queryData },
  ] = useLazyQuery(ALL_PURCHASES_PAGINATED);

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
      <Button href="/add-products">+ Add Purchase</Button>
      <Button href="#">
        <span className="inline-block mr-2">{documents}</span>Import Purchase
      </Button>
      <ErrorMessage error={countError || queryError} />
      <Table
        columns={columns}
        data={data}
        fetchData={fetchData}
        pageCount={pageCount}
        loading={queryLoading}
      />
    </div>
  );
};

export default Purchase;
