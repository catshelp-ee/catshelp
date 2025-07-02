import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import { useAuth } from "@context/auth-context";
import CloseIcon from "@mui/icons-material/Close";
import { useIsMobile } from "@context/is-mobile-context";
import menuItems from "./menu-items.json";

interface SidebarProps {
  setView?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ setView }) => {
  const [isClosed, setIsClosed] = useState(false);
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const animationDelayInMS = 200;

  const content = (
    <>
      <div>
        {menuItems["menu-items"].map((item, index) => (
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
    </>
  );

  const Navbar = (props) => {
    let classes = `flex flex-col w-full md:w-1/5 z-10 md:z-auto absolute md:sticky left-0 top-0 h-screen bg-[#30B0C7] md:bg-none `;
    if (isMobile) {
      classes += `${isClosed ? "animate-slide-left" : "animate-slide-right"}`;
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
            onClick={() => setIsClosed(true)}
          >
            <CloseIcon />
          </IconButton>
          {content}
        </>
      );
    }
    return (
      <div className="flex flex-col w-full h-full py-14 bg-[#30B0C7] relative rounded-r-lg shadow-[0_4px_8px_rgba(0,0,0,0.25)] overflow-y-auto">
        {content}
      </div>
    );
  };

  useEffect(() => {
    if (!isClosed) return;

    setTimeout(() => {
      setView(false);
    }, animationDelayInMS);
  }, [isClosed]);

  return (
    <Navbar>
      <Body />
    </Navbar>
  );
};

export default Sidebar;
