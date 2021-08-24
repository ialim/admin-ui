import { useRef, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import Select from "react-select";
import { AutoSelect } from "../components/auto-select";
import { Fields } from "../components/fields";
import { InvoiceTable } from "../components/invoice-table";
import { VariantSearch } from "../components/variant-search";
import { calcSum, calcTotal } from "../lib/basicCalculattions";
import {
  ALL_CUSTOMERS_QUERY,
  ALL_SUPPLIERS_QUERY,
  ALL_WAREHOUSE_QUERY,
  HEADERS,
  STATUS_OPTIONS,
  TAX_OPTIONS,
} from "../lib/constants";
import { PurchaseFormValues, Variant } from "../types/types";

interface InvoiceProps {
  type: "sale" | "purchase";
}

let renderCount = 0;

export const Invoice = ({ type }: InvoiceProps) => {
  const [variant, setVariant] = useState<Variant>();
  const [variants, setVariants] = useState<any[]>([]);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [status, setStatus] = useState("");
  const { discountSum, subTotal, taxSum, quantitySum } = calcSum(variants);
  const {
    control,
    handleSubmit,
    setValue,
    register,
    getValues,
    formState: { errors },
  } = useForm<PurchaseFormValues>({
    defaultValues: {
      warehouse: "ware",
      supplier: "supp",
      status: "pending",
      variants: [],
      items: 0,
      orderQuantity: 0,
      orderDiscount: 0,
      orderTax: 0,
      grandTotal: 0,
      shippingCost: 0,
      total: 0,
      notes: "",
    },
  });

  const [shippingCost, orderDiscount] = useWatch({
    control,
    name: ["shippingCost", "orderDiscount", "total"],
  });

  const { orderTax, grandTotal } = calcTotal({
    shippingCost,
    orderDiscount,
    total: subTotal,
    taxRate,
  });

  const wareRef = useRef<HTMLButtonElement>(null);
  const suppRef = useRef<HTMLButtonElement>(null);
  const custRef = useRef<HTMLButtonElement>(null);
  const billRef = useRef<HTMLButtonElement>(null);
  const onSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    register("warehouse", {
      validate: (value) => !!value.length || "This is required.",
    });
    setValue("total", subTotal);
    setValue("items", variants.length);
    setValue("orderQuantity", quantitySum);
    setValue("orderTax", orderTax);
    setValue("grandTotal", grandTotal);
  }, [
    grandTotal,
    orderTax,
    quantitySum,
    register,
    setValue,
    subTotal,
    variants.length,
  ]);

  const handlePurchaseSataus = (e: any) => {
    setValue("status", e?.value || "");
    setStatus(e?.value || "")
  };

  console.log(renderCount++);
  return (
    <div className="mx-5 my-3 bg-white px-5 py-2 flex flex-col">
      <header className=" py-3 text-xl ">Add Purchase</header>
      <p className="mt-6 font-light text-xs text-gray-400">
        The field labels marked with * are required input fields.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col mt-5 space-y-5"
      >
        <div>
          <label htmlFor="warehouse">Warehouse:*</label>
          <AutoSelect
            name="warehouse"
            keyName="allWarehouses"
            title="Select Warehouse..."
            searchQuery={ALL_WAREHOUSE_QUERY}
            ref={wareRef}
            setValue={setValue}
          />
          {errors && <p>{errors.warehouse?.message}</p>}
        </div>
        {type === "purchase" ? (
          <div>
            <label htmlFor="supplier">Supplier:</label>
            <AutoSelect
              name="supplier"
              keyName="allSuppliers"
              title="Select Supplier..."
              searchQuery={ALL_SUPPLIERS_QUERY}
              ref={suppRef}
              setValue={setValue}
            />
          </div>
        ) : (
          <>
            <div>
              <label htmlFor="customer">Customer:</label>
              <AutoSelect
                name="customer"
                keyName="allCustomers"
                title="Select Customer..."
                searchQuery={ALL_CUSTOMERS_QUERY}
                ref={custRef}
                setValue={setValue}
              />
            </div>
            <div>
              <label htmlFor="biller">Biller:</label>
              <AutoSelect
                name="biller"
                keyName="allBillers"
                title="Select Biller..."
                searchQuery={ALL_CUSTOMERS_QUERY}
                ref={billRef}
                setValue={setValue}
              />
            </div>
          </>
        )}
        <div>
          <label htmlFor="status">Purchase Status:</label>
          <Select
            className="mt-1 shadow-md"
            onChange={(e) => handlePurchaseSataus(e)}
            options={STATUS_OPTIONS}
            placeholder="Select Status..."
          />
        </div>
        <div>
          <label htmlFor="slug">Attach Document:</label>
          <input
            type="file"
            className="form-input flex flex-col w-full rounded-md mt-1 py-2 text-gray-400 border-gray-400"
            {...register("invoice")}
          />
        </div>
        <div>
          <label htmlFor="variant">Select Product Variant:</label>
          <VariantSearch updateVariant={setVariant} />
        </div>
        <InvoiceTable
          title="Order Table"
          headers={HEADERS}
          discountSum={discountSum}
          subTotal={subTotal}
          quantitySum={quantitySum}
          taxSum={taxSum}
          type={type}
          status={status}
        >
          {variant && (
            <Fields
              {...{
                control,
                register,
                getValues,
                setValue,
                variant,
                setVariants,
                variants,
              }}
            />
          )}
        </InvoiceTable>
        <div className="flex-col space-y-3 mt-2">
          <div>
            <label htmlFor="status">Order Tax:</label>
            <Select
              className="mt-1 rounded-md border-[1px]"
              options={TAX_OPTIONS}
              placeholder="Select Tax Option..."
              onChange={(option) => setTaxRate(option?.value || 0)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="orderDiscount">Discount:</label>
            <input
              className="form-input w-full rounded-md mt-1 py-2 text-gray-400 border-gray-400"
              type="number"
              {...register("orderDiscount", { valueAsNumber: true })}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="shippingCost">Shipping Cost:</label>
            <input
              className="form-input w-full rounded-md mt-1 py-2 text-gray-400 border-gray-400"
              type="number"
              {...register("shippingCost", { valueAsNumber: true })}
            />
          </div>
          {type === "purchase" ? (
            <div className="flex flex-col">
              <label htmlFor="notes">Notes:</label>
              <textarea
                className="mt-1 p-3 text-sm text-gray-400 border-gray-400 rounded-md border-[1px]"
                {...register("notes")}
              />
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="status">Sale Status:</label>
                <Select
                  className="mt-1 shadow-md"
                  onChange={(e) => setValue("status", e?.value || "")}
                  options={STATUS_OPTIONS}
                  placeholder="Select Status..."
                />
              </div>
              <div>
                <label htmlFor="status">Payment Status:</label>
                <Select
                  className="mt-1 shadow-md"
                  onChange={(e) => setValue("status", e?.value || "")}
                  options={STATUS_OPTIONS}
                  placeholder="Select Status..."
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="sale-notes">Sale Notes:</label>
                <textarea
                  className="mt-1 p-3 text-sm text-gray-400 border-gray-400 rounded-md border-[1px]"
                  {...register("notes")}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="staff-notes">Staff Notes:</label>
                <textarea
                  className="mt-1 p-3 text-sm text-gray-400 border-gray-400 rounded-md border-[1px]"
                  {...register("notes")}
                />
              </div>
            </>
          )}
        </div>
        <div className="overflow-scroll">
          <table className="table-auto bg-gray-100 text-sm">
            <tbody>
              <tr className="font-medium text-gray-500 text-center">
                <td className="border-solid border-gray-300 border-[1px] p-2">
                  <strong>Items</strong>
                  <span className="text-right ml-7">{`${variants.length}(${quantitySum})`}</span>
                </td>
                <td className="border-solid border-gray-300 border-[1px] p-2">
                  <strong>Total</strong>
                  <span className="text-right ml-7">{subTotal.toFixed(2)}</span>
                </td>
                <td className="border-solid border-gray-300 border-[1px] p-2">
                  <strong className="">Order Tax</strong>
                  <span className="text-right ml-7">{orderTax.toFixed(2)}</span>
                </td>
                <td className="border-solid border-gray-300 border-[1px] p-2">
                  <strong>Discount</strong>
                  <span className="text-right ml-7">
                    {orderDiscount.toFixed(2)}
                  </span>
                </td>
                <td className="border-solid border-gray-300 border-[1px] p-2">
                  <strong>Shipping Cost</strong>
                  <span className="text-right ml-7">
                    {shippingCost.toFixed(2)}
                  </span>
                </td>
                <td className="border-solid border-gray-300 border-[1px] p-2">
                  <strong>Grand Total</strong>
                  <span className="text-right ml-7">
                    {grandTotal.toFixed(2)}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <input
          type="submit"
          value="Submit"
          className="form-input py-2 rounded-md bg-gray-400 hover:bg-gray-200 tracking-widest"
        />
      </form>
    </div>
  );
};
