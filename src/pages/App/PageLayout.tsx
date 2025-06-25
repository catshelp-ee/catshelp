import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@pages/App/Header";
import Sidebar from "./Sidebar";
import HamburgerMenu from "@pages/App/HamburgerMenu";
import { useIsMobile } from "src/context/IsMobileContext";

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
