import React from "react";
import {
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Cat } from "@models/Cat.ts";
import { COAT_COLOURS, COAT_LENGTHS } from "./FormData";

interface BasicInfoFieldsProps {
  tempSelectedCat: Cat;
  updateField: (e: any, key: string) => void;
}

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  tempSelectedCat,
  updateField,
}) => (
  <div className="flex flex-col gap-4">
    <TextField
      label="Nimi"
      name="name"
      value={tempSelectedCat?.name}
      onChange={(e) => updateField(e, "name")}
    />

    <DatePicker
      label="Sünniaeg"
      name="birthDate"
      value={
        tempSelectedCat?.birthDate ? dayjs(tempSelectedCat.birthDate) : null
      }
      onChange={(e) => updateField(e, "birthDate")}
    />

    <TextField
      label="Leidmiskoht"
      name="foundLoc"
      value={tempSelectedCat?.foundLoc}
      onChange={(e) => updateField(e, "foundLoc")}
    />

    <DatePicker
      label="Leidmiskuupäev"
      name="foundDate"
      value={
        tempSelectedCat?.rescueDate ? dayjs(tempSelectedCat.rescueDate) : null
      }
      onChange={(e) => updateField(e, "foundDate")}
    />

    <FormControl>
      <FormLabel>Sugu</FormLabel>
      <RadioGroup
        name="gender"
        value={tempSelectedCat?.genderLabel}
        onChange={(e) => {
          updateField(e, "gender");
          updateField(e, "genderLabel");
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
      <Select
        name="coatLength"
        value={tempSelectedCat?.coatLength}
        onChange={(e) => updateField(e, "coatLength")}
        MenuProps={{ PaperProps: { style: { maxHeight: 500 } } }}
      >
        {COAT_LENGTHS.map((length, index) => (
          <MenuItem key={index} value={length}>
            {length}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl>
      <FormLabel>Karva värv</FormLabel>
      <Select
        name="coatColour"
        value={tempSelectedCat?.coatColour}
        onChange={(e) => updateField(e, "coatColour")}
        MenuProps={{ PaperProps: { style: { maxHeight: 500 } } }}
      >
        {COAT_COLOURS.map((colour, index) => (
          <MenuItem key={index} value={colour}>
            {colour}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <TextField
      label="Kiibi number"
      name="chipNr"
      value={tempSelectedCat?.chipNr}
      onChange={(e) => updateField(e, "chipNr")}
    />
  </div>
);
