import React from "react";
import { TextField } from "@mui/material";

interface PrimaryFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const PrimaryForm: React.FC<PrimaryFormProps> = ({
  formData,
  setFormData,
}) => {
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <TextField
        label="Päästetud järjekorra NR (AA ' KK nr ..) "
        name="rescueId"
        value={formData.rescueId}
        onChange={handleChange}
        fullWidth
        variant="standard"
        required
      />
      <TextField
        label="Kassi värv"
        name="color"
        value={formData.color}
        onChange={handleChange}
        fullWidth
        variant="standard"
        required
      />
      <TextField
        label="Kassi nimi"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        variant="standard"
      />
      <TextField
        label="Asukoht"
        name="location"
        value={formData.location}
        onChange={handleChange}
        fullWidth
        variant="standard"
      />
      <TextField
        label="Sugu"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        fullWidth
        variant="standard"
      />
      <TextField
        label="Sünniaeg"
        name="dateOfBirth"
        type="date"
        value={formData.dateOfBirth}
        onChange={handleChange}
        fullWidth
        variant="standard"
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginTop: "1rem" }}
      />
    </div>
  );
};
