import { CreatePurchaseInput, ProductPurchase, PurchaseFormValues } from "../types/types";


export const formatCreatePurchaseData = (
    data: PurchaseFormValues,
    user: string
  ): CreatePurchaseInput => {
    let first = Date.now().toString().slice(7, 13);
    let second = Date.now().toLocaleString().replace("/", "");
    let product_purchases: ProductPurchase[] = [];

    const reference_no = `pr-${first}-${second}`;
    const {
      items,
      supplier,
      warehouse,
      orderQuantity,
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
      const { barcode, sku, quantity, cost, total, id } = variant;
      product_purchases.push({
        barcode,
        variant: { connect: { id } },
        sku,
        quantity,
        cost,
        total,
      });
    });
  
    const createPurchaseInput: CreatePurchaseInput = {
      reference_no,
      item: items,
      total_qty: orderQuantity,
      total_discount: orderDiscount * 100,
      total_cost: total * 100,
      total_tax: orderTax * 100,
      shipping_cost: shippingCost * 100,
      grand_total: grandTotal * 100,
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