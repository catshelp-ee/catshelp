import axios from "axios";
import React, { useState } from "react";
import { TextField, Button, IconButton } from "@mui/material";
import { uploadImages } from "@utils/google-utils";
import ImageGallery from "@pages/cat-profile/image-gallery";
import { useAuth } from "@context/auth-context";
import Popup from "@pages/add-cat/Popup";
import { Cat } from "types/cat";
import { useCatForm } from "@hooks/use-cat-form";
import { BasicInfoFields } from "./form/basic-info-fields";
import { VaccinationFields } from "./form/vaccination-fields";
import { DynamicFormFields } from "./form/dynamic-form-fields";
import { useIsMobile } from "@context/is-mobile-context";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

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

    if(!payload["gender"])
      payload["gender"] = "";

    if(!payload["llr"])
      payload["llr"] = "";

    const user = await getUser();
    payload.owner = {
      name: user.fullName,
      email: user.email,
    };

    const images: File[] = previews.map((p) => p.file);

    if (images.length > 0) {
      uploadImages(images, tempSelectedCat.driveId);
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
    <>
      <form
        className={`flex flex-col ${isMobile ? "flex-col w-full" : ""}`}
        onSubmit={handleSubmit}
      >
        <Popup
          isVisible={isPopupVisible}
          slidingDown={isSlidingDown}
          title="🐈‍⬛ Andmed uuendatud! 🐈‍⬛"
        />

        <div className="flex">
          {isMobile && (
            <ImageGallery
              name="images"
              images={selectedCat?.images || []}
              isEditMode
              previews={previews}
              setPreviews={setPreviews}
            />
          )}

          <div className={`${isMobile ? `mt-16` : "w-2/3"}`}>
            <div className="mb-16">
              <h1 className="text-secondary">PEALKIRI: </h1>
              <div className="flex justify-between">
                <TextField
                  name="title"
                  value={tempSelectedCat.title}
                  onChange={(e) => updateField(e, "title")}
                  sx={{ "& .MuiInputBase-input": { fontWeight: "bold", fontSize: "24px", padding: 0  } }}
                />
                <IconButton
                  onClick={() => setIsEditMode(false)}
                  sx={{
                    width: "96px",
                    backgroundColor: "#007AFF",
                    borderRadius: "8px",
                    color: "#FFF",
                    "&:hover": {
                      backgroundColor: "#3696ff",
                    },
                    
                  }}
                >
                  <KeyboardBackspaceIcon /> {/* default is 24 */}
                </IconButton>
              </div>
            </div>

            <div className="mb-16">
              <h1 className="text-secondary"> LOOMA KIRJELDUS: </h1>
              <TextField
                name="title"
                value={tempSelectedCat.description}
                onChange={(e) => updateField(e, "description")}
                sx={{width: "100%"}}
                multiline
              />
            </div>

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
              images={selectedCat.images}
              isEditMode
              previews={previews}
              setPreviews={setPreviews}
            />
          )}
        </div>

        <Button sx={{width: "50%", margin: "2rem auto"}} variant="contained" type="submit">
          Salvesta
        </Button>
      </form>
    </>
  );
};

export default EditProfile;
