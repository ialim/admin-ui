import { useState } from "react";
import { Invoice } from "../components/invoice";
import { SALE_DEFAULT_VALUES } from "../lib/constants";

const AddSale = () => {
  const [data, setData] = useState(SALE_DEFAULT_VALUES);
  console.log("In Purchase: ", data);

  return (
    <Invoice
      header="Add Sale"
      type="sale"
      setData={setData}
      defaultValues={SALE_DEFAULT_VALUES}
      action="create"
    />
  );
};

export default AddSale;
