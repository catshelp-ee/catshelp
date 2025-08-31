import {
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import { Profile } from "types/cat";
import { COAT_COLOURS, COAT_LENGTHS } from "./form-data";
import ResponsiveMultiSelect from "./responsive-multi-select";

interface BasicInfoFieldsProps {
  tempSelectedCat: Profile;
  updateField: (e: any, key: string) => void;
  updateDateField: (newDate: Dayjs, key: string) => void;
  isMobile: boolean;
}


export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  tempSelectedCat,
  updateField,
  updateDateField,
}) => (
  <div className="flex flex-col gap-4">
    <TextField
      label="Nimi"
      name="mainInfo.name"
      value={tempSelectedCat.mainInfo.name}
      onChange={(e) => updateField(e, "mainInfo.name")}
    />

    <DatePicker
      label="Sünniaeg"
      name="mainInfo.birthDate"
      value={
        tempSelectedCat.mainInfo.birthDate ? dayjs(tempSelectedCat.mainInfo.birthDate) : null
      }
      onChange={(e) => updateDateField(e, "mainInfo.birthDate")}
    />

    <TextField
      label="Leidmiskoht"
      name="animalRescueInfo.rescueLocation"
      value={tempSelectedCat.animalRescueInfo.rescueLocation}
      onChange={(e) => updateField(e, "animalRescueInfo.rescueLocation")}
    />

    <DatePicker
      label="Leidmiskuupäev"
      name="animalRescueInfo.rescueDate"
      value={
        tempSelectedCat.animalRescueInfo.rescueDate ? dayjs(tempSelectedCat.animalRescueInfo.rescueDate) : null
      }
      onChange={(e) => updateDateField(e, "animalRescueInfo.rescueDate")}
    />

    <FormControl>
      <FormLabel>Sugu</FormLabel>
      <RadioGroup
        name="characteristics.textFields.gender"
        value={tempSelectedCat.characteristics.textFields.spayedOrNeutered + " " + tempSelectedCat.characteristics.textFields.gender}
        onChange={(e) => {
          updateField(e, "characteristics.textFields.gender");
        }}
      >
        <FormControlLabel
          value="Steriliseerimata emane"
          control={<Radio />}
          label="Steriliseerimata emane"
        />
        <FormControlLabel
          value="Steriliseeritud emane"
          control={<Radio />}
          label="Steriliseeritud emane"
        />
        <FormControlLabel
          value="Kastreerimata isane"
          control={<Radio />}
          label="Kastreerimata isane"
        />
        <FormControlLabel
          value="Kastreeritud isane"
          control={<Radio />}
          label="Kastreeritud isane"
        />
      </RadioGroup>
    </FormControl>

    <FormControl>
      <FormLabel>Karva pikkus</FormLabel>
      <ResponsiveMultiSelect
        name="characteristics.selectFields.coatLength"
        value={tempSelectedCat.characteristics.selectFields.coatLength}
        onChange={(e) => updateField(e, "characteristics.selectFields.coatLength")}
      >
        {COAT_LENGTHS.map((length, index) => (
          <MenuItem key={index} value={length}>
            {length}
          </MenuItem>
        ))}
      </ResponsiveMultiSelect>
    </FormControl>

    <FormControl>
      <FormLabel>Karva värv</FormLabel>
      <ResponsiveMultiSelect
        name="characteristics.selectFields.coatColour"
        value={tempSelectedCat.characteristics.selectFields.coatColour}
        onChange={(e) => updateField(e, "characteristics.selectFields.coatColour")}
      >
        {COAT_COLOURS.map((colour, index) => (
          <MenuItem key={index} value={colour}>
            {colour}
          </MenuItem>
        ))}
      </ResponsiveMultiSelect>
    </FormControl>

    <TextField
      label="Kiibi number"
      name="mainInfo.microchip"
      value={tempSelectedCat.mainInfo.microchip}
      onChange={(e) => updateField(e, "mainInfo.microchip")}
    />

    <FormControl>
      <FormLabel>Kiip LLR-is MTÜ nimel</FormLabel>
      <RadioGroup
        name="mainInfo.microchipRegisteredInLLR"
        value={tempSelectedCat.mainInfo.microchipRegisteredInLLR}
        onChange={(e) => updateField(e, "mainInfo.microchipRegisteredInLLR")}
      >
        <FormControlLabel value={true} control={<Radio />} label="Jah" />
        <FormControlLabel value={false} control={<Radio />} label="Ei" />
      </RadioGroup>
    </FormControl>
  </div>
);