import React from "react";
import {
  TextField,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { Cat } from "@models/Cat.ts";
import {
  FORM_FIELDS,
  MULTISELECT_FIELD_VALUES,
  FIELD_VALUES,
} from "./FormData";

interface DynamicFormFieldsProps {
  tempSelectedCat: Cat;
  updateField: (e: any, key: string) => void;
  updateFieldMultiselect: (e: any, key: string) => void;
}

export const DynamicFormFields: React.FC<DynamicFormFieldsProps> = ({
  tempSelectedCat,
  updateField,
  updateFieldMultiselect,
}) => (
  <>
    {Object.entries(FORM_FIELDS).map(([key, label], index) => {
      if (key in MULTISELECT_FIELD_VALUES) {
        return (
          <FormControl key={index}>
            <FormLabel>{label}</FormLabel>
            <Select
              name={key}
              multiple
              value={tempSelectedCat[key as keyof Cat]}
              onChange={(e) => updateFieldMultiselect(e, key)}
              MenuProps={{ PaperProps: { style: { maxHeight: 500 } } }}
            >
              {MULTISELECT_FIELD_VALUES[key].map((val, idx) => (
                <MenuItem key={idx} value={val}>
                  {val !== "Other" ? (
                    <>
                      <Checkbox
                        checked={
                          tempSelectedCat[key as keyof Cat]!.indexOf(val) > -1
                        }
                      />
                      <ListItemText primary={val} />
                    </>
                  ) : (
                    <ListItemText primary="Other" />
                  )}
                </MenuItem>
              ))}
            </Select>
            {tempSelectedCat[key as keyof Cat][0] === "Other" && (
              <TextField name={key} />
            )}
          </FormControl>
        );
      } else if (key in FIELD_VALUES) {
        return (
          <FormControl key={index}>
            <FormLabel>{label}</FormLabel>
            <Select
              name={key}
              value={tempSelectedCat[key as keyof Cat]}
              onChange={(e) => updateField(e, key)}
              MenuProps={{ PaperProps: { style: { maxHeight: 500 } } }}
            >
              {FIELD_VALUES[key].map((val, idx) => (
                <MenuItem key={idx} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
            {tempSelectedCat[key as keyof Cat] === "Other" && (
              <TextField name={key} />
            )}
          </FormControl>
        );
      }
      return (
        <TextField
          key={index}
          label={label}
          value={tempSelectedCat[key as keyof Cat]}
          onChange={(e) => updateField(e, key)}
          name={key}
          variant="standard"
        />
      );
    })}
  </>
);
