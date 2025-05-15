import React from "react";

interface HeaderProps {
  className?: string;
  imgClass?: string;
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="flex flex-col md:flex-row w-full items-center my-6">
      <div className="w-full md:w-1/5 flex justify-center items-center">
        <img
          className="w-[140px] h-auto object-contain"
          loading="lazy"
          src="/header.png"
          alt="Dashboard logo"
        />
      </div>
    </header>
  );
};

export default Header;
