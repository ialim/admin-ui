import { ApolloError } from "@apollo/client";
import { useState, useEffect, useCallback } from "react";
import { Invoice } from "../components/invoice";
import { PURCHASE_DEFAULT_VALUES } from "../lib/constants";
import {
  formatCreatePurchaseData,
  formatProductWarehouseData,
  formatVariantStockUpdateData,
} from "../lib/format-data";
import { useCreateProductWarehouses } from "../lib/hooks/mutation/create-product-warehouse";
import { useCreatePurchaseMutation } from "../lib/hooks/mutation/create-purchase";
import { useFindWarehouseProducts } from "../lib/hooks/mutation/find-product-warehouse";
import { useUpdateProductWarehouses } from "../lib/hooks/mutation/update-product-warehouse";
import { useUpdateVariantStockMutation } from "../lib/hooks/mutation/update-variant";
import { useUser } from "../lib/hooks/User";
import {
  CreateProductWarehouseInput,
  CreatePurchaseInput,
  Message,
  UpdateProductWarehouseInput,
  UpdateVariantStockInput,
} from "../types/types";

const AddPurchase = () => {
  const [data, setData] = useState<any>();
  const user = useUser();
  const [createPurchase, { loading, error, data: purchaseData }] =
    useCreatePurchaseMutation();

  const [
    findProductWarehouse,
    { loading: findLoading, error: findError, data: findData },
  ] = useFindWarehouseProducts();
  const [updateVariantStock, updateResult] = useUpdateVariantStockMutation();
  const [createProductWarehouses] = useCreateProductWarehouses();
  const [updateProductWarehouses] = useUpdateProductWarehouses();

  const findProductWarehouseQuery = useCallback(
    async (warehouseId: string, variants: string[]): Promise<Message> => {
      try {
        const res = findProductWarehouse({
          variables: { id: warehouseId, variants },
        });
        return { type: "find product warehouse", ok: true, data: findData };
      } catch (error: any) {
        return { type: "find product warehouse", ok: false, error };
      }
    },
    [findData, findProductWarehouse]
  );

  const updateProductWarehousesMutation = useCallback(
    async (
      updateWarehouseProductsInput: UpdateProductWarehouseInput[]
    ): Promise<Message> => {
      try {
        const res = await updateProductWarehouses({
          variables: { updateWarehouseProductsInput },
        });
        return { type: "update product warehouse", ok: true, data: res.data };
      } catch (error: any) {
        return { type: "update product warehouse", ok: false, error };
      }
    },
    [updateProductWarehouses]
  );

  const createProductWarehousesMutation = useCallback(
    async (
      createWarehouseProductsInput: CreateProductWarehouseInput[]
    ): Promise<Message> => {
      try {
        const res = await createProductWarehouses({
          variables: { createWarehouseProductsInput },
        });
        return { type: "create product warehouse", ok: true, data: res.data };
      } catch (error: any) {
        return { type: "create product warehouse", ok: false, error };
      }
    },
    [createProductWarehouses]
  );

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

  const runPurchaseEffect = useCallback(async (data: any) => {
    const {
      createPurchaseInput,
      productWarehouseInput,
      variantIds,
      warehouse,
    } = formatCreatePurchaseData(data, user?.id);

    console.log("createPurchaseInput: ", createPurchaseInput);

    const {
      ok,
      type,
      error,
      data: variantStockDatas,
    } = await createPurchaseMutation(createPurchaseInput);

    if (ok) {
      console.log("variantStockDatas: ", variantStockDatas);
      const updateVariantStockInput =
        formatVariantStockUpdateData(variantStockDatas);
      console.log("updateVariantStockInput: ", updateVariantStockInput);
      const {
        ok,
        type,
        error,
        data: updatedVariantStockDatas,
      } = await updateVariantStockMutation(updateVariantStockInput);

      const {
        ok: findOk,
        error: findError,
        type: findType,
        // data: findData,
      } = await findProductWarehouseQuery(warehouse.id, variantIds);

      if (findOk) {
        console.log("Existing Warehouse Products: ", findData);
        const { createWarehouseProductsInput, updateWarehouseProductsInput } =
          formatProductWarehouseData(
            findData.allProductWarehouses,
            productWarehouseInput
          );

        console.log(
          "createWarehouseProductsInput: ",
          createWarehouseProductsInput
        );
        console.log(
          "updateWarehouseProductsInput: ",
          updateWarehouseProductsInput
        );

        if (createWarehouseProductsInput.length) {
          const { ok, error, data, type } =
            await createProductWarehousesMutation(createWarehouseProductsInput);
          ok ? console.log(type, data) : console.log(type, error?.message);
        }

        if (updateWarehouseProductsInput.length) {
          const { ok, error, type, data } =
            await updateProductWarehousesMutation(updateWarehouseProductsInput);
          ok ? console.log(type, data) : console.log(type, error?.message);
        }
      } else {
        console.log(findType, findError);
      }

      ok
        ? console.log(type, updatedVariantStockDatas)
        : console.log(type, error?.message);
    } else {
      console.log(type, error);
    }
  }, []);

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
