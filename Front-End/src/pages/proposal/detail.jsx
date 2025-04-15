import { Box, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';

import Dapus from './daftar-pustaka';
import Kegiatan from './bab-kegiatan';
import Lampiran from './lampiran';
import MainCard from 'components/MainCard';
import Pelaksanaan from './bab-pelaksanaan';
import Pendahuluan from './bab-pendahuluan/pendahuluan';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Tinjauan from './bab-tinjauan-pustaka';
import { getMe } from 'store/slices/auth';
import { useAuth } from 'pages/protect/authProvider';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProposalDetail = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [value, setValue] = useState('1');

  useEffect(() => {
    const getUser = async () => {
      if (!user) {
        const rest = await dispatch(getMe());

        if (getMe.rejected.match(rest)) {
          navigate('/');
        }
      }
    };

    getUser();
  }, [dispatch, navigate, user]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabs = [
    { label: 'Pendahuluan', value: '1', component: <Pendahuluan /> },
    { label: 'Tinjauan Pustaka', value: '2', component: <Tinjauan /> },
    { label: 'Pelaksanaan', value: '3', component: <Pelaksanaan /> },
    { label: 'Kegiatan', value: '4', component: <Kegiatan /> },
    { label: 'Daftar Pustaka', value: '5', component: <Dapus /> },
    { label: 'Lampiran', value: '6', component: <Lampiran /> }
  ];

  return (
    <TabContext value={value}>
      <MainCard title="Proposal Detail">
        <Box
          sx={{
            maxWidth: { xs: 320, sm: 800 },
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            bgcolor: 'background.paper'
          }}
        >
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="Proposal Detail Tabs">
            {tabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>
        {tabs.map((tab) => (
          <TabPanel key={tab.value} value={tab.value}>
            {tab.component}
          </TabPanel>
        ))}
      </MainCard>
    </TabContext>
  );
};

export default ProposalDetail;
