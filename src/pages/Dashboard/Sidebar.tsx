import React from "react";

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  const menuItems = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/dabedf1b3f622fd4cdbde9bf88cc54c7f15def20e9115618108c061c0b20c463?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973",
      text: "Kiisude töölaud",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ff0ef206640f1fe81d9883f7d9d18bebaa5bff99b8a7357cac95691010dde4b4?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973",
      text: "Tervis ja kliinikud",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/f4de1566ab8cacc30996e6c5533726235e40dcfaa7aa0f72719d5307d485d767?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973",
      text: "Kiisu profiil veebis",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/80a901e8389e57f9ef31b15e19dc34806799ed10eb4d50ddb2c4d32f1a9d1c18?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973",
      text: "Kodu pakkumised",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/edcf65bff9619bd0e8b06a3298aa129e7c3ced1e097657766b5323af526c61e8?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973",
      text: "Kiisu koju saatmine",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/352cb48de117699101af3a1e52d17a1b04caaadefedf4fab7f4b0211eb3b7d9f?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973",
      text: "Juhendid ja lingid",
    },
  ];

  return (
    <nav className="flex flex-col w-[26%] max-md:ml-0 max-md:w-full">
      <div className="flex flex-col pt-12 pb-32 mx-auto w-full text-base font-medium text-white bg-teal-400 rounded-none shadow-sm max-md:pb-24 max-md:mt-10">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`flex gap-5 px-6 py-5 ${
              index === 0 ? "bg-white bg-opacity-30" : ""
            } max-md:px-5`}
          >
            <img
              loading="lazy"
              src={item.icon}
              alt=""
              className="object-contain shrink-0 w-6 aspect-square"
            />
            <div className="grow shrink my-auto">{item.text}</div>
          </div>
        ))}
        <div className="flex gap-4 self-start mt-96 ml-5 max-md:mt-10">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/1a8bfc2073ff01d8a09056dd451c41ede6ad1c5822731d52cf6535f974d3a452?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973"
            alt=""
            className="object-contain shrink-0 w-7 aspect-[1.17]"
          />
          <div className="my-auto">Logi välja</div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
