import { ApolloError } from "@apollo/client";
import { NestedValue } from "react-hook-form";

export type CalcTotal = { taxRate: number } & Pick<
  PurchaseFormValues,
  "orderDiscount" | "shippingCost" | "total"
>;

type queryOption = {
  id: string;
  name: string;
};

type FormValues = {
  warehouse: NestedValue<queryOption>;
  supplier: NestedValue<queryOption>;
  biller: NestedValue<queryOption>;
  customer: NestedValue<queryOption>;
  status: string;
  invoice?: any;
  variants: NestedValue<Variant[]>;
  items: number;
  orderQuantity: number;
  shippingCost: number;
  orderTaxRate: number;
  orderTax: number;
  grandTotal: number;
  orderDiscount: number;
  total: number;
  notes: string;
  staffNotes: string;
  saleNotes: string;
  saleStatus: string;
  paymentStatus: string;
};

export type PurchaseFormValues = Omit<
  FormValues,
  | "saleNotes"
  | "saleStatus"
  | "paymentStatus"
  | "staffNotes"
  | "biller"
  | "customer"
>;

export type SaleFormValues = Omit<FormValues, "notes" | "supplier" | "status">;

export type Variant = {
  id: string;
  itemcode: number;
  name: string;
  barcode: string;
  quantity: number;
  received: number;
  cost: number;
  discount: number;
  sku: string;
  total: number;
  tax: number;
};

export type Status =
  | "Recieved"
  | "Partial"
  | "Pending"
  | "Ordered"
  | "Completed"
  | "Due"
  | "Paid";

export type PurchaseStatus = Exclude<Status, "Completed" | "Due" | "Paid">;

export type PaymentStatus = Exclude<
  Status,
  "Completed" | "Recieved" | "Ordered"
>;

export type SaleStatus = Extract<Status, "Completed" | "Pending">;

type Option<T, K> = {
  label: T;
  value: K;
};

export type PaymentStatusOption = Option<
  PaymentStatus,
  Lowercase<PaymentStatus>
>;

export type PurchaseStatusOption = Option<
  PurchaseStatus,
  Lowercase<PurchaseStatus>
>;

export type SaleStatusOption = Option<SaleStatus, Lowercase<SaleStatus>>;

// export type SaleStatusOption = Option<>;

export type TaxOptions = {
  label: string;
  value: number;
};

type UniqueIdInput = {
  id: string;
};

type ProductPurchase = {
  barcode: string;
  sku: string;
  variant: { connect: UniqueIdInput };
  quantity: number;
  received: number;
  tax: number;
  discount: number;
  cost: number;
  total: number;
  purchase?: { connect: UniqueIdInput };
};

type UpdateProductPurchase = { data: Partial<ProductPurchase>; id: string };

type CreatePurchaseInput = {
  reference_no: string;
  item: number;
  total_qty: number;
  total_discount: number;
  total_cost: number;
  total_tax: number;
  tax_rate: number;
  shipping_cost: number;
  grand_total: number;
  paid_amount: number;
  invoice?: any;
  status: string;
  user: UniqueIdInput;
  product_purchases?: ProductPurchase[];
  supplier: UniqueIdInput;
  warehouse: UniqueIdInput;
  notes: string;
};

type UpdatePurchaseInput = {
  id: string;
  data: Partial<CreatePurchaseInput>;
};

type UpdateVariantStockInput = {
  id: string;
  data: {
    sellable: number;
    stockOnHand: number;
    outOfStockThreshold: number;
    lastCostPrice: number;
    totalPurchased: number;
    isAvailable: boolean;
    isSellable: boolean;
  };
};

type VariantStockData = {
  sellable: number;
  stockOnHand: number;
  outOfStockThreshold: number;
  lastCostPrice: number;
  totalPurchased: number;
  isAvailable: boolean;
  isSellable: boolean;
};

type Message = {
  type: string;
  ok: boolean;
  data?: any;
  error?: ApolloError;
};

type CreateProductPurchaseInput = {
  data: ProductPurchase;
};

type ProductWarehouse = Pick<ProductPurchase, "quantity" | "variant"> & {
  warehouse: { connect: UniqueIdInput };
};

type UpdateProductWarehouseInput = {
  id: string;
  data: Partial<ProductWarehouse>;
};

type CreateProductWarehouseInput = {
  data: ProductWarehouse;
};
