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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import * as Utils from "../utils.ts";
import React, { useState } from "react";
import { Cat } from "../types.ts";
import dayjs from "dayjs";

type ProcedureProps = {
  idx: number;
  removeProcedure: (idx: number) => void;
};

const Procedure: React.FC<ProcedureProps> = ({ idx, removeProcedure }) => {
  const [menuItemValue, setMenuItemValue] = useState<string>("");
  return (
    <div className="flex gap-2">
      <Button onClick={() => removeProcedure(idx)}>
        <RemoveIcon />
      </Button>
      <Select
        className="flex-1"
        defaultValue=""
        onChange={(e) => {
          setMenuItemValue(e.target.value);
        }}
      >
        <MenuItem value="Kompleks_vaktsiin">Kompleks-Vaktsiin</MenuItem>
        <MenuItem value="Marutaudi_vaktsiin">Marutaudi-Vaktsiin</MenuItem>
        <MenuItem value="Ussirohi">Ussirohi</MenuItem>
        <MenuItem value="Muu">muu</MenuItem>
      </Select>
      <DatePicker className="w-1/3" name={menuItemValue} format="DD-MM-YYYY" />
    </div>
  );
};

const AddCatForm = () => {
  const [cat, setCat] = useState<Cat>({
    foundDate: new Date(),
    procedures: {},
  });

  const submitForm = (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    const pictures: File[] = formData.getAll("pildid") as File[];

    console.log(payload);

    //Utils.submitNewCatProfile(payload, pictures);
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
          <Procedure idx={size + 1} removeProcedure={removeProcedure} />
        ),
      },
    });
  };

  return (
    <div className="h-screen">
      <div className="flex flex-col mt-24 h-2/3 overflow-scroll items-center">
        <h1 className="text-5xl">Lisa uus kass</h1>
        <form
          onSubmit={submitForm}
          className="createForm flex w-full flex-col gap-6 mt-12 mb-24"
        >
          <Button
            sx={{
              width: "300px",
              position: "fixed",
              bottom: "64px",
              left: "50%",
              transform: "translate(-50%, 0)",
            }}
            type="submit"
            variant="outlined"
          >
            kinnita
          </Button>

          <FormLabel sx={{ fontSize: "2rem", color: "#000" }}>
            Lisa pilte kassist
          </FormLabel>
          <input type="file" name="pildid" accept="image/*" multiple />
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
              <RadioGroup name="sugu">
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
              <RadioGroup name="loigatud">
                <FormControlLabel value="jah" control={<Radio />} label="Jah" />
                <FormControlLabel value="ei" control={<Radio />} label="Ei" />
              </RadioGroup>
            </div>
          </span>

          <div>
            <InputLabel id="select-karv">Karva Pikkus</InputLabel>
            <Select
              className="w-full"
              defaultValue=""
              onChange={(e) => {
                setCat({ ...cat, color: e.target.value });
              }}
              labelId="select-karv"
              name="karva_pikkus"
            >
              <MenuItem value="pikk">pikk</MenuItem>
              <MenuItem value="lühike">lühike</MenuItem>
              <MenuItem value="pool-pikk">pool-pikk</MenuItem>
              <MenuItem value="muu">muu</MenuItem>
            </Select>
            {cat.color === "muu" && (
              <TextField
                name="karva_pikkus"
                label="Karva Pikkus"
                fullWidth
                margin="normal"
              />
            )}
          </div>
          <div>
            <InputLabel id="select-varv">Värv</InputLabel>
            <Select
              className="w-full"
              defaultValue=""
              onChange={(e) => {
                setCat({ ...cat, coatLength: e.target.value });
              }}
              labelId="select-varv"
              name="varv"
            >
              <MenuItem value="must">must</MenuItem>
              <MenuItem value="valge">valge</MenuItem>
              <MenuItem value="kirju">kirju</MenuItem>
              <MenuItem value="muu">muu</MenuItem>
            </Select>
            {cat.coatLength === "muu" && (
              <TextField label="Värv" name="varv" fullWidth margin="normal" />
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
            <FormControlLabel value="jah" control={<Radio />} label="Jah" />
            <FormControlLabel value="ei" control={<Radio />} label="Ei" />
          </RadioGroup>
          <h1 className="text-3xl">PROTSEDUURID</h1>
          {Object.entries(cat.procedures).map(([, jsx]) => {
            //console.log(jsx[1]);
            return jsx;
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
  );
};

export default AddCatForm;
