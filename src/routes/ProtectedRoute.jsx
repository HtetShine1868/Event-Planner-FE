// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode }from "jwt-decode";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  let role = null;
  try {
    const decoded = jwtDecode(token);
    role = decoded.role; // adjust if your token uses a different claim key
  } catch (e) {
    // Invalid token or decode error
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // Logged in but unauthorized for this route
    if (role === "ADMIN") return <Navigate to="/admin-dashboard" replace />;
    if (role === "ORGANIZER") return <Navigate to="/organizer-dashboard" replace />;
    if (role === "USER") return <Navigate to="/user-dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
