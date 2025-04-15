import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from './authProvider';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (user === null) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
ProtectedRoute.propTypes = { children: PropTypes.node };
