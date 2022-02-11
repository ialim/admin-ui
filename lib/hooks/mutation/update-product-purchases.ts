import { gql, useMutation } from "@apollo/client";

const UPDATE_PRODUCT_PURCHASES_MUTATION = gql`
  mutation UPDATE_PRODUCT_PURCHASES_MUTATION(
    $updateProductPurchasesInput: [ProductPurchasesUpdateInput]
  ) {
    updateProductPurchases(data: $updateProductPurchasesInput) {
      id
      sku
      cost
      received
      quantity
      variant {
        id
        allocated
        sellable
        stockOnHand
        outOfStockThreshold
        totalPurchased
      }
    }
  }
`;

export const useUpdateProductPurchasesMutation = () => {
  const updateProductPurchases = useMutation(UPDATE_PRODUCT_PURCHASES_MUTATION);
  return updateProductPurchases;
};
