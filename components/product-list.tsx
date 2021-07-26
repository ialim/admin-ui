interface ProductListProps {
  children: React.ReactNode;
}

export const ProductList = ({ children }: ProductListProps) => {
  return <ul className="divide-y divide-gray-100 mx-3 rounded-lg bg-gray-50">{children}</ul>;
};
