import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import { GeneralForm } from 'components/form/GeneralForm';
import Stack from '@mui/material/Stack';
import TableGrid from 'components/table/TableGrid';
import { updateBab } from 'store/slices/proposal';
import { useSnackbar } from 'notistack';

export const PELAKSANAAN_INIT = {
  no: 1,
  title: '',
  description: '',
  status: false
};

const Pelaksanaan = () => {
  const { pelaksanaan } = useSelector((state) => state.app.proposal),
    dispatch = useDispatch(),
    { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState([]),
    [object, setObject] = useState(PELAKSANAAN_INIT),
    [errors, setErrors] = useState({});

  const Fields = [
    { name: 'title', label: 'Judul Sub Bab', type: 'text', size: 12 },
    { name: 'description', label: 'Deskripsi', type: 'textarea', size: 12, rows: 10 }
  ];
  const validate = () => {
    const newErrors = {};
    if (!object.title) newErrors.title = 'Judul wajib diisi';
    if (!object.description) newErrors.description = 'Deskripsi wajib diisi';

    return newErrors;
  };

  const handlePelaksanan = {
    onchange: (e) => setObject({ ...object, [e.target.name]: e.target.value }),
    add: (e) => {
      e.preventDefault();
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      if (data === null) {
        setData(object);
      } else {
        setData([...data, { ...object, no: data.length + 1 }]);
      }
      setObject(PELAKSANAAN_INIT);
      setErrors({});
    },
    edit: (param) => {
      setObject({ ...param, status: true });
    },
    update: () => {
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setData(data.map((item) => (item.no === object.no ? { ...item, ...object } : item)));
      setObject(PELAKSANAAN_INIT);
      setErrors({});
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
    },
    save: async () => {
      const newData = {
        id: pelaksanaan[0]?.id,
        proposals_id: pelaksanaan[0]?.proposals_id,
        bab_title: pelaksanaan[0]?.bab_title,
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
    },
    disable: object.status || !object.title || !object.description
  };

  useEffect(() => {
    if (pelaksanaan && pelaksanaan?.json_data) {
      setData(pelaksanaan?.json_data);
    }
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
          <GeneralForm
            buttonForm="Tambah Pustaka Buku"
            buttonDisable={handlePelaksanan.disable}
            formData={object}
            errors={errors}
            Fields={Fields}
            handleChange={handlePelaksanan.onchange}
            handleSubmit={handlePelaksanan.add}
          />
          <TableGrid
            key="grid-tinjauan"
            columns={[
              { name: 'No', field: 'no', width: '4rem' },
              { name: 'Judul Sub Bab', field: 'title' }
            ]}
            rows={data}
            expand={true}
            action
            onEdit={handlePelaksanan.edit}
            onDelete={handlePelaksanan.delete}
            onUpdate={handlePelaksanan.update}
            actionedit={object.status}
            detail={handlePelaksanan.detail}
          />
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="success" onClick={handlePelaksanan.save}>
          Simpan Pelaksanaan
        </Button>
      </Stack>
    </>
  );
};

export default Pelaksanaan;
