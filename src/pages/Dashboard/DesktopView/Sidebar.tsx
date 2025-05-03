import React from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "@pages/Header";
import { Avatar, Button, Typography } from "@mui/material";
import { useAuth } from "../../../authContext.tsx";

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      icon: "Check.png",
      text: "Kiisude töölaud",
      path: "/dashboard",
    },
    /*
    {
      icon: "Heart.png",
      text: "Tervis ja kliinikud",
      path: "/clinics",
    },*/
    {
      icon: "Document.png",
      text: "Kiisu profiil veebis",
      path: "/cat-profile",
    },
    /*
    {
      icon: "Add-Person.png",
      text: "Kodu pakkumised",
      path: "/home-offers",
    },
    {
      icon: "Document-Fav.png",
      text: "Kiisu koju saatmine",
      path: "/sending-home",
    },
    {
      icon: "Information-circle.png",
      text: "Juhendid ja lingid",
      path: "/materials",
    },
    */
  ];

  return (
    <nav className="md:flex flex-col w-1/5 h-full">
      {/* <Header /> */}
      <div className="flex flex-col w-full flex-grow h-full py-14 bg-[#30B0C7] relative rounded-r-lg shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
        <div>
          {menuItems.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className="flex text-white p-5 hover:bg-white/40 text-base"
            >
              <img
                loading="lazy"
                src={`/${item.icon}`}
                alt=""
                className="mr-8 w-[25px] h-[25px] min-w-[25px] min-h-[25px]"
              />
              {item.text}
            </Link>
          ))}
        </div>
        <Button
          sx={{
            position: "absolute",
            bottom: "15%",
            padding: "1.25rem",
            color: "white",
            textTransform: "none",
            fontSize: "1rem",
            lineHeight: "1.5rem",
            width: "100%",
            justifyContent: "flex-start",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.4)",
            },
          }}
          onClick={logout}
        >
          <img
            loading="lazy"
            src="/Vector.png"
            alt=""
            className="mr-8 w-[25px] h-[25px] min-w-[25px] min-h-[25px]"
          />
          Logi välja
        </Button>
      </div>
    </nav>
  );
};

export default Sidebar;
