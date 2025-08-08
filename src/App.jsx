

import { Routes, Route } from 'react-router-dom';
import Navibar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import UserDashboard from './features/user/UserDashboard';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';


function App() {
  return (
    <Routes>
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<HomePage />} />
      
      
    </Routes>
  

  );
}

export default App;
