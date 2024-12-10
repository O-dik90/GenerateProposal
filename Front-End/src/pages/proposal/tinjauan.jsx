import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import { GeneralForm } from 'components/form/GeneralForm';
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
    [object, setObject] = useState(TINJAUAN_INIT),
    [errors, setErrors] = useState({});

  const Fields = [
    { name: 'title', label: 'Judul', type: 'text', size: 12 },
    { name: 'description', label: 'Deskripsi', type: 'textarea', size: 12, rows: 10 }
  ];
  const validate = () => {
    const newErrors = {};
    if (!object.title) newErrors.title = 'Judul wajib diisi';
    if (!object.description) newErrors.description = 'Deskripsi wajib diisi';
    if (object.description.length < 50) newErrors.description = 'Deskripsi minimal 50 karakter';
    return newErrors;
  };

  const handleTinjauan = {
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
      setObject(TINJAUAN_INIT);
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
      setObject(TINJAUAN_INIT);
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
    },
    disable: object.status || !object.title || !object.description
  };
  useEffect(() => {
    if (tinjauan && tinjauan?.json_data) {
      setData(tinjauan?.json_data);
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
          <GeneralForm
            buttonForm="Tambah Pustaka Buku"
            buttonDisable={handleTinjauan.disable}
            formData={object}
            errors={errors}
            Fields={Fields}
            handleChange={handleTinjauan.onchange}
            handleSubmit={handleTinjauan.add}
          />
          <TableGrid
            key="grid-tinjauan"
            columns={[
              { name: 'No', field: 'no', width: '4rem' },
              { name: 'Judul', field: 'title' }
            ]}
            rows={data}
            expand={true}
            action
            onEdit={handleTinjauan.edit}
            onDelete={handleTinjauan.delete}
            onUpdate={handleTinjauan.update}
            actionedit={false}
            detail={handleTinjauan.detail}
          />
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="success" onClick={handleTinjauan.save}>
          Simpan Tinjauan Pustaka
        </Button>
      </Stack>
    </>
  );
};

export default Tinjauan;
