interface NavProps {
  children: React.ReactNode;
}

export const Nav = ({ children }: NavProps) => {
  return (
    <nav>
      <ul className="flex space-x-2">{children}</ul>
    </nav>
  );
};
