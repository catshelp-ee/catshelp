import React, { forwardRef } from "react";
import { Avatar, Button, Typography } from "@mui/material";

const AllPetsPopup = forwardRef(({ pets }, ref) => {
  return (
    <div
      ref={ref}
      className="flex flex-col absolute w-full h-48 overflow-scroll top-0 left-0 rounded-xl bg-white border"
    >
      {pets.map((pet, index) => (
        <Button
          key={index}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 102px",
            margin: "0 0 16px 0",
            color: "inherit",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)", // Subtle hover effect
            },
          }}
        >
          <Avatar
            src={`/${pet.image}`}
            alt={pet.name}
            sx={{ width: 64, height: 64 }} // Tailwind w-16 h-16
          />
          <Typography variant="body2">{pet.name}</Typography>
        </Button>
      ))}
    </div>
  );
});

export default AllPetsPopup;
