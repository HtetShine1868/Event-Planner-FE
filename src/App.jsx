// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import HomePage from "./pages/HomePage";
import UserDashboard from "./pages/UserDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import RoleBasedRoute from "./routes/RoleBasedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Role-based protected routes */}
        <Route
          path="/user/dashboard"
          element={
            <RoleBasedRoute allowedRoles={["ROLE_USER"]}>
              <UserDashboard />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/organizer/dashboard"
          element={
            <RoleBasedRoute allowedRoles={["ROLE_ORGANIZER"]}>
              <OrganizerDashboard />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AdminDashboard />
            </RoleBasedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
