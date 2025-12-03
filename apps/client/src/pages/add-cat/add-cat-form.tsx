import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
    Autocomplete,
    Button,
    ImageList,
    ImageListItem,
    TextField
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useAlert } from "@context/alert-context";
import States from "./states.json";
import React, { useEffect, useState } from "react";
import { resizeImages, uploadImages } from "src/utils/image-utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/auth-context";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
});

const AddCatForm = () => {
    const [images, setImages] = useState<File[]>([]);
    const { showAlert } = useAlert();
    const { getUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserRights = async () => {
            try {
                const user = await getUser();
                if (user.role !== 'ADMIN') {
                    showAlert('Error', "Sul pole privileege, et kuva näha");
                    navigate(`/dashboard`);
                }
            } catch (error) {
                showAlert('Error', "Sul pole privileege, et kuva näha");
                navigate(`/dashboard`);
            }
        }
        checkUserRights();
    }, []);


    const submitNewCatProfile = async (data: any, pictures: File[]) => {
        const newAnimalId: number = (
            await axios.post('/api/animals', data, {
                withCredentials: true,
            })
        ).data;

        const resizedImages = await resizeImages(pictures);
        uploadImages(resizedImages, newAnimalId);
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        const data = {
            notes: formData.get("notes"),
            location: formData.get("location"),
            state: formData.get("state"),
        };

        try {
            await submitNewCatProfile(data, images);
            showAlert('Success', "🐈‍⬛ Kiisuke lisatud! 🐈‍⬛");
        } catch (error) {
            showAlert('Error', "Kassi lisamine ebaõnnestus");
        }
    };
    //Pildid ei salvestu korrektselt hetkel.
    return (
        <div className="md:mx-12">
            <div className="flex flex-col">
                <h1 className="text-6xl my-4">Lisa uus kass</h1>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col w-full gap-4 mb-28"
                >
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                    >
                        Lae üles pildid
                        <VisuallyHiddenInput
                            required
                            name="images"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImages(Array.from(e.target.files ?? []))}
                            multiple
                        />
                    </Button>
                    <ImageList cols={3}>
                        {images.map((image, index) => (
                            <ImageListItem key={index} className="relative">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={`preview-${index}`}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImages((prev) => prev.filter((_, i) => i !== index));
                                    }}
                                    className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-opacity-80"
                                >
                                    ×
                                </button>
                            </ImageListItem>
                        ))}
                    </ImageList>

                    <TextField
                        name="notes"
                        label="Lisainfo"
                        multiline
                        maxRows={4}
                        variant="outlined"
                    />
                    <Autocomplete
                        disablePortal
                        options={States.maakonnad}
                        renderInput={(params) => (
                            <TextField name="state" {...params} label="Maakond" />
                        )}
                    />
                    <TextField name="location" label="Asula" multiline maxRows={4} />


                    <div className="flex flex-row items-center justify-center gap-2">
                        <Button
                            sx={{
                                width: "300px",
                            }}
                            type="submit"
                            variant="outlined"
                        >
                            Kinnita
                        </Button>
                    </div>

                </form>
            </div >
        </div >
    );
};

export default AddCatForm;
