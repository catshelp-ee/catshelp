import axios from 'axios';
import { resizeImages } from './image-utils';

export const uploadImages = async (
  files: File[],
  userEmail: string,
  animalName: string
) => {
  const resizedImages = await resizeImages(files);
  const formData = new FormData();

  // Append each file to the FormData object
  resizedImages.forEach((file: File) => {
    formData.append('images', file);
  });
  formData.append('userEmail', userEmail);
  formData.append('animalName', animalName);
  try {
    await axios.post('/api/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
  } catch (error) {
    console.error('Error uploading files:', error);
  }
};
