import axios from "axios";

export const uploadImages = async (files: File[], catName: string) => {
  const formData = new FormData();

  // Append each file to the FormData object
  files.forEach((file: File) => {
    formData.append("images", file);
  });
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/pilt/lisa`,
      formData,
      {
        headers: {
          "Cat-Name": catName,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Upload successful:", response.data);
  } catch (error) {
    console.error("Error uploading files:", error);
  }
};

export const submitNewCatProfile = async (
  formData: {
    [k: string]: FormDataEntryValue;
  },
  pictures: File[]
) => {
  const catID = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/animals`,
    formData
  );
  uploadImages(pictures, catID.data.split(" ").pop());
};
