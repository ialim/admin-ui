import { gql, useMutation } from "@apollo/client";

const CREATE_PRODUCT_PURCHASES_MUTATION = gql`
  mutation CREATE_PRODUCT_PURCHASES_MUTATION(
    $createProductPurchasesInput: [ProductPurchasesCreateInput]
  ) {
    createProductPurchases(data: $createProductPurchasesInput) {
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

export const useCreateProductPurchasesMutation = () => {
  const createProductPurchases = useMutation(CREATE_PRODUCT_PURCHASES_MUTATION);
  return createProductPurchases;
};
