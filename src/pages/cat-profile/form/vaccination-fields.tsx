import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import React from "react";
import { Cat } from "types/cat";

interface VaccinationFieldsProps {
  tempSelectedCat: Cat;
  updateField: (e: any, key: string) => void;
}

export const VaccinationFields: React.FC<VaccinationFieldsProps> = ({
  tempSelectedCat,
  updateField,
}) => (
  <>
    <DatePicker
      label="Vaktsineerimis-kuupäev"
      name="vacc"
      value={tempSelectedCat?.vaccDate ? dayjs(tempSelectedCat.vaccDate) : null}
      onChange={(e) => updateField(e, "vacc")}
    />

    <DatePicker
      label="Vaktsiini lõppemise kuupäev"
      name="vaccEnd"
      value={tempSelectedCat?.vaccEndDate ? dayjs(tempSelectedCat.vaccEndDate) : null}
      onChange={(e) => updateField(e, "vaccEnd")}
    />

    <DatePicker
      label="Marutaudi vaktsineerimis-kuupäev"
      name="rabiesVacc"
      value={
        tempSelectedCat?.rabiesVaccDate ? dayjs(tempSelectedCat.rabiesVaccDate) : null
      }
      onChange={(e) => updateField(e, "rabiesVacc")}
    />

    <DatePicker
      label="Marutaudi vaktsiini lõppemise kuupäev"
      name="rabiesVaccEnd"
      value={
        tempSelectedCat?.rabiesVaccEndDate
          ? dayjs(tempSelectedCat.rabiesVaccEndDate)
          : null
      }
      onChange={(e) => updateField(e, "rabiesVaccEnd")}
    />

    <TextField
      label="Ussirohu turjatilga nimi"
      name="wormMedName"
      value={tempSelectedCat?.wormMedName}
      onChange={(e) => updateField(e, "wormMedName")}
    />

    <DatePicker
      label="Ussirohu kandmise kuupäev"
      name="wormMedDate"
      value={
        tempSelectedCat.wormMedDate ? dayjs(tempSelectedCat.wormMedDate) : null
      }
      onChange={(e) => updateField(e, "wormMedDate")}
    />
  </>
);
