import {
  Avatar,
  Typography,
} from "@mui/material";
import React from "react";
import { Pet } from "types/animal";

export const PetAvatar: React.FC<{
  pet: Pet;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ pet, isSelected, onClick }) => {
  return (
    <button
      className="flex flex-col transition-transform hover:scale-105 p-2"
      onClick={onClick}
    >
      <Avatar
        src={`/${pet.pathToImage}`}
        alt={`${pet.name} pilt`}
        sx={{
          width: 64,
          height: 64,
          transition: "transform 0.2s ease-in-out",
        }}
      />
      <Typography
        component="span"
        sx={{
          margin: "8px 0",
          color: "text.primary",
          fontWeight: "bold",
          textAlign: "center",
          fontSize: "0.875rem",
          borderBottom: isSelected ? "4px solid #5DC2D8" : "none",
        }}
      >
        {pet.name}
      </Typography>
    </button>
  );
};
