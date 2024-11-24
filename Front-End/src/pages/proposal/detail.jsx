import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import Dapus from './dapus';
import MainCard from 'components/MainCard';
import Pendahuluan from './pendahuluan';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Tabs from '@mui/material/Tabs';
import { getListBabProposal } from 'store/slices/proposal';
import { proposalInitial } from 'store/initial/proposal';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

const ProposalDetail = () => {
  const title = 'Proposal Detail';
  const { id } = useParams(),
    dispatch = useDispatch(),
    [value, setValue] = React.useState('7');

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
          sx={{ maxWidth: { xs: 320, sm: 480 }, margin: '0 auto', justifyContent: 'center', display: 'flex', bgcolor: 'background.paper' }}
        >
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="scrollable auto tabs example">
            <Tab label="Pendahuluan" value="1" />
            {/* <Tab label="Bab" value="2" />
            <Tab label="Bab" value="3" />
            <Tab label="Bab" value="4" />
            <Tab label="Bab" value="5" />
            <Tab label="Bab" value="6" /> */}
            <Tab label="Daftar Pustaka" value="7" />
          </Tabs>
        </Box>
        <TabPanel value="1" sx={{ marginTop: 5 }}>
          <Pendahuluan />
        </TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="7">
          <Dapus paramsData={proposalInitial[0]} />
        </TabPanel>
      </MainCard>
    </TabContext>
  );
};
export default ProposalDetail;
