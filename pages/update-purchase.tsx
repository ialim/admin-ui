import { useEffect, useState, useCallback } from "react";
import { ErrorMessage } from "../components/error-message";
import { Invoice } from "../components/invoice";
import {
  formatUpdatePurchaseData,
  formatVariantStockUpdateData,
  updateDefaultValues,
} from "../lib/format-data";
import { useCreateProductPurchasesMutation } from "../lib/hooks/mutation/create-product-purchase";
import { useFindPurchaseById } from "../lib/hooks/mutation/find-purchase";
import { useUpdateProductPurchasesMutation } from "../lib/hooks/mutation/update-product-purchases";
import { useUpdatePurchaseMutation } from "../lib/hooks/mutation/update-purchase";
import { useUpdateVariantStockMutation } from "../lib/hooks/mutation/update-variant";
import { useRunMutationFunction } from "../lib/hooks/run-mutation";
import { useUser } from "../lib/hooks/User";
import {
  CreateProductPurchaseInput,
  Message,
  UpdateProductPurchase,
  UpdatePurchaseInput,
  UpdateVariantStockInput,
} from "../types/types";

const UpdatePurchase = ({ query }: any) => {
  const { loading, error, data } = useFindPurchaseById(query.id);
  const [updateData, setUpdateData] = useState<any>();
  const currentUser = useUser();
  const [updatePurchase, updateResult] = useUpdatePurchaseMutation();
  const [updateProductPurchases] = useUpdateProductPurchasesMutation();
  const [createProductPurchases] = useCreateProductPurchasesMutation();
  const [updateVariantStock] = useUpdateVariantStockMutation();

  const updatePurchaseMutation = useCallback(
    async (updatePurchaseInput: UpdatePurchaseInput): Promise<Message> => {
      try {
        const res = await updatePurchase({ variables: updatePurchaseInput });
        return { type: "update purchase", ok: true, data: res.data };
      } catch (error: any) {
        return { type: "update purchase", ok: false, error };
      }
    },
    [updatePurchase]
  );

  const updateProductPurchasesMutation = useCallback(
    async (
      updateProductPurchasesInput: UpdateProductPurchase[]
    ): Promise<Message> => {
      try {
        const res = await updateProductPurchases({
          variables: { updateProductPurchasesInput },
        });
        return { type: "update product purchase", ok: true, data: res.data };
      } catch (error: any) {
        return { type: "update product purchase", ok: false, error };
      }
    },
    [updateProductPurchases]
  );

  const createProductPurchasesMutation = useCallback(
    async (
      createProductPurchasesInput: CreateProductPurchaseInput[]
    ): Promise<Message> => {
      try {
        const res = await createProductPurchases({
          variables: { createProductPurchasesInput },
        });
        return { type: "create product purchase", ok: true, data: res.data };
      } catch (error: any) {
        return { type: "create product purchase", ok: false, error };
      }
    },
    [createProductPurchases]
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

  const runUpdatePurchaseEffect = useCallback(
    async (updateData: any) => {
      const { defaultValues, user } = updateDefaultValues(data);
      const {
        updatePurchaseInput,
        updateProductPurchasesInput,
        createProductPurchasesInput,
      } = formatUpdatePurchaseData(
        updateData,
        defaultValues,
        query.id,
        user.id !== currentUser?.id && currentUser.id
      );

      // Update purchase records
      const {
        ok,
        type,
        error,
        data: purchaseData,
      } = await updatePurchaseMutation(updatePurchaseInput);

      // on successful purchase update
      if (ok) {
        // update product purchase if any
        if (updateProductPurchasesInput) {
          const {
            ok,
            type: productPurchasesType,
            data: productPurchasesData,
            error,
          } = await updateProductPurchasesMutation(updateProductPurchasesInput);

          // update variant stock information on successful product purchse update
          if (ok && productPurchasesData) {
            console.log(productPurchasesType, productPurchasesData);
            const updateVariantStockInput =
              formatVariantStockUpdateData(productPurchasesData);

            console.log("Update Product: ", updateVariantStockInput);
            const { ok, type, error, data } = await updateVariantStockMutation(
              updateVariantStockInput
            );
            ok ? console.log(type, data) : console.log(type, error);
          }
          error && console.log(productPurchasesType, error.message);
        }

        // create product purchase if any
        if (createProductPurchasesInput) {
          const {
            ok,
            type: createProdType,
            error,
            data: createProdData,
          } = await createProductPurchasesMutation(createProductPurchasesInput);

          // update variant stock information on successful product purchse create
          if (ok && data) {
            console.log(createProdType, createProdData);
            const updateVariantStockInput =
              formatVariantStockUpdateData(createProdData);

            console.log("Update Product: ", updateVariantStockInput);
            const { ok, type, error, data } = await updateVariantStockMutation(
              updateVariantStockInput
            );
            ok ? console.log(type, data) : console.log(type, error);
          }
          error && console.log(createProdType, error.message);
        }
      } else {
        console.log(type, error);
      }
    },
    [
      createProductPurchasesMutation,
      currentUser.id,
      data,
      query.id,
      updateProductPurchasesMutation,
      updatePurchaseMutation,
      updateVariantStockMutation,
    ]
  );

  console.log(data, error);

  useEffect(() => {
    if (updateData) {
      runUpdatePurchaseEffect(updateData);
    }
  }, [runUpdatePurchaseEffect, updateData]);

  if (loading) return <p>loading...</p>;
  if (error) return <ErrorMessage error={error} />;
  const { defaultValues } = updateDefaultValues(data);

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
