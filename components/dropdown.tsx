interface DropdownProps {
  children: React.ReactNode;
}

export const Dropdown = ({ children }: DropdownProps) => {
  return <ul className="flex flex-col space-y-3 bg-gray-50 min-w-full ">{children}</ul>;
};
