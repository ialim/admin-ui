import { useState } from "react";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { SideNav } from "../components/side-nav";

interface PageProps {
  children: React.ReactNode;
}

export const Page = ({ children }: PageProps) => {
  const [showSideNav, setShowSideNav] = useState(false);
  const toggleSideNav = () => {
    setShowSideNav(!showSideNav);
  };
  return (
    <div className="bg-gray-100 max-w-md mx-auto">
      <div className="flex flex-col">
        <Header showSideNav={toggleSideNav} />
        <main className=" h-screen">
            {showSideNav && (
              <div className="transition duration-1000 left-0">
                <SideNav />
              </div>
            )}
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};
