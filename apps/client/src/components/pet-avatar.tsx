import {
    Avatar,
    Typography,
} from "@mui/material";
import React from "react";
import {AnimalSummary} from "@pages/dashboard/interfaces/animal-summary";

export const PetAvatar: React.FC<{
    data: AnimalSummary;
    isSelected?: boolean;
    onClick?: () => void;
}> = ({data, isSelected, onClick }) => {

    return (
        <button onClick={onClick}>
            <Avatar
                src={data.pathToProfilePicture}
                alt={`${data.name}`}
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
