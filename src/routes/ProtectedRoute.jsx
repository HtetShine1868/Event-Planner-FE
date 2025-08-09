// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    // Not logged in
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
