import React, { useEffect, useState } from "react";

interface NotificationsProps {
  name?: string;
}

const Notifications: React.FC<NotificationsProps> = ({name}) => {
  return (
    <section className="flex gap-4 h-12 font-medium mb-8">
      <h1 className="text-4xl">Tere tulemast {name}!</h1>
      <img
        loading="lazy"
        src="/welcome.svg"
        alt=""
      />
    </section>
  );
};

export default Notifications;
