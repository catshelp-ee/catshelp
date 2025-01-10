import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface PrimaryFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const PrimaryForm: React.FC<PrimaryFormProps> = ({
  formData,
  setFormData,
}) => {
  const handleImageChange = (event: any) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const imageFiles = filesArray.filter((file: any) =>
        file.type.startsWith("image/")
      );

      if (imageFiles.length < filesArray.length) {
        alert("Vali palun korrektne pildifail.");
      }

      setFormData({
        ...formData,
        images: [...formData.images, ...imageFiles],
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = formData.images.filter(
      (_: any, i: number) => i !== index
    );
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const formattedDate = date.format("DD-MM-YYYY");
      setFormData({ ...formData, dateOfBirth: formattedDate });
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
      <DatePicker
        name="dateOfBirth"
        label="Sünniaeg"
        format="DD-MM-YYYY"
        value={
          formData.dateOfBirth
            ? dayjs(formData.dateOfBirth, "DD-MM-YYYY")
            : null
        }
        slotProps={{
          textField: {
            variant: "standard",
          },
        }}
        defaultValue={dayjs()}
        onChange={handleDateChange}
      />
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        lae üles pildid
      </Button>
      {formData.images.length > 0 && (
        <>
          <div className="text-lg font-semibold mb-4">Valitud pildid:</div>
          <div className=" justify-center items-center mb-4 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-10">
            {formData.images.map((file: File, index: number) => (
              <div key={index} className="flex justify-center items-center">
                <div className="relative">
                  <img
                    className="w-48 h-48 bg-gray-100 rounded-lg shadow-md overflow-hidden object-cover"
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                  />
                  <button
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs shadow-md hover:bg-red-600"
                    onClick={() => handleRemoveImage(index)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
