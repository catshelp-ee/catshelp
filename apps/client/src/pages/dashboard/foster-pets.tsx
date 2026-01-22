import {
    IconButton,
    Tooltip,
    useTheme,
} from "@mui/material";
import AllPetsPopup from "@pages/dashboard/all-pets-popup";
import { AvatarData } from "@server/animal/interfaces/avatar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {Link, useLocation, useParams} from "react-router-dom";
import { PetAvatar } from "src/components/pet-avatar";
import {useAuth} from "@context/auth-context";

interface FosterPetsProps {
    pets: AvatarData[];
}

const ShowMoreButton: React.FC<{
    count: number;
    onClick: () => void;
}> = ({ count, onClick }) => {
    const theme = useTheme();

    return (
        <Tooltip title="Näita kõik loomad" arrow>
            <IconButton
                onClick={onClick}
                aria-label={`Näita ${count} varjatud looma`}
                sx={{
                    width: 64,
                    height: 64,
                    backgroundColor: theme.palette.grey[200],
                    color: theme.palette.grey[700],
                    fontSize: "1rem",
                    fontWeight: "bold",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                        backgroundColor: theme.palette.grey[300],
                        transform: "scale(1.05)",
                    },
                    "&:focus": {
                        outline: `2px solid ${theme.palette.primary.main}`,
                        outlineOffset: "2px",
                    },
                }}
            >
                +{count}
            </IconButton>
        </Tooltip>
    );
};

const PetsGrid: React.FC<{
    displayPets: AvatarData[];
    hasMorePets: boolean;
    hiddenCount: number;
    onShowMore: () => void;
}> = ({ displayPets, hasMorePets, hiddenCount, onShowMore }) => {
    const { getUser } = useAuth();
    const [userId, setUserId] = useState(null);
    const params = useParams();
    useEffect(() => {
        const getUserId = async () => {
            const user = await getUser();
            let id = params.userId as string;

            if (!id) {
                id = user.id as string;
            }

            setUserId(id);
        }

        getUserId();
    }, []);
    return(
        <div className="flex justify-start space-x-3 px-8 relative" >
            {
                displayPets.map((pet, id) => (
                    <Link
                        key={id}
                        to={`/animals/${userId}/profiles/${pet.id}`}
                        aria-label={`Vaata ${pet.name} profiili`}
                    >
                        <PetAvatar name={pet.name} id={pet.id} />
                    </Link>
                ))
            }

            {hasMorePets && <ShowMoreButton count={hiddenCount} onClick={onShowMore} />}
        </div >
    );
}

const usePopupManager = () => {
    const [isOpen, setIsOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = useCallback(
        (event: MouseEvent) => {
            if (
                isOpen &&
                popupRef.current &&
                !popupRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        },
        [isOpen]
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        },
        [isOpen]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);

            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
                document.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [isOpen, handleClickOutside, handleKeyDown]);

    const openPopup = useCallback(() => setIsOpen(true), []);
    const closePopup = useCallback(() => setIsOpen(false), []);

    return { isOpen, popupRef, openPopup, closePopup };
};

const FosterPets: React.FC<FosterPetsProps> = ({ pets }) => {
    const MAX_VISIBLE_PETS = 2;
    const { isOpen, popupRef, openPopup, closePopup } = usePopupManager();

    const displayPets = pets.slice(0, MAX_VISIBLE_PETS);
    const hiddenCount = Math.max(0, pets.length - MAX_VISIBLE_PETS);
    const hasMorePets = hiddenCount > 0;

    return (
        <div className="md:flex-1 relative">
            <h2 className="dashboard-heading mb-8 text-base font-bold leading-relaxed px-8 text-slate-500">
                SINU HOIULOOMAD
            </h2>

            <PetsGrid
                displayPets={displayPets}
                hiddenCount={hiddenCount}
                onShowMore={openPopup}
                hasMorePets={hasMorePets}
            />

            {isOpen && (
                <AllPetsPopup
                    pets={pets}
                    ref={popupRef}
                    onClose={closePopup}
                    isOpen={isOpen}
                />
            )}
        </div>
    );
};

export default FosterPets;
