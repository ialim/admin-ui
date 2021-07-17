import Link from "next/link";

export interface NavItemProps {
  href: string;
  isActive?: boolean;
  children: React.ReactNode;
}

export const NavItem = ({ href, isActive, children }: NavItemProps) => {
  return (
    <li>
      <Link href={`${href}`}>
        <a className={`py-2 hover:bg-white ${isActive ? "bg-amber-100" : ""}`}>
          {children}
        </a>
      </Link>
    </li>
  );
};
