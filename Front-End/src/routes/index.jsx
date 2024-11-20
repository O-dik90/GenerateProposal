import LoginRoutes from './LoginRoutes';
// project import
import MainRoutes from './MainRoutes';
import { createBrowserRouter } from 'react-router-dom';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([MainRoutes, LoginRoutes], { basename: import.meta.env.VITE_APP_BASE_NAME });

export default router;
