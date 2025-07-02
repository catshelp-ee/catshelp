import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import AllPetsPopup from "@pages/dashboard/all-pets-popup";
import { Pet } from "./dashboard";
import { PetAvatar } from "src/components/pet-avatar";

interface FosterPetsProps {
  pets: Pet[];
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
  displayPets: Pet[];
  hasMorePets: boolean;
  hiddenCount: number;
  onShowMore: () => void;
}> = ({ displayPets, hasMorePets, hiddenCount, onShowMore }) => (
  <div className="flex items-center justify-around space-x-3 px-8 relative">
    {displayPets.map((pet, id) => (
      <PetAvatar key={id} pet={pet} />
    ))}

    {hasMorePets && <ShowMoreButton count={hiddenCount} onClick={onShowMore} />}
  </div>
);

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
      <h2 className="text-base font-bold leading-relaxed text-slate-500">
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
