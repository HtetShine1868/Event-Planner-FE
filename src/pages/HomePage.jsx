import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="hero">
        <h1>✨ Welcome to EventEase ✨</h1>
        <p>Your cozy place for discovering and organizing magical events 💖</p>
        <div className="buttons">
          <Link to="/login">
            <button className="btn primary">Login</button>
          </Link>
          <Link to="/register">
            <button className="btn secondary">Register</button>
          </Link>
        </div>
      </div>

      <div className="features">
        <h2>💡 Why You'll Love Us</h2>
        <div className="feature-cards">
          <div className="card">
            <h3>🌸 For Users</h3>
            <p>Explore dreamy events and join with one click.</p>
          </div>
          <div className="card">
            <h3>💫 For Organizers</h3>
            <p>Create and manage events with ease and sparkle.</p>
          </div>
          <div className="card">
            <h3>🔒 Secure & Safe</h3>
            <p>JWT authentication keeps your data protected.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
