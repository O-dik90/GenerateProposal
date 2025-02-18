import { BIAYA_INIT, KEGIATAN_INIT, dataBiaya } from './initial-data';
import { Button, Grid, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { getBabProposalDetail, updateBabProposalDetail } from 'store/slices/proposal';
import { useDispatch, useSelector } from 'react-redux';

import { Columns } from './initial-column';
import { FieldsData } from './initial-form';
import GenForm from 'components/general-form';
import { TableForm } from 'components/table-form';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';

const BAB_TITLE4 = 'BAB 4 BIAYA DAN JADWAL KEGIATAN';

const Kegiatan = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { lampiran, proposal_detail } = useSelector((state) => state.app.proposal);

  const [object, setObject] = useState({
    biaya: BIAYA_INIT,
    kegiatan: KEGIATAN_INIT
  });

  const [data, setData] = useState({
    biaya: [],
    kegiatan: []
  });

  const resetFormState = useCallback((key) => {
    setObject((prev) => ({ ...prev, [key]: key === 'kegiatan' ? KEGIATAN_INIT : {} }));
  }, []);

  const handleKegiatan = {
    edit: (key) => (item) => setObject((prev) => ({ ...prev, [key]: { ...item, status: true } })),
    reset: (key) => () => resetFormState(key),
    delete: (key) => (item) => {
      setData((prev) => ({
        ...prev,
        [key]: prev[key].filter((row) => row.no !== item.no).map((row, index) => ({ ...row, no: index + 1 }))
      }));
    },
    save: async () => {
      const newData = {
        bab_title: BAB_TITLE4,
        json_data: data.kegiatan
      };

      try {
        const res = await dispatch(updateBabProposalDetail({ id: Number(id), data: newData }));
        if (updateBabProposalDetail.fulfilled.match(res)) {
          enqueueSnackbar('Berhasil menyimpan', { variant: 'success' });
        } else {
          enqueueSnackbar('Gagal menyimpan', { variant: 'error' });
        }
      } catch {
        enqueueSnackbar('Terjadi error', { variant: 'error' });
      }
    }
  };

  const handleFormSubmit = useCallback(
    (values, key) => {
      setData((prev) => ({
        ...prev,
        [key]: object[key]?.status
          ? prev[key].map((item) => (item.no === object[key]?.no ? { ...item, ...values, status: false } : item))
          : [...prev[key], { ...values, no: (prev[key]?.length || 0) + 1 }]
      }));
      resetFormState(key);
    },
    [object, resetFormState]
  );

  useEffect(() => {
    if (id) {
      dispatch(getBabProposalDetail({ id, bab_title: BAB_TITLE4 }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!proposal_detail?.length) {
      setData({ biaya: [], kegiatan: [] });
      return;
    }

    const bab4 = JSON.parse(proposal_detail[0]?.json_data || '[]');

    if (!Array.isArray(bab4)) {
      setData((prev) => ({
        ...prev,
        kegiatan: []
      }));
      return;
    }

    const cost = lampiran?.anggaran?.cost || {};
    const updatedBiaya = dataBiaya?.map((item) => ({
      ...item,
      sub_total: (cost[item.ref]?.belmawa || 0) + (cost[item.ref]?.perguruan || 0),
      sumber: item.sumber.map((sumberItem) => ({
        ...sumberItem,
        amount: cost[item.ref]?.[sumberItem.type] ?? sumberItem.amount
      }))
    }));

    setData((prev) => (prev.kegiatan !== bab4 || prev.biaya !== updatedBiaya ? { kegiatan: bab4, biaya: updatedBiaya } : prev));
  }, [proposal_detail, lampiran]);

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
          columns={Columns.Biaya(handleKegiatan.edit('biaya'), handleKegiatan.delete('biaya'), object['biaya'].status)}
          rows={data.biaya}
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
            onSubmit={(values) => handleFormSubmit(values, 'kegiatan')}
            titleButton={object['kegiatan'].status ? `Update Data` : `Tambah Data`}
            initialValuesUpdate={object['kegiatan']}
          />
          <TableForm
            columns={Columns.Kegiatan(handleKegiatan.edit('kegiatan'), handleKegiatan.delete('kegiatan'), object['kegiatan'].status)}
            rows={data.kegiatan}
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
