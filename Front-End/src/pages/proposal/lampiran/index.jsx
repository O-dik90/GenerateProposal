import { Box, Grid, Tab, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Anggaran } from './anggaran';
import { FilePendukung } from './file-pendukung';
import { INIT_CHANGEDATA } from '../detail';
import { Identitas } from './identitas';
import { StrukturOrganisasi } from './struktur-organisasi';
import { SuratPernyataan } from './surat-pernyataan';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { updateChangesAsync } from 'store/slices/proposal';

const Lampiran = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState('L1');
  const { status } = useSelector((state) => state.app.proposal);

  const handleChange = (event, newValue) => {
    if (status.changesData) {
      dispatch(
        updateChangesAsync({
          ...INIT_CHANGEDATA,
          confirmData: true
        })
      );
    } else {
      setValue(newValue);
    }
  };

  const tabs = [
    { label: 'Identitas', code: 'L1', component: <Identitas confirmSave={status.confirmData} /> },
    { label: 'Anggaran', code: 'L2', component: <Anggaran confirmSave={status.confirmData} /> },
    { label: 'Susunan Tim', code: 'L3', component: <StrukturOrganisasi confirmSave={status.confirmData} /> },
    { label: 'Surat Pernyataan', code: 'L4', component: <SuratPernyataan /> },
    { label: 'File Pendukung', code: 'L5', component: <FilePendukung /> }
  ];

  return (
    <>
      <Typography variant="h4" gutterBottom>
        LAMPIRAN
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
                  <Tab
                    key={item.code}
                    label={item.label}
                    value={item.code}
                    aria-controls={`tabpanel-${item.code}`}
                    sx={(theme) => ({
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText
                      }
                    })}
                  />
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
