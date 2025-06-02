import React from "react";
import { Button, TextField, Typography } from "@mui/material";
import { Cat } from "../../types/Cat.ts";
import ImageGallery from "./ImageGallery.tsx";
import { useIsMobile } from "@/hooks/isMobile.tsx";

interface CatDetailsProps {
  selectedCat: Cat;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const FIELD_LABELS = {
  gender: "Kassi sugu",
  age: "Kassi vanus",
  appearence: "Kassi välimus",
  currentLoc: "Kassi asukoht",
  procedures: "Mis protseduurid hoiulisel tehtud on?",
  issues:
    "Kui kassil esineb krooniline haigus, vajab eritoitu või on vigastus palun kirjuta siia sellest",
  duration: "Kui kaua on kass hoiukodus/kassitoas viibinud?",
  history:
    "Kas Sa tead, kuidas kiisu meie MTÜ hoole alla sattus? (Kirjelda tema leidmise ajalugu, mis seisundis ta oli jne)",
  characteristics: "Iseloom",
  likes: "Kassile meeldib",
  descriptionOfCharacter:
    "Kirjelda kassi mõne iseloomustava lausega (nt milline on kiisu argipäev)",
  treatOtherCats: "Kuidas suhtub teistesse kassidesse?",
  treatDogs: "Kuidas suhtub koertesse?",
  treatChildren: "Kuidas suhtub lastesse?",
  outdoorsIndoors: "Kuidas ta sobiks toa- või õuekassikas?",
} as const;

const CatDetailsHeader: React.FC<{
  title: string;
  onEditClick: () => void;
}> = ({ title, onEditClick }) => (
  <div className="mb-16">
    <h1 className="text-secondary">PEALKIRI:</h1>
    <span className="flex justify-between">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button onClick={onEditClick}>Muuda/Lisa</Button>
    </span>
  </div>
);

const CatDescription: React.FC<{ description: string }> = ({ description }) => (
  <div className="mb-16">
    <h1 className="text-secondary">LOOMA KIRJELDUS:</h1>
    <Typography sx={{ textAlign: "justify" }}>{description}</Typography>
  </div>
);

const CatProfileField: React.FC<{
  label: string;
  value: string | [] | string[] | Date | null;
}> = ({ label, value }) => (
  <div>
    <h2 className="font-bold">{label}</h2>
    <TextField disabled variant="standard" value={value || ""} fullWidth />
  </div>
);

const CatDetails: React.FC<CatDetailsProps> = ({
  selectedCat,
  setIsEditMode,
}) => {
  const handleEditClick = () => setIsEditMode(true);
  const isMobile = useIsMobile();

  return (
    <div
      className={`flex ${
        isMobile ? "flex-col" : ""
      } my-4 border-2 rounded-lg p-4`}
    >
      {isMobile && (
        <ImageGallery isMobile={isMobile} images={selectedCat?.images || []} />
      )}
      <div className="w-full">
        <CatDetailsHeader
          title={selectedCat?.title || ""}
          onEditClick={handleEditClick}
        />

        <CatDescription description={selectedCat?.description || ""} />

        <div className="flex flex-col gap-4">
          <h1 className="text-secondary">LOOMA PROFIIL:</h1>
          {Object.entries(FIELD_LABELS).map(([key, label]) => (
            <CatProfileField
              key={key}
              label={label}
              value={selectedCat[key as keyof Cat]}
            />
          ))}
        </div>
      </div>

      {!isMobile && <ImageGallery images={selectedCat?.images || []} />}
    </div>
  );
};

export default CatDetails;
