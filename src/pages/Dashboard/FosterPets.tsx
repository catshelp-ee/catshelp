import React, { useEffect, useRef, useState } from "react";
import { Avatar, IconButton, Tooltip, Button } from "@mui/material";
import AllPetsPopup from "./AllPetsPopup";
import { Link } from "react-router-dom";
import axios from "axios";

interface FosterPetsProps {
  pets: any;
}

const FosterPets: React.FC<FosterPetsProps> = ({ pets }) => {
  const displayPets = pets.slice(0, 2); // Show only the first 2 pets
  const hiddenPets = pets.length - 2; // Number of hidden pets
  const [viewAllPets, setViewAllPets] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event: any) => {
    if (viewAllPets && !dropdownRef.current!.contains(event.target)) {
      setViewAllPets(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [viewAllPets]);

  return (
    <section className="flex w-full">
      <div className="flex flex-col w-2/3">
        <h2 className="text-base font-bold text-slate-500">
          TEATED CATS HELPILT
        </h2>
        <div className="px-4 py-6 mt-5 text-sm rounded-3xl border border-solid border-black border-opacity-20">
          Siia kirjutame informatiivseid teateid, millest tahame hoiukodule
          teada anda. Pikema teksti puhul tuleks sisemine scroll :) Tekstid
          tulevad Sheetsist.
        </div>
      </div>
      <div className="flex flex-col grow shrink self-stretch my-auto min-w-[240px] w-[194px]">
        <h2 className="text-base font-bold mb-2 leading-relaxed text-slate-500">
          SINU HOIULOOMAD
        </h2>
        <div className="flex items-center justify-around space-x-3 px-8 relative">
          {displayPets.map((pet, index) => (
            <Link to="/cat-profile/1">
              <Tooltip title={pet.name} className="flex flex-col items-center">
                <Avatar
                  src={`/${pet.image}`}
                  alt={pet.name}
                  sx={{ width: 64, height: 64 }} // Tailwind w-16 h-16
                />
              </Tooltip>
            </Link>
          ))}

          {hiddenPets > 0 && (
            <Tooltip title="Näita kõik">
              <IconButton
                sx={{
                  width: 64, // w-16
                  height: 64, // h-16
                  backgroundColor: "#E5E7EB", // Tailwind gray-300
                  color: "#374151", // Tailwind gray-700
                  "&:hover": { backgroundColor: "#D1D5DB" }, // Hover effect
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
                onClick={() => setViewAllPets(true)}
              >
                +{hiddenPets}
              </IconButton>
            </Tooltip>
          )}
          {viewAllPets && <AllPetsPopup pets={pets} ref={dropdownRef} />}
        </div>
      </div>
    </section>
  );
};

export default FosterPets;
