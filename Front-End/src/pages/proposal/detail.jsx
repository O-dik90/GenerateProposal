import { Box, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';

import Dapus from './dapus';
import Kegiatan from './kegiatan';
import Lampiran from './lampiran';
import MainCard from 'components/MainCard';
import Pelaksanaan from './pelaksanaan';
import Pendahuluan from './pendahuluan';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Tinjauan from './tinjauan';
import { getListBabProposal } from 'store/slices/proposal';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

const ProposalDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [value, setValue] = useState('6');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getListBabProposal(id));
      } catch (error) {
        console.error('Error fetching proposal details:', error);
      }
    };

    fetchData();
  }, [dispatch, id]);

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
