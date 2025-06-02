import axios from "axios";
import React, { useState } from "react";
import { TextField } from "@mui/material";
import * as Utils from "@utils/utils.ts";
import ImageGallery from "@pages/CatProfile/ImageGallery.tsx";
import { useAuth } from "@/context/AuthContext";
import Popup from "@pages/AddCat/Popup";
import { Cat } from "@models/Cat";
import { useCatForm } from "@hooks/useCatForm";
import { BasicInfoFields } from "./Form/BasicInfoFields";
import { VaccinationFields } from "./Form/VaccinationFields";
import { DynamicFormFields } from "./Form/DynamicFormFields";
import { ActionButtons } from "./Form/ActionButtons";
import { Section } from "./Form/Section";
import { useIsMobile } from "@/hooks/isMobile";

interface CatDetailsProps {
  selectedCat: Cat;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCat: React.Dispatch<React.SetStateAction<Cat>>;
}

interface PreviewImage {
  file: File;
  preview: string;
  id: string;
}

const EditProfile: React.FC<CatDetailsProps> = ({
  selectedCat,
  setIsEditMode,
  setSelectedCat,
}) => {
  const { getUser } = useAuth();
  const [previews, setPreviews] = useState<PreviewImage[]>([]);
  const isMobile = useIsMobile();

  const {
    tempSelectedCat,
    isPopupVisible,
    isSlidingDown,
    setPopupVisible,
    setSlidingDown,
    updateField,
    updateFieldMultiselect,
  } = useCatForm(selectedCat);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPopupVisible) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData);

    const user = await getUser();
    payload.owner = {
      name: user.fullName,
      email: user.email,
    };

    const images: File[] = previews.map((p) => p.file);

    if (images.length > 0) {
      Utils.uploadImages(images, tempSelectedCat.driveId);
    }

    try {
      const response = await axios.put("/api/animals/cat-profile", payload, {
        withCredentials: true,
      });

      setSelectedCat(tempSelectedCat);
      setSlidingDown(true);
      setPopupVisible(true);
      setTimeout(() => {
        setIsEditMode(false);
      }, 1500);
    } catch (error) {
      console.error("Error updating cat profile:", error);
    }
  };

  return (
    <form
      className={`flex ${
        isMobile ? "flex-col w-full p-4" : "mr-3 my-4 border-2 rounded-lg p-4"
      }`}
      onSubmit={handleSubmit}
    >
      <Popup
        isVisible={isPopupVisible}
        slidingDown={isSlidingDown}
        title="🐈‍⬛ Andmed uuendatud! 🐈‍⬛"
      />

      {isMobile && (
        <ImageGallery
          name="images"
          images={selectedCat?.images || []}
          isEditMode={true}
          isMobile={isMobile}
          previews={previews}
          setPreviews={setPreviews}
        />
      )}

      <div className={`${isMobile ? `mt-16` : "w-2/3"}`}>
        <Section title="PEALKIRI:">
          <TextField
            name="title"
            value={tempSelectedCat.title}
            onChange={(e) => updateField(e, "title")}
            sx={{ "& .MuiInputBase-input": { fontWeight: "bold" } }}
          />
        </Section>

        <Section title="LOOMA KIRJELDUS:">
          <TextField
            name="description"
            multiline
            value={tempSelectedCat?.description}
            onChange={(e) => updateField(e, "description")}
            sx={{ textAlign: "justify", width: "100%" }}
          />
        </Section>

        <div className="flex flex-col gap-4">
          <BasicInfoFields
            isMobile={isMobile}
            tempSelectedCat={tempSelectedCat}
            updateField={updateField}
          />

          <VaccinationFields
            tempSelectedCat={tempSelectedCat}
            updateField={updateField}
          />

          <DynamicFormFields
            tempSelectedCat={tempSelectedCat}
            isMobile={isMobile}
            updateField={updateField}
            updateFieldMultiselect={updateFieldMultiselect}
          />
        </div>
      </div>

      {!isMobile && (
        <ImageGallery
          name="images"
          images={selectedCat?.images || []}
          isEditMode={true}
          previews={previews}
          setPreviews={setPreviews}
        />
      )}
      <ActionButtons />
    </form>
  );
};

export default EditProfile;
