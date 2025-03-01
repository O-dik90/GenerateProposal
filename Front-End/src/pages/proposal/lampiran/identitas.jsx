import { Button, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getLampiranProposalDetail, lampiranIdentitasAsync, updateLampiranProposalDetail } from 'store/slices/proposal';
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

export const BAB_TITLE6 = 'LAMPIRAN';

const Identitas = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { gender, role } = useSelector((state) => state.app.masterData);
  const { lampiran, identitas } = useSelector((state) => state.app.proposal);

  const [object, setObject] = useState(ID_INIT);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  // Memoized role options for better performance
  const roleOptions = useMemo(() => role || [], [role]);

  useEffect(() => {
    setData(identitas ?? []);
  }, [identitas]);

  useEffect(() => {
    const fetchMasterData = async () => {
      if (!gender.length) await dispatch(masterGender({ name: 'GENDER' }));
      if (!role.length) await dispatch(masterLampiranRole({ name: 'ROLE_IDENTITAS' }));
    };
    fetchMasterData();
  }, [dispatch, gender, role]);

  useEffect(() => {
    if (id) {
      dispatch(getLampiranProposalDetail({ id, bab_title: BAB_TITLE6 }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!lampiran.length) return;

    try {
      const parsedData = JSON.parse(lampiran[0]?.json_data || '{}');
      if (Array.isArray(parsedData.identitas)) {
        dispatch(lampiranIdentitasAsync(parsedData.identitas));
      }
    } catch (error) {
      console.error('Error parsing JSON data:', error.message);
    }
  }, [dispatch, lampiran]);

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
      setData((prevData) => {
        const updatedData = prevData.filter((entry) => entry.no !== item.no).map((entry, index) => ({ ...entry, no: index + 1 }));
        return updatedData;
      });
    },

    save: async () => {
      console.log('data', data);

      try {
        const jsonData = lampiran[0]?.json_data ? JSON.parse(lampiran[0]?.json_data) : {};
        const payload = {
          bab_title: BAB_TITLE6,
          json_data: { ...jsonData, identitas: data }
        };

        const res = await dispatch(updateLampiranProposalDetail({ id: Number(id), data: payload }));

        if (res?.error) {
          enqueueSnackbar('Gagal menyimpan', { variant: 'error' });
        } else {
          enqueueSnackbar('Berhasil menyimpan', { variant: 'success' });
        }
      } catch (error) {
        enqueueSnackbar('Terjadi kesalahan saat menyimpan data', { variant: 'error' });
        console.error('Save Error:', error);
      }
    },

    detail: (item) => {
      console.log(item);
      if (!item?.no === '') return null;
      return <DetailIdentitas data={item} />;
    }
  };

  const handleForm = useCallback(
    (values) => {
      if (!Array.isArray(data)) return [];

      if (object?.status) {
        const updatedEntries = data.map((entry) => (entry.no === object.no ? { ...entry, ...values, status: false } : entry));

        dispatch(lampiranIdentitasAsync(updatedEntries));
      } else {
        const newEntry = { ...values, no: data.length + 1 };
        const newEntries = [...data, newEntry];

        dispatch(lampiranIdentitasAsync(newEntries));
        return newEntries;
      }
      setObject(ID_INIT);
    },
    [data, dispatch, object.no, object?.status]
  );

  return (
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
        {roleOptions.map((item) => (
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
  );
};

export { Identitas };
