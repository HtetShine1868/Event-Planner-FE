// src/App.jsx
import { Route, Routes } from "react-router-dom";


import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import UserDashboard from './features/user/UserDashboard';
import OrganizerApplicationForm from './organizer/OrganizerApplicationForm';
import UserProfileForm from './user/UserProfileForm';

import HomePage from "./pages/HomePage";

const App = () => {
  return (


      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
           <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<UserProfileForm />} />
        <Route path="/organizer-application" element={<OrganizerApplicationForm />} />

      </Routes>

  );
};

export default App;
