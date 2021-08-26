import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import { calcSum } from "../lib/basicCalculattions";
import { formatValue } from "../lib/format-value";

interface InvoiceTableFooter {
  control: any;
  setValue: Function;
  status: string;
}

let renderCount = 0

export const InvoiceTableFooter = ({
  control,
  setValue,
  status,
}: InvoiceTableFooter) => {
  const variants = useWatch({ control, name: "variants" });
  const { discountSum, subTotal, taxSum, quantitySum } = calcSum(variants);
  
  useEffect(() => {
    setValue("total", subTotal);
    setValue("orderQuantity", quantitySum);
  }, [quantitySum, setValue, subTotal]);
  
  console.log("Render count Invoice table footer: ",renderCount++);
  return (
    <tfoot>
      <tr className="font-medium text-gray-500 text-center">
        <th>Total</th>
        <th></th>
        <th></th>
        <th>{formatValue(quantitySum, "count")}</th>
        {status === "partial" ? <th></th> : null}
        <th></th>
        <th>{formatValue(discountSum)}</th>
        <th>{formatValue(taxSum)}</th>
        <th>{formatValue(subTotal)}</th>
        <th></th>
      </tr>
    </tfoot>
  );
};
