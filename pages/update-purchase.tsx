import { useEffect, useState, useCallback } from "react";
import { ErrorMessage } from "../components/error-message";
import { Invoice } from "../components/invoice";
import {
  formatProductWarehouseData,
  formatUpdatePurchaseData,
  formatUpdatePurchaseWarehouseData,
  formatUpdateVariantStockOnDelete,
  formatVariantStockUpdateData,
  updateDefaultValues,
} from "../lib/format-data";
import { useCreateProductPurchasesMutation } from "../lib/hooks/mutation/create-product-purchase";
import { useCreateProductWarehouses } from "../lib/hooks/mutation/create-product-warehouse";
import { useDeleteProductPurchaseMutation } from "../lib/hooks/mutation/delete-product-purchase";
import { useFindWarehouseProducts } from "../lib/hooks/mutation/find-product-warehouse";
import { useFindPurchaseById } from "../lib/hooks/mutation/find-purchase";
import { useUpdateProductPurchasesMutation } from "../lib/hooks/mutation/update-product-purchases";
import { useUpdateProductWarehouses } from "../lib/hooks/mutation/update-product-warehouse";
import { useUpdatePurchaseMutation } from "../lib/hooks/mutation/update-purchase";
import { useUpdateVariantStockMutation } from "../lib/hooks/mutation/update-variant";
import { useRunMutationFunction } from "../lib/hooks/run-mutation";
import { useUser } from "../lib/hooks/User";
import {
  CreateProductPurchaseInput,
  Message,
  PurchaseFormValues,
  UpdateProductPurchase,
  UpdatePurchaseInput,
  UpdateVariantStockInput,
} from "../types/types";

