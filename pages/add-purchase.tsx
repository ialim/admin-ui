import { gql } from "@apollo/client";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { NestedValue, useForm } from "react-hook-form";
import Select from "react-select";
import { AutoSelect } from "../components/auto-select";
import { Fields } from "../components/fields";
import { InvoiceTable } from "../components/invoice-table";
import { VariantSearch } from "../components/variant-search";

const ALL_WAREHOUSE_QUERY = gql`
  query {
    allWarehouses {
      id
      name
    }
  }
`;

const ALL_SUPPLIERS_QUERY = gql`
  query {
    allSuppliers {
      id
      name
    }
  }
`;

type PurchaseStatus = "Recieved" | "Partial" | "Pending" | "Ordered";

type Option = {
  label: PurchaseStatus;
  value: string;
};

const statusOptions: Option[] = [
  { label: "Recieved", value: "Recieved".toLowerCase() },
  { label: "Partial", value: "Partial".toLowerCase() },
  { label: "Pending", value: "Pending".toLowerCase() },
  { label: "Ordered", value: "Ordered".toLowerCase() },
];

type FormValues = {
  warehouse: string;
  supplier: string;
  status: string;
  invoice: any;
  variants: NestedValue<Variant[]>;
};

export type Variant = {
  id: string;
  itemcode: number;
  name: string;
  barcode?: number;
  quantity?: number;
  cost?: number;
  discount?: number;
  sku?: string;
  total?: number;
  tax?: number;
};

const headers = [
  "Name",
  "Code",
  "Barcode",
  "Quantity",
  "Recieved",
  "Net Unit Cost",
  "Discount",
  "Tax",
  "SubTotal",
];

const TAX_RATE: number = 10;

let renderCount = 0;

const calcNetTotal = (
  quantity: number,
  cost: number,
  discount: number
): number[] => {
  let netTotal = quantity * cost - discount;
  let tax = (netTotal * TAX_RATE) / 100;
  let subTotal = netTotal + tax;
  return [tax, subTotal];
};

const AddPurchase = () => {
  const [variant, setVariant] = useState<Variant>();
  const {
    control,
    handleSubmit,
    setValue,
    register,
    getValues,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      warehouse: "ware",
      supplier: "supp",
      status: "pending",
      variants: [],
    },
  });

  const wareRef = useRef<HTMLButtonElement>(null);
  const suppRef = useRef<HTMLButtonElement>(null);
  const onSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    register("warehouse", {
      validate: (value) => !!value.length || "This is required.",
    });
  }, [register]);

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
            onChange={(e) => setValue("status", e?.value || "")}
            options={statusOptions}
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
        <InvoiceTable title="Order Table" headers={headers}>
          {variant && (
            <Fields
              {...{
                control,
                register,
                getValues,
                setValue,
                variant,
                calcNetTotal,
              }}
            />
          )}
        </InvoiceTable>
        <input
          type="submit"
          value="Submit"
          className="form-input py-2 rounded-md bg-gray-400 hover:bg-gray-200 tracking-widest"
        />
      </form>
    </div>
  );
};

export default AddPurchase;
