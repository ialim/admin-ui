import { useEffect, useState } from "react";
import { ErrorMessage } from "../components/error-message";
import { Invoice } from "../components/invoice";
import {
  formatUpdatePurchaseData,
  updateDefaultValues,
} from "../lib/format-data";
import { useFindPurchaseById } from "../lib/hooks/mutation/find-purchase";
import { useUser } from "../lib/hooks/User";

export const UpdatePurchase = ({ query }: any) => {
  const [updateData, setUpdateData] = useState<any>();
  const { loading, error, data } = useFindPurchaseById(query.id);
  const currentUser = useUser();

  const { defaultValues, user } = updateDefaultValues(data);

  useEffect(() => {
    if (updateData) {
      const updatePurchaseInput = formatUpdatePurchaseData(
        updateData,
        defaultValues,
        query.id,
        user.id !== currentUser?.id && currentUser.id
      );
    }
  }, [currentUser.id, defaultValues, query.id, updateData, user.id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorMessage error={error} />;
  console.log("defaultValues: ", defaultValues);
  console.log("Updated Data: ", updateData);

  return (
    <Invoice
      header="Update Purchase"
      type="purchase"
      setData={setUpdateData}
      defaultValues={defaultValues}
      action="update"
    />
  );
};
export default UpdatePurchase;
