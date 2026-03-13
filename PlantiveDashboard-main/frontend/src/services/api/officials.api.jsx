import apiClient from './apiClient';

/**
 * Get all officials
 * @returns {Promise}
 */
export const getOfficials = async (params = {}) => {
  try {
    const response = await apiClient.get('/officials', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching officials:', error);
    throw error;
  }
};

/**
 * Get dashboard statistics
 * @returns {Promise}
 */
export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};
