import Header from "@components/header";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Autocomplete,
  Button,
  ImageList,
  ImageListItem,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useAlert } from "@context/alert-context";
import States from "./states.json";
import React, { useState } from "react";
import { resizeImages, uploadImages } from "src/utils/image-utils";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

const AddCatForm = () => {
  const [images, setImages] = useState<File[]>([]);
  const { showAlert } = useAlert();

  const submitNewCatProfile = async (data: any, pictures: File[]) => {
    const newAnimalId: number = (
      await axios.post('/api/animals', data, {
        withCredentials: true,
      })
    ).data;

    const resizedImages = await resizeImages(pictures);
    uploadImages(resizedImages, newAnimalId);
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const data = {
      notes: formData.get("notes"),
      location: formData.get("location"),
      state: formData.get("state"),
    };

    try {
      await submitNewCatProfile(data, images);
      showAlert('Success', "🐈‍⬛ Kiisuke lisatud! 🐈‍⬛");
    } catch (error) {
      showAlert('Error', "Kassi lisamine ebaõnnestus");
    }
  };

  return (
    <div className="h-screen flex justify-center">
      <div className="flex flex-col w-1/3 max-sm:w-full">
        <Header className="mt-4" imgClass="m-auto" />
        <h1 className="text-5xl mt-4 mb-16 max-sm:text-4xl">Lisa uus kass</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full gap-4 mb-28"
        >
          <Button
            sx={{
              width: "300px",
              position: "fixed",
              bottom: "25px",
              left: "50%",
              transform: "translate(-50%, 0)",
            }}
            type="submit"
            variant="outlined"
          >
            Kinnita
          </Button>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Lae üles pildid
            <VisuallyHiddenInput
              required
              name="images"
              type="file"
              accept="image/*"
              onChange={(e) => setImages(Array.from(e.target.files ?? []))}
              multiple
            />
          </Button>
          <ImageList cols={3}>
            {images.map((image, index) => (
              <ImageListItem key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`preview-${index}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImages((prev) => prev.filter((_, i) => i !== index));
                  }}
                  className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-opacity-80"
                >
                  ×
                </button>
              </ImageListItem>
            ))}
          </ImageList>

          <TextField
            name="notes"
            label="Lisainfo"
            multiline
            maxRows={4}
            variant="outlined"
          />
          <Autocomplete
            disablePortal
            options={States.maakonnad}
            renderInput={(params) => (
              <TextField name="state" {...params} label="Maakond" />
            )}
          />
          <TextField name="location" label="Asula" multiline maxRows={4} />
        </form>
      </div>
    </div>
  );
};

export default AddCatForm;
