import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

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
