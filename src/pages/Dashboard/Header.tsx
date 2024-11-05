import React from "react";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/beacc243585eb268694226cece1ab712c8ad5fd9c3bac4e98c89153abb678eb7?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973"
        alt="Dashboard logo"
        className="object-contain ml-16 max-w-full aspect-[1.62] w-[164px] max-md:ml-2.5"
      />
    </header>
  );
};

export default Header;
