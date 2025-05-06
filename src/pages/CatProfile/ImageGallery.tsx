import React from "react";
import { Dialog } from "@mui/material";

interface ImageGalleryProps {
  images: string[];
  open: boolean;
  onClose: () => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <div className="flex flex-wrap justify-center gap-6 md:gap-8 p-6">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Gallery image ${index + 1}`}
            className="w-3/4 md:w-1/3 object-cover rounded-lg"
          />
        ))}
      </div>
    </Dialog>
  );
};

export default ImageGallery;
