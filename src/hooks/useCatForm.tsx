import { useState, useEffect } from "react";
import { Cat } from "@models/Cat.ts";

export const useCatForm = (selectedCat: Cat) => {
  const [tempSelectedCat, setTempSelectedCat] = useState<Cat>({
    ...selectedCat,
  });
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isSlidingDown, setSlidingDown] = useState(false);

  useEffect(() => {
    setTempSelectedCat({ ...selectedCat });
  }, [selectedCat]);

  const updateField = (e: any, key: string) => {
    const value = e.target.value;
    setTempSelectedCat((prev: any) => ({ ...prev, [key]: value }));
  };

  const updateFieldMultiselect = (e: any, key: string) => {
    let value = e.target.value;
    if (key !== "Other" && value[0] === "Other") value = [value[1]];
    setTempSelectedCat((prev: any) => {
      if (value[value.length - 1] === "Other")
        return { ...prev, [key]: ["Other"] };
      return { ...prev, [key]: value };
    });
  };

  return {
    tempSelectedCat,
    setTempSelectedCat,
    isPopupVisible,
    setPopupVisible,
    isSlidingDown,
    setSlidingDown,
    updateField,
    updateFieldMultiselect,
  };
};
