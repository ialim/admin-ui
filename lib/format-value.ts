export const formatValue = (number: any, type?: "count" | "money") => {
  const formatter = new Intl.NumberFormat("yo-NG", {
    style: "decimal",
    currency: "NGN",
    maximumFractionDigits: 2,
    minimumFractionDigits: type === "count" ? 0 : 2,
  });

  return formatter.format(number);
};
