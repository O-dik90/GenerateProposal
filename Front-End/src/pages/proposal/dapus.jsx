import { Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TableGrid from 'components/table/TableGrid';

const Dapus = () => {
  const [data, setData] = useState([]),
    [object, setObject] = useState({
      no: 1,
      penulis: '',
      judul: '',
      penerbit: '',
      tahun_terbit: '',
      volume: '',
      status: false
    });
  const [jenis, setJenis] = React.useState('jurnal');

  const columns = [
    { name: 'No', field: 'no', width: '4rem' },
    { name: 'Penulis', field: 'penulis' },
    { name: 'Judul', field: 'judul' },
    { name: 'Penerbit', field: 'penerbit' },
    { name: 'Tahun Terbit', field: 'tahun_terbit' },
    { name: 'Volume', field: 'volume' }
  ];
  return (
    <>
      <Typography variant="h4" gutterBottom>
        DAFTAR PUSTAKA
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Select
            size="small"
            value={jenis}
            inputProps={{ 'aria-label': 'Without label' }}
            onChange={(e) => setJenis(e.target.value)}
            sx={{ width: '10rem' }}
          >
            <MenuItem value="jurnal">Jurnal</MenuItem>
            <MenuItem value="buku">Buku</MenuItem>
            <MenuItem value="url">Link / Url</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={6} sx={{ marginTop: 2 }}>
          <TextField
            label="Penulis"
            name="penulis"
            type="text"
            variant="outlined"
            value={object.penulis}
            onChange={(e) => setObject(e.target.value)}
            fullWidth
            // error={!!errors[field.name]}
            // helperText={errors[field.name]}
            // InputProps={field.inputProps}
          />
        </Grid>
        <Grid item xs={6} sx={{ marginTop: 2 }}>
          <TextField
            label="Tahun Terbit"
            name="tahun_terbit"
            type="number"
            variant="outlined"
            value={object.tahun_terbit}
            onChange={(e) => setObject(e.target.value)}
            fullWidth
            // error={!!errors[field.name]}
            // helperText={errors[field.name]}
            // InputProps={field.inputProps}
          />
        </Grid>
        <Grid item xs={6} sx={{ marginTop: 2 }}>
          <TextField
            label="Judul"
            name="judul"
            type="text"
            variant="outlined"
            value={object.judul}
            onChange={(e) => setObject(e.target.value)}
            fullWidth
            // error={!!errors[field.name]}
            // helperText={errors[field.name]}
            // InputProps={field.inputProps}
          />
        </Grid>
        <Grid item xs={6} sx={{ marginTop: 2 }}>
          <TextField
            label="Volume"
            name="volume  "
            type="text"
            variant="outlined"
            value={object.volume}
            onChange={(e) => setObject(e.target.value)}
            fullWidth
            // error={!!errors[field.name]}
            // helperText={errors[field.name]}
            // InputProps={field.inputProps}
          />
        </Grid>
        <Grid item xs={6} sx={{ marginTop: 2 }}>
          <TextField
            label="Tempat Publikasi"
            name="tempat_publikasi"
            type="text"
            variant="outlined"
            value={object.tempat_publikasi}
            onChange={(e) => setObject(e.target.value)}
            fullWidth
            // error={!!errors[field.name]}
            // helperText={errors[field.name]}
            // InputProps={field.inputProps}
          />
        </Grid>
        <Grid item xs={6} sx={{ marginTop: 2 }}>
          <TextField
            label="Penerbit"
            name="penerbit"
            type="text"
            variant="outlined"
            value={object.penerbit}
            onChange={(e) => setObject(e.target.value)}
            fullWidth
            // error={!!errors[field.name]}
            // helperText={errors[field.name]}
            // InputProps={field.inputProps}
          />
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          {/* {!true && (
            <Button variant="contained" color="primary" onClick={''} sx={{ marginY: 2 }}>
              Tambah Rumusan Masalah
            </Button>
          )} */}
          {true && (
            <Button variant="contained" color="info" onClick={() => setData()} sx={{ marginY: 2 }}>
              Update Daftar Pustaka
            </Button>
          )}
          <TableGrid key="grid-1" columns={columns} rows={data} expand={false} action onEdit={''} />
        </Grid>
      </Grid>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: 'space-evenly',
          alignItems: 'center',
          marginY: 5
        }}
      >
        <Button variant="contained" color="success" onClick={() => alert('simpan data')} sx={{ marginTop: 5, width: '25rem' }}>
          Simpan
        </Button>
      </Stack>
    </>
  );
};

export default Dapus;
