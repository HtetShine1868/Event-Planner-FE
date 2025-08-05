// src/services/authService.js
import jwtDecode from 'jwt-decode';

export const loginUser = async (credentials) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const data = await res.json();
  const token = data.token;

  localStorage.setItem("token", token);

  // Decode and extract role
  const decoded = jwtDecode(token);
  const role = decoded.authorities?.[0] || "ROLE_USER";
  localStorage.setItem("role", role);

  return data;
};

export const registerUser = async (credentials) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    throw new Error("Register failed");
  }

  const data = await res.json();
  const token = data.token;

  localStorage.setItem("token", token);

  // Decode and extract role
  const decoded = jwtDecode(token);
  const role = decoded.authorities?.[0] || "ROLE_USER";
  localStorage.setItem("role", role);

  return data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

export const getToken = () => localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");
