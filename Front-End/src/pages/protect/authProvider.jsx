import { createContext, useContext } from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user } = useSelector((state) => state.app.auth);

  // useEffect(() => {
  //   console.log('auth', user);
  // }, [user]);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
AuthProvider.propTypes = { children: PropTypes.node };
