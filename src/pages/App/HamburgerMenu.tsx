import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import SidebarMobile from "@pages/App/MobileView/SidebarMobile";

const HamburgerMenu = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
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
        onClick={() => setIsSidebarVisible(true)}
      >
        <MenuIcon />
      </IconButton>
      {isSidebarVisible && (
        <SidebarMobile setView={setIsSidebarVisible} view={isSidebarVisible} />
      )}
    </>
  );
};

export default HamburgerMenu;
