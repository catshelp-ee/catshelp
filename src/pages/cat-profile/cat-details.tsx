import { useIsMobile } from "@context/is-mobile-context";
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Typography } from "@mui/material";
import { calculateAge, isFutureDate } from "@utils/date-utils";
import React from "react";
import { Profile } from "types/cat";
import ImageGallery from "./image-gallery";

interface CatDetailsProps {
  selectedCat: Profile;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const CatDetailsHeader: React.FC<{
  title: string;
  onEditClick: () => void;
}> = ({ title, onEditClick }) => (
  <div className="mb-16">
    <h1 className="text-secondary">PEALKIRI:</h1>
    <span className="flex justify-between">
      <h1 className="text-2xl font-bold">{title}</h1>
      <IconButton
        onClick={onEditClick}
        sx={{
          width: "96px",
          backgroundColor: "#007AFF",
          borderRadius: "8px",
          color: "#FFF",
          "&:hover": {
            backgroundColor: "#3696ff",
          },

        }}
      >
        <EditIcon /> {/* default is 24 */}
      </IconButton>
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
  value: string | string[] | Date | null;
}> = ({ label, value }) => {

  const renderContent = () => {
    if (Array.isArray(value)) {
      return value.join(", ");
    } else if (value instanceof Date) {
      return Date.toString()
    }
    return value;
  }

  return (
    <div>
      <h2 className="font-bold">{label}</h2>
      <Typography variant="body1">
        {renderContent()}
      </Typography>
    </div>
  )
}

const extractProcedures = (profile: Profile): string => {
  const procedures = [];


  if (!profile.characteristics.textFields.gender.split(' ')[0].endsWith('mata')) {
    procedures.push("Lõigatud");
  }

  if (isFutureDate(profile.vaccineInfo.nextComplexVaccineDate)) {
    procedures.push('Kompleksvaktsiin');
  }

  if (isFutureDate(profile.vaccineInfo.nextRabiesVaccineDate)) {
    procedures.push('Marutaudi vaktsiin');
  }

  if (profile.vaccineInfo.dewormingOrFleaTreatmentDate) {
    procedures.push('Ussirohi');
  }

  return procedures.join(', ');
}

const CatDetails: React.FC<CatDetailsProps> = ({
  selectedCat,
  setIsEditMode,
}) => {
  const handleEditClick = () => setIsEditMode(true);
  const isMobile = useIsMobile();

  const capitalize = str => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const FIELD_LABELS = {
    "Kassi sugu": capitalize(selectedCat.characteristics.textFields.gender.split(' ')[1]),
    "Kassi vanus": calculateAge(selectedCat.mainInfo.birthDate),
    "Kassi välimus": [
      selectedCat.characteristics.selectFields.coatColour,
      selectedCat.characteristics.selectFields.coatLength
    ].filter(Boolean).join(' '),
    "Kassi asukoht": selectedCat.mainInfo.location,
    "Mis protseduurid hoiulisel tehtud on?": extractProcedures(selectedCat),
    "Kui kassil esineb krooniline haigus, vajab eritoitu või on vigastus palun kirjuta siia sellest": selectedCat.characteristics.textFields.chronicConditions,
    "Kui kaua on kass hoiukodus/kassitoas viibinud?": selectedCat.characteristics.textFields.fosterStayDuration,
    "Iseloom": selectedCat.characteristics.multiselectFields.personality.join(", "),
    "Kassile meeldib": selectedCat.characteristics.multiselectFields.likes.join(", "),
    "Kirjelda kassi mõne iseloomustava lausega (nt milline on kiisu argipäev)": selectedCat.characteristics.textFields.description,
    "Kuidas suhtub teistesse kassidesse?": selectedCat.characteristics.selectFields.attitudeTowardsCats,
    "Kuidas suhtub koertesse?": selectedCat.characteristics.selectFields.attitudeTowardsDogs,
    "Kuidas suhtub lastesse?": selectedCat.characteristics.selectFields.attitudeTowardsChildren,
    "Kuidas ta sobiks toa- või õuekassikas?": selectedCat.characteristics.selectFields.suitabilityForIndoorOrOutdoor
  } as const;

  return (
    <>
      {isMobile && (
        <ImageGallery images={selectedCat?.images || []} />
      )}
      <div className={`${isMobile ? "w-full" : "w-2/3"}`}>
        <CatDetailsHeader
          title={selectedCat?.title || ""}
          onEditClick={handleEditClick}
        />

        <CatDescription description={selectedCat?.description || ""} />

        <div className="flex flex-col gap-4">
          <h1 className="text-secondary">LOOMA PROFIIL:</h1>
          {Object.entries(FIELD_LABELS).map(([label, value], index) => {
            return (
              <CatProfileField
                key={index}
                label={label}
                value={value}
              />)
          })}
        </div>
      </div>

      {!isMobile && <ImageGallery name={selectedCat.mainInfo.name} images={selectedCat?.images || []} />}
    </>
  );
};

export default CatDetails;
