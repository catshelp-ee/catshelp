import axios from "axios";

export const uploadImages = async (files: File[], driveId: string) => {
  const formData = new FormData();

  // Append each file to the FormData object
  files.forEach((file: File) => {
    formData.append("images", file);
  });
  formData.append("driveId", driveId);
  try {
    const response = await axios.post("/api/pilt/lisa", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    console.log("Upload successful:", response.data);
  } catch (error) {
    console.error("Error uploading files:", error);
  }
};