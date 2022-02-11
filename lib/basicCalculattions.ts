import { CalcTotal } from "../types/types";

const TAX_RATE: number = 10;

export const calcNetTotal = (
  quantity: number,
  cost: number,
  discount: number
): number[] => {
  let netTotal = quantity * cost - discount;
  let tax = (netTotal * TAX_RATE) / 100;
  let subTotal = netTotal + tax;
  return [tax, subTotal];
};

export const calcSum = (variants: any[]) => {
  let taxSum = 0,
    discountSum = 0,
    subTotal = 0,
    quantitySum = 0;
  variants &&
    variants.map((variant) => {
      const { tax, discount, total, quantity } = variant;
      taxSum += tax;
      discountSum += discount;
      subTotal += total;
      quantitySum += quantity;
    });
  return { taxSum, discountSum, subTotal, quantitySum };
};

export const calcTotal = ({
  orderDiscount,
  shippingCost,
  total,
  taxRate,
}: CalcTotal) => {
  let grandTotal: number = 0,
    orderTax: number = 0;
  orderTax = (total * taxRate) / 100;
  grandTotal = total + orderTax + shippingCost - orderDiscount;
  return { grandTotal, orderTax };
};
