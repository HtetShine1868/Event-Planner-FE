import axios from 'axios';

// Get events user registered for
export const getMyRegisteredEvents = async (userId) => {
  const response = await axios.get(`/api/registrations/my`);
  return response.data;
};

// Get trending events
export const getTrendingEvents = async () => {
  const response = await axios.get(`/api/event/trending`); // adjust path if needed
  return response.data;
};

// Search events by query params
export const searchEvents = async (query) => {
  const response = await axios.get(`/api/event/search`, { params: query });
  return response.data;
};

// Get all approved events
export const getAllApprovedEvents = async () => {
  const response = await axios.get(`/api/event`);
  return response.data;
};

// Register user for event
export const registerForEvent = async (eventId, userId) => {
  const response = await axios.post(`/api/events/${eventId}/register`, { userId });
  return response.data;
};
