// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import { lazy } from 'react';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/register')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/',
      element: <AuthLogin />
    },
    {
      path: '/register',
      element: <AuthRegister />
    }
  ]
};

export default LoginRoutes;
