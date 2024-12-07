import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import Dapus from './dapus';
import Kegiatan from './kegiatan';
import MainCard from 'components/MainCard';
import Pelaksanaan from './pelaksanaan';
import Pendahuluan from './pendahuluan';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Tabs from '@mui/material/Tabs';
import Tinjauan from './tinjauan';
import { getListBabProposal } from 'store/slices/proposal';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

const ProposalDetail = () => {
  const title = 'Proposal Detail';
  const { id } = useParams(),
    dispatch = useDispatch(),
    [value, setValue] = React.useState('4');

  const handleChange = (event, newValue) => {
    event.preventDefault();
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(getListBabProposal(id));
  }, [dispatch, id]);

  return (
    <TabContext value={value}>
      <MainCard title={title}>
        <Box
          sx={{ maxWidth: { xs: 320, sm: 550 }, margin: '0 auto', justifyContent: 'center', display: 'flex', bgcolor: 'background.paper' }}
        >
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="scrollable auto tabs example">
            <Tab label="Pendahuluan" value="1" />
            <Tab label="Tinjauan Pustaka" value="2" />
            <Tab label="Pelaksanaan" value="3" />
            <Tab label="Kegiatan" value="4" />
            <Tab label="Daftar Pustaka" value="5" />
          </Tabs>
        </Box>
        <TabPanel value="1" sx={{ marginTop: 5 }}>
          <Pendahuluan />
        </TabPanel>
        <TabPanel value="2">
          <Tinjauan />
        </TabPanel>
        <TabPanel value="3">
          <Pelaksanaan />
        </TabPanel>
        <TabPanel value="4">
          <Kegiatan />
        </TabPanel>
        <TabPanel value="5">
          <Dapus />
        </TabPanel>
      </MainCard>
    </TabContext>
  );
};
export default ProposalDetail;
