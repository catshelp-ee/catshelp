import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { useAuth } from "@/context/AuthContext";

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
    <nav className="flex flex-col w-1/5">
      <div className="flex flex-col w-full h-full py-14 bg-[#30B0C7] relative rounded-tr-lg shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
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
                className="mr-8"
              />
              {item.text}
            </Link>
          ))}
        </div>
        <Button
          sx={{
            position: "absolute",
            bottom: "15%",
            padding: "16px",
            color: "white",
            textTransform: "none",
            fontSize: "1rem",
            lineHeight: "1.5rem",
          }}
          onClick={logout}
        >
          <img loading="lazy" src="/Vector.png" alt="" className="mr-8" />
          Logi välja
        </Button>
      </div>
    </nav>
  );
};

export default Sidebar;
