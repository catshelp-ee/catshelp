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

const createFolder = async (folderName: string) => {
  console.log(folderName);
  const folder = await axios.post(
    "/api/create_folder",
    { folderName },
    {
      withCredentials: true,
    }
  );
  return folder.data;
};

export const submitNewCatProfile = async (data: any, pictures: File[]) => {
  const folder = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/animals`,
    data,
    {
      withCredentials: true,
    }
  );
  uploadImages(pictures, folder.data);
};
