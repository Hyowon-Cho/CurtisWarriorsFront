import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

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
export const getETAForRequest = (routeId, requestId) => api.get(`/bus-routes/${routeId}/eta/${requestId}`);

export default api;