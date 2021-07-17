interface DropdownProps {
  children: React.ReactNode;
}

export const Dropdown = ({ children }: DropdownProps) => {
  return (
    <div>
      <ul className="flex flex-col space-y-3 bg-gray-100">{children}</ul>
    </div>
  );
};
