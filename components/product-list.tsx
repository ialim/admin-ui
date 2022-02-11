interface ProductListProps {
  children: React.ReactNode;
}

export const ProductList = ({ children }: ProductListProps) => {
  return <ul className="flex flex-col divide-y-2 divide-gray-200 mx-3 rounded-lg bg-gray-50">{children}</ul>;
};
