import Popup from "@components/popup";
import { useAuth } from "@context/auth-context";
import { useIsMobile } from "@context/is-mobile-context";
import { useCatForm } from "@hooks/use-cat-form";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { AccordionDetails, Button, IconButton, TextField, Typography } from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ImageGallery from "@pages/cat-profile/image-gallery";
import { uploadImages } from "@utils/google-utils";
import React, { useState } from "react";
import { Profile } from "types/cat";
import { BasicInfoFields } from "./form/basic-info-fields";
import { DynamicFormFields } from "./form/dynamic-form-fields";
import { VaccinationFields } from "./form/vaccination-fields";


interface CatDetailsProps {
  selectedCat: Profile;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCat: React.Dispatch<React.SetStateAction<Profile>>;
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
  const [previews, setPreviews] = useState<PreviewImage[]>([]);
  const isMobile = useIsMobile();

  const {
    tempSelectedCat,
    isPopupVisible,
    isSlidingDown,
    setPopupVisible,
    setSlidingDown,
    updateField,
    updateMultiSelectField,
    updateDateField
  } = useCatForm(selectedCat);

  const { getUser } = useAuth();

  function parseDotNotationFormData(formData: FormData) {
    const obj = {} as Profile;

    for (const [key, value] of formData.entries()) {
      const keys = key.split('.'); // split by dots
      let current = obj;

      keys.forEach((part, index) => {
        // If it's the last key, assign the value
        if (index === keys.length - 1) {
          current[part] = value;
        } else {
          // If this key doesn't exist yet, create an empty object
          if (!current[part]) current[part] = {};
          current = current[part];
        }
      });
    }

    return obj;
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPopupVisible) {
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const updatedAnimalData = parseDotNotationFormData(formData);

    const images: File[] = previews.map((p) => p.file);
    const user = await getUser();


    if (images.length > 0) {
      uploadImages(images, user.id);
    }

    /*
    try {
      await axios.put("/api/animals/cat-profile", updatedAnimalData, {
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
      */
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
                  sx={{ "& .MuiInputBase-input": { fontWeight: "bold", fontSize: "24px", padding: 0 } }}
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
                name="description"
                value={tempSelectedCat.description}
                onChange={(e) => updateField(e, "description")}
                sx={{ width: "100%" }}
                multiline
              />
            </div>

            <div className="flex flex-col gap-4">
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography>Põhiandmed</Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ display: 'flex', flexDirection: 'column' }}>

                  <BasicInfoFields
                    isMobile={isMobile}
                    tempSelectedCat={tempSelectedCat}
                    updateField={updateField}
                    updateDateField={updateDateField}
                  />

                  <VaccinationFields
                    tempSelectedCat={tempSelectedCat}
                    updateField={updateField}
                    updateDateField={updateDateField}
                  />
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography>Iseloom</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ display: 'flex', flexDirection: 'column' }}>

                  <DynamicFormFields
                    tempSelectedCat={tempSelectedCat}
                    isMobile={isMobile}
                    updateField={updateField}
                    updateMultiSelectField={updateMultiSelectField}
                  />
                </AccordionDetails>
              </Accordion>
              <Button sx={{ width: "50%", margin: "2rem auto" }} variant="contained" type="submit">
                Salvesta
              </Button>
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
      </form>
    </>
  );
};

export default EditProfile;
