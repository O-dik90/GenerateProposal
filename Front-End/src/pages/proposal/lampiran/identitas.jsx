import { Box, Button, Grid, List, ListItem, MenuItem, Select, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getLampiranProposalDetail, lampiranIdentitasAsync, updateChangesAsync, updateLampiranProposalDetail } from 'store/slices/proposal';
import { masterGender, masterLampiranRole } from 'store/slices/master-data';
import { useDispatch, useSelector } from 'react-redux';

import { DetailIdentitas } from './detail-identitas';
import GenForm from 'components/general-form';
import { ID_INIT } from './initial-data';
import { TableForm } from 'components/table-form';
import { initialFields } from './initial-form';
import { lampiranColumns } from './initial-column';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import { INIT_CHANGEDATA } from '../detail';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

export const BAB_TITLE6 = 'LAMPIRAN';

const Identitas = ({ confirmSave }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const originalDataRef = useRef(null);
  const { gender, role } = useSelector((state) => state.app.masterData);
  const { lampiran, identitas } = useSelector((state) => state.app.proposal);
  const [object, setObject] = useState(ID_INIT);
  const [open, setOpen] = useState(false);
  const data = useMemo(() => identitas || [], [identitas]);

  const roleOptions = useMemo(() => role || [], [role]);

  const handleCloseModal = () => {
    dispatch(updateChangesAsync(INIT_CHANGEDATA));
  };

  useEffect(() => {
    const fetchMasterData = async () => {
      if (!gender.length) await dispatch(masterGender({ name: 'GENDER' }));
      if (!role.length) await dispatch(masterLampiranRole({ name: 'ROLE_IDENTITAS' }));
    };
    fetchMasterData();
  }, [dispatch, gender, role]);

  useEffect(() => {
    dispatch(getLampiranProposalDetail({ id, bab_title: BAB_TITLE6 }));
  }, [dispatch, id]);

  useEffect(() => {
    if (!lampiran.length) return;

    try {
      const parsedData = JSON.parse(lampiran[0]?.json_data || '{}');
      console.log(parsedData);

      if (Array.isArray(parsedData.identitas) && parsedData.identitas !== null) {
        dispatch(lampiranIdentitasAsync(parsedData.identitas));
        originalDataRef.current = parsedData.identitas;
      } else {
        dispatch(lampiranIdentitasAsync([]));
        originalDataRef.current = [];
      }
    } catch (error) {
      console.error('Error parsing JSON data:', error.message);
    }
  }, [dispatch, lampiran]);

  useEffect(() => {
    if (originalDataRef.current && Array.isArray(data)) {
      const hasChanged = !isEqual(data, originalDataRef.current);
      dispatch(updateChangesAsync({ ...INIT_CHANGEDATA, changesData: hasChanged }));
    }
  }, [data, dispatch]);

  const handlePersonal = {
    edit: (item) => {
      if (!item) return;
      setObject({ ...item, status: true });
    },

    reset: () => {
      setOpen(false);
      setObject(ID_INIT);
    },

    delete: (item) => {
      const updatedData = data.filter((entry) => entry.no !== item.no).map((entry, index) => ({ ...entry, no: index + 1 }));
      dispatch(lampiranIdentitasAsync(updatedData));
    },

    save: async () => {
      try {
        const jsonData = lampiran[0]?.json_data ? JSON.parse(lampiran[0]?.json_data) : {};
        const payload = {
          bab_title: BAB_TITLE6,
          json_data: { ...jsonData, identitas: data }
        };

        const res = await dispatch(updateLampiranProposalDetail({ id: Number(id), data: payload }));

        if (updateLampiranProposalDetail.fulfilled.match(res)) {
          enqueueSnackbar('Berhasil menyimpan', { variant: 'success' });

          originalDataRef.current = [...data];
          dispatch(updateChangesAsync({ ...INIT_CHANGEDATA, changesData: false }));
        } else {
          enqueueSnackbar('Gagal menyimpan', { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar('Terjadi kesalahan saat menyimpan data', { variant: 'error' });
        console.error('Save Error:', error);
      }

      handleCloseModal();
    },

    detail: (item) => {
      if (!item || item.no === '') return null;

      const itemData = [
        { label: 'Program Studi', value: item.major },
        { label: 'Jenis Kelamin', value: item.gender },
        { label: 'No HP', value: item.phone },
        { label: 'Tanggal Lahir', value: item.birth_date },
        { label: 'Kota/Tempat Kelahiran', value: item.birth_place }
      ];

      return (
        <>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {itemData.map((item, index) => (
              <ListItem key={`${item.label}-${index}`} disableGutters>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {item.label}:
                  </Typography>
                  <Typography variant="body1">{item.value || 'Data tidak tersedia'}</Typography>
                </Box>
              </ListItem>
            ))}
          </List>
          <DetailIdentitas data={item} />
        </>
      );
    }
  };

  const handleForm = useCallback(
    (values) => {
      if (!Array.isArray(data)) return;

      if (object?.status) {
        const updatedEntries = data.map((entry) => (entry.no === object.no ? { ...entry, ...values, status: false } : entry));
        dispatch(lampiranIdentitasAsync(updatedEntries));
      } else {
        const newEntry = { ...values, no: data.length + 1 };
        const newEntries = [...data, newEntry];
        dispatch(lampiranIdentitasAsync(newEntries));
      }
      setObject(ID_INIT);
    },
    [data, dispatch, object]
  );

  return (
    <>
      <Stack direction="column" spacing={2}>
        <Typography variant="h5" gutterBottom>
          Detail Identitas
        </Typography>
        <Select
          id="role_person"
          displayEmpty
          disabled={object.status}
          value={object.role_person || ''}
          onChange={(e) => setObject((prev) => ({ ...prev, role_person: e.target.value }))}
          sx={{ width: '15rem' }}
        >
          <MenuItem disabled value="">
            <em>Pilih Keanggotaan</em>
          </MenuItem>
          {roleOptions?.map((item) => (
            <MenuItem key={item.id} value={item.init}>
              {item.init}
            </MenuItem>
          ))}
        </Select>
        <Grid item xs={12} sx={{ marginY: 1 }}>
          {object.role_person && (
            <GenForm
              formFields={initialFields.personal}
              buttonDisable={open}
              onSubmit={handleForm}
              titleButton={object.status ? 'Update Data Personal' : 'Tambah Data Personal'}
              initialValuesUpdate={object}
            />
          )}
        </Grid>
        <TableForm
          columns={lampiranColumns.personal(handlePersonal.edit, handlePersonal.delete, handlePersonal.reset, object.no)}
          rows={data}
          expand
          detail={handlePersonal.detail}
        />
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Button variant="contained" color="success" onClick={handlePersonal.save}>
            Simpan Detail
          </Button>
        </Stack>
      </Stack>
      <ConfirmDialog
        open={confirmSave}
        title={`${BAB_TITLE6} - Identitas`}
        message="Simpan perubahan data?"
        onClose={handleCloseModal}
        onConfirm={handlePersonal.save}
      />
    </>
  );
};

Identitas.propTypes = {
  confirmSave: PropTypes.bool.isRequired
};

export { Identitas };
