import { Profile, ProfileHeader } from "@catshelp/types/src";
import { useAlert } from "@context/alert-context";
import { useIsMobile } from "@context/is-mobile-context";
import { useCatForm } from "@hooks/use-cat-form";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { AccordionDetails, Button, IconButton, TextField, Typography } from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import axios from "axios";
import React, { useState } from "react";
import { uploadImages } from "src/utils/image-utils";
import { BasicInfoFields } from "./form/basic-info-fields";
import { DynamicFormFields } from "./form/dynamic-form-fields";
import { VaccinationFields } from "./form/vaccination-fields";
import ImageGallery from "./image-gallery";


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
    const { showAlert } = useAlert();

    const {
        tempSelectedCat,
        updateField,
        updateMultiSelectField,
        updateDateField
    } = useCatForm(selectedCat);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const updatedAnimalData = { animalId: tempSelectedCat.animalId, title: formData.get('title'), description: formData.get('description') } as ProfileHeader;

        const images: File[] = previews.map((p) => p.file);


        if (e.nativeEvent.submitter.name === "notify-volunteers") {
            formData.append('animalId', tempSelectedCat.animalId.toString());
            formData.append('to', JSON.stringify([import.meta.env.VITE_UPDATE_NOTIFICATION_EMAIL]));
            formData.append('subject', "Uuenda veebi");
            for (let index = 0; index < images.length; index++) {
                const image = images[index];
                formData.append('images', image);
            }
            try {
                await axios.post("/api/notifications/email", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                });

                setTimeout(() => {
                    setIsEditMode(false);
                }, 1500);
                showAlert('Success', "🐈‍⬛ Andmed uuendatud! 🐈‍⬛");
            } catch (e) {
                console.error("Error updating cat profile:", e);
                showAlert('Error', "Andmete uuendamine ebaõnnestus");
            }
            return;
        }

        if (images.length > 0) {
            await uploadImages(images, selectedCat.animalId);
        }

        try {
            await axios.put("/api/animals", updatedAnimalData, {
                withCredentials: true,
            });

            tempSelectedCat.title = updatedAnimalData.title;
            tempSelectedCat.description = updatedAnimalData.description;
            setSelectedCat(tempSelectedCat);
            setTimeout(() => {
                setIsEditMode(false);
            }, 1500);
            showAlert('Success', "🐈‍⬛ Andmed uuendatud! 🐈‍⬛");
        } catch (error) {
            console.error("Error updating cat profile:", error);
            showAlert('Error', "Andmete uuendamine ebaõnnestus");
        }
    };

    return (
        <>
            <form
                className={`flex flex-col ${isMobile ? "flex-col w-full" : ""}`}
                onSubmit={handleSubmit}
            >
                <div className="flex">
                    {isMobile && (
                        <ImageGallery
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
                                    value={tempSelectedCat.title || ""}
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
                                    <KeyboardBackspaceIcon />
                                </IconButton>
                            </div>
                        </div>

                        <div className="mb-16">
                            <h1 className="text-secondary"> LOOMA KIRJELDUS: </h1>
                            <TextField
                                name="description"
                                value={tempSelectedCat.description || ""}
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

                            <div className="flex justify-around mt-8">
                                <Button sx={{ width: "32%" }} variant="contained" name="save-to-db" type="submit">
                                    Salvesta
                                </Button>
                                <Button sx={{ width: "32%" }} variant="contained" name="notify-volunteers" type="submit">
                                    Saada vabatahtlikele teavitus
                                </Button>
                            </div>
                        </div>
                    </div>

                    {!isMobile && (
                        <ImageGallery
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
