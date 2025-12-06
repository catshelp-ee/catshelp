import { useAuth } from "@context/auth-context";
import { useIsMobile } from "@context/is-mobile-context";
import CloseIcon from "@mui/icons-material/Close";
import { Button, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import menuItems from "./menu-items.json";

interface SidebarProps {
    setView?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ setView }) => {
    const [isNavbarClosed, setIsNavbarClosed] = useState(false);
    const { logout } = useAuth();
    const isMobile = useIsMobile();
    const animationDelayInMS = 200;
    const { getUser } = useAuth();
    const [user, setUser] = useState(null);
    let menuItemArray = menuItems["menu-items"];

    useEffect(() => {
        async function fetchUser() {
            const u = await getUser();
            setUser(u);
        }

        fetchUser();
        if (!isNavbarClosed) {
            return;
        }

        setTimeout(() => {
            setView(false);
        }, animationDelayInMS);
    }, [isNavbarClosed]);

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
            classes += `${isNavbarClosed ? "animate-slide-left" : "animate-slide-right"}`;
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
                        onClick={() => setIsNavbarClosed(true)}
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

export default Sidebar;
