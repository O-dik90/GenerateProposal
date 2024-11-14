import { Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TableGrid from 'components/table/TableGrid';

const Pendahuluan = () => {
  const [rumusan, setRumusan] = useState({
      no: 1,
      data: '',
      status: false
    }),
    [tujuan, setTujuan] = useState({
      no: 1,
      data: '',
      status: false
    }),
    [luaran, setLuaran] = useState({
      no: 1,
      data: '',
      status: false
    }),
    [manfaat, setManfaat] = useState({
      no: 1,
      data: '',
      status: false
    }),
    [data, setData] = React.useState({
      latar_belakang: '',
      rumusan_masalah: [{ no: 1, rumusan_masalah: 'Rumusan Masalah 1' }],
      tujuan: [{ no: 1, tujuan: 'Tujuan 1' }],
      luaran: [{ no: 1, luaran: 'Luaran 1' }],
      manfaat: [{ no: 1, manfaat: 'Manfaat 1' }]
    });

  const columns = {
    rumusan: [
      { name: 'No', field: 'no', width: '4rem' },
      { name: 'Rumusan Masalah', field: 'rumusan_masalah' }
    ],
    tujuan: [
      { name: 'No', field: 'no', width: '4rem' },
      { name: 'Tujuan', field: 'tujuan' }
    ],
    luaran: [
      { name: 'No', field: 'no', width: '4rem' },
      { name: 'Luaran', field: 'luaran' }
    ],
    manfaat: [
      { name: 'No', field: 'no', width: '4rem' },
      { name: 'Manfaat', field: 'manfaat' }
    ]
  };

  const handleRumusan = {
    onchange: (e) => {
      setRumusan({ ...rumusan, data: e.target.value });
    },
    tambah: (e) => {
      e.preventDefault();
      setData({
        ...data,
        rumusan_masalah: [...data.rumusan_masalah, { no: data.rumusan_masalah.length + 1, rumusan_masalah: rumusan.data }]
      });
      setRumusan({ ...rumusan, no: rumusan.no + 1, data: '', status: false });
    },
    edit: (params) => {
      console.log(params);
      setRumusan({ ...rumusan, no: params.no, data: params.rumusan_masalah, status: true });
    },
    update: () => {
      setData({
        ...data,
        rumusan_masalah: data.rumusan_masalah.map((item) => {
          if (item.no === rumusan.no) {
            return { ...item, rumusan_masalah: rumusan.data };
          }
          return item;
        })
      });
      setRumusan({ ...rumusan, no: 1, data: '', status: false });
    },
    delete: (params) => {
      const filteredData = data.rumusan_masalah.filter((item) => item.no !== params.no);
      // Reindex the remaining items
      const reindexedData = filteredData.map((item, index) => ({
        ...item,
        no: index + 1
      }));
      setData({
        ...data,

        rumusan_masalah: reindexedData
      });
    }
  };

  const handleTujuan = {
    onchange: (e) => {
      setTujuan({ ...tujuan, data: e.target.value });
    },
    tambah: (e) => {
      e.preventDefault();
      setData({
        ...data,
        tujuan: [...data.tujuan, { no: data.tujuan.length + 1, tujuan: tujuan.data }]
      });
      setTujuan({ ...tujuan, no: tujuan.no + 1, data: '', status: false });
    },
    edit: (params) => {
      setTujuan({ ...tujuan, no: params.no, data: params.tujuan, status: true });
    },
    update: () => {
      setData({
        ...data,
        tujuan: data.tujuan.map((item) => {
          if (item.no === tujuan.no) {
            return { ...item, tujuan: tujuan.data };
          }
          return item;
        })
      });
      setTujuan({ ...tujuan, no: tujuan.no + 1, data: '', status: false });
    },
    delete: (params) => {
      const filteredData = data.tujuan.filter((item) => item.no !== params.no);
      const reindexedData = filteredData.map((item, index) => ({
        ...item,
        no: index + 1
      }));
      setData({
        ...data,

        tujuan: reindexedData
      });
    }
  };

  const handleLuaran = {
    onchange: (e) => {
      setLuaran({ ...luaran, data: e.target.value });
    },
    tambah: (e) => {
      e.preventDefault();
      setData({
        ...data,
        luaran: [...data.luaran, { no: data.luaran.length + 1, luaran: luaran.data }]
      });
      setLuaran({ ...luaran, no: luaran.no + 1, data: '', status: false });
    },
    edit: (params) => {
      setLuaran({ ...luaran, no: params.no, data: params.luaran, status: true });
    },
    update: () => {
      setData({
        ...data,
        luaran: data.luaran.map((item) => {
          if (item.no === luaran.no) {
            return { ...item, luaran: luaran.data };
          }
          return item;
        })
      });
      setLuaran({ ...luaran, no: luaran.no + 1, data: '', status: false });
    },
    delete: (params) => {
      const filteredData = data.luaran.filter((item) => item.no !== params.no);
      const reindexedData = filteredData.map((item, index) => ({
        ...item,
        no: index + 1
      }));
      setData({
        ...data,

        luaran: reindexedData
      });
    }
  };

  const handleManfaat = {
    onchange: (e) => {
      setManfaat({ ...manfaat, data: e.target.value });
    },
    tambah: (e) => {
      e.preventDefault();
      setData({
        ...data,
        manfaat: [...data.manfaat, { no: data.manfaat.length + 1, manfaat: manfaat.data }]
      });
      setManfaat({ ...manfaat, no: manfaat.no + 1, data: '', status: false });
    },
    edit: (params) => {
      setManfaat({ ...manfaat, no: params.no, data: params.manfaat, status: true });
    },
    update: () => {
      setData({
        ...data,
        manfaat: data.manfaat.map((item) => {
          if (item.no === manfaat.no) {
            return { ...item, manfaat: manfaat.data };
          }
          return item;
        })
      });
      setManfaat({ ...manfaat, no: manfaat.no + 1, data: '', status: false });
    },
    delete: (params) => {
      const filteredData = data.manfaat.filter((item) => item.no !== params.no);
      const reindexedData = filteredData.map((item, index) => ({
        ...item,
        no: index + 1
      }));
      setData({
        ...data,

        manfaat: reindexedData
      });
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        BAB 1. PENDAHULUAN
      </Typography>
      <Typography variant="h5" gutterBottom>
        1.1 Latar Belakang
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            label="Latar Belakang"
            name="latar_belakang"
            variant="outlined"
            value={data.latar_belakang}
            onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
            fullWidth
            multiline
            rows={8}
          />
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Typography variant="h5" gutterBottom>
            1.2 Rumusan Masalah
          </Typography>
          <Typography variant="body1" gutterBottom>
            Berdasarkan latar belakang tersebut, dapat dibuat beberapa rumusan masalah sebagai berikut:
          </Typography>
          <TextField
            label="Rumusan Masalah"
            name="rumusan_masalah"
            type="text"
            variant="outlined"
            value={rumusan.data}
            onChange={handleRumusan.onchange}
            fullWidth
            // error={!!errors[field.name]}
            // helperText={errors[field.name]}
            // InputProps={field.inputProps}
          />
          <Button variant="contained" color="primary" onClick={handleRumusan.tambah} sx={{ marginY: 2 }}>
            Tambah Rumusan Masalah
          </Button>
          <TableGrid
            key="grid-1"
            columns={columns.rumusan}
            rows={data.rumusan_masalah}
            expand={false}
            action
            onEdit={handleRumusan.edit}
            onDelete={handleRumusan.delete}
            onUpdate={handleRumusan.update}
            actionEdit={rumusan.status}
          />
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Typography variant="h5" gutterBottom>
            1.3 Tujuan
          </Typography>
          <Typography variant="body1" gutterBottom>
            Dari rumusan masalah di atas, berikut merupakan beberapa tujuan pada program ini:
          </Typography>
          <TextField
            label="Tujuan"
            name="tujuan"
            type="text"
            variant="outlined"
            value={tujuan.data}
            onChange={handleTujuan.onchange}
            fullWidth
            // error={!!errors[field.name]}
            // helperText={errors[field.name]}
            // InputProps={field.inputProps}
          />
          <Button variant="contained" color="primary" onClick={handleTujuan.tambah} sx={{ marginY: 2 }}>
            Tambah Tujuan
          </Button>
          <TableGrid
            key="grid-2"
            columns={columns.tujuan}
            rows={data.tujuan}
            expand={false}
            action
            onEdit={handleTujuan.edit}
            onDelete={handleTujuan.delete}
            onUpdate={handleTujuan.update}
            actionEdit={tujuan.status}
          />
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Typography variant="h5" gutterBottom>
            1.4 Luaran
          </Typography>
          <Typography variant="body1" gutterBottom>
            Luaran-luaran yang diperlukan pada program ini antara lain:
          </Typography>
          <TextField
            label="Luaran"
            name="luaran"
            type="text"
            variant="outlined"
            value={luaran.data}
            onChange={handleLuaran.onchange}
            fullWidth
            // error={!!errors[field.name]}
            // helperText={errors[field.name]}
            // InputProps={field.inputProps}
          />
          <Button variant="contained" color="primary" onClick={handleLuaran.tambah} sx={{ marginY: 2 }}>
            Tambah Luaran
          </Button>
          <TableGrid
            key="grid-3"
            columns={columns.luaran}
            rows={data.luaran}
            expand={false}
            action
            onEdit={handleLuaran.edit}
            onUpdate={handleLuaran.update}
            onDelete={handleLuaran.delete}
            actionEdit={luaran.status}
          />
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Typography variant="h5" gutterBottom>
            1.5 Manfaat
          </Typography>
          <Typography variant="body1" gutterBottom>
            Isi Manfaat:
          </Typography>
          <TextField
            label="Manfaat"
            name="manfaat"
            type="text"
            variant="outlined"
            value={manfaat.data}
            onChange={handleManfaat.onchange}
            fullWidth
            // error={!!errors[field.name]}
            // helperText={errors[field.name]}
            // InputProps={field.inputProps}
          />
          <Button variant="contained" color="primary" onClick={handleManfaat.tambah} sx={{ marginY: 2 }}>
            Tambah Manfaat
          </Button>
          <TableGrid
            key="grid-4"
            columns={columns.manfaat}
            rows={data.manfaat}
            expand={false}
            action
            onEdit={handleManfaat.edit}
            onDelete={handleManfaat.delete}
            onUpdate={handleManfaat.update}
            actionEdit={manfaat.status}
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
export default Pendahuluan;
