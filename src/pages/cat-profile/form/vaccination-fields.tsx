import React from "react";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Cat } from "@models/Cat.ts";

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
      value={tempSelectedCat?.vacc ? dayjs(tempSelectedCat.vacc) : null}
      onChange={(e) => updateField(e, "vacc")}
    />

    <DatePicker
      label="Vaktsiini lõppemise kuupäev"
      name="vaccEnd"
      value={tempSelectedCat?.vaccEnd ? dayjs(tempSelectedCat.vaccEnd) : null}
      onChange={(e) => updateField(e, "vaccEnd")}
    />

    <DatePicker
      label="Marutaudi vaktsineerimis-kuupäev"
      name="rabiesVacc"
      value={
        tempSelectedCat?.rabiesVacc ? dayjs(tempSelectedCat.rabiesVacc) : null
      }
      onChange={(e) => updateField(e, "rabiesVacc")}
    />

    <DatePicker
      label="Marutaudi vaktsiini lõppemise kuupäev"
      name="rabiesVaccEnd"
      value={
        tempSelectedCat?.rabiesVaccEnd
          ? dayjs(tempSelectedCat.rabiesVaccEnd)
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
