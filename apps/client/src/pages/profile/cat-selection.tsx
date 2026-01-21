import { Profile, Avatar } from "@catshelp/types/src";
import { PetAvatar } from "@components/pet-avatar";
import { Stack } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface CatSelectionProps {
    animalAvatars: Avatar[];
    setSelectedCat: React.Dispatch<React.SetStateAction<Profile>>;
    setIsEditMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CatSelection: React.FC<CatSelectionProps> = ({
    animalAvatars,
    setSelectedCat,
    setIsEditMode,
}) => {
    const navigate = useNavigate();
    const params = useParams();
    

    const handleCatSelect = async (index: number, animalAvatar: Avatar) => {
        if (animalAvatar.id === Number(params.id)) {
            return;
        }

        const response = await axios.get(`/api/profile/${animalAvatar.id}`, {
            withCredentials: true
        });

        navigate(`/cat-profile/${animalAvatar.id}`);
        setSelectedCat(response.data);
        setIsEditMode(false);
    };
    return (
        <Stack direction="row" spacing={2}>
            {animalAvatars.map((animal, index) => (
                <PetAvatar onClick={() => {
                    handleCatSelect(index, animal);
                }}
                    isSelected={animal.id === Number(params.id)}
                    id={animal.id}
                    name={animal.name}
                />
            ))}
        </Stack>
    );
};

export default CatSelection;
