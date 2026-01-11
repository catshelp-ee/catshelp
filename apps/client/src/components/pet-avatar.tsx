import {
    Avatar,
    Typography,
} from "@mui/material";
import React from "react";

export const PetAvatar: React.FC<{
    pathToImage: string;
    name: string;
    isSelected?: boolean;
    onClick?: () => void;
}> = ({ pathToImage, name, isSelected, onClick }) => {
    return (
        <button onClick={onClick}>
            <Avatar
                src={`/images/${pathToImage}`}
                alt={`${name} pilt`}
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
                {name}
            </Typography>
        </button>
    );
};
