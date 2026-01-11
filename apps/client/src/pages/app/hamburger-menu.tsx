import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import Sidebar from "./sidebar";

interface HamburgerMenuProps {
    sidebarIsOpen: boolean;
    setSidebarIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ sidebarIsOpen, setSidebarIsOpen }) => {
    return (
        <>
            <IconButton
                sx={{
                    width: "100%",
                    borderRadius: 0,
                    margin: "16px 0 0 0",
                    backgroundColor: "#E5E7EB", // Tailwind gray-300
                    color: "#374151", // Tailwind gray-700
                    "&:hover": { backgroundColor: "#D1D5DB" }, // Hover effect
                }}
                onClick={() => {
                    setSidebarIsOpen(true);
                }}
            >
                <MenuIcon />
            </IconButton>
            {sidebarIsOpen && (
                <Sidebar setSidebarIsOpen={setSidebarIsOpen} />
            )}
        </>
    );
};

export default HamburgerMenu;
