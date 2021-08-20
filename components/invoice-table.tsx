import { SVG } from "../public/svg";

interface InvoiceTableProps {
  title: string;
  headers: string[];
  status?: string;
  children?: React.ReactNode;
}

export const InvoiceTable = ({
  title,
  headers,
  children,
}: InvoiceTableProps) => {
  const { trash } = SVG;
  return (
    <div >
      <h5 className="font-semibold">{title}</h5>
      <div className="overflow-scroll">
        <table className="table-auto divide-y-2 mt-3">
          <thead className="">
            <tr className="">
              {headers.map((header: string, index) => (
                <th
                  className=" font-medium text-gray-800 text-sm"
                  key={index}
                >
                  {header}
                </th>
              ))}
              <th className="font-light">{trash}</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 space-y-2 mt-1">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
};
