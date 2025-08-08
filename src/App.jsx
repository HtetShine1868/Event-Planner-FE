import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import PrivateRoute from './routes/PrivateRoute';

import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import UserDashboard from './features/user/UserDashboard';
import Dashboard from "./pages/Dashboard";
import UserProfileForm from './user/UserProfileForm';

import Navibar from "./components/Navbar";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Optional: Home route for main landing page */}
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Route for Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Private Route for user dashboard */}
        <Route path="/user-dashboard" element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        } />

        {/* Regular route for user profile */}
        <Route path="/profile" element={<UserProfileForm />} />
      </Routes>
    </Router>
  );
};

export default App;

