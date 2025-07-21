import axios from 'axios';
import { resizeImages } from './image-utils';

export const uploadImages = async (files: File[], userID: string) => {
  const resizedImages = await resizeImages(files);
  const formData = new FormData();

  // Append each file to the FormData object
  resizedImages.forEach((file: File) => {
    formData.append('images', file);
  });
  formData.append('userID', userID);
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
