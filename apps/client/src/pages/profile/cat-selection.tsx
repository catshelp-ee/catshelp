import { Profile, Avatar } from "@catshelp/types/src";
import { PetAvatar } from "@components/pet-avatar";
import { Stack } from "@mui/material";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useAuth} from "@context/auth-context";
import {AnimalSummary} from "@interfaces/animal-summary";

interface CatSelectionProps {
    animalAvatars: AnimalSummary[];
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
    const url = useLocation()
    const { getUser } = useAuth();
    const [animalId, setAnimalId] = useState(params.animalId);

    useEffect(() => {
        if (url.pathname === "/users/animals/profile"){
            setAnimalId(animalAvatars[0].id as string);
        }
    }, [url.pathname, animalAvatars]);

    const getProfile = async (userId: number | string, animalId: number | string): Promise<Profile> => {
        const response = await axios.get(`/api/users/${userId}/animals/${animalId}/profile`, {
            withCredentials: true
        });

        return response.data;
    }

    const handleCatSelect = async (index: number, animalAvatar: AnimalSummary) => {
        if (animalAvatar.id == params.animalId) {
            return;
        }

        let userId = params.userId;
        if (url.pathname === "/users/animals/profile"){
            userId = (await getUser()).id as string;
        }

        try {
            const profile = await getProfile(userId, animalAvatar.id);
            setAnimalId(profile.animalId as string);
            setSelectedCat(profile);
            setIsEditMode(false);

            navigate(`/users/${userId}/animals/${animalAvatar.id}/profile`);
        } catch (e) {
            return;
        }
    };
    return (
        <Stack direction="row" spacing={2}>
            {animalAvatars.map((animal, index) => (
                <PetAvatar onClick={() => {
                    handleCatSelect(index, animal);
                }}
                    isSelected={animal.id == animalId}
                    id={animal.id}
                    name={animal.name}
                />
            ))}
        </Stack>
    );
};

export default CatSelection;
