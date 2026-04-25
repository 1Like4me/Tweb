import axios from 'axios';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { readJson } from '../utils/storage';

const api = axios.create({
  baseURL: 'http://localhost:5085', // Backend API base URL
  withCredentials: false
});

api.interceptors.request.use(
  (config) => {
    const session = readJson<{ token: string } | null>(STORAGE_KEYS.auth, null);
    if (session?.token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${session.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      window.localStorage.removeItem(STORAGE_KEYS.auth);
      window.location.href = '/login';
    }

    if (status === 500) {
      console.error('API error', error);
      return Promise.reject({
        message: 'Unexpected server error',
        status: 500
      });
    }

    return Promise.reject(error);
  }
);

export default api;

