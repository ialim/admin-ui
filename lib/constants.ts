import { gql } from "@apollo/client";
import { Option, TaxOptions } from "../types/types";

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

// Purchase Page
export const STATUS_OPTIONS: Option[] = [
  { label: "Recieved", value: "Recieved".toLowerCase() },
  { label: "Partial", value: "Partial".toLowerCase() },
  { label: "Pending", value: "Pending".toLowerCase() },
  { label: "Ordered", value: "Ordered".toLowerCase() },
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
