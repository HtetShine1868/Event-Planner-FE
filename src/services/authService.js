// src/services/authService.js
import axiosInstance from "./axiosInstance";

// ✅ Login API call
export const login = async (credentials) => {
  console.log("Sending:", credentials);
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data;
};

// ✅ Register API call
export const registerUser = async (userData) => {
  const response = await axiosInstance.post("/auth/register", userData);
  return response.data;
};
