import { gql, useMutation } from "@apollo/client";

const UPDATE_PURCHASE_MUTATION = gql`
  mutation UPDATE_PURCHASE_MUTATION($id: ID!, $data: PurchaseUpdateInput) {
    updatePurchase(id: $id, data: $data) {
      id
      product_purchases {
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
  }
`;

export const useUpdatePurchaseMutation = () => {
  const updatePurchase = useMutation(UPDATE_PURCHASE_MUTATION);
  return updatePurchase;
};
