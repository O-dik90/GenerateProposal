import { Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TableGrid from 'components/table/TableGrid';
import { useSelector } from 'react-redux';

// import { useDispatch, useSelector } from 'react-redux';

// import { updateBabPendahuluan } from 'store/slices/proposal';

// import { useParams } from 'react-router-dom';
// import { useSnackbar } from 'notistack';

export const PELAKSANAAN_INIT = {
  no: 1,
  title: '',
  description: '',
  status: false
};

const Pelaksanaan = () => {
  const { pelaksanaan } = useSelector((state) => state.app.proposal);
  const [data, setData] = useState([]),
    [object, setObject] = useState(PELAKSANAAN_INIT);

  const handlePelaksanan = {
    onchange: (e) => setObject({ ...object, [e.target.name]: e.target.value }),
    add: () => {
      console.log(object);
      if (data === null) {
        setData(object);
      } else {
        setData([...data, { ...object, no: data.length + 1 }]);
      }
      setObject(PELAKSANAAN_INIT);
    },
    edit: (param) => {
      setObject({ ...param });
    },
    update: () => {
      setData(data.map((item) => (item.no === object.no ? { ...object } : item)));
      setObject(PELAKSANAAN_INIT);
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

  const handleSimpan = () => {
    const newData = {
      id: pelaksanaan[0]?.id,
      proposal_id: pelaksanaan[0]?.proposals_id,
      bab_title: pelaksanaan[0]?.bab_title,
      json_data: data
    };
    console.log(newData);
  };

  useEffect(() => {
    console.log(pelaksanaan[0]);
  }, [pelaksanaan]);
  return (
    <>
      <Typography variant="h4" gutterBottom>
        BAB 3. Tahap Pelaksanaan
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Typography variant="h6" gutterBottom>
            Tuliskan judul dan deskripsi di tahap pelaksanakaan yang akan digunakan dalam penelitian.
          </Typography>
          <Stack direction="column" spacing={2}>
            <TextField
              placeholder="Judul"
              name="title"
              type="text"
              variant="outlined"
              value={object.title}
              onChange={handlePelaksanan.onchange}
              fullWidth
            />
            <TextField
              placeholder="Deskripsi"
              name="description"
              type="text"
              variant="outlined"
              value={object.description}
              onChange={handlePelaksanan.onchange}
              multiline
              minRows={10}
              fullWidth
            />
          </Stack>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePelaksanan.add}
            disabled={!object.title || !object.description}
            sx={{ marginY: 2 }}
          >
            Tambah Tahapan
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
            onEdit={handlePelaksanan.edit}
            onDelete={handlePelaksanan.delete}
            onUpdate={handlePelaksanan.update}
            actionedit={false}
            detail={handlePelaksanan.detail}
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

export default Pelaksanaan;
