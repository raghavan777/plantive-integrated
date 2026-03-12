import { Platform } from 'react-native';

// For Android emulator, localhost is 10.0.2.2
// For iOS and Web, it's localhost
export const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5000/api',
  ios: 'http://localhost:5000/api',
  default: 'http://localhost:5000/api',
});

export const API_ENDPOINTS = {
  AUTH: {
    SEND_OTP: `${BASE_URL}/auth/send-otp`,
    VERIFY_OTP: `${BASE_URL}/auth/verify-otp`,
    REGISTER: `${BASE_URL}/auth/farmer/register`,
  },
  FARMERS: {
    PROFILE: `${BASE_URL}/farmers/profile`,
    HISTORY: `${BASE_URL}/farmers/history`,
  },
  SUBMISSIONS: {
    CREATE: `${BASE_URL}/submissions`,
    HISTORY: `${BASE_URL}/submissions/history`,
    STATUS: `${BASE_URL}/submissions/status`,
  },
  NOTIFICATIONS: {
    LIST: `${BASE_URL}/notifications`,
    UNREAD_COUNT: `${BASE_URL}/notifications/unread-count`,
    MARK_READ: (id: string) => `${BASE_URL}/notifications/${id}/read`,
  },
};

// Simple in-memory token storage for the session
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthHeaders = () => {
  const headers: any = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};
