import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
    Dialog,
    Button,
    IconButton,
    ImageList,
    ImageListItem,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useIsMobile } from "@context/is-mobile-context";

interface ImageGalleryProps {
    name?: string;
    images: string[];
    isEditMode?: boolean;
    previews?: PreviewImage[];
    setPreviews?: React.Dispatch<React.SetStateAction<PreviewImage[]>>;
}

interface PreviewImage {
    file: File;
    preview: string;
    id: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
    name,
    images,
    isEditMode = false,
    previews,
    setPreviews,
}) => {
    const isMobile = useIsMobile();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newPreviews = acceptedFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            id: Math.random().toString(36).substring(2, 9),
        }));
        setPreviews((prev) => [...prev, ...newPreviews]);
    }, []);

    const removeImage = (id: string) => {
        setPreviews((prev) => prev.filter((img) => img.id !== id));
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: true,
    });

    const renderPreview = () => (
        <ImageList cols={1} sx={{ height: '100%', overflowY: 'auto' }}>
            {previews.map((img, index) => (
                <ImageListItem key={index} className="relative">
                    <img
                        className="p-4 rounded !object-fill"
                        srcSet={img.preview}
                        src={img.preview}
                        loading="lazy"
                    />
                    <CloseIcon
                        fontSize="small"
                        className="absolute top-1 right-1 bg-white/80 rounded-full p-1 cursor-pointer hover:bg-white"
                        onClick={(e) => {
                            e.stopPropagation();
                            setPreviews((prev) => prev.filter((_, i) => i !== index));
                        }}
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );

    const renderUploadPrompt = () => (
        <div className="flex flex-col items-center justify-center gap-2 text-center px-4">
            <img src="/upload.png" width="72" alt="Upload Icon" />
            <p>Lisamiseks lohista pilt siia</p>
            <p>või</p>
            <Button
                sx={{
                    backgroundColor: "#007AFF",
                    fontSize: "13px",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    textTransform: "none",
                }}
                variant="contained"
            >
                Otsi arvutist
            </Button>
        </div>
    );

    return (
        <div className={`${isMobile ? "w-full mt-8" : "w-1/3"}`}>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                <div className="flex flex-col items-center">
                    {images.length > 0 && (
                        <button onClick={() => setIsOpen(true)} className={`w-64 h-64 mb-4`}>
                            <img src={`/images/${images[0]}`} className="w-full h-full rounded-2xl" />
                        </button>
                    )}
                    {images.length > 1 && (
                        <button className={`relative w-64 h-64 mb-4`} onClick={() => setIsOpen(true)}>
                            <img className={`w-full h-full rounded-2xl opacity-50`} src={`/images/${images[0]}`} alt="More images" />
                            <div className="absolute inset-0 text-xl flex items-center justify-center font-bold">
                                +{images.length - 1} Pilti
                            </div>
                        </button>
                    )}

                    {isEditMode && (
                        <div
                            {...getRootProps()}
                            className={`w-64 h-64 border-2 border-black rounded-2xl flex items-center justify-center cursor-pointer bg-white relative overflow-hidden`}
                        >
                            <input {...getInputProps({ name })} />
                            {previews.length > 0 ? renderPreview() : renderUploadPrompt()}
                        </div>
                    )}
                </div>
            </div>

            <Dialog PaperProps={{
                sx: {
                    borderRadius: "16px",
                    maxWidth: '50vw', // 50% of the viewport width
                    width: '100%',     // ensures it uses the full allowed width
                },
            }}
                open={isOpen} onClose={() => setIsOpen(false)}>
                <div className="w-full p-10">
                    <div className="w-full flex justify-between items-center mb-4">
                        <Typography variant="h4" > {name} hetkede varakamber ✨</Typography>
                        <IconButton onClick={() => setIsOpen(false)} sx={{}}>
                            <CloseIcon />
                        </IconButton>
                    </div>

                    <ImageList cols={5} gap={8}>
                        {images.map((image, index) => (
                            <ImageListItem key={index}>
                                <img className="rounded" srcSet={`/images/${image}`} src={`/images/${image}`} loading="lazy" />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </div>
            </Dialog>
        </div>
    );
};

export default ImageGallery;
