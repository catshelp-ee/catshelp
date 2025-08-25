import { PetAvatar } from "@components/pet-avatar";
import { Stack } from "@mui/material";
import React, { useState } from "react";
import { Profile } from "types/cat";

interface CatSelectionProps {
  cats: Profile[];
  setSelectedCat: React.Dispatch<React.SetStateAction<Profile>>;
  setIsEditMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

const AVATAR_SIZE = { width: 72, height: 72 };
const SELECTED_INDICATOR_STYLE = "border-b-4 border-[#5DC2D8]";

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
        <PetAvatar onClick={() => {
          handleCatSelect(index, cat);
        }}
          isSelected={selectedCatIndex === index}
          pet={{ name: cat.mainInfo.name, pathToImage: cat.profilePictureFilename }} />
      ))}
    </Stack>
  );
};

export default CatSelection;
