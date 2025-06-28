import { Box, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
import { updateChangesAsync } from 'store/slices/proposal';
import { useAuth } from 'pages/protect/authProvider';
import { useNavigate } from 'react-router-dom';

export const INIT_CHANGEDATA = {
  changesData: false,
  confirmData: false
};
const ProposalDetail = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [page, setPage] = useState('1');
  const { status } = useSelector((state) => state.app.proposal);
  const navigate = useNavigate();

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

  const handleChange = (e, newValue) => {
    // console.log(status.changesData);
    if (status.changesData) {
      dispatch(
        updateChangesAsync({
          ...INIT_CHANGEDATA,
          confirmData: true
        })
      );
    } else {
      setPage(newValue);
    }
  };

  const tabs = [
    { label: 'Pendahuluan', value: '1', component: <Pendahuluan confirmSave={status.confirmData} /> },
    { label: 'Tinjauan Pustaka', value: '2', component: <Tinjauan confirmSave={status.confirmData} /> },
    { label: 'Pelaksanaan', value: '3', component: <Pelaksanaan confirmSave={status.confirmData} /> },
    { label: 'Kegiatan', value: '4', component: <Kegiatan confirmSave={status.confirmData} /> },
    { label: 'Daftar Pustaka', value: '5', component: <Dapus confirmSave={status.confirmData} /> },
    { label: 'Lampiran', value: '6', component: <Lampiran /> }
  ];

  return (
    <TabContext value={page}>
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
          <Tabs
            value={page}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Proposal Detail Tabs"
            textColor="primary"
            indicatorColor="primary"
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
                sx={(theme) => ({
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText
                  }
                })}
              />
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
