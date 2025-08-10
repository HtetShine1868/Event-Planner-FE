import { Routes, Route } from "react-router-dom";

import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import UserDashboard from './features/user/UserDashboard';
import UserProfileForm from './user/UserProfileForm';
import HomePage from "./pages/HomePage";
import RoleRedirect from "./components/RoleRedirect";
import OrganizerDashboard from "./features/organizer/OrganizerDashboard";
import AdminDashboard from "./features/admin/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import EventDetails from './features/events/EventDetails';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/redirect" element={<RoleRedirect />} />
      <Route path="/user-profile-form" element={<UserProfileForm />} />
      <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Route>

      {/* Organizer dashboard, protected */}
      <Route element={<ProtectedRoute allowedRoles={["ORGANIZER"]} />}>
        <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
      </Route>

      {/* Admin dashboard, protected */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["USER", "ORGANIZER", "ADMIN"]} />}>
          <Route path="/events/:id" element={<EventDetails />} />
      </Route>
    </Routes>
  );
};

export default App;
