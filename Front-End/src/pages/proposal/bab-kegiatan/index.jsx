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
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { biaya: kegiatanData, metadata: rawData, lampiran } = useSelector((state) => state.app.proposal);

  const [object, setObject] = useState({
    biaya: BIAYA_INIT,
    kegiatan: KEGIATAN_INIT
  });

  const [data, setData] = useState({
    biaya: [],
    kegiatan: []
  });

  // Helper to reset form state
  const resetFormState = useCallback((key) => {
    setObject((prev) => ({ ...prev, [key]: initialStateForKey(key) }));
  }, []);

  const initialStateForKey = (key) => {
    if (key === 'kegiatan') return KEGIATAN_INIT;
    return {};
  };

  // Handle Kegiatan actions (edit, reset, delete, save)
  const handleKegiatan = {
    edit: (key) => (item) => {
      setObject((prev) => ({ ...prev, [key]: { ...item, status: true } }));
    },
    reset: (key) => () => resetFormState(key),
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
        } else {
          enqueueSnackbar('Gagal menyimpan', { variant: 'error' });
        }
      } catch {
        enqueueSnackbar('Terjadi error saat menyimpan', { variant: 'error' });
      }
    }
  };

  // Handle form submission for both biaya and kegiatan
  const handleFormSubmit = useCallback(
    (values, key) => {
      if (object[key]?.status) {
        setData((prev) => ({
          ...prev,
          [key]: prev[key].map((item) => (item.no === object[key]?.no ? { ...item, ...values, status: false } : item))
        }));
        resetFormState(key);
      } else {
        const newItem = { ...values, no: (data[key]?.length || 0) + 1 };
        setData((prev) => ({
          ...prev,
          [key]: [...prev[key], newItem]
        }));
      }
    },
    [data, object, resetFormState]
  );

  // Populate data on component mount or when biaya changes
  useEffect(() => {
    if (Array.isArray(kegiatanData) && lampiran?.anggaran?.cost) {
      const cost = lampiran.anggaran.cost;

      const updatedBiaya = dataBiaya.reduce((acc, item) => {
        const ref = item.ref;
        if (cost[ref]) {
          acc.push({
            ...item,
            sub_total: cost[ref].belmawa + cost[ref].perguruan,
            sumber: item.sumber.map((sumberItem) => ({
              ...sumberItem,
              amount: cost[ref][sumberItem.type]
            }))
          });
        } else {
          acc.push(item);
        }
        return acc;
      }, []);

      setData((prev) => {
        const isBiayaChanged = JSON.stringify(prev.biaya) !== JSON.stringify(updatedBiaya);
        const isKegiatanChanged = JSON.stringify(prev.kegiatan) !== JSON.stringify(kegiatanData);

        if (isBiayaChanged || isKegiatanChanged) {
          return {
            ...prev,
            kegiatan: kegiatanData,
            biaya: updatedBiaya
          };
        }
        return prev;
      });
    } else {
      setData((prev) => ({
        ...prev,
        kegiatan: []
      }));
    }
  }, [kegiatanData, lampiran]);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        BAB 4. BIAYA DAN JADWAL KEGIATAN
      </Typography>

      {/* Section 4.1 Anggaran Biaya */}
      <Grid item xs={12} sx={{ marginTop: 2 }}>
        <Typography variant="h5" gutterBottom>
          4.1 Anggaran Biaya
        </Typography>
        <Typography variant="h6" gutterBottom>
          Kalkulasi anggaran biaya akan ditampilkan setelah meng-upload data lampiran untuk anggaran kegiatan.
        </Typography>
        <TableForm
          columns={Columns.Biaya(handleKegiatan.edit('biaya'), handleKegiatan.delete('biaya'), false)}
          rows={data.biaya}
          expand={false}
          detail=""
        />
      </Grid>

      {/* Section 4.2 Jadwal Kegiatan */}
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
            onSubmit={(values) => handleFormSubmit(values, 'kegiatan')}
            titleButton={object['kegiatan'].status ? `Update Data` : `Tambah Data`}
            initialValuesUpdate={object['kegiatan']}
          />
          <TableForm
            columns={Columns.Kegiatan(
              handleKegiatan.edit('kegiatan'),
              handleKegiatan.delete('kegiatan'),
              handleKegiatan.reset('kegiatan'),
              object['kegiatan'].status
            )}
            rows={data.kegiatan}
            expand={false}
            detail=""
          />
        </Stack>
      </Grid>

      {/* Save Button */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="success" onClick={handleKegiatan.save}>
          Simpan Kegiatan
        </Button>
      </Stack>
    </>
  );
};

export default Kegiatan;
