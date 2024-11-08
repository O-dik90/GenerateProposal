import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

import Box from '@mui/material/Box';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import Drawer from './Drawer';
import Header from './Header';
import Loader from 'components/Loader';
import { Outlet } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import navigation from 'menu-items';
import { useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout() {
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));

  useEffect(() => {
    handlerDrawerOpen(!downXL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header />
      <Drawer />
      <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar />
        <Breadcrumbs navigation={navigation} title />
        <Outlet />
      </Box>
    </Box>
  );
}
