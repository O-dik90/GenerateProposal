import { Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TableGrid from 'components/table/TableGrid';

export const selector = {
  gaya: ['apa', 'mla'],
  referensi: ['jurnal', 'buku', 'url']
};
export const ref_penulis = {
  buku: ['pengarang', 'editor', 'terjemahan'],
  jurnal: [],
  url: []
};

const Dapus = () => {
  const [data, setData] = useState({
      pengarang: [{ no: 1, nama_pengarang: 'pengarang' }],
      dapus: [{ no: 1, nama_pengarang: 'Pengarang 1', judul: 'Judul 1', penerbit: 'Penerbit 1', tahun_terbit: '2022', volume: '1' }],
      status: false
    }),
    [object, setObject] = useState({
      no: 1,
      nama_pengarang: '',
      judul: '',
      penerbit: '',
      tahun_terbit: '',
      volume: '',
      status: false
    });
  const [inisiasi, setInisiasi] = useState({
    gaya: 'mla',
    referensi: 'buku',
    pengarang: 'pengarang'
  });

  const columns = {
    pengarang: [
      { name: 'No', field: 'no', width: '4rem' },
      { name: 'Nama Pengarang', field: 'nama_pengarang' }
    ],
    dapus: [
      { name: 'No', field: 'no', width: '4rem' },
      { name: 'Nama Pengarang', field: 'nama_pengarang' },
      { name: 'Judul', field: 'judul' },
      { name: 'Penerbit', field: 'penerbit' },
      { name: 'Tahun Terbit', field: 'tahun_terbit' },
      { name: 'Volume', field: 'volume' }
    ]
  };
  const handlePengarang = {
    onchange: (e) => {
      setObject({ ...object, nama_pengarang: e.target.value });
    },
    tambah: () => {
      console.log(object.nama_pengarang);
      setData({ ...data, pengarang: [...data.pengarang, { no: data.pengarang.length + 1, nama_pengarang: object.nama_pengarang }] });
      setObject({ ...object, nama_pengarang: '' });
    },
    edit: (e) => {
      setObject({ ...object, no: e.no, nama_pengarang: e.nama_pengarang, status: true });
    },
    delete: (e) => {
      console.log(e);
    },
    update: () => {
      setData({
        ...data,
        pengarang: data.pengarang.map((item) => {
          if (item.no === object.no) {
            return { ...item, nama_pengarang: object.nama_pengarang };
          }
          return item;
        })
      });
      setObject({ ...object, no: 1, nama_pengarang: '', status: false });
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        DAFTAR PUSTAKA
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Stack direction="row" spacing={2}>
            <Select
              displayEmpty
              value={inisiasi.gaya}
              onChange={(e) => setInisiasi({ ...inisiasi, gaya: e.target.value })}
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ width: '10rem' }}
            >
              <MenuItem disabled value="">
                <em>Gaya Penulisan</em>
              </MenuItem>
              {selector.gaya.map((name) => (
                <MenuItem key={name} value={name}>
                  {name.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
            <Select
              displayEmpty
              value={inisiasi.referensi}
              onChange={(e) => setInisiasi({ ...inisiasi, referensi: e.target.value })}
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ width: '10rem' }}
            >
              <MenuItem disabled value="">
                <em>Referensi</em>
              </MenuItem>
              {selector.referensi.map((name) => (
                <MenuItem key={name} value={name}>
                  {name.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
            {inisiasi.referensi === 'buku' && (
              <Select
                displayEmpty
                value={inisiasi.pengarang}
                onChange={(e) => setInisiasi({ ...inisiasi, pengarang: e.target.value })}
                inputProps={{ 'aria-label': 'Without label' }}
                sx={{ width: '10rem' }}
              >
                <MenuItem disabled value="">
                  <em>Oleh</em>
                </MenuItem>
                {ref_penulis.buku.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Stack>
          <Typography variant="body2" gutterBottom sx={{ marginTop: 1 }}>
            Keterangan untuk gaya penulisan dan referensi dalama penulisna daftar pustaka
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <TextField
            label="Nama Pengarang"
            name="nama_pengarang"
            type="text"
            variant="outlined"
            value={object.nama_pengarang}
            onChange={handlePengarang.onchange}
            fullWidth
            // error={!!errors[field.name]}
            // helperText={errors[field.name]}
            // InputProps={field.inputProps}
          />
          {!object.status && (
            <Button variant="contained" color="primary" onClick={handlePengarang.tambah} sx={{ marginY: 2 }}>
              Tambah Pengarang
            </Button>
          )}
          {object.status && (
            <Button variant="contained" color="info" onClick={handlePengarang.update} sx={{ marginY: 2 }}>
              Update Pengarang
            </Button>
          )}
          <TableGrid key="grid-1" columns={columns.pengarang} rows={data.pengarang} expand={false} action onEdit={handlePengarang.edit} />
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
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          {!data.status && (
            <Button variant="contained" color="primary" onClick={() => {}} sx={{ marginY: 2 }}>
              Tambah Daftar Pustaka
            </Button>
          )}
          {data.status && (
            <Button variant="contained" color="info" onClick={() => {}} sx={{ marginY: 2 }}>
              Update Daftar Pustaka
            </Button>
          )}
          <TableGrid key="grid-2" columns={columns.dapus} rows={data.dapus} expand={false} action onEdit={() => {}} />
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
