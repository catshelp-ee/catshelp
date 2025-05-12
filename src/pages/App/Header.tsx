import React from "react";

interface HeaderProps {
  className?: string;
  imgClass?: string;
}

const Header: React.FC<HeaderProps> = ({ className, imgClass }) => {
  return (
    <header className={`${className}`}>
      <img
        className={`${imgClass}`}
        loading="lazy"
        src="/header.png"
        alt="Dashboard logo"
      />
    </header>
  );
};

export default Header;
