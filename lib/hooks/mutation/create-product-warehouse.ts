import { gql, useMutation } from "@apollo/client";

const CREATE_PRODUCT_WAREHOUSE_MUTATION = gql`
  mutation CREATE_PRODUCT_WAREHOUSE_MUTATION(
    $variables: [ProductWarehousesCreateInput]
  ) {
    createProductWarehouses(data: $variables) {
      id
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

export const useCreateProductWarehouses = () => {
  const createProductWarehouses = useMutation(
    CREATE_PRODUCT_WAREHOUSE_MUTATION
  );
  return createProductWarehouses;
};
