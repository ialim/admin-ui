import { NestedValue } from "react-hook-form";

export type CalcTotal = { taxRate: number } & Pick<
  PurchaseFormValues,
  "orderDiscount" | "shippingCost" | "total"
>;

type FormValues = {
  warehouse: string;
  supplier: string;
  biller: string;
  customer: string;
  status: string;
  invoice: any;
  variants: NestedValue<Variant[]>;
  items: number;
  orderQuantity: number;
  shippingCost: number;
  orderTax: number;
  grandTotal: number;
  orderDiscount: number;
  total: number;
  notes: string;
  stafNotes: string;
  saleNotes: string;
  saleStatus: string;
  paymentStatus: string;
};

export type PurchaseFormValues = {
  warehouse: string;
  supplier: string;
  status: string;
  invoice: any;
  variants: NestedValue<Variant[]>;
  items: number;
  orderQuantity: number;
  shippingCost: number;
  orderTax: number;
  grandTotal: number;
  orderDiscount: number;
  total: number;
  notes: string;
};

export type Variant = {
  id: string;
  itemcode: number;
  name: string;
  barcode?: number;
  quantity?: number;
  cost?: number;
  discount?: number;
  sku?: string;
  total?: number;
  tax?: number;
};

export type status =
  | "Recieved"
  | "Partial"
  | "Pending"
  | "Ordered"
  | "Completed"
  | "Due"
  | "Paid";

export type PurchaseStatus = "Recieved" | "Partial" | "Pending" | "Ordered";

export type Option = {
  label: PurchaseStatus;
  value: string;
};

export type TaxOptions = {
  label: string;
  value: number;
};
