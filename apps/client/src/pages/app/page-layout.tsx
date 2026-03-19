import React, {useEffect, useState} from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from './header';
import HamburgerMenu from "./hamburger-menu";
import { useIsMobile } from "src/context/is-mobile-context";
import {useAuth} from "@context/auth-context";
import {AppMode, checkIfAdmin} from "@config/app";

const PageLayout = () => {
    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
    const isMobile = useIsMobile();
    const { getUser } = useAuth();

    const [appMode, setAppMode] = useState<AppMode>('foster');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        checkIfAdmin(getUser, setIsAdmin);
    }, [getUser]);


    const MobileView = () => {
        return (
            <div className={`flex flex-col h-full items-center ${sidebarIsOpen ? "overflow-hidden" : ""}`}>
                <HamburgerMenu sidebarIsOpen={sidebarIsOpen} setSidebarIsOpen={setSidebarIsOpen} />
                <Outlet />
            </div>
        )
    }

    const DesktopView = () => {
        return (
            <div id="page" className="page">
                <Header appMode={appMode} setAppMode={setAppMode} isAdmin={isAdmin} />
                <div className="flex">
                    <Sidebar />
                    <div className="page-content">
                        <Outlet />
                    </div>
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
