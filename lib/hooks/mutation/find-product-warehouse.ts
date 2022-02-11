import { gql, useLazyQuery } from "@apollo/client";

const FIND_WAREHOUSE_PRODUCT_QUERY = gql`
  query FIND_WAREHOUSE_PRODUCT_QUERY($id: ID, $variants: [ID]) {
    allProductWarehouses(
      where: {
        AND: [{ warehouse: { id: $id } }, { variant: { id_in: $variants } }]
      }
    ) {
      id
      variant {
        id
      }
      quantity
    }
  }
`;

export const useFindWarehouseProducts = () => {
  const result = useLazyQuery(FIND_WAREHOUSE_PRODUCT_QUERY);
  return result;
};
