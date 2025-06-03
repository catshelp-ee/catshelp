import React from "react";

interface NotificationsProps {
  name?: string;
  className?: string;
}

const Notifications: React.FC<NotificationsProps> = ({ name, className }) => {
  return (
    <section className={`flex gap-4 h-12 font-medium ${className}`}>
      <h1 className="text-2xl">Tere tulemast {name}!</h1>
      <img
        loading="lazy"
        src="/welcome.svg"
        className="w-[32px] h-[32px]"
        alt=""
      />
    </section>
  );
};

export default Notifications;
