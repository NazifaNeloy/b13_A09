import axios from 'axios';

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocal ? 'http://localhost:5001' : 'https://b13-a09-server-chi.vercel.app';
};

const axiosSecure = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true
});

axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// We can also add response interceptors to handle 401/403 and automatically logout, if needed.
export const useAxiosSecure = () => {
  return axiosSecure;
};
