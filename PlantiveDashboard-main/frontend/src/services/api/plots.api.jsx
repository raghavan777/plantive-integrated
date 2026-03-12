import apiClient from './apiClient';

export const getPlots = async (params) => {
  const response = await apiClient.get('/plots', { params });
  return response.data;
};

export const getPlotsGeoJSON = async (params) => {
  const response = await apiClient.get('/plots/geojson', { params });
  return response.data;
};

export const getPlot = async (id) => {
  const response = await apiClient.get(`/plots/${id}`);
  return response.data;
};

export const createPlot = async (plotData) => {
  const response = await apiClient.post('/plots', plotData);
  return response.data;
};
