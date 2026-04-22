import {useEffect, useState} from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar.tsx";
import Header from './header.tsx';
import HamburgerMenu from "./hamburger-menu.tsx";
import { useIsMobile } from "@context/is-mobile-context.tsx";
import {useAuth} from "@context/auth-context.tsx";
import {AppMode} from "@config/app.ts";

const PageLayout = () => {
    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
    const isMobile = useIsMobile();
    const { checkIfAdmin } = useAuth();

    const [appMode, setAppMode] = useState<AppMode>('foster');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!checkIfAdmin()) {
            return;
        }

        setIsAdmin(true);
    }, [checkIfAdmin]);


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
