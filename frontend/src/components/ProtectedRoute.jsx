import { Navigate } from 'react-router-dom';
import { isAdminLoggedIn } from '../components/utils/auth';

const ProtectedRoute = ({ children }) => {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

export default ProtectedRoute;