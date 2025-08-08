import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/event'; // adjust if different

export const getAllApprovedEvents = async () => {
  const response = await axios.get(`${API_BASE}`);
  return response.data;
};

export const getTrendingEvents = async () => {
  const response = await axios.get(`${API_BASE}/trending`);
  return response.data;
};


export const searchEvents = async (keyword) => {
  const response = await axios.get(`${API_BASE}/search`, {
    params: { keyword }
  });
  return response.data;
};




