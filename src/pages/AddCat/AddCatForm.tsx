import React, { useState } from "react";
import { Button, TextField, Autocomplete } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as Utils from "@utils/utils.ts";
import { Cat, defaultCat } from "@types/Cat.ts";
import Header from "../App/Header.tsx";
import Gallery from "@pages/AddCat/Gallery.tsx";
import Popup from "@pages/AddCat/Popup.tsx";
import States from "@pages/AddCat/States.json";

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
  const [cat, setCat] = useState<Cat>(defaultCat);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isSlidingDown, setSlidingDown] = useState(false);
  const [isSlidingUp, setSlidingUp] = useState(false);
  const [indexOffset, setIndexOffset] = useState(0);

  const handlePopupClose = () => {
    setSlidingUp(true);
    setSlidingDown(false);
    setTimeout(() => {
      setSlidingUp(false);
      setPopupVisible(false);
    }, 300);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const images = cat.primaryInfo.images!;

    files.forEach((file, index) => {
      images.set(index+indexOffset, file);
    });

    setIndexOffset(prev => prev + files.length);

    setCat((prevCat) => ({
      ...prevCat,
      primaryInfo: { images },
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isPopupVisible) {
      setSlidingDown(false);
      setTimeout(() => setSlidingDown(true), 10);
    } else {
      setPopupVisible(true);
      setSlidingDown(true);
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData);
    const pictures = Array.from(cat.primaryInfo.images?.values() || []);

    Utils.submitNewCatProfile(payload, pictures);
  };

  return (
    <div className="h-screen flex justify-center">
      <Popup
        isVisible={isPopupVisible}
        slidingDown={isSlidingDown}
        slidingUp={isSlidingUp}
        onClose={handlePopupClose}
        title="🐈‍⬛ Kiisuke lisatud! 🐈‍⬛"
      />
      <div className="flex flex-col w-1/3 max-sm:w-full">
        <Header className="mt-4" imgClass="m-auto" />
        <h1 className="text-5xl mt-4 mb-16 max-sm:text-4xl">Lisa uus kass</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col overflow-scroll no-scrollbar w-full gap-4 mb-28"
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
                name="pildid"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                multiple
              />
            </Button>
            <Gallery files={cat.primaryInfo.images!} setCat={setCat} />
            <TextField
              name="lisa"
              label="Lisainfo"
              multiline
              maxRows={4}
              variant="outlined"
            />
              <Autocomplete
                disablePortal
                options={States.maakonnad}
                renderInput={(params) => <TextField {...params} label="Maakond" />}
               />
              <TextField name="asula" label="Asula" multiline maxRows={4} />
          </form>
      </div>
    </div>
  );
};

export default AddCatForm;
