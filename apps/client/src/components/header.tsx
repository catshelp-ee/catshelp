const Header = () => {
  const headerHeight = 113;
  const headerWidth = 184;
  return (
    <header className="flex flex-col md:flex-row w-full items-center my-6 ">
      <div className="w-full md:w-1/5 flex justify-center items-center">
        <img
          className={`w-[${headerWidth}px] h-[${headerHeight}px] object-contain`}
          loading="lazy"
          src="/header.png"
          alt="Dashboard logo"
        />
      </div>
    </header>
  );
};

export default Header;
