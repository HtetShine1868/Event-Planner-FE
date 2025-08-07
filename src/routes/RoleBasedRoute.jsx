// src/routes/RoleBasedRoute.jsx
import { Navigate } from "react-router-dom";
import { getToken, getRole } from "../services/authService";

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const token = getToken();
  const role = getRole();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RoleBasedRoute;
