import { SVG } from "../public/svg";
import { InvoiceTableFooter } from "./invoice-table-footer";

interface InvoiceTableProps {
  title: string;
  headers: string[];
  status: string;
  children?: React.ReactNode;
  control: any;
  setValue: Function;
}

let renderCount = 0;

export const InvoiceTable = ({
  title,
  headers,
  children,
  status,
  control,
  setValue,
}: InvoiceTableProps) => {
  const { trash } = SVG;
  console.log("Render count Invoice table: ", renderCount++);
  return (
    <div>
      <h5 className="font-semibold">{title}</h5>
      <div className="overflow-scroll">
        <table className="table-auto divide-y-2 mt-3">
          <thead className="">
            <tr className="">
              {headers.map((header: string, index) =>
                header === "Received" && status !== "partial" ? null : (
                  <th className="font-normal text-gray-500 text-sm" key={index}>
                    {header}
                  </th>
                )
              )}
              <th className="font-light">{trash}</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 space-y-2 mt-1">{children}</tbody>
          <InvoiceTableFooter
            status={status}
            setValue={setValue}
            control={control}
          />
        </table>
      </div>
    </div>
  );
};
