

import { Routes, Route } from 'react-router-dom';
import Navibar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import UserDashboard from './features/user/UserDashboard';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
                  <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      {/* Add more routes as needed */}
    </Routes>

  );
}

export default App;
