import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStats = () => api.get('/stats/');
export const getLoads = () => api.get('/loads/');
export const createLoad = (data) => api.post('/loads/', data);
export const getTrucks = () => api.get('/trucks/');
export const createTruck = (data) => api.post('/trucks/', data);
export const getMatches = () => api.get('/matches/');
export const findMatches = (payload) => api.post('/matching/find-matches/', payload);
export const acceptMatch = (matchId) => api.post('/matching/accept/', { match_id: matchId });

export const uploadToCloudinary = (file, folder = 'trucklink_uploads') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  return api.post('/upload/cloudinary/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default api;
