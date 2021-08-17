interface DropdownProps {
  children: React.ReactNode;
}

export const SearchDropdown = ({ children }: DropdownProps) => {
  return (
    <ul className="flex flex-col absolute z-10 space-y-3 bg-gray-50 w-96">
      {children}
    </ul>
  );
};
