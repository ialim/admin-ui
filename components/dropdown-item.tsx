import Link from "next/link";
import { DrawerItemProps } from "./drawer-item";

export interface DropdownItemProps {
  href?: string;
  children: React.ReactNode;
}

export const DropdownItem = ({ href, children }: DrawerItemProps) => {
  return (
    <li className={`py-2 pl-11 hover:bg-gray-300`}>
      <Link href={`${href}`}>
        <a className="flex flex-row">
          {children}
        </a>
      </Link>
    </li>
  );
};
