import { Button, Stack } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BAB_TITLE6 } from './identitas';
import GenForm from 'components/general-form';
import { STRUCTURE_INIT } from './initial-data';
import { TableForm } from 'components/table-form';
import { structureColumns } from './initial-column';
import { structureFields } from './initial-form';
import { updateLampiranProposalDetail } from 'store/slices/proposal';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';

const StrukturOrganisasi = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { lampiran } = useSelector((state) => state.app.proposal);

  const [object, setObject] = useState(STRUCTURE_INIT);
  const [data, setData] = useState([]);

  const handleForm = useCallback(
    (values) => {
      setData((prevData) => {
        if (object?.status) {
          return prevData.map((item) => (item.no === object.no ? { ...item, ...values, status: false } : item));
        } else {
          return [...prevData, { ...values, no: prevData.length + 1 }];
        }
      });
      setObject(STRUCTURE_INIT);
    },
    [object]
  );

  const handleStructure = {
    edit: (param) => {
      setObject({ ...param, status: true });
    },
    reset: () => {
      setObject(STRUCTURE_INIT);
    },
    delete: (param) => {
      setData((prevData) => prevData.filter((_, index) => index !== param));
    },
    cancel: () => {
      setObject(STRUCTURE_INIT);
    },
    save: async () => {
      if (!lampiran.length) return;

      try {
        const jsonData = JSON.parse(lampiran[0]?.json_data || '{}');
        const payload = {
          bab_title: BAB_TITLE6,
          json_data: {
            ...jsonData,
            organisasi: data
          }
        };

        const res = await dispatch(updateLampiranProposalDetail({ id: Number(id), data: payload }));
        if (updateLampiranProposalDetail.fulfilled.match(res)) {
          enqueueSnackbar('Berhasil menyimpan', { variant: 'success' });
        } else {
          enqueueSnackbar('Gagal menyimpan', { variant: 'error' });
        }
      } catch (error) {
        console.error('Error saving proposal:', error);
        enqueueSnackbar('Gagal menyimpan data pustaka', { variant: 'error' });
      }
    }
  };

  useEffect(() => {
    if (!lampiran.length) {
      setData([]);
      return;
    }

    try {
      const bab6 = JSON.parse(lampiran[0]?.json_data || '{}');

      if (Array.isArray(bab6?.organisasi)) {
        setData((prev) => (JSON.stringify(prev) !== JSON.stringify(bab6.organisasi) ? bab6.organisasi : prev));
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error parsing JSON data:', error);
      setData([]);
    }

    return () => setData([]);
  }, [lampiran]);

  return (
    <>
      <GenForm
        formFields={structureFields}
        buttonDisable={false}
        onSubmit={handleForm}
        onCancel={handleStructure.cancel}
        titleButton={object?.status ? 'Update Data' : 'Tambah Data'}
        initialValuesUpdate={object}
      />
      <Stack direction="column" sx={{ marginTop: 5 }}>
        <TableForm
          columns={structureColumns(handleStructure.edit, handleStructure.delete, handleStructure.reset, object)}
          rows={data || []}
          expand={false}
        />
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="success" onClick={handleStructure.save}>
          Simpan Detail
        </Button>
      </Stack>
    </>
  );
};

export { StrukturOrganisasi };
