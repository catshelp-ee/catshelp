import { useAuth } from "@context/auth-context";
import { useIsMobile } from "@context/is-mobile-context";
import CloseIcon from "@mui/icons-material/Close";
import { Button, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import menuItems from "./menu-items.json";
import axios from "axios";

interface SidebarProps {
    setView?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ setView }) => {
    const [isNavbarClosed, setIsNavbarClosed] = useState(false);
    const { logout } = useAuth();
    const isMobile = useIsMobile();
    const animationDelayInMS = 200;
    const { getUser } = useAuth();
    const [paths, setPaths] = useState([]);
    let menuItemArray = menuItems["menu-items"];

    useEffect(() => {
        if (!isNavbarClosed) {
            return;
        }

        setTimeout(() => {
            setView(false);
        }, animationDelayInMS);
    }, [isNavbarClosed]);

    useEffect(() => {
        const resolveDynamicPath = async (path) => {
            if (path !== "/cat-profile") {
                return
            }

            const response = await axios.get("/api/profile", {
                withCredentials: true
            });

            const profiles = response.data.profiles;

            if (profiles.length === 0) {
                return;
            }

            return profiles[0].id;

        }

        const getPaths = async () => {
            const u = await getUser();

            const allowedRedirects = menuItemArray.filter((element) => { return !element.requiredRole || element.requiredRole === u?.role; });
            const redirects = [];

            let dynamicPathID;
            let path;
            for (let index = 0; index < allowedRedirects.length; index++) {
                const link = allowedRedirects[index];

                if (link.path === "/dashboard") {
                    dynamicPathID = u.id;
                } else {
                    dynamicPathID = await resolveDynamicPath(link.path);
                }

                if (link.dynamic) {
                    path = `${link.path}/${dynamicPathID}`;
                } else {
                    path = link.path;
                }


                redirects.push(
                    <Link to={path} key={index} className="sidebar-item">
                        <img loading="lazy" src={`/${link.icon}`} alt="" className="mr-8 w-[25px] h-[25px] min-w-[25px] min-h-[25px]" />
                        {link.text}
                    </Link>
                )

            }

            setPaths(redirects);
        }

        getPaths();
    }, [])

    const content = (
        <>
            <div className="sidebar">
                <div className="sidebar-image">
                    <img loading="lazy" src="/header.png" alt="Dashboard logo" />
                </div>

                <div className="sidebar-menu">
                    <div className="sidebar-menu-items">
                        {paths}
                    </div>
                    <div>
                        <Button
                            className="sidebar-logout"
                            onClick={logout}>

                            <img loading="lazy" src="/Vector.png" alt="" className="mr-8 w-[25px] h-[25px] min-w-[25px] min-h-[25px]" />
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
