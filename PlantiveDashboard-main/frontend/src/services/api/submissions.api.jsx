import apiClient from './apiClient';

export const getSubmissions = async (params) => {
  const response = await apiClient.get('/submissions', { params });
  return response.data;
};

export const getSubmission = async (id) => {
  const response = await apiClient.get(`/submissions/${id}`);
  return response.data;
};

export const createSubmission = async (formData) => {
  const response = await apiClient.post('/submissions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const verifySubmission = async (id, verificationData) => {
  const response = await apiClient.put(`/submissions/${id}/verify`, verificationData);
  return response.data;
};
