import { SVG } from "../public/svg";

interface InvoiceTableProps {
  title: string;
  headers: string[];
  status?: string;
  children?: React.ReactNode;
  taxSum: number;
  subTotal: number;
  discountSum: number;
  quantitySum: number;
  type: string;
}

export const InvoiceTable = ({
  title,
  headers,
  children,
  taxSum,
  quantitySum,
  discountSum,
  subTotal,
  type,
  status,
}: InvoiceTableProps) => {
  const { trash } = SVG;
  if (type === "sale") {
    headers && headers.splice(headers.indexOf("Received"), 1);
  }
  return (
    <div>
      <h5 className="font-semibold">{title}</h5>
      <div className="overflow-scroll">
        <table className="table-auto divide-y-2 mt-3">
          <thead className="">
            <tr className="">
              {headers.map((header: string, index) => {
                type === "sale" ? (
                  <th className=" font-large text-gray-500 text-sm" key={index}>
                    header
                  </th>
                ) : header === "Received" && status === "Partial" ? (
                  <th className=" font-large text-gray-500 text-sm" key={index}>
                    header
                  </th>
                ) : (
                  ""
                );
              })}
              <th className="font-light">{trash}</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 space-y-2 mt-1">{children}</tbody>
          <tfoot>
            <tr className="font-medium text-gray-500 text-center">
              <th>Total</th>
              <th></th>
              <th></th>
              <th>{quantitySum}</th>
              {type === "sale" ? "" : status === "Partial" ? <th></th> : ""}
              <th></th>
              <th>{discountSum.toFixed(2)}</th>
              <th>{taxSum.toFixed(2)}</th>
              <th>{subTotal.toFixed(2)}</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
