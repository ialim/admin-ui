import { gql, useMutation } from "@apollo/client";

const UPDATE_VARIANT_STOCK_MUTATION = gql`
  mutation UPDATE_VARIANT_STOCK_MUTATION(
    $updateVariantStockInput: [ProductVariantsUpdateInput]
  ) {
    updateProductVariants(data: $updateVariantStockInput) {
      id
      allocated
      sellable
      stockOnHand
      outOfStockThreshold
      lastCostPrice
      totalPurchased
      isAvailable
      isSellable
    }
  }
`;

export const useUpdateVariantStockMutation = () => {
  const updateVariantStock = useMutation(UPDATE_VARIANT_STOCK_MUTATION);
  return updateVariantStock;
};

const UPDATE_SINGLE_VARIANT_STOCK_MUTATION = gql`
  mutation UPDATE_VARIANT_STOCK_MUTATION(
    $id: ID
    $updateVariantStockInput: ProductVariantsUpdateInput
  ) {
    updateProductVariants(id: $id, data: $updateVariantStockInput) {
      id
      allocated
      sellable
      stockOnHand
      outOfStockThreshold
      lastCostPrice
      totalPurchased
      isAvailable
      isSellable
    }
  }
`;

export const useUpdateSingleVariantStockMutation = () => {
  const updateVariantStock = useMutation(UPDATE_SINGLE_VARIANT_STOCK_MUTATION);
  return updateVariantStock;
};
