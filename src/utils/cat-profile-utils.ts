import axios from "axios";
import { resizeImages } from "./image-utils";
import { uploadImages } from "./google-utils";

export const submitNewCatProfile = async (data: any, pictures: File[]) => {
  const folder = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/animals`,
    data,
    {
      withCredentials: true,
    }
  );

  const resizedImages = await resizeImages(pictures);
  uploadImages(resizedImages, folder.data);
};