import React, { forwardRef } from "react";
import { Avatar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const AllPetsPopup = forwardRef(({ pets }, ref) => {
  return (
    <div
      ref={ref}
      className="flex flex-col absolute w-full h-48 overflow-scroll top-0 left-0 rounded-xl bg-white border"
    >
      {pets.map((pet, index) => (
        <Link
          to="/cat-profile/1"
          key={index}
          className="flex justify-between items-center px-24 mb-4 text-inherit bg-transparent hover:bg-black/5"
        >
          <Avatar
            src={`/${pet.image}`}
            alt={pet.name}
            sx={{ width: 64, height: 64 }} // Tailwind w-16 h-16
          />
          <Typography variant="body2">{pet.name}</Typography>
        </Link>
      ))}
    </div>
  );
});

export default AllPetsPopup;
