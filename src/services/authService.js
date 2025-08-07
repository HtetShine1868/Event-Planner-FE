import axiosInstance from './axiosInstance';

export const loginUser = async ({ username, password }) => {
  const response = await axiosInstance.post('/auth/login', { username, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const registerUser = async (formData) => {
  const response = await axiosInstance.post('/auth/register', formData);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};
