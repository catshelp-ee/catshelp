import React from "react";

interface NotificationsProps {}

const Notifications: React.FC<NotificationsProps> = () => {
  return (
    <section className="flex gap-7 max-w-full text-4xl font-medium leading-none text-neutral-950 w-[313px]">
      <h1 className="grow">Tere tulemast!</h1>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/7e465b039e1e53b308e2abe0e9d3502d0948114e93388ae5ca6d885b50aabe50?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973"
        alt=""
        className="object-contain shrink-0 aspect-[1.02] w-[43px]"
      />
    </section>
  );
};

export default Notifications;
