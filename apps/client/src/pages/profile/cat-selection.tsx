import { Profile, Avatar } from "@catshelp/types/src";
import { PetAvatar } from "@components/pet-avatar";
import { Stack } from "@mui/material";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useAuth} from "@context/auth-context";

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
    const url = useLocation()
    const { getUser } = useAuth();
    const [animalId, setAnimalId] = useState(params.animalId);

    useEffect(() => {
        if (url.pathname === "/animals/profiles"){
            setAnimalId(animalAvatars[0].id);
        }
    }, []);
    

    const handleCatSelect = async (index: number, animalAvatar: Avatar) => {
        if (animalAvatar.id == params.animalId) {
            return;
        }

        let userId = params.userId;
        if (url.pathname === "/animals/profiles"){
            userId = (await getUser()).id as string;
        }

        const response = await axios.get(`/api/animals/${userId}/profiles/${animalAvatar.id}`, {
            withCredentials: true
        });

        navigate(`/animals/${userId}/profiles/${animalAvatar.id}`);
        setSelectedCat(response.data);
        setIsEditMode(false);
        setAnimalId(animalAvatar.id);
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
