import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const AdminFooter = () => {
  return (
    <footer className="dashboard-footer">
      <div className="footer-content">
        
        {/* Logo / Brand */}
        <div className="footer-brand">
          <h2 className="footer-title">Event Planner Admin</h2>
          <p className="footer-subtitle">Manage. Organize. Control.</p>
        </div>

        {/* Navigation */}
        <div className="footer-nav">
          <h3 className="footer-heading">Quick Links</h3>
          <Link to="/admin-dashboard" className="footer-link">Dashboard</Link>
          <Link to="/admin-dashboard?tab=events" className="footer-link">Events</Link>
          <Link to="/admin-dashboard?tab=applications" className="footer-link">Applications</Link>
          <Link to="/admin-settings" className="footer-link">Settings</Link>
        </div>

        {/* Support */}
        <div className="footer-support">
          <h3 className="footer-heading">Support</h3>
          <a href="mailto:support@eventplanner.com" className="footer-link">support@eventplanner.com</a>
          <p className="footer-text">Mon-Fri, 9AM-5PM</p>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h3 className="footer-heading">Follow Us</h3>
          <div className="social-icons">
            <a href="#" className="social-icon" aria-label="Facebook">
              <Facebook size={16} />
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              <Twitter size={16} />
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <Instagram size={16} />
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Event Planner Admin Dashboard. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/privacy" className="footer-bottom-link">Privacy Policy</Link>
          <Link to="/terms" className="footer-bottom-link">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;