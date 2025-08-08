// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from './routes/PrivateRoute';

import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import UserDashboard from './features/user/UserDashboard';
import UserProfileForm from './user/UserProfileForm';

import Navibar from "./components/Navbar";
import HomePage from "./pages/HomePage";

const App = () => {
  return (


      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
           <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<UserProfileForm />} />
      </Routes>

  );
};

export default App;
