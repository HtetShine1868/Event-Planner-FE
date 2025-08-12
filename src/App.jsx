import { Route, Routes } from "react-router-dom";

import RoleRedirect from "./components/RoleRedirect";
import AdminDashboard from "./features/admin/AdminDashboard";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import EventDetails from './features/events/EventDetails';
import OrganizerDashboard from "./features/organizer/OrganizerDashboard";
import UserDashboard from './features/user/UserDashboard';
import OrganizerApplicationForm from './organizer/OrganizerApplicationForm';
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import UserProfileForm from './user/UserProfileForm';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/redirect" element={<RoleRedirect />} />
      <Route path="/user-profile-form" element={<UserProfileForm />} />
      <Route path="/organizer-application-form" element={<OrganizerApplicationForm />} />
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