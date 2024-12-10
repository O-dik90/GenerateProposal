import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import { GeneralForm } from 'components/form/GeneralForm';
import Stack from '@mui/material/Stack';
import TableGrid from 'components/table/TableGrid';
import { updateBab } from 'store/slices/proposal';
import { useSnackbar } from 'notistack';

const INIT_STATE = {
  no: 1,
  title: '',
  description: '',
  status: false
};

const FIELD_CONFIG = {
  biaya: [
    { name: 'title', label: 'Judul', type: 'text', size: 12 },
    { name: 'description', label: 'Deskripsi', type: 'textarea', size: 12, rows: 10 }
  ],
  kegiatan: [
    { name: 'title', label: 'Judul', type: 'text', size: 12 },
    { name: 'description', label: 'Deskripsi', type: 'textarea', size: 12, rows: 10 }
  ]
};

const Kegiatan = () => {
  const { biaya } = useSelector((state) => state.app.proposal);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState({ biaya: [], kegiatan: [] });
  const [object, setObject] = useState({ biaya: { ...INIT_STATE }, kegiatan: { ...INIT_STATE } });
  const [errors, setErrors] = useState({ biaya: {}, kegiatan: {} });

  const validateFields = (key) => {
    const fields = object[key];
    const newErrors = {};
    if (!fields.title) newErrors.title = 'Judul wajib diisi';
    if (!fields.description) newErrors.description = 'Deskripsi wajib diisi';
    return newErrors;
  };

  const handleAction = {
    onchange: (key) => (e) => {
      const { name, value } = e.target;
      setObject((prev) => ({
        ...prev,
        [key]: { ...prev[key], [name]: value }
      }));
    },

    add: (key) => (e) => {
      e.preventDefault();
      const validationErrors = validateFields(key);
      if (Object.keys(validationErrors).length > 0) {
        setErrors((prev) => ({ ...prev, [key]: validationErrors }));
        return;
      }

      setData((prev) => ({
        ...prev,
        [key]: [...prev[key], { ...object[key], no: prev[key].length + 1 }]
      }));

      setObject((prev) => ({ ...prev, [key]: { ...INIT_STATE } }));
      setErrors((prev) => ({ ...prev, [key]: {} }));
    },

    edit: (key) => (item) => {
      setObject((prev) => ({ ...prev, [key]: { ...item, status: true } }));
    },

    update: (key) => () => {
      const validationErrors = validateFields(key);
      if (Object.keys(validationErrors).length > 0) {
        setErrors((prev) => ({ ...prev, [key]: validationErrors }));
        return;
      }

      setData((prev) => ({
        ...prev,
        [key]: prev[key].map((item) => (item.no === object[key].no ? { ...item, ...object[key] } : item))
      }));

      setObject((prev) => ({ ...prev, [key]: { ...INIT_STATE } }));
      setErrors((prev) => ({ ...prev, [key]: {} }));
    },

    delete: (key) => (item) => {
      setData((prev) => ({
        ...prev,
        [key]: prev[key].filter((row) => row.no !== item.no).map((row, index) => ({ ...row, no: index + 1 }))
      }));
    },

    detail: (item) => (
      <>
        <Typography variant="h5" gutterBottom>
          Deskripsi
        </Typography>
        <Typography variant="body1" gutterBottom>
          {item.description}
        </Typography>
      </>
    ),
    disable: (key) => !object[key].title || !object[key].description || object[key].status,
    save: async () => {
      const payload = {
        id: biaya[0]?.id,
        proposals_id: biaya[0]?.proposals_id,
        bab_title: biaya[0]?.bab_title,
        json_data: data
      };

      try {
        const result = await dispatch(updateBab(payload));
        if (updateBab.fulfilled.match(result)) {
          enqueueSnackbar('Berhasil menyimpan', { variant: 'success' });
        } else {
          enqueueSnackbar('Gagal menyimpan', { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar('Terjadi kesalahan', { variant: 'error' });
      }
    }
  };

  useEffect(() => {
    if (biaya) {
      setData({
        biaya: biaya?.json_data?.biaya || [],
        kegiatan: biaya?.json_data?.kegiatan || []
      });
    }
  }, [biaya]);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        BAB 4. BIAYA DAN JADWAL KEGIATAN
      </Typography>

      {['biaya', 'kegiatan'].map((key, index) => (
        <Grid item xs={12} key={key} sx={{ marginTop: index === 0 ? 2 : 4 }}>
          <Typography variant="h5" gutterBottom>
            {key === 'biaya' ? '4.1 Anggaran Biaya' : '4.2 Jadwal Kegiatan'}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {key === 'biaya'
              ? 'Tuliskan anggaran biaya yang akan digunakan dalam penelitian.'
              : 'Tuliskan jadwal kegiatan yang akan digunakan dalam penelitian.'}
          </Typography>

          <GeneralForm
            buttonForm={`Tambah ${key === 'biaya' ? 'Biaya' : 'Kegiatan'}`}
            buttonDisable={handleAction.disable(key)}
            formData={object[key]}
            errors={errors[key]}
            Fields={FIELD_CONFIG[key]}
            handleChange={handleAction.onchange(key)}
            handleSubmit={handleAction.add(key)}
          />

          <TableGrid
            key={`grid-${key}`}
            columns={[
              { name: 'No', field: 'no', width: '4rem' },
              { name: 'Judul', field: 'title' }
            ]}
            rows={data[key] || []}
            expand
            action
            onEdit={handleAction.edit(key)}
            onDelete={handleAction.delete(key)}
            onUpdate={handleAction.update(key)}
            detail={handleAction.detail}
          />
        </Grid>
      ))}

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="success" onClick={handleAction.save}>
          Simpan Kegiatan
        </Button>
      </Stack>
    </>
  );
};

export default Kegiatan;
