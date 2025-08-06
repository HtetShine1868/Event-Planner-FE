import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import UserDashboard from './features/user/UserDashboard';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/user-dashboard" element={
        <PrivateRoute>
          <UserDashboard />
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default App;
