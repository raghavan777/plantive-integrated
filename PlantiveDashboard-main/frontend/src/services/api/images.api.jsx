import apiClient from './apiClient';

export const uploadImage = async (formData) => {
  const response = await apiClient.post('/images/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getImages = async (params) => {
  const response = await apiClient.get('/images', { params });
  return response.data;
};

export const compareImages = async (params) => {
  const response = await apiClient.get('/images/compare', { params });
  return response.data;
};
