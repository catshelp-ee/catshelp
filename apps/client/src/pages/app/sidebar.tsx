/*import { useAuth } from "@context/auth-context";
import { useIsMobile } from "@context/is-mobile-context";
import CloseIcon from "@mui/icons-material/Close";
import { Button, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import menuItems from "./menu-items.json";

interface SidebarProps {
    setSidebarIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ setSidebarIsOpen }) => {
    const { logout } = useAuth();
    const isMobile = useIsMobile();
    const { getUser } = useAuth();
    const [user, setUser] = useState(null);
    let menuItemArray = menuItems["menu-items"];



    useEffect(() => {
        async function fetchUser() {
            const u = await getUser();
            setUser(u);
        }

        fetchUser();
    }, []);

    const content = (
        <>
            <div className="sidebar">
                <div className="sidebar-image">
                    <img loading="lazy" src="/header.png" alt="Dashboard logo" />
                </div>

                <div className="sidebar-menu">
                    <div className="sidebar-menu-items">
                        {menuItemArray.filter((element) => {
                            return !element.requiredRole || element.requiredRole === user?.role;
                        }).map((item, index) => (
                            <Link to={item.path} key={index} className="sidebar-item">
                                <img loading="lazy" src={`/${item.icon}`} alt="" className="mr-8 w-[25px] h-[25px] min-w-[25px] min-h-[25px]"/>
                                {item.text}
                            </Link>
                        ))}
                    </div>
                    <div>
                        <Button
                            className="sidebar-logout"
                            onClick={logout}>

                            <img loading="lazy" src="/Vector.png" alt="" className="mr-8 w-[25px] h-[25px] min-w-[25px] min-h-[25px]"/>
                            Logi välja
                        </Button>
                    </div>

                </div>
            </div>
        </>
    );

    const Navbar = (props) => {
        let classes = `z-10 md:z-auto md:sticky h-screen md:bg-none `;
        if (isMobile) {
            classes += ' mobile-navbar ';
        }
        return <nav className={classes}>{props.children}</nav>;
    };

    const Body = () => {
        if (isMobile) {
            return (
                <>
                    <IconButton
                        sx={{
                            borderRadius: 0,
                            width: "20%",
                            height: "4rem",
                            padding: "1.25rem",
                            position: "absolute",
                            right: 0,
                            backgroundColor: "#E5E7EB", // Tailwind gray-300
                            "&:hover": { backgroundColor: "#D1D5DB" }, // Hover effect
                        }}
                        onClick={() => setSidebarIsOpen(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                    {content}
                </>
            );
        }
        return (
            <div className="w-full">
                {content}
            </div>
        );
    };

    return (
        <Navbar>
            <Body />
        </Navbar>
    );
};
*/

import {useLocation, useNavigate} from "react-router-dom";

import { LayoutDashboard, Cat, Heart } from 'lucide-react';
import {translations} from "@translations/translations";
import type {Screen} from "@config/app";

export function Sidebar() {

    const navigate = useNavigate();
    const url = useLocation();

    const navItems = [
        {
            id: 'dashboard' as Screen,
            label: translations.nav.dashboard.et,
            icon: LayoutDashboard,
            path: "/users"
        },
        {
            id: 'cat-profile' as Screen,
            label: translations.nav.catProfile.et,
            icon: Cat,
            path: "/cat-profile"
        },
        {
            id: 'medical' as Screen,
            label: translations.nav.medical.et,
            icon: Heart,
        },
    ];

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 fixed left-0 top-16 bottom-0 overflow-y-auto">
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = url.pathname.includes(item.path);

                        return (
                            <button
                                key={item.id}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                                onClick={() => {
                                    navigate(item.path)
                                }}
                            >
                                <Icon className={`w-5 h-5 text-gray-500`} />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile bottom navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
                <div className="flex items-center justify-around px-2 py-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.id}
                                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors text-gray-600`}
                            >
                                <Icon className={`w-5 h-5 text-gray-500`} />
                                <span className="text-xs font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}

export default Sidebar;
