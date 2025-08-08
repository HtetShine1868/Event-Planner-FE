import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navibar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-blue-900 text-white px-6 py-4">
      <div className="flex justify-between items-center">
        
        <div className="text-2xl font-bold">
          <Link to="/">Event Planner</Link>
        </div>

        
        <div>
          <button onClick={toggleMenu} className="text-white focus:outline-none text-2xl">
            {isOpen ? '✖' : '☰'}
          </button>
        </div>
      </div>

      
      {isOpen && (
        <ul className="mt-4 flex flex-col gap-4 border-t border-white pt-4">
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/events" onClick={toggleMenu}>Events</Link></li>
          <li><Link to="/search" onClick={toggleMenu}>Search</Link></li>
          <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
          <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default Navibar;
