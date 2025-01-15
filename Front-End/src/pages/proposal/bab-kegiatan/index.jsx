import { BIAYA_INIT, KEGIATAN_INIT, dataBiaya } from './initial-data';
import { Button, Grid, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Columns } from './initial-column';
import { FieldsData } from './initial-form';
import GenForm from 'components/general-form';
import { TableForm } from 'components/table-form';
import { updateBab } from 'store/slices/proposal';
import { useSnackbar } from 'notistack';

const Kegiatan = () => {
  const { biaya } = useSelector((state) => state.app.proposal),
    dispatch = useDispatch(),
    { enqueueSnackbar } = useSnackbar();
  const [object, setObject] = useState({
    biaya: BIAYA_INIT,
    kegiatan: KEGIATAN_INIT
  });
  const [data, setData] = useState({
    biaya: dataBiaya || [],
    kegiatan: []
  });

  const reset = useCallback((key) => {
    setObject((prev) => ({ ...prev, [key]: initialStateForKey(key) }));
  }, []);

  const initialStateForKey = (key) => {
    switch (key) {
      case 'kegiatan':
      default:
        return KEGIATAN_INIT;
    }
  };
  const handleKegiatan = {
    edit: (key) => (param) => {
      setObject((prev) => ({ ...prev, [key]: { ...param, status: true } }));
    },
    delete: (key) => (item) => {
      setData((prev) => ({
        ...prev,
        [key]: prev[key].filter((row) => row.no !== item.no).map((row, index) => ({ ...row, no: index + 1 }))
      }));
    }
  };

  const handleForm = useCallback(
    (values, key) => {
      if (object[key]?.status) {
        setData((prevData) => ({
          ...prevData,
          [key]: prevData[key]?.map((item) => (item.no === object[key]?.no ? { ...item, ...values, status: false } : item))
        }));
        reset(key);
      } else {
        const newItem = { ...values, no: (object[key]?.length || 0) + 1 };
        setData((prevData) => ({
          ...prevData,
          [key]: [...(prevData[key] || []), newItem]
        }));
      }
    },
    [object, reset]
  );

  const handleKegiataan = {
    save: async () => {
      const newData = {
        id: biaya?.id,
        proposals_id: biaya?.proposals_id,
        bab_title: biaya?.bab_title,
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
    }
  };

  useEffect(() => {
    if (biaya) {
      console.log(biaya);
      // setData({
      //   biaya: biaya?.json_data?.biaya || [],
      //   kegiatan: biaya?.json_data?.kegiatan || []
      // });
    }
  }, [biaya]);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        BAB 4. BIAYA DAN JADWAL KEGIATAN
      </Typography>

      <Grid item xs={12} sx={{ marginTop: 2 }}>
        <Typography variant="h5" gutterBottom>
          4.1 Anggaran Biaya
        </Typography>
        <Typography variant="h6" gutterBottom>
          Kalkulasi anggaran biaya akan ditampilkan setelah meng-upload data lampiran untuk anggaran kegiatan.
        </Typography>

        <TableForm
          columns={Columns.Biaya(handleKegiatan.edit('biaya'), handleKegiatan.delete('biaya'), false)}
          rows={data?.biaya || []}
          expand={false}
          detail=""
        />
      </Grid>

      <Grid item xs={12} sx={{ marginTop: 2 }}>
        <Typography variant="h5" gutterBottom>
          4.2 Jadwal Kegiatan
        </Typography>
        <Typography variant="h6" gutterBottom>
          Tuliskan jadwal kegiatan yang akan digunakan dalam penelitian.
        </Typography>

        <Stack direction="column" spacing={5}>
          <GenForm
            formFields={FieldsData['kegiatan']}
            buttonDisable={false}
            onSubmit={(values) => handleForm(values, 'kegiatan')}
            titleButton={object['kegiatan'].status ? `Update Data ` : `Tambah Data `}
            initialValuesUpdate={object['kegiatan']}
          />

          <TableForm
            columns={Columns.Kegiatan(handleKegiatan.edit('kegiatan'), handleKegiatan.delete('kegiatan'), false)}
            rows={data?.kegiatan || []}
            expand={false}
            detail=""
          />
        </Stack>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="success" onClick={handleKegiataan.save}>
          Simpan Kegiatan
        </Button>
      </Stack>
    </>
  );
};

export default Kegiatan;