const UpdatePurchase = ({ query }: any) => {
  const [updateData, setUpdateData] = useState<any>(undefined);
  const [entry, setEntry] = useState(false);
  const [deleteProductPurchaseIds, setDeleteProductPurchaseIds] = useState<
    string[]
  >([]);

  const { loading, error, data } = useFindPurchaseById(query.id);
  const currentUser = useUser();
  const [
    findProductWarehouse,
    { loading: findLoading, error: findError, data: findData },
  ] = useFindWarehouseProducts();
  const [updatePurchase] = useUpdatePurchaseMutation();
  const [updateProductPurchases] = useUpdateProductPurchasesMutation();
  const [createProductPurchases] = useCreateProductPurchasesMutation();
  const [updateVariantStock] = useUpdateVariantStockMutation();
  const [createProductWarehouses] = useCreateProductWarehouses();
  const [updateProductWarehouses] = useUpdateProductWarehouses();
  const [deleteProductPurchase] = useDeleteProductPurchaseMutation();

  const findProductWarehouseQuery =
    useRunMutationFunction(findProductWarehouse);
  const updateProductWarehousesMutation = useRunMutationFunction(
    updateProductWarehouses
  );
  const createProductWarehousesMutation = useRunMutationFunction(
    createProductWarehouses
  );

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

  const deletePurchaseProductMutation = useCallback(
    async (productPurchaseId: string): Promise<Message> => {
      try {
        const res = await deleteProductPurchase({
          variables: { productPurchaseId: productPurchaseId },
        });
        return { type: "delete product purchase", ok: true, data: res.data };
      } catch (error: any) {
        return { type: "delete product purchase", ok: false, error };
      }
    },
    [deleteProductPurchase]
  );

  const updateSingleVariantStockMutation = useCallback(
    async (
      updateVariantStockInput: UpdateVariantStockInput
    ): Promise<Message> => {
      try {
        const res = await updateVariantStock({
          variables: { updateVariantStockInput },
        });
        return {
          type: "update variant stock on delete",
          ok: true,
          data: res.data,
        };
      } catch (error: any) {
        return { type: "update variant stock on delete", ok: false, error };
      }
    },
    [updateVariantStock]
  );

  const runDeleteProductPurchaseEffect = useCallback(
    async (id: string) => {
      const {
        ok,
        type,
        error,
        data: deleteData,
      } = await deletePurchaseProductMutation(id);

      if (ok) {
        const updateVariantStockInput =
          formatUpdateVariantStockOnDelete(deleteData);

        const { ok, type, error, data } =
          await updateSingleVariantStockMutation(updateVariantStockInput);
        ok ? console.log(type, data) : console.log(type, error?.message);
      }
    },
    [deletePurchaseProductMutation, updateSingleVariantStockMutation]
  );

  const runWarehouseUpdate = useCallback(
    async (updateData: any, variantIds: string[], defaultValues: any) => {
      console.log("findData warehouse: ", findData);
      if (findData) {
        const {
          rollBackUpdateProductWarehouse,
          createWarehouseProductsInput,
          updateWarehouseProductsInput,
        } = formatUpdatePurchaseWarehouseData(
          updateData,
          defaultValues,
          findData?.allProductWarehouses
        );

        if (!rollBackUpdateProductWarehouse.length) {
          console.log(
            "createWarehouseProductsInput: ",
            createWarehouseProductsInput
          );
          console.log(
            "updateWarehouseProductsInput: ",
            updateWarehouseProductsInput
          );

          if (createWarehouseProductsInput.length) {
            const { ok, error, type, data } =
              await createProductWarehousesMutation(
                createWarehouseProductsInput,
                "create product warehouse"
              );
            ok ? console.log(type, data) : console.log(type, error?.message);
          }
          if (updateWarehouseProductsInput.length) {
            const { ok, error, type, data } =
              await updateProductWarehousesMutation(
                updateWarehouseProductsInput,
                "update product warehouse"
              );
            ok ? console.log(type, data) : console.log(type, error?.message);
          }
        } else {
          const { ok, error, type, data } =
            await updateProductWarehousesMutation(
              rollBackUpdateProductWarehouse,
              "rollback product warehouse"
            );
          ok ? console.log(type, data) : console.log(type, error?.message);

          const {
            ok: newDataOK,
            error: newDataError,
            type: newDataType,
          } = await findProductWarehouseQuery(
            { id: updateData.warehouse.id, variantIds },
            "find new product warehouse"
          );

          const {
            variants,
            warehouse: { id: warehouseId },
          } = updateData;

          // product warehouse data for new warehouse
          const productWarehouseInput = variants.map((variant: any) => {
            const { received, id } = variant;
            return {
              warehouse: { connect: { id: warehouseId } },
              quantity: received,
              variant: { connect: { id } },
            };
          });

          if (newDataOK && findData) {
            const {
              createWarehouseProductsInput,
              updateWarehouseProductsInput,
            } = formatProductWarehouseData(
              findData?.allProductWarehouses,
              productWarehouseInput
            );

            // create product warehouse if variants does not exist
            if (createWarehouseProductsInput.length) {
              const { ok, error, type, data } =
                await createProductWarehousesMutation(
                  createWarehouseProductsInput,
                  "create new product warehouse"
                );
              ok ? console.log(type, data) : console.log(type, error?.message);
            }

            // update product warehouse if variants already exist
            if (updateWarehouseProductsInput.length) {
              const { ok, error, type, data } =
                await updateProductWarehousesMutation(
                  updateWarehouseProductsInput,
                  "update new product warehouse"
                );
              ok ? console.log(type, data) : console.log(type, error?.message);
            }
          } else {
            console.log(newDataType, newDataError);
          }
        }
      }
    },
    [
      createProductWarehousesMutation,
      findData,
      findProductWarehouseQuery,
      updateProductWarehousesMutation,
    ]
  );

  const runUpdatePurchaseEffect = useCallback(
    async (
      updatePurchaseInput: UpdatePurchaseInput,
      updateProductPurchasesInput: UpdateProductPurchase[],
      createProductPurchasesInput: CreateProductPurchaseInput[],
      defaultValues: PurchaseFormValues
    ) => {
      setEntry(true);
      console.log("updatePurchaseInput: ", updatePurchaseInput);

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
        console.log(
          "updateProductPurchasesInput: ",
          updateProductPurchasesInput
        );
        if (updateProductPurchasesInput.length) {
          const {
            ok,
            type: productPurchasesType,
            data: productPurchasesData,
            error,
          } = await updateProductPurchasesMutation(updateProductPurchasesInput);

          // update variant stock information on successful product purchse update
          if (ok && productPurchasesData) {
            console.log(productPurchasesType, productPurchasesData);
            const updateVariantStockInput = formatVariantStockUpdateData(
              productPurchasesData.updateProductPurchases,
              defaultValues
            );

            console.log("Update Product: ", updateVariantStockInput);
            const { ok, type, error, data } = await updateVariantStockMutation(
              updateVariantStockInput
            );
            ok ? console.log(type, data) : console.log(type, error);
          }
          error && console.log(productPurchasesType, error.message);
        }

        // create product purchase if any
        console.log(
          "createProductPurchasesInput: ",
          createProductPurchasesInput
        );
        if (createProductPurchasesInput.length) {
          const {
            ok,
            type: createProdType,
            error,
            data: createProdData,
          } = await createProductPurchasesMutation(createProductPurchasesInput);

          // update variant stock information on successful product purchse create
          if (ok && createProdData) {
            console.log(createProdType, createProdData);
            const updateVariantStockInput = formatVariantStockUpdateData(
              createProdData.createProductPurchases
            );

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
      updateProductPurchasesMutation,
      updatePurchaseMutation,
      updateVariantStockMutation,
    ]
  );

  useEffect(() => {
    if (updateData && data && currentUser) {
      console.log("well...", deleteProductPurchaseIds);
      const { defaultValues, user } = updateDefaultValues(data);
      const {
        updatePurchaseInput,
        updateProductPurchasesInput,
        createProductPurchasesInput,
        variantIds,
      } = formatUpdatePurchaseData(
        updateData,
        defaultValues,
        query.id,
        user.id !== currentUser?.id && currentUser?.id
      );
      if (!entry)
        runUpdatePurchaseEffect(
          updatePurchaseInput,
          updateProductPurchasesInput,
          createProductPurchasesInput,
          defaultValues
        );

      // find product warehouse for initial warehouse and variants
      findProductWarehouseQuery(
        { id: defaultValues.warehouse.id, variants: variantIds },
        "find product warehouse"
      );

      // Update warehouse Stock Information
      if (findData) {
        console.log("FindData: ", findData);
        runWarehouseUpdate(updateData, variantIds, defaultValues);
      }

      // setUpdateData(undefined);
    }
  }, [
    currentUser,
    data,
    deleteProductPurchaseIds,
    entry,
    findData,
    findProductWarehouseQuery,
    query.id,
    runUpdatePurchaseEffect,
    runWarehouseUpdate,
    updateData,
  ]);

  if (loading) return <p>loading...</p>;
  findLoading
    ? console.log("loading on find data...")
    : console.log(findData, findError);
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
      setDeleteProductPurchaseIds={setDeleteProductPurchaseIds}
    />
  );
};
export default UpdatePurchase;
