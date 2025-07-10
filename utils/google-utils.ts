import axios from 'axios';

export const uploadImages = async (files: File[], driveId: string) => {
  const formData = new FormData();

  // Append each file to the FormData object
  files.forEach((file: File) => {
    formData.append('images', file);
  });
  formData.append('driveId', driveId);
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
