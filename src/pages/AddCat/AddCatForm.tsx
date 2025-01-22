import { Button, FormLabel, Select, TextField, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as Utils from "../../utils.ts";
import React, { useState, useEffect } from "react";
import { Cat, defaultCat } from "../../types/Cat.ts";
import Header from "../Header.tsx";
import Gallery from "./Gallery.tsx";
import States from "./States.json";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const AddCatForm = () => {
  const [cat, setCat] = useState<Cat>(defaultCat);

  const submitForm = (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    const pictures: File[] = formData.getAll("pildid") as File[];

    if (!payload.sugu) payload.sugu = "";
    if (!payload.loigatud) payload.loigatud = "";
    if (payload.loigatud != "") payload.loigatud = payload.loigatud === "true";

    Utils.submitNewCatProfile(payload, pictures);
  };

  return (
    <div className="h-screen flex justify-center">
      <div className="flex flex-col w-1/3 max-sm:w-full">
        <Header className="mt-4" imgClass="m-auto" />
        <h1 className="text-5xl mt-2 max-sm:text-4xl">Lisa uus kass</h1>
        <div className="flex flex-col flex-1 mb-24 mt-6 overflow-scroll items-center content-center">
          <form
            onSubmit={submitForm}
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
              kinnita
            </Button>

            <FormLabel
              sx={{
                fontSize: "2rem",
                color: "#000",
                "@media (max-width: 600px)": {
                  fontSize: "1.5rem", // Adjust font size for smaller screens
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
              lae üles pildid
              <VisuallyHiddenInput
                name="pildid"
                type="file"
                accept="image/*"
                onChange={(event: any) => {
                  const files: File[] = Array.from(event.target.files);
                  const images = cat.primaryInfo.images!;
                  for (let index = 0; index < files.length; index++) {
                    images.set(index, files[index]);
                  }
                  setCat((prevCat) => ({
                    ...prevCat,
                    primaryInfo: { images: images },
                  }));
                }}
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
              <h2 className="my-8 text-2xl">LEDIMISKOHT</h2>
              <h3 className="">MAAKOND</h3>
              <Select name="leidmis_maakond" className="mb-8 mt-2">
                {States.maakonnad.map((maakond: string, idx: number) => {
                  return <MenuItem>{maakond}</MenuItem>;
                })}
              </Select>
              <h3>ASULA</h3>
              <TextField name="leidmis_linn" className="mb-8 mt-2"></TextField>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCatForm;

/*
              <Select name="leidmis_maakond" className="mb-8 mt-2">
                {States.maakonnad.map((maakond: string, idx: number) => {
                  return <MenuItem>{maakond}</MenuItem>;
                })}
              </Select>*/
