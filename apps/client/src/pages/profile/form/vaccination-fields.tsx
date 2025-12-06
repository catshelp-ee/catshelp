import { Profile } from "@catshelp/types/src";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import React from "react";

interface VaccinationFieldsProps {
    tempSelectedCat: Profile;
    updateField: (e: any, key: string) => void;
    updateDateField: (newDate: Dayjs, key: string) => void;
}

export const VaccinationFields: React.FC<VaccinationFieldsProps> = ({
    tempSelectedCat,
    updateField,
    updateDateField,
}) => {
    return (
        <>
            <DatePicker
                label="Vaktsineerimis-kuupäev"
                name="vaccineInfo.complexVaccine"
                value={tempSelectedCat.vaccineInfo.complexVaccine && dayjs(tempSelectedCat.vaccineInfo.complexVaccine)}
                disabled
                onChange={(e) => updateDateField(e, "vaccineInfo.complexVaccine")}
            />

            <DatePicker
                label="Vaktsiini lõppemise kuupäev"
                name="vaccineInfo.nextComplexVaccineDate"
                value={tempSelectedCat.vaccineInfo.nextComplexVaccineDate && dayjs(tempSelectedCat.vaccineInfo.nextComplexVaccineDate)}
                disabled
                onChange={(e) => updateDateField(e, "vaccineInfo.nextComplexVaccineDate")}
            />

            <DatePicker
                label="Marutaudi vaktsineerimis-kuupäev"
                name="vaccineInfo.rabiesVaccine"
                value={
                    tempSelectedCat.vaccineInfo.rabiesVaccine && dayjs(tempSelectedCat.vaccineInfo.rabiesVaccine)
                }
                disabled
                onChange={(e) => updateDateField(e, "vaccineInfo.rabiesVaccine")}
            />

            <DatePicker
                label="Marutaudi vaktsiini lõppemise kuupäev"
                name="vaccineInfo.nextRabiesVaccineDate"
                value={
                    tempSelectedCat.vaccineInfo.nextRabiesVaccineDate &&
                    dayjs(tempSelectedCat.vaccineInfo.nextRabiesVaccineDate)
                }
                disabled
                onChange={(e) => updateDateField(e, "vaccineInfo.nextRabiesVaccineDate")}
            />

            <TextField
                label="Ussirohu turjatilga nimi"
                name="vaccineInfo.dewormingOrFleaTreatmentName"
                value={tempSelectedCat.vaccineInfo.dewormingOrFleaTreatmentName}
                disabled
                onChange={(e) => updateField(e, "vaccineInfo.dewormingOrFleaTreatmentName")}
            />

            <DatePicker
                label="Ussirohu kandmise kuupäev"
                name="vaccineInfo.dewormingOrFleaTreatmentDate"
                value={
                    tempSelectedCat.vaccineInfo.dewormingOrFleaTreatmentDate && dayjs(tempSelectedCat.vaccineInfo.dewormingOrFleaTreatmentDate)}
                disabled
                onChange={(e) => updateDateField(e, "vaccineInfo.dewormingOrFleaTreatmentDate")}
            />
        </>
    );
}
