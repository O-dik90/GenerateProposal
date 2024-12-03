import { Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TableGrid from 'components/table/TableGrid';
import { updateBab } from 'store/slices/proposal';
import { useSnackbar } from 'notistack';

export const TINJAUAN_INIT = {
  no: 1,
  title: '',
  description: '',
  status: false
};

const Tinjauan = () => {
  const { tinjauan } = useSelector((state) => state.app.proposal),
    dispatch = useDispatch(),
    { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState([]),
    [object, setObject] = useState(TINJAUAN_INIT);

  const handlePustaka = {
    onchange: (e) => setObject({ ...object, [e.target.name]: e.target.value }),
    add: () => {
      if (data === null) {
        setData(object);
      } else {
        setData([...data, { ...object, no: data.length + 1 }]);
      }
      setObject(TINJAUAN_INIT);
    },
    edit: (param) => {
      setObject({ ...param, status: true });
    },
    update: () => {
      setData(data.map((item) => (item.no === object.no ? { ...item, ...object } : item)));
      setObject(TINJAUAN_INIT);
    },
    delete: (param) => {
      setData(data.filter((item) => item.no !== param?.no).map((item, index) => ({ ...item, no: index + 1 })));
    },
    detail: (param) => {
      return (
        <>
          <Typography variant="h5" gutterBottom component="div">
            Deskripsi
          </Typography>
          {param && (
            <Typography variant="body1" gutterBottom component="div">
              {param?.description}
            </Typography>
          )}
        </>
      );
    }
  };

  const handleSimpan = async () => {
    const newData = {
      id: tinjauan[0]?.id,
      proposals_id: tinjauan[0]?.proposals_id,
      bab_title: tinjauan[0]?.bab_title,
      json_data: data
    };

    try {
      const res = await dispatch(updateBab(newData));
      if (updateBab.fulfilled.match(res)) {
        enqueueSnackbar('Berhasil menyimpan', { variant: 'success' });
      } else if (updateBab.rejected.match(res)) {
        enqueueSnackbar('Gagal menyimpan', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Terjadi error', { variant: 'error' });
    }
  };

  useEffect(() => {
    console.log(tinjauan[0]?.json_data);
    if (tinjauan && tinjauan[0]?.json_data) {
      setData(tinjauan[0]?.json_data);
    }
  }, [tinjauan]);
  return (
    <>
      <Typography variant="h4" gutterBottom>
        BAB 2. Tinjauan Pustaka
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Typography variant="h6" gutterBottom>
            Tuliskan judul dan deskripsi pada tinjauan pustaka yang akan digunakan dalam penelitian.
          </Typography>
          <Stack direction="column" spacing={2}>
            <TextField
              placeholder="Judul"
              name="title"
              type="text"
              variant="outlined"
              value={object.title}
              onChange={handlePustaka.onchange}
              fullWidth
            />
            <TextField
              placeholder="Deskripsi"
              name="description"
              type="text"
              variant="outlined"
              value={object.description}
              onChange={handlePustaka.onchange}
              multiline
              minRows={10}
              fullWidth
            />
          </Stack>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePustaka.add}
            disabled={!object.title || !object.description}
            sx={{ marginY: 2 }}
          >
            Tambah Pustaka
          </Button>
          <TableGrid
            key="grid-tinjauan"
            columns={[
              { name: 'No', field: 'no', width: '4rem' },
              { name: 'Judul', field: 'title' }
            ]}
            rows={data}
            expand={true}
            action
            onEdit={handlePustaka.edit}
            onDelete={handlePustaka.delete}
            onUpdate={handlePustaka.update}
            actionedit={false}
            detail={handlePustaka.detail}
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
        <Button variant="contained" color="success" onClick={handleSimpan} sx={{ width: '25rem' }}>
          Simpan
        </Button>
      </Stack>
    </>
  );
};

export default Tinjauan;
