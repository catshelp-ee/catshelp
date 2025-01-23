import React, { useState } from "react";
import { Button, FormLabel, Select, TextField, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as Utils from "../../utils.ts";
import { Cat, defaultCat } from "../../types/Cat.ts";
import Header from "../Header.tsx";
import Gallery from "./Gallery.tsx";
import Popup from "./Popup.tsx";
import States from "./States.json";

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
      images.set(index, file);
    });

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

    // Utils.submitNewCatProfile(payload, pictures);
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
        <h1 className="text-5xl mt-2 max-sm:text-4xl">Lisa uus kass</h1>
        <div className="flex flex-col flex-1 mb-24 mt-6 overflow-scroll items-center content-center">
          <form
            onSubmit={handleSubmit}
            className="createForm flex w-full flex-col gap-4"
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
            <FormLabel
              sx={{
                fontSize: "2rem",
                color: "#000",
                "@media (max-width: 600px)": {
                  fontSize: "1.5rem",
                },
              }}
            >
              Lisa pilte kassist
            </FormLabel>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Lae üles pildid
              <VisuallyHiddenInput
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
              minRows={4}
              variant="outlined"
            />
            <div className="flex flex-col">
              <h2 className="my-8 text-2xl">Leidmiskoht</h2>
              <h3>Maakond</h3>
              <Select
                name="maakond"
                className="mb-8 mt-2"
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: "50%", // Set the maximum height for the dropdown
                      overflowY: "auto", // Enable vertical scrolling
                    },
                  },
                  sx: {
                    "@media (max-width: 375px)": {
                      ".MuiPopover-paper": {
                        left: "0 !important",
                      },
                    },
                  },
                }}
              >
                {States.maakonnad.map((maakond: string, idx: number) => (
                  <MenuItem key={idx} value={maakond}>
                    {maakond}
                  </MenuItem>
                ))}
              </Select>
              <h3>Asula</h3>
              <TextField name="asula" className="mb-8 mt-2" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCatForm;
