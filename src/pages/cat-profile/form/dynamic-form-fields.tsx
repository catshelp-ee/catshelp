import React from "react";
import {
  TextField,
  FormControl,
  FormLabel,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { Cat } from "types/cat";
import {
  FORM_FIELDS,
  MULTISELECT_FIELD_VALUES,
  FIELD_VALUES,
} from "./form-data";
import ResponsiveMultiSelect from "./responsive-multi-select";

interface DynamicFormFieldsProps {
  tempSelectedCat: Cat;
  updateField: (e: any, key: string) => void;
  updateFieldMultiselect: (e: any, key: string) => void;
  isMobile: boolean;
}

const wrappingStyle = {
  shrink: true,
  sx: {
    whiteSpace: "normal",
    overflowWrap: "break-word",
    maxWidth: "100%", // or set to a specific width
  },
};

export const DynamicFormFields: React.FC<DynamicFormFieldsProps> = ({
  tempSelectedCat,
  updateField,
  updateFieldMultiselect,
  isMobile,
}) => (
  <>
    {Object.entries(FORM_FIELDS).map(([key, label], index) => {
      if (key in MULTISELECT_FIELD_VALUES) {
        return (
          <FormControl key={index}>
            <FormLabel>{label}</FormLabel>
            <ResponsiveMultiSelect
              name={key}
              multiple
              value={tempSelectedCat[key as keyof Cat]}
              onChange={(e) => updateFieldMultiselect(e, key)}
              renderValue={(selected) => (
                <div className="flex flex-wrap whitespace-normal break-words">
                  {selected.join(', ')}
                </div>
              )}  
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
            </ResponsiveMultiSelect>
          </FormControl>
        );
      } else if (key in FIELD_VALUES) {
        return (
          <FormControl key={index}>
            <FormLabel>{label}</FormLabel>
            <ResponsiveMultiSelect
              name={key}
              value={tempSelectedCat[key as keyof Cat]}
              onChange={(e) => updateField(e, key)}
            >
              {FIELD_VALUES[key].map((val, idx) => (
                <MenuItem key={idx} value={val}>
                  {val}
                </MenuItem>
              ))}
            </ResponsiveMultiSelect>
          </FormControl>
        );
      }
      return (
        <div key={index}>
          <FormLabel className="block text-sm font-medium mb-1 break-words whitespace-normal">
            {label}
          </FormLabel>
          <TextField
            value={tempSelectedCat[key as keyof Cat]}
            onChange={(e) => updateField(e, key)}
            name={key}
            fullWidth
          />
        </div>
      );
    })}
  </>
);
