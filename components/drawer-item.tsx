import Link from "next/link";

export interface DrawerItemProps {
  href?: string;
  isActive?: boolean;
  children: React.ReactNode;
  type: string;
  handleClick?: () => void;
}

export const DrawerItem = ({
  href,
  isActive,
  children,
  type,
  handleClick,
}: DrawerItemProps) => {
  return (
    <li
      className={`py-2 px-3 hover:bg-gray-300 ${
        isActive ? "bg-amber-100" : ""
      }`}
    >
      {type === "link" && (
        <Link href={`${href}`}>
          <a className="flex flex-row">{children}</a>
        </Link>
      )}
      {type === "button" && (
        <button className="flex flex-row w-full" onClick={handleClick}>
          {children}
        </button>
      )}
    </li>
  );
};
