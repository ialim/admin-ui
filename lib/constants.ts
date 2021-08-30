import { gql } from "@apollo/client";
import {
  PaymentStatusOption,
  PurchaseStatusOption,
  SaleStatusOption,
  TaxOptions,
} from "../types/types";

export const CLIENT_SIDE_FILTERING_LIMIT: number = 1000;

// Queries
export const ALL_WAREHOUSE_QUERY = gql`
  query {
    allWarehouses {
      id
      name
    }
  }
`;

export const ALL_SUPPLIERS_QUERY = gql`
  query {
    allSuppliers {
      id
      name
    }
  }
`;

export const ALL_CUSTOMERS_QUERY = gql`
  query {
    allCustomers {
      id
      name
    }
  }
`;

export const ALL_BILLERS_QUERY = gql`
  query {
    allBillers {
      id
      name
    }
  }
`;

export const ALL_PURCHASES_QUERY = gql`
  query ALL_PURCHASES_QUERY {
    allPurchases {
      id
      created_at
      reference_no
    }
  }
`;

export const SEARCH_PURCHASE_QUERY = gql`
  query SEARCH_PURCHASE_QUERY($searchTerm: String) {
    searchPurchases: allPurchases(
      where: {
        OR: [
          { reference_no_contains_i: $searchTerm }
          { status_contains_i: $searchTerm }
          { supplier: { name_contains_i: $searchTerm } }
          { user: { name_contains_i: $searchTerm } }
        ]
      }
    ) {
      id
      created_at
      reference_no
    }
  }
`;

// Purchase Page
export const STATUS_OPTIONS: PurchaseStatusOption[] = [
  { label: "Recieved", value: "recieved" },
  { label: "Partial", value: "partial" },
  { label: "Pending", value: "pending" },
  { label: "Ordered", value: "ordered" },
];

export const PAYMENT_STATUS_OPTIONS: PaymentStatusOption[] = [
  { label: "Due", value: "due" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Partial", value: "partial" },
];

export const SALE_STATUS_OPTIONS: SaleStatusOption[] = [
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
];

export const TAX_OPTIONS: TaxOptions[] = [
  { label: "No Tax", value: 0 },
  { label: "VAT @ 5%", value: 5 },
  { label: "VAT @ 10%", value: 10 },
  { label: "VAT @ 15%", value: 15 },
];

export const HEADERS = [
  "Name",
  "Code",
  "Barcode",
  "Quantity",
  "Received",
  "Net Unit Cost",
  "Discount",
  "Tax",
  "SubTotal",
];

export const PURCHASE_DEFAULT_VALUES = {
  warehouse: "ware",
  supplier: "supp",
  status: "pending",
  variants: [],
  items: 0,
  orderQuantity: 0,
  orderDiscount: 0,
  orderTaxRate: 0,
  orderTax: 0,
  grandTotal: 0,
  shippingCost: 0,
  total: 0,
  notes: "",
};

export const SALE_DEFAULT_VALUES = {
  warehouse: "ware",
  biller: "biller",
  customer: "cust",
  status: "pending",
  variants: [],
  items: 0,
  orderQuantity: 0,
  orderDiscount: 0,
  orderTax: 0,
  grandTotal: 0,
  shippingCost: 0,
  total: 0,
  staffNotes: "",
  saleNotes: "",
  paymentStatus: "",
  saleStatus: "",
};
