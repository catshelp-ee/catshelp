import {
    Avatar,
    Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import axios from "axios";

export const PetAvatar: React.FC<{
    id: number | string;
    name: string;
    isSelected?: boolean;
    onClick?: () => void;
}> = ({ id, name, isSelected, onClick }) => {
    const [image, setImage] = useState("")


    useEffect(() => {
        // this looks stupid. why not include the profile image in the animal object???
        const getImage = async () => {
            const response = await axios.get(`/api/animals/${id}/profile-picture`);

            setImage(`/images/${response.data.uuid}.jpg`);
        }

        getImage();
    }, []);

    return (
        <button onClick={onClick}>
            <Avatar
                src={image}
                alt={`/missing64x64.png`}
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
