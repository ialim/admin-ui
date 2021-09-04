import { ApolloError } from "@apollo/client";
import { useState, useEffect, useCallback } from "react";
import { Invoice } from "../components/invoice";
import { PURCHASE_DEFAULT_VALUES } from "../lib/constants";
import {
  formatCreatePurchaseData,
  formatVariantStockUpdateData,
} from "../lib/format-data";
import { useCreatePurchaseMutation } from "../lib/hooks/mutation/create-purchase";
import { useUpdateVariantStockMutation } from "../lib/hooks/mutation/update-variant";
import { useUser } from "../lib/hooks/User";
import {
  CreatePurchaseInput,
  Message,
  UpdateVariantStockInput,
} from "../types/types";

const AddPurchase = () => {
  const [data, setData] = useState<any>();
  const user = useUser();
  const [createPurchase, { loading, error, data: purchaseData }] =
    useCreatePurchaseMutation();

  const [updateVariantStock, updateResult] = useUpdateVariantStockMutation();

  const createPurchaseMutation = useCallback(
    async (createPurchaseInput: CreatePurchaseInput): Promise<Message> => {
      try {
        const res = await createPurchase({ variables: createPurchaseInput });
        return { type: "create purchase", ok: true, data: res.data };
      } catch (error: any) {
        return { type: "create purchase", ok: false, error };
      }
    },
    [createPurchase]
  );

  const updateVariantStockMutation = useCallback(
    async (
      updateVariantStockInput: UpdateVariantStockInput[]
    ): Promise<Message> => {
      try {
        console.log("In mutation: ", updateVariantStockInput);
        const res = await updateVariantStock({
          variables: { updateVariantStockInput },
        });
        return { type: "update variant stock", ok: true, data: res.data };
      } catch (error: any) {
        return { type: "update variant stock", ok: false, error };
      }
    },
    [updateVariantStock]
  );

  const runPurchaseEffect = useCallback(
    async (data: any) => {
      const createPurchaseInput = formatCreatePurchaseData(data, user?.id);

      console.log("hi: ", createPurchaseInput);

      const {
        ok,
        type,
        error,
        data: variantStockDatas,
      } = await createPurchaseMutation(createPurchaseInput);

      if (ok) {
        console.log(variantStockDatas);
        const updateVariantStockInput =
          formatVariantStockUpdateData(variantStockDatas);
        console.log("here: ", updateVariantStockInput);
        const {
          ok,
          type,
          error,
          data: updatedVariantStockDatas,
        } = await updateVariantStockMutation(updateVariantStockInput);

        ok
          ? console.log(type, updatedVariantStockDatas)
          : console.log(type, error?.message);
      }
    },
    [createPurchaseMutation, updateVariantStockMutation, user?.id]
  );

  console.log("In Purchase: ", data);
  useEffect(() => {
    if (data) {
      runPurchaseEffect(data);
    }
  }, [data, runPurchaseEffect]);
  return (
    <Invoice
      header="Add Purchase"
      type="purchase"
      setData={setData}
      defaultValues={PURCHASE_DEFAULT_VALUES}
      action="create"
    />
  );
};

export default AddPurchase;
