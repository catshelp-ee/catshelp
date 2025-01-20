import {
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import * as Utils from "../utils.ts";
import React, { useState } from "react";
import { Cat } from "../types.ts";
import dayjs from "dayjs";
import Header from "./Header.tsx";

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

type ProcedureProps = {
  idx: number;
  removeProcedure: (idx: number) => void;
  setCat: React.Dispatch<React.SetStateAction<Cat>>;
};

const AddCatForm = () => {
  const [cat, setCat] = useState<Cat>({
    foundDate: new Date(),
    procedures: {},
    proceduresValues: {},
  });

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
                multiple
              />
            </Button>
            <DatePicker
              name="leidmis_kp"
              label="Leidmiskuupäev"
              format="DD-MM-YYYY"
              defaultValue={dayjs(cat.foundDate)}
            />
            <TextField name="nimi" label="Nimi" variant="outlined" />
            <div className="flex flex-col">
              <h2 className="my-8 text-2xl">LEDIMISKOHT</h2>
              <h3 className="">MAAKOND</h3>
              <Select name="leidmis_maakond" className="mb-8 mt-2"></Select>
              <h3>LINN</h3>
              <Select name="leidmis_linn" className="mb-8 mt-2"></Select>
            </div>
            <span className="flex place-content-between">
              <div>
                <FormLabel>Sugu</FormLabel>
                <RadioGroup name="sugu" defaultValue={""}>
                  <FormControlLabel
                    value="emane"
                    control={<Radio />}
                    label="Emane"
                  />
                  <FormControlLabel
                    value="isane"
                    control={<Radio />}
                    label="Isane"
                  />
                </RadioGroup>
              </div>

              <div>
                <FormLabel>Kastreeritud/Steriliseeritud</FormLabel>
                <RadioGroup name="loigatud" defaultValue={""}>
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Jah"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="Ei"
                  />
                </RadioGroup>
              </div>
            </span>
            <TextField
              name="lisa"
              label="Lisainfo"
              multiline
              minRows={4}
              variant="outlined"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCatForm;
