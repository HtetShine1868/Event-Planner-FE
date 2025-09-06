import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ChatbotUI from "./components/ChatbotUI";
import 'leaflet/dist/leaflet.css';
import RoleRedirect from "./components/RoleRedirect";
import EventDetails from "./features/events/EventDetails";
import About from "./pages/About";

import HomePage from "./pages/HomePage";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import UserProfileForm from "./user/UserProfileForm";
import UserDashboard from "./features/user/UserDashboard";
import OrganizerDashboard from "./features/organizer/OrganizerDashboard";
import OrganizerApplicationForm from "./organizer/OrganizerApplicationForm";
import AnalysisPage from "./features/organizer/AnalysisPage";
import AdminDashboard from "./features/admin/AdminDashboard";

import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <>
      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={5000} />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/user-profile-form" element={<UserProfileForm />} />
        <Route path="/organizer-application-form" element={<OrganizerApplicationForm />} />
        <Route path="/chatbot" element={<ChatbotUI />} />
        <Route path="/about" element={<About />} />
        <Route path="/redirect" element={<RoleRedirect />} />
        
        {/* Protected routes for Users */}
        <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Route>

        {/* Protected routes for Organizers */}
        <Route element={<ProtectedRoute allowedRoles={["ORGANIZER"]} />}>
          <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
          <Route path="/organizer/analysis/:eventId" element={<AnalysisPage />} />
        </Route>

        {/* Protected routes for Admins */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Protected routes for any logged-in user */}
        <Route element={<ProtectedRoute allowedRoles={["USER", "ORGANIZER", "ADMIN"]} />}>
          <Route path="/events/:id" element={<EventDetails />} />
        </Route>
      </Routes>

    </>
  );
};

export default App;
