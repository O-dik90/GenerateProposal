import { Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TableGrid from 'components/table/TableGrid';
import { updateDapus } from 'store/slices/proposal';
import { useDispatch } from 'react-redux';

export const selector = {
  gaya: ['mla'], // mla, apa, chicago
  referensi: ['buku'] // jurnal, buku, url
};
export const ref_penulis = {
  buku: ['penulis'], //, 'editor', 'terjemahan'
  jurnal: [],
  url: []
};

export const DAPUS_INIT = {
  no: 0,
  nama_pengarang: '',
  judul: '',
  penerbit: '',
  tahun_terbit: '',
  edisi: '',
  data_pengarang: [],
  status: false
};

export const PENGARANG_INIT = {
  no: 0,
  nama_depan: '',
  nama_belakang: '',
  status: false
};

const Dapus = () => {
  const [data, setData] = useState([]),
    dispatch = useDispatch(),
    [object, setObject] = useState({
      pengarang: PENGARANG_INIT,
      dapus: DAPUS_INIT,
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

      setObject((prev) => ({
        ...prev,
        pengarang: {
          ...prev.pengarang,
          [name]: value
        }
      }));
    },
    new: () => {
      setObject((prev) => ({
        ...prev,
        dapus: {
          ...prev.dapus,
          data_pengarang: [
            ...prev.dapus.data_pengarang,
            {
              ...prev.pengarang,
              no: prev.dapus.data_pengarang.length + 1
            }
          ]
        },
        pengarang: PENGARANG_INIT
      }));
    },
    edit: (param) => {
      setObject((prev) => ({
        ...prev,
        pengarang: param
      }));
    },
    delete: (param) => {
      const filteredData = object.dapus.data_pengarang
        .filter((item) => item.no !== param.no)
        .map((item, index) => ({
          ...item,
          no: index + 1
        }));
      setObject((prev) => ({
        ...prev,
        dapus: {
          ...prev.dapus,
          data_pengarang: filteredData
        }
      }));
    },
    update: () => {
      setObject((prev) => ({
        ...prev,
        dapus: {
          ...prev.dapus,
          data_pengarang: prev.dapus.data_pengarang.map((item) =>
            item.no === object.pengarang.no
              ? {
                ...item,
                nama_depan: object.pengarang.nama_depan,
                nama_belakang: object.pengarang.nama_belakang
              }
              : item
          )
        },
        pengarang: PENGARANG_INIT
      }));
    }
  };

  const handleDapus = {
    onchange: (param) => {
      const { name, value } = param.target;

      setObject((prev) => ({
        ...prev,
        dapus: {
          ...prev.dapus,
          [name]: value
        }
      }));
    },
    new: () => {
      const newData = [...data];
      newData.push({
        ...object.dapus,
        no: data.length + 1,
        nama_pengarang: object.dapus.data_pengarang.map((item) => `${item.nama_depan} ${item.nama_belakang}`).join(',')
      });
      setData(newData);
      setObject({
        pengarang: PENGARANG_INIT,
        dapus: DAPUS_INIT
      });
    },
    delete: (param) => {
      const filteredDapus = data
        .filter((item) => item.no !== param.no)
        .map((item, index) => ({
          ...item,
          no: index + 1
        }));
      setData(filteredDapus);
    },
    edit: (param) => {
      console.log(param);
      setObject((prev) => ({
        ...prev,
        dapus: {
          no: param.no,
          judul: param.judul,
          nama_pengarang: param.nama_pengarang,
          penerbit: param.penerbit,
          tahun_terbit: param.tahun_terbit,
          edisi: param.edisi,
          data_pengarang: param.data_pengarang,
          status: !object.status
        }
      }));
    },
    update: () => {
      const indexToUpdate = data.findIndex((item) => item.no === object.dapus.no);

      if (indexToUpdate !== -1) {
        data.splice(indexToUpdate, 1, {
          ...data[indexToUpdate],

          data_pengarang: object.dapus.data_pengarang,
          nama_pengarang: Array.isArray(object.dapus.data_pengarang)
            ? object.dapus.data_pengarang.map((pengarang) => `${pengarang.nama_depan} ${pengarang.nama_belakang}`).join(', ') // Join names
            : data[indexToUpdate].nama_pengarang,
          judul: object.dapus.judul,
          penerbit: object.dapus.penerbit,
          tahun_terbit: object.dapus.tahun_terbit,
          edisi: object.dapus.edisi
        });
      }
      setData([...data]);
      setObject({
        pengarang: PENGARANG_INIT,
        dapus: DAPUS_INIT
      });
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
    },
    save: () => {
      dispatch(updateDapus(data));
    }
  };

  useEffect(() => {
    console.log('object', data);
  }, [data]);

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
              value={object.pengarang.nama_depan}
              onChange={handlePengarang.onchange}
              fullWidth
            />
            <TextField
              placeholder="Nama Belakang"
              name="nama_belakang"
              type="text"
              variant="outlined"
              value={object.pengarang.nama_belakang}
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
            rows={object.dapus.data_pengarang}
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
            value={object.dapus.judul}
            onChange={handleDapus.onchange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} sm={2} sx={{ marginTop: 2 }}>
          <TextField
            placeholder="Tahun Terbit"
            name="tahun_terbit"
            type="text"
            value={object.dapus.tahun_terbit}
            onChange={handleDapus.onchange}
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
            type="text"
            variant="outlined"
            value={object.dapus.edisi}
            onChange={handleDapus.onchange}
            fullWidth
            inputProps={{
              min: '0',
              maxLength: 3
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3} sx={{ marginTop: 2 }}>
          <TextField
            placeholder="Penerbit"
            name="penerbit"
            type="text"
            variant="outlined"
            value={object.dapus.penerbit}
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
            rows={data}
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
        <Button variant="contained" color="success" onClick={handleDapus.save} sx={{ marginTop: 5, width: '25rem' }}>
          Simpan
        </Button>
      </Stack>
    </>
  );
};

export default Dapus;
