import {
  CreatePurchaseInput,
  ProductPurchase,
  PurchaseFormValues,
} from "../types/types";

export const formatCreatePurchaseData = (
  data: PurchaseFormValues,
  user: string
): CreatePurchaseInput => {
  let time = new Date();
  let first = time.getTime().toString().slice(5, 10);
  let second = time.toLocaleDateString().replace(/\//g, "");
  let product_purchases: ProductPurchase[] = [];

  const reference_no = `pr-${first}-${second}`;
  const {
    items,
    supplier,
    warehouse,
    orderQuantity,
    orderTaxRate,
    orderTax,
    total,
    orderDiscount,
    variants,
    grandTotal,
    notes,
    shippingCost,
    status,
    invoice,
  } = data;

  variants.map((variant) => {
    const { barcode, sku, quantity, cost, total, id, received, tax, discount } =
      variant;
    let sku_u = `${supplier}-${warehouse}-${second}-${barcode}`;
    product_purchases.push({
      barcode,
      variant: { connect: { id } },
      sku: sku_u,
      quantity,
      received:
        status === "ordered" || status === "pending"
          ? 0
          : status === "partial"
          ? received
          : quantity,
      tax: Math.round(tax * 100),
      discount: Math.round(discount * 100),
      cost: Math.round(cost * 100),
      total: Math.round(total * 100),
    });
  });

  const createPurchaseInput: CreatePurchaseInput = {
    reference_no,
    item: items,
    total_qty: orderQuantity,
    total_discount: orderDiscount * 100,
    total_cost: Math.round(total * 100),
    total_tax: Math.round(orderTax * 100),
    tax_rate: orderTaxRate,
    shipping_cost: shippingCost * 100,
    grand_total: Math.round(grandTotal * 100),
    paid_amount: 0,
    invoice: invoice[0],
    status,
    user: { id: user },
    product_purchases,
    supplier: { id: supplier },
    warehouse: { id: warehouse },
    notes,
  };

  return createPurchaseInput;
};
