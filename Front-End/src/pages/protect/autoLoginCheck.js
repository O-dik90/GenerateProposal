import { getMe } from 'store/slices/auth';
import { useDispatch } from 'react-redux';
// components/AutoLoginCheck.js
import { useEffect } from 'react';

const AutoLoginCheck = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        await dispatch(getMe());
      } catch (error) {
        // If session is expired or invalid, log out and redirect to login page
        // dispatch(userLogout());
        window.location.href = '/login';
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return null; // No need to render anything, this is for session management
};

export default AutoLoginCheck;
