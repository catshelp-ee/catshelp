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

const resizeImage = (file, width, height) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0, width, height);

        // Force output as JPEG with quality 0.8 (adjust as needed)
        canvas.toBlob(blob => {
          if (blob) {
            const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const newFileName = `${baseName}_${width}x${height}.jpg`; // always .jpg

            const resizedFile = new File([blob], newFileName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            resolve(resizedFile);
          } else {
            reject(new Error('Canvas is empty'));
          }
        }, 'image/jpeg', 0.8); // quality: 0.8 is a good balance
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


const resizeImages = async (images: File[]): Promise<File[]> => {
  const allResizePromises = images.flatMap(image => [
    resizeImage(image, 64, 64),
    resizeImage(image, 256, 256),
  ]);

  // Wait for all resized files
  const resizedImages = await Promise.all(allResizePromises);

  // `resizedImages` is a flat array of resized File objects
  return resizedImages;
}

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
