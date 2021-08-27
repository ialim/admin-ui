import { useState, useEffect } from "react";
import { Invoice } from "../components/invoice";
import { formatCreatePurchaseData } from "../lib/format-data";
import { useCreatePurchaseMutation } from "../lib/hooks/purchase-mutation";
import { useUser } from "../lib/hooks/User";
import { CreatePurchaseInput } from "../types/types";

const AddPurchase = () => {
  const [data, setData] = useState<any>();
  const user = useUser();
  const [createPurchase, { loading, error, data: purchaseData }] =
    useCreatePurchaseMutation();

  const createPurchaseMutation = async (
    createPurchaseInput: CreatePurchaseInput
  ) => {
    const res = await createPurchase({ variables: createPurchaseInput }).catch(
      (error) => console.log("Here in function: ", error.message)
    );
    return res;
  };
  console.log("In Purchase: ", data);
  useEffect(() => {
    if (data) {
      const createPurchaseInput = formatCreatePurchaseData(data, user?.id);
      console.log("hi: ", createPurchaseInput);
      const res = createPurchaseMutation(createPurchaseInput);
      console.log(res);

      loading && console.log("Loading...");
      error && console.log("Errors: ", error.message);
    }
  }, [data]);
  return <Invoice header="Add Purchase" type="purchase" setData={setData} />;
};

export default AddPurchase;
