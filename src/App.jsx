import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navibar from "./components/Navbar";  // make sure filename and import match
import HomePage from "./pages/HomePage";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";  // import the Footer component
import './index.css'; 
import About from "./pages/About";
const App = () => {
  return (
    <Router>
      {/* flex-col + min-h-screen + main flex-grow keeps footer at bottom */}
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navibar />

        {/* main content grows to push footer to bottom */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/footer" element={<Footer />} />
            <Route
              path="/user-dashboard"  // keep path consistent
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
