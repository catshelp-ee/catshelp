import React from "react";

interface NotificationsProps {
  name?: string;
}

const Notifications: React.FC<NotificationsProps> = ({ name }) => {
  return (
    <section className="flex items-center gap-4 h-12 font-medium md:mb-8">
      <h1 className="text-2xl md:text-4xl">Tere tulemast {name}!</h1>
      <img loading="lazy" src="/welcome.svg" alt="" />
    </section>
  );
};

export default Notifications;
