import { Navigate } from 'react-router-dom';
import Login from '@/features/auth/Login';
import Register from '@/features/auth/Register';
import UserDashboard from '@/features/user/UserDashboard';
// Import other dashboard components if needed

const routes = [
  { path: '/', element: <Navigate to="/login" /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/dashboard', element: <UserDashboard /> },  // ✅ Make sure this is here!
  // You can also define child routes under /dashboard if needed
];

export default routes;
