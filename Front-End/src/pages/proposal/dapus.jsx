import { Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TableGrid from 'components/table/TableGrid';
import { updateDapus } from 'store/slices/proposal';
import { useSnackbar } from 'notistack';

export const selector = {
  style: ['mla'],
  reference: [
    {
      key: 'book',
      value: 'BUKU'
    }
  ]
};
export const ref_penulis = {
  buku: [
    {
      key: 'authors',
      value: 'PENULIS'
    }
  ], //, 'editor', 'terjemahan'
  jurnal: [],
  url: []
};

export const DAPUS_INIT = {
  no: 0,
  category: 'book',
  style: 'mla',
  author_title: 'authors',
  authors_name: [''],
  title: '',
  publisher: '',
  year: '',
  edition: '',
  authors_data: []
};

export const PENGARANG_INIT = {
  no: 0,
  first_name: '',
  last_name: ''
};

const Dapus = () => {
  const { dapus } = useSelector((state) => state.app.proposal);
  const [data, setData] = useState([]),
    { enqueueSnackbar } = useSnackbar(),
    dispatch = useDispatch(),
    [object, setObject] = useState({
      author: PENGARANG_INIT,
      dapus: DAPUS_INIT,
      status: false
    });
  const [inisiasi, setInisiasi] = useState({
    style: 'mla',
    reference: 'book',
    author_title: 'authors'
  });

  const columns = {
    pengarang: [
      { name: 'No', field: 'no', width: '4rem' },
      { name: 'Nama Depan', field: 'first_name' },
      { name: 'Nama Belakang', field: 'last_name' }
    ],
    dapus: [
      { name: 'No', field: 'no', width: '4rem' },
      { name: 'Nama Pengarang', field: 'authors_name', width: '25rem' },
      { name: 'Judul', field: 'title', width: '12rem' },
      { name: 'Penerbit', field: 'publisher', width: '12rem' },
      { name: 'Tahun Terbit', field: 'year', width: '5rem' },
      { name: 'edisi', field: 'edition', width: '5rem' }
    ]
  };

  const handlePengarang = {
    onchange: (param) => {
      const { name, value } = param.target;

      setObject((prev) => ({
        ...prev,
        author: {
          ...prev.author,
          [name]: value
        }
      }));
    },
    new: () => {
      setObject((prev) => ({
        ...prev,
        dapus: {
          ...prev.dapus,
          authors_data: [
            ...prev.dapus.authors_data,
            {
              ...prev.author,
              no: prev.dapus.authors_data.length + 1
            }
          ]
        },
        author: PENGARANG_INIT
      }));
    },
    edit: (param) => {
      setObject((prev) => ({
        ...prev,
        author: param
      }));
    },
    delete: (param) => {
      const filteredData = object.dapus.authors_data
        .filter((item) => item.no !== param.no)
        .map((item, index) => ({
          ...item,
          no: index + 1
        }));
      setObject((prev) => ({
        ...prev,
        dapus: {
          ...prev.dapus,
          authors_data: filteredData
        }
      }));
    },
    update: () => {
      setObject((prev) => ({
        ...prev,
        dapus: {
          ...prev.dapus,
          authors_data: prev.dapus.authors_data.map((item) =>
            item.no === object.author.no
              ? {
                  ...item,
                  first_name: object.author.first_name,
                  last_name: object.author.last_name
                }
              : item
          )
        },
        author: PENGARANG_INIT
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
      console.log(data);
      const no = data !== null ? data.length + 1 : 1;

      const newEntry = {
        ...object.dapus,
        no,
        authors_name: Array.isArray(object.dapus.authors_data)
          ? object.dapus.authors_data.map((item) => `${item.first_name} ${item.last_name}`).join(',')
          : ''
      };

      setData(data !== null ? [...data, newEntry] : [newEntry]);

      setObject({
        author: PENGARANG_INIT,
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
          title: param.title,
          authors_name: param.authors_name,
          publisher: param.publisher,
          year: param.year,
          edition: param.edition,
          authors_data: param.authors_data,
          status: true
        }
      }));
    },
    update: () => {
      const indexToUpdate = data.findIndex((item) => item.no === object.dapus.no);

      if (indexToUpdate !== -1) {
        data.splice(indexToUpdate, 1, {
          ...data[indexToUpdate],

          authors_data: object.dapus.authors_data,
          authors_name: Array.isArray(object.dapus.authors_data)
            ? object.dapus.authors_data.map((o) => `${o.first_name} ${o.last_name}`).join(', ') // Join names
            : data[indexToUpdate].authors_data,
          title: object.dapus.title,
          publisher: object.dapus.publisher,
          year: object.dapus.year,
          edition: object.dapus.edition
        });
      }
      setData([...data]);
      setObject({
        author: PENGARANG_INIT,
        dapus: DAPUS_INIT
      });
    },
    detail: (row) => {
      const res = `${row.authors_name} (${row.year}) ${row.title}. ${row.publisher}.`;
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
    save: async () => {
      try {
        const res = await dispatch(updateDapus({ id: dapus[0]?.id, data: data }));

        if (updateDapus.fulfilled.match(res)) {
          enqueueSnackbar('Berhasil menyimpan', { variant: 'success' });
        } else if (updateDapus.rejected.match(res)) {
          enqueueSnackbar('Gagal menyimpan', { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar('Terjadi error', { variant: 'error' });
      }
    }
  };

  useEffect(() => {
    if (dapus !== null) {
      setData(dapus[0]?.json_data);
    }
  }, [dapus]);

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
              value={inisiasi.style}
              onChange={(e) => setInisiasi({ ...inisiasi, style: e.target.value })}
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ width: '10rem' }}
            >
              <MenuItem disabled value="">
                <em>Gaya Penulisan</em>
              </MenuItem>
              {selector.style.map((name) => (
                <MenuItem key={name} value={name}>
                  {name.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
            <Select
              displayEmpty
              value={inisiasi.reference}
              onChange={(e) => setInisiasi({ ...inisiasi, reference: e.target.value })}
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ width: '10rem' }}
            >
              <MenuItem disabled value="">
                <em>Referensi</em>
              </MenuItem>
              {selector.reference.map((o) => (
                <MenuItem key={o.key} value={o.key}>
                  {o.value.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
            {DAPUS_INIT.category === 'book' && (
              <Select
                displayEmpty
                value={inisiasi.author_title}
                onChange={(e) => setInisiasi({ ...inisiasi, author_title: e.target.value })}
                inputProps={{ 'aria-label': 'Without label' }}
                sx={{ width: '10rem' }}
              >
                <MenuItem disabled value="">
                  <em>Oleh</em>
                </MenuItem>
                {ref_penulis.buku.map((o) => (
                  <MenuItem key={o.key} value={o.key}>
                    {o.value.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Stack>
          <Typography variant="body2" gutterBottom sx={{ marginTop: 1 }}>
            Keterangan untuk gaya penulisan dan referensi dalama penulisna daftar pustaka
          </Typography>
        </Grid>
        <Grid item xs={12} sm={5} sx={{ marginTop: 2 }}>
          <TextField
            placeholder="Judul"
            name="title"
            type="text"
            variant="outlined"
            value={object.dapus.title}
            onChange={handleDapus.onchange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} sm={2} sx={{ marginTop: 2 }}>
          <TextField
            placeholder="Tahun Terbit"
            name="year"
            type="text"
            value={object.dapus.year}
            onChange={handleDapus.onchange}
            fullWidth
            inputProps={{
              maxLength: 4
            }}
          />
        </Grid>
        <Grid item xs={6} sm={2} sx={{ marginTop: 2 }}>
          <TextField
            placeholder="Edisi"
            name="edition"
            type="text"
            variant="outlined"
            value={object.dapus.edition}
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
            name="publisher"
            type="text"
            variant="outlined"
            value={object.dapus.publisher}
            onChange={handleDapus.onchange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              placeholder="Nama Depan"
              name="first_name"
              type="text"
              variant="outlined"
              value={object.author.first_name}
              onChange={handlePengarang.onchange}
              fullWidth
            />
            <TextField
              placeholder="Nama Belakang"
              name="last_name"
              type="text"
              variant="outlined"
              value={object.author.last_name}
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
            rows={object.dapus.authors_data}
            expand={false}
            action
            onEdit={handlePengarang.edit}
            onDelete={handlePengarang.delete}
            onUpdate={handlePengarang.update}
            actionedit={object.author.status}
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
            actionedit={object.dapus.status}
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
