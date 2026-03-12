import apiClient from './apiClient';

export const getReports = async (params) => {
  const response = await apiClient.get('/reports', { params });
  return response.data;
};

export const getReport = async (id) => {
  const response = await apiClient.get(`/reports/${id}`);
  return response.data;
};

export const createReport = async (reportData) => {
  const response = await apiClient.post('/reports', reportData);
  return response.data;
};

export const exportReport = async (id) => {
  // Return blob for file download
  const response = await apiClient.get(`/reports/${id}/export`, { responseType: 'blob' });
  return response.data;
};

export const deleteReport = async (id) => {
  const response = await apiClient.delete(`/reports/${id}`);
  return response.data;
};
