import axios from 'axios';
import { uploadImages } from './google-utils';
import { resizeImages } from './image-utils';

export const submitNewCatProfile = async (data: any, pictures: File[]) => {
  const rescueDriveID = (
    await axios.post('/api/animals', data, {
      withCredentials: true,
    })
  ).data;

  const resizedImages = await resizeImages(pictures);
  uploadImages(resizedImages, rescueDriveID);
};
