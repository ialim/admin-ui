interface SearchItemProps {
  highlight?: boolean;
  children: React.ReactNode;
}

export const SearchItem = ({ highlight, children }: SearchItemProps) => {
  return (
    <li className={`py-2 pl-11 ${highlight ? "hover:bg-gray-300" : ""}`}>
      {children}
    </li>
  );
};
