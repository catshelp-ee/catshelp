import { fieldLabels, Profile } from "@catshelp/types/src";
import {
    Checkbox,
    FormControl,
    FormLabel,
    ListItemText,
    MenuItem,
    TextField
} from "@mui/material";
import React from "react";
import {
    FIELD_VALUES,
    MULTISELECT_FIELD_VALUES
} from "./form-data";
import ResponsiveMultiSelect from "./responsive-multi-select";

interface DynamicFormFieldsProps {
    tempSelectedCat: Profile;
    updateField: (e: any, key: string) => void;
    updateMultiSelectField: (e: any, key: string) => void;
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
    updateMultiSelectField,
    isMobile,
}) => {
    const renderMultiselect = () => {
        return Object.entries(tempSelectedCat.characteristics.multiselectFields).map(([label, value], index) => {
            if (!(label in fieldLabels.et)) {
                return;
            }
            return (
                <FormControl key={index}>
                    <FormLabel>{fieldLabels.et[label]}</FormLabel>
                    <ResponsiveMultiSelect
                        name={`characteristics.multiselectFields.${label}`}
                        multiple
                        value={value}
                        disabled
                        onChange={(e) => updateMultiSelectField(e, `characteristics.multiselectFields.${label}`)}
                        renderValue={(selected: string[]) => (
                            <div className="flex flex-wrap whitespace-normal break-words">
                                {selected.join(', ')}
                            </div>
                        )}
                    >
                        {MULTISELECT_FIELD_VALUES[label].map((val, idx) => {
                            return (
                                <MenuItem key={idx} value={val}>
                                    <Checkbox
                                        checked={
                                            tempSelectedCat.characteristics.multiselectFields[label].indexOf(val) > -1
                                        }
                                    />
                                    <ListItemText primary={val} />
                                </MenuItem>
                            )
                        }
                        )}
                    </ResponsiveMultiSelect>
                </FormControl>
            )
        })
    }

    const renderSelectFields = () => {
        return Object.entries(tempSelectedCat.characteristics.selectFields).map(([label, value], index) => {
            if (!(label in fieldLabels.et)) {
                return;
            }
            return (
                <FormControl key={index}>
                    <FormLabel>{fieldLabels.et[label]}</FormLabel>
                    <ResponsiveMultiSelect
                        name={`characteristics.selectFields.${label}`}
                        value={value}
                        disabled
                        onChange={(e) => updateField(e, `characteristics.selectFields.${label}`)}
                    >
                        {FIELD_VALUES[label].map((val, idx) => (
                            <MenuItem key={idx} value={val}>
                                {val}
                            </MenuItem>
                        ))}
                    </ResponsiveMultiSelect>
                </FormControl>
            );
        })
    }

    const renderTextFields = () => {
        return Object.entries(tempSelectedCat.characteristics.textFields).map(([label, value], index) => {
            if (!(label in fieldLabels.et)) {
                return;
            }
            return (
                <div key={index}>
                    <FormLabel className="block text-sm font-medium mb-1 break-words whitespace-normal">
                        {fieldLabels.et[label]}
                    </FormLabel>
                    <TextField
                        value={value}
                        disabled
                        onChange={(e) => updateField(e, `characteristics.textFields.${label}`)}
                        name={`characteristics.textFields.${label}`}
                        fullWidth
                    />
                </div>
            );
        })
    }

    return (
        <>
            {renderTextFields()}
            {renderMultiselect()}
            {renderSelectFields()}
        </>
    );
}
