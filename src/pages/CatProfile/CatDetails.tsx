import React from "react";
import CatInfoField from "./CatInfo.tsx";
import { Button } from "@mui/material";
import { Cat } from "../../types/Cat.ts";

interface CatDetailsProps {
  selectedCat: Cat;
  handleEditCat: () => void;
}

const CatDetails: React.FC<CatDetailsProps> = ({
  selectedCat,
  handleEditCat,
}) => {
  return (
    <>
      <div className="flex flex-col flex-1 mr-3 my-4">
        <div className="text-sm font-medium text-secondary text-bold">
          PEALKIRI:
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="md:text-xl font-bold">{selectedCat.title}</div>
          <Button
            sx={{ textTransform: "none" }}
            onClick={() => handleEditCat()}
          >
            <img src="/edit.png" alt="Edit" className="w-5 h-5 mr-2" />
            Muuda/Lisa
          </Button>
        </div>
        <div className="text-sm font-medium text-secondary text-bold mt-8 mb-2">
          LOOMA KIRJELDUS:
        </div>
        <p className="md:text-sm leading-6 tracking-normal font-normal">
          {selectedCat.description}
        </p>
        <div className="">
          <div className="text-sm font-medium text-secondary text-bold mt-8 mb-2">
            LOOMA PROFIIL:
          </div>
          <CatInfoField label="Kassi nimi" value={selectedCat.name} />
          <CatInfoField label="Kassi vanus/sünnikp" value={selectedCat.age} />
          <CatInfoField label="Kassi välimus" value={selectedCat.appearance} />
          <CatInfoField label="Protseduurid" value={selectedCat.procedures} />
          <CatInfoField
            label="Kassi päästmiskp"
            value={selectedCat.rescueDate}
          />
          <CatInfoField label="Ajalugu" value={selectedCat.history} />
          <CatInfoField label="Iseloom" value={selectedCat.characteristics} />
          <CatInfoField label="Meeldib" value={selectedCat.likes} />
          <CatInfoField
            label="Suhtub kassidesse"
            value={selectedCat.treatOtherCats}
          />
          <CatInfoField
            label="Suhtub koertesse"
            value={selectedCat.treatDogs}
          />
          <CatInfoField
            label="Suhtub lastesse"
            value={selectedCat.treatChildren}
          />
          <CatInfoField
            label="Toa/õuekass"
            value={selectedCat.outdoorsIndoors}
          />
        </div>
      </div>
    </>
  );
};

export default CatDetails;
