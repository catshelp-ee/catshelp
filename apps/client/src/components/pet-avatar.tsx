import {
    Avatar,
    Typography,
} from "@mui/material";
import { AvatarData } from "@server/animal/interfaces/avatar";
import React from "react";

export const PetAvatar: React.FC<{
    data: AvatarData;
    isSelected?: boolean;
    onClick?: () => void;
}> = ({ data, isSelected, onClick }) => {
    return (
        <button
            className="flex flex-col transition-transform hover:scale-105 p-2"
            onClick={onClick}
        >
            <Avatar
                src={`/${data.pathToImage}`}
                alt={`${data.name} pilt`}
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
                {data.name}
            </Typography>
        </button>
    );
};
