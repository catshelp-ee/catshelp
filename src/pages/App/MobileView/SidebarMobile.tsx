import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconButton, Button } from "@mui/material";
import { useAuth } from "@context/AuthContext";
import CloseIcon from "@mui/icons-material/Close";

interface SidebarProps {
  setView: any;
  view: any;
}

const SidebarMobile: React.FC<SidebarProps> = ({ setView, view }) => {
  const [isClosed, setIsClosed] = useState(false);
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

  useEffect(() => {
    if (!isClosed) return;

    setTimeout(() => {
      setView(false);
    }, 200);
  }, [isClosed]);

  return (
    <nav
      className={`flex flex-col z-10 top-0 left-0 absolute h-full w-full bg-[#30B0C7] ${
        isClosed ? "animate-slide-left" : "animate-slide-right"
      }`}
    >
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
        onClick={() => setIsClosed(true)}
      >
        <CloseIcon />
      </IconButton>
      <div className="mt-[20%] mb-[20%]">
        {menuItems.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className="flex text-white p-5 text-base w-4/5"
            onClick={() => setIsClosed(true)}
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
    </nav>
  );
};

export default SidebarMobile;
