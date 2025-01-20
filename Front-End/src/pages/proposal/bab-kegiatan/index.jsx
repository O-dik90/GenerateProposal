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
  const { biaya, metadata: rawData } = useSelector((state) => state.app.proposal),
    { cost } = useSelector((state) => state.app.proposal.lampiran?.anggaran),
    dispatch = useDispatch(),
    { enqueueSnackbar } = useSnackbar();
  const [object, setObject] = useState({
    biaya: BIAYA_INIT,
    kegiatan: KEGIATAN_INIT
  });
  const [data, setData] = useState({
    biaya: [],
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
    reset: (key) => () => {
      reset(key);
    },
    delete: (key) => (item) => {
      setData((prev) => ({
        ...prev,
        [key]: prev[key].filter((row) => row.no !== item.no).map((row, index) => ({ ...row, no: index + 1 }))
      }));
    },
    save: async () => {
      const newData = {
        id: rawData[7]?.id,
        proposals_id: rawData[7]?.proposals_id,
        bab_title: rawData[7]?.bab_title,
        json_data: data.kegiatan
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

  const handleForm = useCallback(
    (values, key) => {
      if (object[key]?.status) {
        setData((prevData) => ({
          ...prevData,
          [key]: prevData[key]?.map((item) => (item.no === object[key]?.no ? { ...item, ...values, status: false } : item))
        }));
        reset(key);
      } else {
        const newItem = { ...values, no: (data[key]?.length || 0) + 1 };
        setData((prevData) => ({
          ...prevData,
          [key]: [...(prevData[key] || []), newItem]
        }));
      }
    },
    [data, object, reset]
  );

  useEffect(() => {
    if (biaya) {
      //console.log(biaya);
      setData({
        biaya: [],
        kegiatan: biaya?.kegiatan || []
      });
    }
  }, [biaya]);

  useEffect(() => {
    const updatedData = dataBiaya.map((item) => {
      const ref = item.ref;
      if (cost[ref]) {
        return {
          ...item,
          sub_total: cost[ref]['belmawa'] + cost[ref]['perguruan'],
          sumber: item.sumber.map((sumberItem) => {
            return {
              ...sumberItem,
              amount: cost[ref][sumberItem.type]
            };
          })
        };
      }

      return item;
    });

    setData((prevData) => ({
      ...prevData,
      biaya: updatedData
    }));
  }, [cost]);

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
            columns={Columns.Kegiatan(
              handleKegiatan.edit('kegiatan'),
              handleKegiatan.delete('kegiatan'),
              handleKegiatan.reset('kegiatan'),
              object['kegiatan'].status
            )}
            rows={data?.kegiatan || []}
            expand={false}
            detail=""
          />
        </Stack>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="success" onClick={handleKegiatan.save}>
          Simpan Kegiatan
        </Button>
      </Stack>
    </>
  );
};

export default Kegiatan;
