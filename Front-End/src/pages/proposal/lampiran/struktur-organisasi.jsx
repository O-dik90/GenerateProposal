import { Button, Stack } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { updateChangesAsync, updateLampiranProposalDetail } from 'store/slices/proposal';
import { useDispatch, useSelector } from 'react-redux';

import { BAB_TITLE6 } from './identitas';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import GenForm from 'components/general-form';
import { INIT_CHANGEDATA } from '../detail';
import PropTypes from 'prop-types';
import { STRUCTURE_INIT } from './initial-data';
import { TableForm } from 'components/table-form';
import { isEqual } from 'lodash';
import { structureColumns } from './initial-column';
import { structureFields } from './initial-form';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';

const StrukturOrganisasi = ({ confirmSave }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const originalDataRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const { lampiran } = useSelector((state) => state.app.proposal);

  const [object, setObject] = useState(STRUCTURE_INIT);
  const [data, setData] = useState([]);

  const handleCloseModal = () => {
    dispatch(updateChangesAsync(INIT_CHANGEDATA));
  };
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
      console.log(param);
      setData((prevData) => prevData.filter((item) => item.no !== param.no));
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

      handleCloseModal();
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
        originalDataRef.current = bab6.organisasi;
      } else {
        setData([]);
        originalDataRef.current = [];
      }
    } catch (error) {
      console.error('Error parsing JSON data:', error);
      setData([]);
    }

    return () => setData([]);
  }, [lampiran]);

  useEffect(() => {
    if (originalDataRef.current && Array.isArray(data)) {
      const hasChanged = !isEqual(data, originalDataRef.current);
      dispatch(updateChangesAsync({ ...INIT_CHANGEDATA, changesData: hasChanged }));
    }
  }, [data, dispatch]);

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
      <ConfirmDialog
        open={confirmSave}
        title={`${BAB_TITLE6} - Susunan Tim`}
        message="Simpan perubahan data?"
        onClose={handleCloseModal}
        onConfirm={handleStructure.save}
      />
    </>
  );
};

StrukturOrganisasi.propTypes = {
  confirmSave: PropTypes.bool.isRequired
};

export { StrukturOrganisasi };
