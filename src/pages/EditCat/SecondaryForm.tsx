import React from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

interface SecondaryFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const SecondaryForm: React.FC<SecondaryFormProps> = ({
  formData,
  setFormData,
}) => {
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <TextField
        label="Kiibi nr"
        name="chipId"
        value={formData.chipId}
        onChange={handleChange}
        variant="standard"
        fullWidth
      />
      <FormControl variant="standard">
        <InputLabel id="fur-length-label">Karva Pikkus</InputLabel>
        <Select
          labelId="fur-length-label"
          name="furLength"
          value={formData.furLength}
          onChange={handleChange}
        >
          <MenuItem value={"Lühikarvaline"}>Lühikarvaline</MenuItem>
          <MenuItem value={"Pikakarvaline"}>Pikakarvaline</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Päästmiskp"
        name="rescueDate"
        type="date"
        value={formData.rescueDate}
        onChange={handleChange}
        fullWidth
        variant="standard"
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <TextField
        label="Kroonilised haigused või vigastused"
        name="chronicIllnesses"
        value={formData.chronicIllnesses}
        onChange={handleChange}
        variant="standard"
        fullWidth
      />
      <TextField
        label="Kaua on viibinud hoiukodus"
        name="timeInFosterCare"
        value={formData.timeInFosterCare}
        onChange={handleChange}
        variant="standard"
        fullWidth
      />
      <TextField
        label="Päästmisajalugu, kuidas sattus hoiukodusse"
        name="rescueHistory"
        value={formData.rescueHistory}
        onChange={handleChange}
        variant="standard"
        fullWidth
      />
      <TextField
        label="Lisamärkmeid"
        name="additionalNotes"
        value={formData.additionalNotes}
        onChange={handleChange}
        variant="standard"
        fullWidth
      />
    </div>
  );
};
