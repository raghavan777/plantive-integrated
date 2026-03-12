import apiClient from './apiClient';

export const analyzeImage = async (formData) => {
  const response = await apiClient.post('/ai/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getAIResults = async (params) => {
  const response = await apiClient.get('/ai/results', { params });
  return response.data;
};

export const getAIResult = async (id) => {
  const response = await apiClient.get(`/ai/results/${id}`);
  return response.data;
};
