import { Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TableGrid from 'components/table/TableGrid';

export const selector = {
  gaya: ['mla'], // mla, apa, chicago
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
      penerbit: 0,
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
    onchange: (param) => {
      setObject({ ...object, nama_pengarang: param.target.value });
    },
    tambah: () => {
      setData({ ...data, pengarang: [...data.pengarang, { no: data.pengarang.length + 1, nama_pengarang: object.nama_pengarang }] });
      setObject({ ...object, nama_pengarang: '' });
    },
    edit: (param) => {
      setObject({ ...object, no: param.no, nama_pengarang: param.nama_pengarang, status: !object.status });
    },
    delete: (param) => {
      setData({
        ...data,
        pengarang: data.pengarang.filter((item) => item.no !== param.no)
      });
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

  const handleDapus = {
    onchange: (param) => {
      setObject({ ...object, [param.target.name]: param.target.value });
    },
    tambah: () => {
      setData({
        ...data,
        dapus: [
          ...data.dapus,
          {
            no: data.dapus.length + 1,
            nama_pengarang: object.nama_pengarang,
            judul: object.judul,
            penerbit: object.penerbit,
            tahun_terbit: object.tahun_terbit,
            volume: object.volume
          }
        ]
      });
      setObject({ ...object, nama_pengarang: '', judul: '', penerbit: 0, tahun_terbit: '', volume: '' });
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
          <Button variant="contained" color="primary" onClick={handlePengarang.tambah} sx={{ marginY: 2 }}>
            Tambah Pengarang
          </Button>
          <TableGrid
            key="grid-1"
            columns={columns.pengarang}
            rows={data.pengarang}
            expand={false}
            action
            onEdit={handlePengarang.edit}
            onDelete={handlePengarang.delete}
            onUpdate={handlePengarang.update}
            actionEdit={object.status}
          />
        </Grid>
        <Grid item xs={5} sx={{ marginTop: 2 }}>
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
        <Grid item xs={2} sx={{ marginTop: 2 }}>
          <TextField
            label="Tahun Terbit"
            name="tahun_terbit"
            type="text"
            value={object.tahun_terbit}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              if (value.length <= 4) {
                setObject({ ...object, tahun_terbit: value });
              }
            }}
            fullWidth
            inputProps={{
              maxLength: 4,
              placeholder: `years`
            }}
          />
        </Grid>
        <Grid item xs={2} sx={{ marginTop: 2 }}>
          <TextField
            label="Volume"
            name="volume"
            type="number"
            variant="outlined"
            value={object.volume}
            onChange={(e) => {
              const value = e.target.value;
              if (value >= 0) {
                setObject({ ...object, volume: value });
              }
            }}
            fullWidth
            inputProps={{
              min: '0'
            }}
          />
        </Grid>
        <Grid item xs={3} sx={{ marginTop: 2 }}>
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
          <Button variant="contained" color="primary" onClick={handleDapus.tambah} sx={{ marginY: 2 }}>
            Tambah Daftar Pustaka
          </Button>
          <TableGrid
            key="grid-2"
            columns={columns.dapus}
            rows={data.dapus}
            expand
            action
            onEdit={() => {}}
            onDelete={() => {}}
            onUpdate={() => {}}
            actionEdit={data.status}
          />
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
