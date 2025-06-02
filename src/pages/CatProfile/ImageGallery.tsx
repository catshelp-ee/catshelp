import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ImageGalleryProps {
  name?: string;
  images: string[];
  isEditMode?: boolean;
  previews?: PreviewImage[];
  setPreviews?: React.Dispatch<React.SetStateAction<PreviewImage[]>>;
  isMobile?: boolean;
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
  isMobile,
}) => {
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
    <div className="flex flex-wrap gap-2 p-2">
      {previews.map((img) => (
        <div
          key={img.id}
          className="relative w-24 h-24 border rounded overflow-hidden"
        >
          <img
            src={img.preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeImage(img.id);
            }}
            className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-bl px-1"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>
      ))}
    </div>
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
          <button
            onClick={() => setIsOpen(true)}
            className={`rounded-2xl ${
              isMobile ? "max-w-52 h-52" : "max-w-72 h-72"
            } rounded-full mb-4`}
          >
            <img src={images[0]} className="h-full rounded-2xl" />
          </button>
          <button
            className={`relative ${
              isMobile ? "max-w-52 h-52" : "max-w-72 h-72"
            } rounded-2xl mb-4`}
            onClick={() => setIsOpen(true)}
          >
            <img
              className={`opacity-50 h-full rounded-2xl`}
              src={images[0]}
              alt="More images"
            />
            <div className="absolute inset-0 flex items-center justify-center font-bold">
              +{images.length - 1} pilti
            </div>
          </button>

          {isEditMode && (
            <div
              {...getRootProps()}
              className={`${
                isMobile ? "max-w-52 h-52" : "max-w-72 h-72"
              } border-2 border-black rounded-2xl flex items-center justify-center cursor-pointer bg-white relative overflow-hidden`}
            >
              <input {...getInputProps({ name })} />
              {previews.length > 0 ? renderPreview() : renderUploadPrompt()}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="w-full p-4">
          <div className="w-full flex justify-end mb-4">
            <IconButton onClick={() => setIsOpen(false)} sx={{}}>
              <CloseIcon />
            </IconButton>
          </div>

          <ImageList cols={3}>
            {images.map((image, index) => (
              <ImageListItem key={index}>
                <img srcSet={image} src={image} loading="lazy" />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      </Dialog>
    </div>
  );
};

export default ImageGallery;
