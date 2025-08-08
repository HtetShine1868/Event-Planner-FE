// src/components/ProfileMenu.jsx
import React, { useState } from 'react';

const ProfileMenu = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gray-300 text-black hover:bg-gray-400"
      >
        {user?.username?.charAt(0)?.toUpperCase() || "U"}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-4 z-50">
          <p className="font-semibold">{user?.username}</p>
          <p className="text-sm text-gray-600">{user?.email}</p>
          <hr className="my-2" />
          <button
            onClick={onLogout}
            className="text-red-600 hover:underline w-full text-left"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
