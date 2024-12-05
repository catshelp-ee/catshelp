import React, { useEffect, useState } from "react";

interface FosterPetsProps {
  pets: any;
}

const FosterPets: React.FC<FosterPetsProps> = ({ pets }) => {
  return (
    <section className="flex w-full">
      <div className="flex flex-col w-2/3">
        <h2 className="text-base font-bold leading-relaxed text-slate-500">
          TEATED CATS HELPILT
        </h2>
        <div className="overflow-hidden px-4 py-6 mt-5 max-w-full text-sm leading-5 text-gray-700 bg-white rounded-3xl border border-solid border-black border-opacity-20 w-[687px] max-md:max-w-full">
          Siia kirjutame informatiivseid teateid, millest tahame hoiukodule
          teada anda. Pikema teksti puhul tuleks sisemine scroll :) Tekstid
          tulevad Sheetsist.
        </div>
      </div>
      <div className="flex flex-col grow shrink self-stretch my-auto min-w-[240px] w-[194px]">
        <h2 className="text-base font-bold leading-relaxed text-slate-500">
          SINU HOIULOOMAD
        </h2>
        <div className="flex gap-3.5 items-center mt-5 w-full text-sm font-semibold text-center whitespace-nowrap min-h-[126px] text-neutral-950">
          {pets.map((pet, index) => (
            <div
              key={index}
              className="flex flex-col self-stretch px-5 py-3.5 my-auto w-28 max-md:pl-5"
            >
              <img
                loading="lazy"
                src={pet.image}
                alt={pet.name}
                className="object-contain aspect-square rounded-[45px] w-[77px]"
              />
              <div className="self-center mt-1.5">{pet.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FosterPets;
