import axios from "axios";

export const uploadImages = async (files: File[], catName: string) => {
  const formData = new FormData();

  // Append each file to the FormData object
  files.forEach((file: File) => {
    formData.append("images", file);
  });
  formData.append("catName", catName);
  try {
    const response = await axios.post(`/api/pilt/lisa`, formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
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
  const catID = await axios.post(`/api/animals`, formData, 
    {
      withCredentials:true,
    }
  );
  uploadImages(pictures, catID.data.split(" ").pop());
};
