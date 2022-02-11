import { gql, useMutation } from "@apollo/client";

const UPDATE_PRODUCT_WAREHOUSE_MUTATION = gql`
  mutation UPDATE_PRODUCT_WAREHOUSE_MUTATION(
    $variables: [ProductWarehousesUpdateInput]
  ) {
    updateProductWarehouses(data: $variables) {
      variant {
        id
      }
      quantity
      warehouse {
        id
      }
    }
  }
`;

export const useUpdateProductWarehouses = () => {
  const updateProductWarehouses = useMutation(
    UPDATE_PRODUCT_WAREHOUSE_MUTATION
  );
  return updateProductWarehouses;
};
