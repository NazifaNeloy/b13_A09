import axios from 'axios';

const axiosSecure = axios.create({
  baseURL: 'http://localhost:5000',
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
