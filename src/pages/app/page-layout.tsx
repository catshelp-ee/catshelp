import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "src/components/header";
import Sidebar from "./sidebar";
import HamburgerMenu from "@pages/app/HamburgerMenu";
import { useIsMobile } from "src/context/is-mobile-context";

interface LayoutProps {}

const PageLayout: React.FC<LayoutProps> = () => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const MobileView = () => {
    return (
      <div className={`flex flex-col h-full items-center ${sidebarIsOpen ? "overflow-hidden" : ""}`}>
        <Header/>
        <HamburgerMenu sidebarIsOpen={sidebarIsOpen} setSidebarIsOpen={setSidebarIsOpen} />
        <Outlet />
      </div>
    )
  }

  const DesktopView = () => {
    return (
      <div className="flex flex-col w-full">
        <Header />
        <div className="flex">
          <Sidebar />
          <Outlet />
        </div>
      </div>
    )
  }

  if (isMobile) {
    return (
      <MobileView />
    );
  }
  return (
      <DesktopView />
  );
};

export default PageLayout;
