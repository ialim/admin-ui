import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import { calcTotal } from "../lib/basicCalculattions";
import { formatValue } from "../lib/format-value";

interface InvoiceFooterProps {
  control: any;
  setValue: Function;
}

let renderCount = 0;

export const InvoiceFooter = ({ control, setValue }: InvoiceFooterProps) => {
  const [
    orderDiscount,
    shippingCost,
    variants,
    orderTaxRate,
    total,
    orderQuantity,
  ] = useWatch({
    control,
    name: [
      "orderDiscount",
      "shippingCost",
      "variants",
      "orderTaxRate",
      "total",
      "orderQuantity",
    ],
  });

  const { orderTax, grandTotal } = calcTotal({
    shippingCost,
    orderDiscount,
    total,
    taxRate: orderTaxRate,
  });
  useEffect(() => {
    setValue("items", variants.length);
    setValue("orderTax", orderTax);
    setValue("grandTotal", grandTotal);
  }, [grandTotal, orderTax, setValue, variants.length]);

  console.log("Render count Invoice footer: ", renderCount++);
  return (
    <div className="overflow-scroll">
      <table className="table-auto bg-gray-100 text-sm">
        <tbody>
          <tr className="font-medium text-gray-500 text-center">
            <td className="border-solid border-gray-300 border-[1px] p-2">
              <strong>Items</strong>
              <span className="text-right ml-7">{`${
                variants.length
              }(${formatValue(orderQuantity, "count")})`}</span>
            </td>
            <td className="border-solid border-gray-300 border-[1px] p-2">
              <strong>Total</strong>
              <span className="text-right ml-7">{formatValue(total)}</span>
            </td>
            <td className="border-solid border-gray-300 border-[1px] p-2">
              <strong className="">Order Tax</strong>
              <span className="text-right ml-7">{formatValue(orderTax)}</span>
            </td>
            <td className="border-solid border-gray-300 border-[1px] p-2">
              <strong>Discount</strong>
              <span className="text-right ml-7">
                {formatValue(orderDiscount)}
              </span>
            </td>
            <td className="border-solid border-gray-300 border-[1px] p-2">
              <strong>Shipping Cost</strong>
              <span className="text-right ml-7">
                {formatValue(shippingCost)}
              </span>
            </td>
            <td className="border-solid border-gray-300 border-[1px] p-2">
              <strong>Grand Total</strong>
              <span className="text-right ml-7">{formatValue(grandTotal)}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
