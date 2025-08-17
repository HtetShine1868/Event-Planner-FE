// src/services/eventService.js
import API from './axiosInstance'; // your axios instance with JWT

export const getAllApprovedEvents = async () => {
  const response = await API.get('/event');
  return response.data;
};

export const getTrendingEvents = async () => {
  const response = await API.get('/event/trending');
  return response.data;
};

export const getEventAnalysis = async (eventId) => {
  const response = await API.get(`/event/${eventId}/simple-analysis`);
  return response.data;
};

export const searchEvents = async (keyword) => {
  const response = await API.get('/event/search', { params: { keyword } });
  return response.data;
};
export const getApprovedEvents = async (organizerId) => {
  const res = await API.get('/event/myevent', {
    params: { organizerId, status: 'APPROVED', page: 0, size: 100 }
  });
  return res.data.content || [];
};


