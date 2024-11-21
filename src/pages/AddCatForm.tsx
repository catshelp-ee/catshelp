import {
  Button,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
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

const Procedure: React.FC<ProcedureProps> = ({
  idx,
  removeProcedure,
  setCat,
}) => {
  const [menuItemValue, setMenuItemValue] = useState<string>("");
  return (
    <>
      <Button onClick={() => removeProcedure(idx)}>
        <RemoveIcon />
      </Button>
      <Select
        className="flex-1 truncate"
        defaultValue=""
        onChange={(e) => {
          setMenuItemValue(e.target.value);
        }}
      >
        <MenuItem value="kompleks_vaktsiin">Kompleks-Vaktsiin</MenuItem>
        <MenuItem value="marutaudi_vaktsiin">Marutaudi-Vaktsiin</MenuItem>
        <MenuItem value="ussirohi">Ussirohi</MenuItem>
        <MenuItem value="muu">muu</MenuItem>
      </Select>
      <DatePicker
        onChange={(e) => {
          const day = e.$D;
          const month = e.$M;
          const year = e.$y;
          const date = `${year}-${month}-${day}`;
          setCat((prevCat) => {
            return {
              ...prevCat,
              proceduresValues: {
                ...prevCat.proceduresValues,
                [menuItemValue]: date,
              },
            };
          });
        }}
        className="w-1/3"
        format="DD-MM-YYYY"
      />
    </>
  );
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
    if (!payload.llr) payload.llr = "";
    if (!payload.loigatud) payload.loigatud = "";
    if (payload.loigatud != "") payload.loigatud = payload.loigatud === "true";
    if (payload.llr != "") payload.llr = payload.llr === "true";

    Utils.submitNewCatProfile(payload, pictures);
  };

  const formatChipNumber = (e: any) => {
    const value = e.target.value;

    // Format the input value to xxx-xxx-xxx-xxx pattern
    const formattedValue = Utils.formatInput(value);
    setCat({ ...cat, chipNumber: formattedValue });
  };

  const removeProcedure = (idx: number) => {
    setCat((prevCat) => {
      const procedures = prevCat.procedures;
      delete procedures[idx];
      return {
        ...prevCat,
        procedures: procedures,
      };
    });
  };

  const addProcedure = () => {
    const size = Object.keys(cat.procedures).length;
    setCat({
      ...cat,
      procedures: {
        ...cat.procedures,
        [size + 1]: (
          <Procedure
            idx={size + 1}
            removeProcedure={removeProcedure}
            setCat={setCat}
          />
        ),
      },
    });
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
              Upload files
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
            <TextField
              name="leidmiskoht"
              label="Leidmiskoht"
              variant="outlined"
            />
            <DatePicker name="synniaeg" label="Sünniaeg" format="DD-MM-YYYY" />
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

            <div>
              <InputLabel id="select-karv">Karva Värv</InputLabel>
              <Select
                className="w-full"
                defaultValue=""
                onChange={(e) => {
                  setCat({ ...cat, color: e.target.value });
                }}
                labelId="select-karv"
                name="varv"
              >
                <MenuItem value="must">must</MenuItem>
                <MenuItem value="valge">valge</MenuItem>
                <MenuItem value="kirju">kirju</MenuItem>
                <MenuItem value="muu">muu</MenuItem>
              </Select>
              {cat.color === "muu" && (
                <TextField
                  name="varv"
                  label="Karva Värv"
                  fullWidth
                  margin="normal"
                />
              )}
            </div>
            <div>
              <InputLabel id="select-varv">Karva Pikkus</InputLabel>
              <Select
                className="w-full"
                defaultValue=""
                onChange={(e) => {
                  setCat({ ...cat, coatLength: e.target.value });
                }}
                labelId="select-varv"
                name="karva_pikkus"
              >
                <MenuItem value="pikk">pikk</MenuItem>
                <MenuItem value="lühike">lühike</MenuItem>
                <MenuItem value="pool-pikk">pool-pikk</MenuItem>
                <MenuItem value="muu">muu</MenuItem>
              </Select>
              {cat.coatLength === "muu" && (
                <TextField
                  label="Karva Pikkus"
                  name="karva_pikkus"
                  fullWidth
                  margin="normal"
                />
              )}
            </div>
            <TextField
              name="kiibi_nr"
              label="Kiibi number"
              variant="outlined"
              value={cat.chipNumber}
              onChange={formatChipNumber}
            />
            <FormLabel>Kiip LLR-is MTÜ nimel</FormLabel>
            <RadioGroup name="llr">
              <FormControlLabel value="true" control={<Radio />} label="Jah" />
              <FormControlLabel value="false" control={<Radio />} label="Ei" />
            </RadioGroup>
            <h1 className="text-3xl">PROTSEDUURID</h1>
            {Object.entries(cat.procedures).map(([idx, jsx]) => {
              //console.log(jsx[1]);
              return (
                <div className="flex gap-2" key={idx}>
                  {jsx}
                </div>
              );
            })}
            <Button onClick={addProcedure}>
              <AddIcon />
            </Button>
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
