import { gql, useMutation } from "@apollo/client";

const UPDATE_PURCHASE_MUTATION = gql`
  mutation UPDATE_PURCHASE_MUTATION(
    $id: ID
    $reference_no: String
    $item: Int
    $total_qty: Int
    $total_discount: Int
    $total_cost: Int
    $total_tax: Int
    $tax_rate: Int
    $shipping_cost: Int
    $grand_total: Int
    $paid_amount: Int
    $invoice: Upload
    $status: String
    $user: UserWhereUniqueInput
    $product_purchases: [ProductPurchaseCreateInput]
    $supplier: SupplierWhereUniqueInput
    $warehouse: WarehouseWhereUniqueInput
    $notes: String
  ) {
    createPurchase(
      id: $id
      data: {
        reference_no: $reference_no
        item: $item
        total_qty: $total_qty
        total_discount: $total_discount
        total_cost: $total_cost
        total_tax: $total_tax
        tax_rate: $tax_rate
        shipping_cost: $shipping_cost
        grand_total: $grand_total
        paid_amount: $paid_amount
        invoice: { upload: $invoice }
        status: $status
        user: { connect: $user }
        product_purchases: { create: $product_purchases }
        supplier: { connect: $supplier }
        warehouse: { connect: $warehouse }
        notes: $notes
      }
    ) {
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
