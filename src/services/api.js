// File: /src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createUser = (userData) => api.post('/users', userData);
export const createRideRequest = (requestData) => api.post('/ride-requests', requestData);
export const getBusRoutes = () => api.get('/bus-routes');
export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (userData) => api.put('/users/profile', userData);

export default api;