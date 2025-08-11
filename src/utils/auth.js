import { jwtDecode } from 'jwt-decode'; // ✅ Correct way

export const getToken = () => localStorage.getItem('token') || localStorage.getItem('accessToken');

export const getUser = () => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};
