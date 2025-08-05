// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  const token = response.data.token;
  if (token) localStorage.setItem('token', token);
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  const token = response.data.token;
  if (token) localStorage.setItem('token', token);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => localStorage.getItem('token');
