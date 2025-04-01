import React, { useEffect, useRef, useState } from "react";
import { Avatar, IconButton, Tooltip, Typography } from "@mui/material";
import AllPetsPopup from "./AllPetsPopup";
import { Link } from "react-router-dom";

interface FosterPetsProps {
  pets: any;
}

const FosterPetsMobile: React.FC<FosterPetsProps> = ({ pets }) => {
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
    <div className="">
      <h2 className="my-4 text-base font-bold leading-relaxed text-slate-500">
        TEATED CATS HELPILT
      </h2>
      <p className="h-28 mb-4 p-4 whitespace-pre-line overflow-scroll text-left border rounded-3xl border border-solid border-black border-opacity-20">
        Siia kirjutame informatiivseid teateid, millest tahame hoiukodule teada
        anda. Pikema teksti puhul tuleks sisemine scroll :) Tekstid tulevad
        Sheetsist.
      </p>

      <div className="flex items-center relative justify-around px-8 border rounded-3xl border border-solid border-black border-opacity-20">
        {displayPets.map((pet, index) => (
          <Link to="/cat-profile/1">
            <Avatar
              src={`/${pet.image}`}
              alt=""
              sx={{ width: 64, height: 64, margin: "8px 0 0 0" }}
            />
            <Typography
              sx={{ margin: "8px 0", color: "black", fontWeight: "bold" }}
            >
              {pet.name}
            </Typography>
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
  );
};

export default FosterPetsMobile;
