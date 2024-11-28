import { Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TableGrid from 'components/table/TableGrid';

export const selector = {
  gaya: ['mla'], // mla, apa, chicago
  referensi: ['buku'] // jurnal, buku, url
};
export const ref_penulis = {
  buku: ['penulis'], //, 'editor', 'terjemahan'
  jurnal: [],
  url: []
};

const Dapus = () => {
  const [data, setData] = useState({
      pengarang: [],
      dapus: [],
      status: false
    }),
    [object, setObject] = useState({
      no: 1,
      nama_depan: [''],
      nama_belakang: [''],
      nama_pengarang: [''],
      judul: '',
      penerbit: '',
      tahun_terbit: '',
      edisi: '',
      status: false
    });
  const [inisiasi, setInisiasi] = useState({
    gaya: 'mla',
    referensi: 'buku',
    pengarang: 'penulis'
  });

  const columns = {
    pengarang: [
      { name: 'No', field: 'no', width: '4rem' },
      { name: 'Nama Depan', field: 'nama_depan' },
      { name: 'Nama Belakang', field: 'nama_belakang' }
    ],
    dapus: [
      { name: 'No', field: 'no', width: '4rem' },
      { name: 'Nama Pengarang', field: 'nama_pengarang', width: '25rem' },
      { name: 'Judul', field: 'judul', width: '12rem' },
      { name: 'Penerbit', field: 'penerbit', width: '12rem' },
      { name: 'Tahun Terbit', field: 'tahun_terbit', width: '5rem' },
      { name: 'edisi', field: 'edisi', width: '5rem' }
    ]
  };

  const handlePengarang = {
    onchange: (param) => {
      const { name, value } = param.target;
      setObject({ ...object, [name]: value });
    },
    new: () => {
      setData({
        ...data,
        pengarang: [
          ...data.pengarang,
          {
            no: data.pengarang.length + 1,
            nama_depan: object.nama_depan,
            nama_belakang: object.nama_belakang
          }
        ]
      });
      setObject((prev) => ({ ...prev, nama_depan: '', nama_belakang: '' }));
    },
    edit: (param) => {
      setObject({ ...object, no: param.no, nama_depan: param.nama_depan, nama_belakang: param.nama_belakang, status: !object.status });
    },
    delete: (param) => {
      const filteredData = data.pengarang
        .filter((item) => item.no !== param.no)
        .map((item, index) => ({
          ...item,
          no: index + 1
        }));
      setData({
        ...data,
        pengarang: filteredData
      });
    },
    update: () => {
      setData({
        ...data,
        pengarang: data.pengarang.map((item) => {
          if (item.no === object.no) {
            return { ...item, nama_depan: object.nama_depan, nama_belakang: object.nama_belakang };
          }
          return item;
        })
      });
      setObject({ ...object, no: 1, nama_depan: '', nama_belakang: '', status: false });
    }
  };

  const handleDapus = {
    onchange: (param) => {
      setObject({ ...object, [param.target.name]: param.target.value });
    },
    new: () => {
      setData({
        ...data,
        dapus: [
          ...data.dapus,
          {
            no: data.dapus.length + 1,
            nama_pengarang: data.pengarang.map((item) => `${item.nama_depan} ${item.nama_belakang}`).join(', '),
            judul: object.judul,
            penerbit: object.penerbit,
            tahun_terbit: object.tahun_terbit,
            edisi: object.edisi,
            data_pengarang: data.pengarang
          }
        ],
        pengarang: []
      });
      setObject({ ...object, nama_pengarang: '', judul: '', penerbit: 0, tahun_terbit: '', edisi: '' });
      // setData({ ...data, pengarang: [] });
    },
    delete: (param) => {
      const filteredDapus = data.dapus
        .filter((item) => item.no !== param.no)
        .map((item, index) => ({
          ...item,
          no: index + 1
        }));
      setData({
        ...data,
        dapus: filteredDapus
      });
    },
    edit: (param) => {
      setObject({
        ...object,
        no: param.no,
        nama_pengarang: param.nama_pengarang,
        judul: param.judul,
        penerbit: param.penerbit,
        tahun_terbit: param.tahun_terbit,
        edisi: param.edisi,
        status: !object.status
      });
      setData({ ...data, pengarang: param.data_pengarang });
    },
    update: () => {
      setData({
        ...data,
        dapus: prev.dapus.map((item) =>
          item.no === object.no
            ? {
                ...item,
                nama_pengarang: data.pengarang.map((p) => `${p.nama_depan} ${p.nama_belakang}`).join(', '),
                judul: object.judul,
                penerbit: object.penerbit,
                tahun_terbit: object.tahun_terbit,
                edisi: object.edisi,
                data_pengarang: data.pengarang
              }
            : item
        )
      });
      setObject({ ...object, no: 1, nama_pengarang: '', judul: '', penerbit: 0, tahun_terbit: '', edisi: '', status: false });
    },
    detail: (row) => {
      const res = `${row.nama_pengarang} (${row.tahun_terbit}) ${row.judul}. ${row.penerbit}.`;
      return (
        <>
          <Typography variant="h5" gutterBottom component="div">
            Detail
          </Typography>
          <Typography variant="body1" gutterBottom component="div">
            {res}
          </Typography>
        </>
      );
    }
  };

  useEffect(() => {
    console.log('dapus', data.dapus);
  }, [data.dapus]);

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
          <Stack direction="row" spacing={2}>
            <TextField
              placeholder="Nama Depan"
              name="nama_depan"
              type="text"
              variant="outlined"
              value={object.nama_depan}
              onChange={handlePengarang.onchange}
              fullWidth
            />
            <TextField
              placeholder="Nama Belakang"
              name="nama_belakang"
              type="text"
              variant="outlined"
              value={object.nama_belakang}
              onChange={handlePengarang.onchange}
              fullWidth
            />
          </Stack>
          <Button variant="contained" color="primary" onClick={handlePengarang.new} sx={{ marginY: 2 }}>
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
            actionedit={object.status}
          />
        </Grid>
        <Grid item xs={12} sm={5} sx={{ marginTop: 2 }}>
          <TextField
            placeholder="Judul"
            name="judul"
            type="text"
            variant="outlined"
            value={object.judul}
            onChange={handleDapus.onchange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} sm={2} sx={{ marginTop: 2 }}>
          <TextField
            placeholder="Tahun Terbit"
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
        <Grid item xs={6} sm={2} sx={{ marginTop: 2 }}>
          <TextField
            placeholder="Edisi"
            name="edisi"
            type="number"
            variant="outlined"
            value={object.edisi}
            onChange={(e) => {
              const value = e.target.value;
              if (value >= 0) {
                setObject({ ...object, edisi: value });
              }
            }}
            fullWidth
            inputProps={{
              min: '0'
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3} sx={{ marginTop: 2 }}>
          <TextField
            placeholder="Penerbit"
            name="penerbit"
            type="text"
            variant="outlined"
            value={object.penerbit}
            onChange={handleDapus.onchange}
            fullWidth
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            marginTop: 2,
            '& .MuiTableContainer-root': {
              overflowX: 'auto',
              width: '100%'
            },
            '& .MuiTable-root': {
              minWidth: 1200 // Adjust based on total column widths
            }
          }}
        >
          <Button variant="contained" color="primary" onClick={handleDapus.new} sx={{ marginY: 2 }}>
            Tambah Daftar Pustaka
          </Button>
          <TableGrid
            key="grid-2"
            columns={columns.dapus}
            rows={data.dapus}
            expand
            action
            onEdit={handleDapus.edit}
            onDelete={handleDapus.delete}
            onUpdate={handleDapus.update}
            actionedit={data.status}
            detail={handleDapus.detail}
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
        <Button variant="contained" color="success" onClick={() => console.log(data)} sx={{ marginTop: 5, width: '25rem' }}>
          Simpan
        </Button>
      </Stack>
    </>
  );
};

export default Dapus;
