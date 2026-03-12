import apiClient from './apiClient';

export const getFarmers = async (params) => {
  const response = await apiClient.get('/farmers', { params });
  return response.data;
};

export const getFarmer = async (id) => {
  const response = await apiClient.get(`/farmers/${id}`);
  return response.data;
};

export const createFarmer = async (farmerData) => {
  const response = await apiClient.post('/farmers', farmerData);
  return response.data;
};

export const updateFarmer = async (id, farmerData) => {
  const response = await apiClient.put(`/farmers/${id}`, farmerData);
  return response.data;
};
