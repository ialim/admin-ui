import { useState } from "react";
import { Invoice } from "../components/invoice";
import { formatCreatePurchaseData } from "../lib/format-data";
import { useUser } from "../lib/hooks/User";


const AddPurchase = () => {
  const [data, setData] = useState<any>();
  const user = useUser();

  console.log("In Purchase: ", data);
  if (data) {
    const createPurchaseInput = formatCreatePurchaseData(data, user.id);
  }
  return (
    <Invoice header="Add Purchase" type="purchase" setData={setData} />
  );
};

export default AddPurchase;
