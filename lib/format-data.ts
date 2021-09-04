import {
  CreateProductPurchaseInput,
  CreatePurchaseInput,
  ProductPurchase,
  PurchaseFormValues,
  UpdateProductPurchase,
  UpdatePurchaseInput,
  UpdateVariantStockInput,
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
    let sku_u = `${supplier.id}-${warehouse.id}-${second}-${barcode}`;
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

  // create prodeuct purchase record
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
    supplier: { id: supplier.id },
    warehouse: { id: warehouse.id },
    notes,
  };

  return createPurchaseInput;
};

export const formatVariantStockUpdateData = (data: any) => {
  const updateVariantStockInput: UpdateVariantStockInput[] = [];
  const {
    createPurchase: { product_purchases },
  } = data;

  product_purchases.map((productPurchase: any) => {
    const {
      cost,
      received,
      quantity,
      variant: {
        id,
        allocated,
        sellable,
        stockOnHand,
        outOfStockThreshold,
        totalPurchased,
      },
    } = productPurchase;

    let notNull = [
      allocated,
      sellable,
      stockOnHand,
      outOfStockThreshold,
      totalPurchased,
    ].map((val) => (val === null ? 0 : val));

    let [
      _allocated,
      _sellable,
      _stockOnHand,
      _outOfStockThreshold,
      _totalPurchased,
    ] = notNull;

    // update stock information for products variant purchase on CRUD
    updateVariantStockInput.push({
      id,
      data: {
        sellable: _stockOnHand + received - _allocated - _outOfStockThreshold,
        stockOnHand: _stockOnHand + received,
        outOfStockThreshold: _outOfStockThreshold,
        lastCostPrice: cost,
        totalPurchased: _totalPurchased + quantity,
        isAvailable:
          _stockOnHand + received - outOfStockThreshold > 0 ? true : false,
        isSellable:
          _stockOnHand + received - _allocated - _outOfStockThreshold > 0
            ? true
            : false,
      },
    });
  });
  return updateVariantStockInput;
};

export const updateDefaultValues = (data: any) => {
  const {
    reference_no,
    item: items,
    total_qty,
    total_discount,
    total_cost,
    total_tax,
    tax_rate,
    shipping_cost,
    grand_total,
    paid_amount,
    notes,
    status,
    warehouse,
    supplier,
    product_purchases,
    user,
  } = data?.Purchase;

  // pass initial values to purchase update form
  const defaultValues: PurchaseFormValues = {
    items,
    orderQuantity: total_qty,
    orderDiscount: total_discount / 100,
    total: total_cost / 100,
    orderTax: total_tax / 100,
    orderTaxRate: tax_rate,
    shippingCost: shipping_cost / 100,
    grandTotal: grand_total / 100,
    notes,
    status,
    warehouse,
    supplier,
    variants: product_purchases.map((product_purchase: any) => {
      const {
        id: productPurchaseId,
        cost,
        barcode,
        sku,
        variant: { id, itemcode, name },
        quantity,
        received,
        total,
        discount,
        tax,
      } = product_purchase;
      return {
        cost: cost / 100,
        barcode,
        sku: `${productPurchaseId}-${sku}`,
        id,
        itemcode,
        name,
        quantity,
        received,
        total: total / 100,
        discount: discount / 100,
        tax: tax / 100,
      };
    }),
  };
  return { defaultValues, user };
};

export const formatUpdatePurchaseData = (
  updateData: PurchaseFormValues,
  intialValues: PurchaseFormValues,
  purchaseId: string,
  user?: string
) => {
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
  } = intialValues;

  // update existing purchase information is necessary
  const updatePurchaseInput: UpdatePurchaseInput = {
    id: purchaseId,
    data: {
      ...(items !== updateData.items && { item: updateData.items }),
      ...(orderQuantity !== updateData.orderQuantity && {
        total_qty: updateData.orderQuantity,
      }),
      ...(orderDiscount !== updateData.orderDiscount && {
        total_discount: updateData.orderDiscount * 100,
      }),
      ...(total !== updateData.total && {
        total_cost: Math.round(updateData.total * 100),
      }),
      ...(orderTax !== updateData.orderTax && {
        total_tax: Math.round(updateData.orderTax * 100),
      }),
      ...(orderTaxRate !== updateData.orderTaxRate && {
        tax_rate: updateData.orderTaxRate,
      }),
      ...(shippingCost !== updateData.shippingCost && {
        shipping_cost: updateData.shippingCost * 100,
      }),
      ...(grandTotal !== updateData.grandTotal && {
        grand_total: Math.round(updateData.grandTotal * 100),
      }),
      ...(invoice?.length && { invoice: invoice[0] }),
      ...(status !== updateData.status && { status: updateData.status }),
      ...(warehouse.id !== updateData.warehouse.id && {
        warehouse: { id: updateData.warehouse.id },
      }),
      ...(supplier.id !== updateData.supplier.id && {
        supplier: { id: updateData.supplier.id },
      }),
      ...(notes !== updateData.notes && { notes: updateData.notes }),
      ...(user && { user: { id: user } }),
    },
  };

  let updateProductPurchasesInput: UpdateProductPurchase[] = [];
  let createProductPurchasesInput: CreateProductPurchaseInput[] = [];

  updateData.variants.map((variant, index) => {
    const { barcode, sku, quantity, cost, total, id, received, tax, discount } =
      variant;

    // Update existing product if there are any changes
    if (id === variants[index].id) {
      updateProductPurchasesInput.push({
        id,
        data: {
          ...(barcode !== variants[index].barcode && { barcode }),
          ...(quantity !== variants[index].quantity && { quantity }),
          ...(received !== variants[index].received && {
            received:
              updateData.status === "ordered" || updateData.status === "pending"
                ? 0
                : updateData.status === "partial"
                ? received
                : quantity,
          }),
          ...(cost !== variants[index].cost && {
            cost: Math.round(cost * 100),
          }),
          ...(discount !== variants[index].discount && {
            discount: Math.round(discount * 100),
          }),
          ...(total !== variants[index].total && {
            total: Math.round(total * 100),
          }),
          ...(tax !== variants[index].tax && { tax: Math.round(tax * 100) }),
        },
      });
    }

    // create newly added product if there are any
    if (id !== variants[index].id) {
      let time = new Date();
      let second = time.toLocaleDateString().replace(/\//g, "");
      let sku_u = `${supplier.id}-${warehouse.id}-${second}-${barcode}`;
      createProductPurchasesInput.push({
        data: {
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
          purchase: { connect: { id: purchaseId } },
        },
      });
    }
  });

  return {
    updatePurchaseInput,
    updateProductPurchasesInput,
    createProductPurchasesInput,
  };
};

export const formatUpdateVariantStockOnDelete = (data: any) => {
  const {
    cost,
    received,
    quantity,
    variant: {
      id,
      allocated,
      stockOnHand,
      outOfStockThreshold,
      totalPurchased,
    },
  } = data;

  const updateVariantStockInput: UpdateVariantStockInput = {
    id,
    data: {
      sellable: stockOnHand - received - allocated - outOfStockThreshold,
      stockOnHand: stockOnHand - received,
      outOfStockThreshold: outOfStockThreshold,
      lastCostPrice: cost,
      totalPurchased: totalPurchased - quantity,
      isAvailable:
        stockOnHand - received - outOfStockThreshold > 0 ? true : false,
      isSellable:
        stockOnHand - received - allocated - outOfStockThreshold > 0
          ? true
          : false,
    },
  };
  return updateVariantStockInput;
};
