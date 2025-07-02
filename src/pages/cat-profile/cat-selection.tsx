import React, { useState } from "react";
import { Cat } from "types/cat";
import { Avatar, Stack, IconButton } from "@mui/material";

interface CatSelectionProps {
  cats: Cat[];
  setSelectedCat: React.Dispatch<React.SetStateAction<Cat>>;
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

  const handleCatSelect = (index: number, cat: Cat) => {
    if (selectedCatIndex === index) return;

    setSelectedCatIndex(index);
    setSelectedCat(cat);
    setIsEditMode?.(false);
  };

  return (
    <Stack direction="row" spacing={2}>
      {cats.map((cat, index) => (
        <CatAvatar
          key={index}
          cat={cat}
          index={index}
          isSelected={selectedCatIndex === index}
          onSelect={handleCatSelect}
        />
      ))}
    </Stack>
  );
};

interface CatAvatarProps {
  cat: Cat;
  index: number;
  isSelected: boolean;
  onSelect: (index: number, cat: Cat) => void;
}

const CatAvatar: React.FC<CatAvatarProps> = ({
  cat,
  index,
  isSelected,
  onSelect,
}) => (
  <div className="flex flex-col items-center">
    <IconButton onClick={() => onSelect(index, cat)}>
      <Avatar sx={AVATAR_SIZE} src={cat.images[0]} alt={`${cat.name} avatar`} />
    </IconButton>
    <p className={isSelected ? SELECTED_INDICATOR_STYLE : ""}>{cat.name}</p>
  </div>
);

export default CatSelection;
