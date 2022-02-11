import Head from "next/head";
import { SVG } from "../public/svg";
import { Nav } from "./nav";
import { NavItem } from "./nav-item";

interface HeaderProps {
  showSideNav: () => void;
}

export const Header = ({ showSideNav }: HeaderProps) => {
  const { menu, bell, user, globe } = SVG;
  return (
    <header className="bg-white">
      <div className="mx-5 my-2">
        <Head>
          <title>Elemoh Admin Portal</title>
          <meta name="description" content="Admin portal for elemoh stores" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex flex-row items-center justify-between">
          <button className="py-2" onClick={showSideNav}>
            {menu}
          </button>
          <Nav>
            <NavItem href="">{globe}</NavItem>
            <NavItem href="">{bell}</NavItem>
            <NavItem href="">{user}</NavItem>
          </Nav>
        </div>
      </div>
    </header>
  );
};
