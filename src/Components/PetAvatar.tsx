import React from "react";
import {
  Avatar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

interface Pet {
  name: string;
  image: string;
}

export const PetAvatar: React.FC<{ pet: Pet }> = ({ pet }) => {
  return (
    <Link
      to={`/cat-profile`}
      className="flex flex-col transition-transform hover:scale-105 p-2"
      aria-label={`Vaata ${pet.name} profiili`}
    >
      <Avatar
        src={`/${pet.image}`}
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
        }}
      >
        {pet.name}
      </Typography>
    </Link>
  );
};
