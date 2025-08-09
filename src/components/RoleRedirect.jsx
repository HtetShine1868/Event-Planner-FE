import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRedirect = () => {
  const { role, profileCompleted } = useAuth();

  if (!profileCompleted) {
    return <Navigate to="/profile" />;
  }

  switch (role) {
    case 'USER':
      return <Navigate to="/user-dashboard" />;
    // case 'ORGANIZER':
    //   return <Navigate to="/organizer-dashboard" />;
    // case 'ADMIN':
    //   return <Navigate to="/admin-dashboard" />;
    default:
      return <Navigate to="/" />;
  }
};

export default RoleRedirect;
