import { gql, useQuery } from "@apollo/client";

const FIND_PURCHASE_QUERY = gql`
  query FIND_PURCHASE_QUERY($id: ID) {
    Purchase(where: { id: $id }) {
      reference_no
      item
      total_qty
      total_discount
      total_cost
      total_tax
      tax_rate
      shipping_cost
      grand_total
      paid_amount
      notes
      status
      invoice { filename }
      product_purchases {
        id
        cost
        barcode
        sku
        variant {
          id
          itemcode
          name
        }
        quantity
        received
        total
        discount
        tax
      }
      warehouse {
        id
        name
      }
      supplier {
        id
        name
      }
      user {
        id
        name
      }
    }
  }
`;

export const useFindPurchaseById = (id: string) => {
  const findPurchase = useQuery(FIND_PURCHASE_QUERY, { variables: { id } });
  return findPurchase;
};
