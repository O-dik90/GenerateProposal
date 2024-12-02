import { Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TableGrid from 'components/table/TableGrid';
import { useSelector } from 'react-redux';

// import { updateBabPendahuluan } from 'store/slices/proposal';

// import { useSnackbar } from 'notistack';

export const BIAYA_INIT = {
  no: 1,
  title: '',
  description: '',
  status: false
};

export const KEGIATAN_INIT = {
  no: 1,
  title: '',
  description: '',
  status: false
};

const Kegiatan = () => {
  const { biaya } = useSelector((state) => state.app.proposal);
  const [data, setData] = useState({
    biaya: [],
    kegiatan: []
  });
  const [object, setObject] = useState({
    biaya: BIAYA_INIT,
    kegiatan: KEGIATAN_INIT
  });

  const handleBiaya = {
    onchange: (param) => {
      const { name, value } = param.target;

      setObject((prev) => ({
        ...prev,
        biaya: {
          ...prev.biaya,
          [name]: value
        }
      }));
    },
    add: () => {
      const newBiaya = [...data.biaya, { ...object.biaya, no: data.biaya.length + 1 }];
      setData((prev) => ({ ...prev, biaya: newBiaya }));
      setObject((prev) => ({ ...prev, biaya: BIAYA_INIT }));
    },
    edit: (param) => {
      setObject((prev) => ({ ...prev, biaya: param }));
    },
    update: () => {
      const updatedBiaya = data.biaya.map((item) => (item.no === object.biaya.no ? { ...object.biaya } : item));
      setData((prev) => ({ ...prev, biaya: updatedBiaya }));
      setObject((prev) => ({ ...prev, biaya: BIAYA_INIT }));
    },
    delete: (param) => {
      const filteredBiaya = data.biaya.filter((item) => item.no !== param?.no).map((item, index) => ({ ...item, no: index + 1 }));
      setData((prev) => ({ ...prev, biaya: filteredBiaya }));
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

  const handleKegiatan = {
    onchange: (param) => {
      const { name, value } = param.target;

      setObject((prev) => ({
        ...prev,
        kegiatan: {
          ...prev.kegiatan,
          [name]: value
        }
      }));
    },
    add: () => {
      const newKegiatan = [...data.kegiatan, { ...object.kegiatan, no: data.kegiatan.length + 1 }];
      setData((prev) => ({ ...prev, kegiatan: newKegiatan }));
      setObject((prev) => ({ ...prev, kegiatan: KEGIATAN_INIT }));
    },
    edit: (param) => {
      setObject((prev) => ({ ...prev, kegiatan: param }));
    },
    update: () => {
      const updatedKegiatan = data.kegiatan.map((item) => (item.no === object.kegiatan.no ? { ...object.kegiatan } : item));
      setData((prev) => ({ ...prev, kegiatan: updatedKegiatan }));
      setObject((prev) => ({ ...prev, kegiatan: KEGIATAN_INIT }));
    },
    delete: (param) => {
      const filteredKegiatan = data.kegiatan.filter((item) => item.no !== param?.no).map((item, index) => ({ ...item, no: index + 1 }));
      setData((prev) => ({ ...prev, kegiatan: filteredKegiatan }));
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

  const handleSimpan = () => {
    const newData = {
      id: biaya[0]?.id,
      proposal_id: biaya[0]?.proposals_id,
      bab_title: biaya[0]?.bab_title,
      json_data: data
    };
    console.log(newData);
  };

  useEffect(() => {
    console.log(biaya[0]);
    if (biaya !== null) {
      setData((prev) => ({
        ...prev,
        biaya: biaya[0]?.json_data?.biaya,
        kegiatan: biaya[0]?.json_data?.kegiatan
      }));
    }
  }, [biaya]);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        BAB 4. BIAYA DAN JADWAL KEGIATAN
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Typography variant="h5" gutterBottom>
            4.1 Anggaran Biaya
          </Typography>
          <Typography variant="h6" gutterBottom>
            Tuliskan anggaran biaya yang akan digunakan dalam penelitian.
          </Typography>
          <Stack direction="column" spacing={2}>
            <TextField
              placeholder="Judul"
              name="title"
              type="text"
              variant="outlined"
              value={object.biaya.title}
              onChange={handleBiaya.onchange}
              fullWidth
            />
            <TextField
              placeholder="Deskripsi"
              name="description"
              type="text"
              variant="outlined"
              value={object.biaya.description}
              onChange={handleBiaya.onchange}
              multiline
              minRows={10}
              fullWidth
            />
          </Stack>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBiaya.add}
            disabled={!object.biaya.title || !object.biaya.description}
            sx={{ marginY: 2 }}
          >
            Tambah Pustaka
          </Button>
          <TableGrid
            key="grid-kegiatan"
            columns={[
              { name: 'No', field: 'no', width: '4rem' },
              { name: 'Judul', field: 'title' }
            ]}
            rows={data?.biaya || []}
            expand={true}
            action
            onEdit={handleBiaya.edit}
            onDelete={handleBiaya.delete}
            onUpdate={handleBiaya.update}
            actionedit={false}
            detail={handleBiaya.detail}
          />
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Typography variant="h5" gutterBottom>
            4.2 Jadwal Kegiatan
          </Typography>
          <Typography variant="h6" gutterBottom>
            Tuliskan jadwal kegiatan yang akan digunakan dalam penelitian.
          </Typography>
          <Stack direction="column" spacing={2}>
            <TextField
              placeholder="Judul"
              name="title"
              type="text"
              variant="outlined"
              value={object.kegiatan.title}
              onChange={handleKegiatan.onchange}
              fullWidth
            />
            <TextField
              placeholder="Deskripsi"
              name="description"
              type="text"
              variant="outlined"
              value={object.kegiatan.description}
              onChange={handleKegiatan.onchange}
              multiline
              minRows={10}
              fullWidth
            />
          </Stack>
          <Button
            variant="contained"
            color="primary"
            onClick={handleKegiatan.add}
            disabled={!object.kegiatan.title || !object.kegiatan.description}
            sx={{ marginY: 2 }}
          >
            Tambah Pustaka
          </Button>
          <TableGrid
            key="grid-kegiatan"
            columns={[
              { name: 'No', field: 'no', width: '4rem' },
              { name: 'Judul', field: 'title' }
            ]}
            rows={data?.kegiatan || []}
            expand={true}
            action
            onEdit={handleKegiatan.edit}
            onDelete={handleKegiatan.delete}
            onUpdate={handleKegiatan.update}
            actionedit={false}
            detail={handleKegiatan.detail}
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

export default Kegiatan;
