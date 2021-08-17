import { gql } from "@apollo/client";
import { useEffect } from "react";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { AutoSelect } from "../components/auto-select";

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

type FormValues = {
  warehouse: string;
  supplier: string;
};

let renderCount = 0;

const AddPurchase = () => {
  const {
    control,
    handleSubmit,
    setValue,
    register,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { warehouse: "ware", supplier: "supp" },
  });
  const wareRef = useRef<HTMLButtonElement>(null);
  const suppRef = useRef<HTMLButtonElement>(null);
  const warehouse = watch("warehouse")
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
          <label htmlFor="warehouse">Warehouse</label>
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
          <label htmlFor="supplier">Supplier</label>
          <AutoSelect
            name="supplier"
            keyName="allSuppliers"
            title="Select Supplier..."
            searchQuery={ALL_SUPPLIERS_QUERY}
            ref={suppRef}
            setValue={setValue}
          />
        </div>
        <input
          type="submit"
          value="Submit"
          className="form-input py-2 rounded-md bg-gray-400 hover:bg-gray-200 tracking-widest"
        />
      </form>
      {console.log("we are here!!!")}
    </div>
  );
};

export default AddPurchase;
