import { Box, Grid, Tab, Typography } from '@mui/material';
import React, { useState } from 'react';

import { Anggaran } from './anggaran';
import { Identitas } from './identitas';
import { StrukturOrganisasi } from './struktur-organisasi';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const Lampiran = () => {
  const [value, setValue] = useState('L1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabs = [
    { label: 'Identitas', code: 'L1', component: <Identitas /> },
    { label: 'Anggaran', code: 'L2', component: <Anggaran /> },
    { label: 'Susunan Tim', code: 'L3', component: <StrukturOrganisasi /> },
    { label: 'Surat Pernyataan', code: 'L4', component: <></> },
    { label: 'File Pendukung', code: 'L5', component: <></> }
  ];

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Lampiran
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Typography variant="h6" gutterBottom>
            Berisikan tentang lampiran data yang diperlukan dalam pembuatan proposal.
          </Typography>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lampiran tabs">
                {tabs?.map((item) => (
                  <Tab key={item.code} label={item.label} value={item.code} aria-controls={`tabpanel-${item.code}`} />
                ))}
              </TabList>
            </Box>
            {tabs?.map((item) => (
              <TabPanel key={item.code} value={item.code}>
                {item.component}
              </TabPanel>
            ))}
          </TabContext>
        </Grid>
      </Grid>
    </>
  );
};

export default Lampiran;
