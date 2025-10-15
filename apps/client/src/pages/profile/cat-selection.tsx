import { Profile } from "@catshelp/types/src";
import { PetAvatar } from "@components/pet-avatar";
import { Stack } from "@mui/material";
import React, { useState } from "react";

interface CatSelectionProps {
  cats: Profile[];
  setSelectedCat: React.Dispatch<React.SetStateAction<Profile>>;
  setIsEditMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CatSelection: React.FC<CatSelectionProps> = ({
  cats,
  setSelectedCat,
  setIsEditMode,
}) => {
  const [selectedCatIndex, setSelectedCatIndex] = useState(0);

  const handleCatSelect = (index: number, cat: Profile) => {
    if (selectedCatIndex === index) {
      return;
    }

    setSelectedCatIndex(index);
    setSelectedCat(cat);
    setIsEditMode(false);
  };
  return (
    <Stack direction="row" spacing={2}>
      {cats.map((cat, index) => (
        <PetAvatar key={cat.animalId} onClick={() => {
          handleCatSelect(index, cat);
        }}
          isSelected={selectedCatIndex === index}
          data={{ name: cat.mainInfo.name, pathToImage: cat.profilePictureFilename }} />
      ))}
    </Stack>
  );
};

export default CatSelection;
