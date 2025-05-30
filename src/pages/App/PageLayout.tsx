import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/pages/App/Header";
import Sidebar from "@pages/App/DesktopView/Sidebar";
import HamburgerMenu from "@pages/App/HamburgerMenu";

interface LayoutProps {}

function useMediaQuery(query: any) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

const PageLayout: React.FC<LayoutProps> = () => {
  //TODO pass to child components somehow. so they don't need to check it themselves
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <div className="flex flex-col h-full items-center">
        <Header imgClass="h-20" />
        <HamburgerMenu />
        <Outlet />
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full">
      <Header className="flex w-1/5 my-2 h-[113px] justify-center" />
      <div className="flex">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default PageLayout;
