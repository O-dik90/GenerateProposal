import { BIAYA_INIT, KEGIATAN_INIT, dataBiaya } from './initial-data';
import { Button, Grid, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getBabProposalDetail, getLampiranProposalDetail, updateBabProposalDetail, updateChangesAsync } from 'store/slices/proposal';
import { useDispatch, useSelector } from 'react-redux';

import { BAB_TITLE6 } from '../lampiran/identitas';
import { Columns } from './initial-column';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import { FieldsData } from './initial-form';
import GenForm from 'components/general-form';
import { INIT_CHANGEDATA } from '../detail';
import PropTypes from 'prop-types';
import { TableForm } from 'components/table-form';
import { isEqual } from 'lodash';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';

const BAB_TITLE4 = 'BAB 4 BIAYA DAN JADWAL KEGIATAN';

const Kegiatan = ({ confirmSave }) => {
  const originalDataRef = useRef(null);
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

  const handleCloseModal = () => {
    dispatch(updateChangesAsync(INIT_CHANGEDATA));
  };

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

      handleCloseModal();
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
      dispatch(getLampiranProposalDetail({ id, bab_title: BAB_TITLE6 }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!proposal_detail?.length) {
      setData({ biaya: [], kegiatan: [] });
      return;
    }

    try {
      const bab4 = JSON.parse(proposal_detail[0]?.json_data || '{}'); // Ensure parsing safely
      const isBab4Array = Array.isArray(bab4) ? bab4 : [];

      let updatedBiaya = [];
      if (lampiran?.length > 0) {
        const dataLampiran = JSON.parse(lampiran[0]?.json_data || '{}');

        const cost = dataLampiran?.anggaran?.cost || {};
        updatedBiaya =
          dataBiaya?.map((item) => ({
            ...item,
            sub_total: (cost[item.ref]?.belmawa || 0) + (cost[item.ref]?.perguruan || 0),
            sumber: item.sumber.map((sumberItem) => ({
              ...sumberItem,
              amount: cost[item.ref]?.[sumberItem.type] ?? sumberItem.amount
            }))
          })) || [];
      }

      setData((prev) => {
        if (JSON.stringify(prev.kegiatan) !== JSON.stringify(isBab4Array) || JSON.stringify(prev.biaya) !== JSON.stringify(updatedBiaya)) {
          return { kegiatan: isBab4Array, biaya: updatedBiaya };
        }
        return prev;
      });
      originalDataRef.current = isBab4Array;
    } catch (error) {
      console.error('Error parsing proposal_detail JSON:', error);
      setData({ biaya: [], kegiatan: [] });
    }
  }, [proposal_detail, lampiran]);

  useEffect(() => {
    if (originalDataRef.current !== null && Object.keys(data).length > 0 && !isEqual(data.kegiatan, originalDataRef.current)) {
      dispatch(
        updateChangesAsync({
          ...INIT_CHANGEDATA,
          changesData: true
        })
      );
    }
  }, [data, dispatch]);

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
        <TableForm expand={false} columns={Columns.Biaya()} rows={data.biaya} />
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
            expand={false}
            columns={Columns.Kegiatan(
              handleKegiatan.edit('kegiatan'),
              handleKegiatan.delete('kegiatan'),
              handleKegiatan.reset('kegiatan'),
              object['kegiatan']
            )}
            rows={data.kegiatan}
          />
        </Stack>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="success" onClick={handleKegiatan.save}>
          Simpan Kegiatan
        </Button>
      </Stack>

      <ConfirmDialog
        open={confirmSave}
        title={`${BAB_TITLE4}`}
        message="Simpan perubahan data?"
        onClose={handleCloseModal}
        onConfirm={handleKegiatan.save}
      />
    </>
  );
};
Kegiatan.propTypes = {
  confirmSave: PropTypes.bool.isRequired
};

export default Kegiatan;
