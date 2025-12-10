import { Profile } from "@catshelp/types/src";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

export const useCatForm = (selectedCat: Profile) => {
    const [tempSelectedCat, setTempSelectedCat] = useState<Profile>({
        ...selectedCat,
    });

    useEffect(() => {
        setTempSelectedCat({ ...selectedCat });
    }, [selectedCat]);

    const updateNestedField = (key: string, value: any) => {
        setTempSelectedCat((prev: any) => {
            const keys = key.split('.');
            const updated = { ...prev };
            let current = updated;

            for (let i = 0; i < keys.length - 1; i++) {
                const k = keys[i];
                current[k] = { ...current[k] }; // preserve immutability
                current = current[k];
            }

            current[keys[keys.length - 1]] = value;
            return updated;
        });
    };

    // Generic field handler
    const updateField = (e: any, key: string) => {
        const value = e.target.value;
        updateNestedField(key, value);
    };

    // For DatePicker
    const updateDateField = (newDate: Dayjs, key: string) => {
        updateNestedField(key, newDate.toISOString());
    };

    // For Multiselect
    const updateMultiSelectField = (e: any, key: string) => {
        const value = e.target.value;
        const finalValue = value[value.length - 1] === "Other" ? ["Other"] : value;
        updateNestedField(key, finalValue);
    };


    return {
        tempSelectedCat,
        setTempSelectedCat,
        updateField,
        updateMultiSelectField,
        updateDateField,
    };
};
