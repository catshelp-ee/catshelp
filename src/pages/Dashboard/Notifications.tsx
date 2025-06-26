import React from "react";

interface NotificationsProps {
}

const Notifications: React.FC<NotificationsProps> = () => {
  return (
    <div className="md:w-2/3">
      <h2 className="mb-8 text-left text-base font-bold leading-relaxed text-slate-500">
        TEATED CATS HELPILT
      </h2>
      <p className="flex-1 p-2 whitespace-pre-line overflow-auto text-left border rounded-xl border-solid border-black border-opacity-20">
        Siia kirjutame informatiivseid teateid, millest tahame hoiukodule teada
        anda. Pikema teksti puhul tuleks sisemine scroll :) Tekstid tulevad
        Sheetsist.
      </p>
    </div>
  );
};

export default Notifications;
