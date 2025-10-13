import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Ici gérer globalement 401, 500, logs, etc.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Pas de réponse HTTP => problème réseau/serveur down
    if (!error.response) {
      const p = window.location.pathname;
      if (!p.startsWith('/error/')) {
        window.location.assign('/error/network'); // redirection 
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
