import { gql, useMutation } from "@apollo/client";

const DELETE_PRODUCT_PURCHASE_MUTATION = gql`
  mutation DELETE_PRODUCT_PURCHASE_MUTATION($productPurchaseId: ID!) {
    deleteProductPurchase(id: $productPurchaseId) {
      id
      cost
      barcode
      sku
      variant {
        id
        allocated
        stockOnHand
        outOfStockThreshold
        totalPurchased
      }
      quantity
      received
      total
      discount
      tax
    }
  }
`;

export const useDeleteProductPurchaseMutation = () => {
  const deleteProductPurchase = useMutation(DELETE_PRODUCT_PURCHASE_MUTATION);
  return deleteProductPurchase;
};
