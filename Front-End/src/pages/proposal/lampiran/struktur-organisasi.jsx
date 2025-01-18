import { Button, Stack } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import GenForm from 'components/general-form';
import { STRUCTURE_INIT } from './initial-data';
import { TableForm } from 'components/table-form';
import { structureColumns } from './initial-column';
import { structureFields } from './initial-form';
import { updateBab } from 'store/slices/proposal';
import { useSnackbar } from 'notistack';

const StrukturOrganisasi = () => {
  const [object, setObject] = useState(STRUCTURE_INIT),
    [data, setData] = useState([]),
    dispatch = useDispatch(),
    { enqueueSnackbar } = useSnackbar();
  const { lampiran, metadata: rawData } = useSelector((state) => state.app.proposal);

  const handleForm = useCallback(
    (values) => {
      if (object?.status) {
        setData((prevData) =>
          prevData.map((item) => {
            if (item.no === object.no) {
              return { ...item, ...values, status: false };
            }
            return item;
          })
        );
      } else {
        const newItem = { ...values, no: data.length + 1 };
        setData((prevData) => [...prevData, newItem]);
      }
      setObject(STRUCTURE_INIT);
    },
    [data, object.no, object?.status]
  );

  const handleStructure = {
    edit: (param) => {
      setObject({ ...param, status: true });
    },
    reset: () => {
      setObject(STRUCTURE_INIT);
    },
    delete: (param) => {
      const updatedData = [...data];
      updatedData.splice(param, 1);
      setData(updatedData);
    },
    cancel: () => {
      setObject(STRUCTURE_INIT);
    },
    save: async () => {
      const jsonData = JSON.parse(rawData[9]?.json_data);
      const payload = {
        id: rawData[9]?.id,
        proposals_id: rawData[9]?.proposals_id,
        bab_title: rawData[9]?.bab_title,
        json_data: {
          ...jsonData,
          organisasi: data
        }
      };
      //console.log('payload', payload);

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
    if (lampiran && lampiran.organisasi) {
      setData(lampiran.organisasi);
    }
  }, [lampiran]);

  return (
    <>
      <GenForm
        formFields={structureFields}
        buttonDisable={false}
        onSubmit={(values) => handleForm(values)}
        onCancel={handleStructure.cancel}
        titleButton={object?.status ? `Update Data ` : `Tambah Data`}
        initialValuesUpdate={object}
      />
      <Stack direction="column" sx={{ marginTop: 5 }}>
        <TableForm
          columns={structureColumns(handleStructure.edit, handleStructure.delete, handleStructure.reset, object?.status)}
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
