// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import LogoutButton from './components/LogoutButton';

// Simple Dashboard placeholder
const Dashboard = () => <h2 className="text-3xl text-center mt-20">Welcome to your Dashboard</h2>;

// A simple Protected Route wrapper that checks for token presence
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Redirect to login if no token
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center p-6">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* 404 fallback */}
          <Route path="*" element={<h2 className="mt-20 text-center">404 - Page Not Found</h2>} />
        </Routes>

        {/* Show logout button only if logged in */}
        {localStorage.getItem('token') && (
          <div className="fixed top-4 right-4">
            <LogoutButton />
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
