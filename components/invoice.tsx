import { useRef, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import Select from "react-select";
import { AutoSelect } from "../components/auto-select";
import { Fields } from "../components/fields";
import { InvoiceTable } from "../components/invoice-table";
import { VariantSearch } from "../components/variant-search";
import {
  ALL_BILLERS_QUERY,
  ALL_CUSTOMERS_QUERY,
  ALL_SUPPLIERS_QUERY,
  ALL_WAREHOUSE_QUERY,
  HEADERS,
  PAYMENT_STATUS_OPTIONS,
  PURCHASE_DEFAULT_VALUES,
  SALE_DEFAULT_VALUES,
  SALE_STATUS_OPTIONS,
  STATUS_OPTIONS,
  TAX_OPTIONS,
} from "../lib/constants";
import { PurchaseFormValues, SaleFormValues, Variant } from "../types/types";
import { InvoiceFooter } from "./invoice-footer";

interface InvoiceProps {
  type: "sale" | "purchase";
  header: string;
  setData: Function;
}

let renderCount = 0;

export const Invoice = ({ type, setData, header }: InvoiceProps) => {
  const [variant, setVariant] = useState<Variant>();
  const [status, setStatus] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    register,
    getValues,
    formState: { errors },
  } = useForm<PurchaseFormValues | SaleFormValues>({
    defaultValues:
      type === "purchase" ? PURCHASE_DEFAULT_VALUES : SALE_DEFAULT_VALUES,
  });

  const wareRef = useRef<HTMLButtonElement>(null);
  const suppRef = useRef<HTMLButtonElement>(null);
  const custRef = useRef<HTMLButtonElement>(null);
  const billRef = useRef<HTMLButtonElement>(null);
  const onSubmit = (data: any) => {
    console.log("In Invoice: ", data);
    setData(data);
  };

  useEffect(() => {
    register("warehouse", {
      validate: (value) => !!value.length || "This is required.",
    });
    register("items", {
      validate: (value) => value > 0 || "This is required.",
    });
    register("orderQuantity", {
      validate: (value) => value > 0 || "This is required.",
    });
  }, [register]);

  const handlePurchaseSataus = (e: any) => {
    setValue("status", (e?.value as never) || "");
    setStatus(e?.value || "");
  };

  console.log("Render count Invoice", renderCount++);
  return (
    <div className="mx-5 my-3 bg-white px-5 py-2 flex flex-col">
      <header className=" py-3 text-xl ">{header}</header>
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
          <>
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
            <div>
              <label htmlFor="status">Purchase Status:</label>
              <Select
                className="mt-1 shadow-md"
                onChange={(e) => handlePurchaseSataus(e)}
                options={STATUS_OPTIONS}
                placeholder="Select Status..."
              />
            </div>
          </>
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
                searchQuery={ALL_BILLERS_QUERY}
                ref={billRef}
                setValue={setValue}
              />
            </div>
          </>
        )}
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
          control={control}
          status={status}
          setValue={setValue}
        >
          {variant && (
            <Fields
              {...{
                control,
                register,
                getValues,
                setValue,
                variant,
                status,
              }}
            />
          )}
        </InvoiceTable>
        {errors && <p>{errors.variants?.message}</p>}
        <div className="flex-col space-y-3 mt-2">
          <div>
            <label htmlFor="taxRate">Order Tax:</label>
            <Select
              className="mt-1 rounded-md border-[1px]"
              options={TAX_OPTIONS}
              placeholder="Select Tax Option..."
              onChange={(option) =>
                setValue("orderTaxRate", option?.value || 0)
              }
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
                  onChange={(e) =>
                    setValue("saleStatus", (e?.value as never) || "")
                  }
                  options={SALE_STATUS_OPTIONS}
                  placeholder="Select Status..."
                />
              </div>
              <div>
                <label htmlFor="status">Payment Status:</label>
                <Select
                  className="mt-1 shadow-md"
                  onChange={(e) =>
                    setValue("paymentStatus", (e?.value as never) || "")
                  }
                  options={PAYMENT_STATUS_OPTIONS}
                  placeholder="Select Status..."
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="saleNotes">Sale Notes:</label>
                <textarea
                  className="mt-1 p-3 text-sm text-gray-400 border-gray-400 rounded-md border-[1px]"
                  {...register("saleNotes")}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="staffNotes">Staff Notes:</label>
                <textarea
                  className="mt-1 p-3 text-sm text-gray-400 border-gray-400 rounded-md border-[1px]"
                  {...register("staffNotes")}
                />
              </div>
            </>
          )}
        </div>
        <InvoiceFooter control={control} setValue={setValue} />
        <input
          type="submit"
          value="Submit"
          className="form-input py-2 rounded-md bg-gray-400 hover:bg-gray-200 tracking-widest"
        />
      </form>
    </div>
  );
};
