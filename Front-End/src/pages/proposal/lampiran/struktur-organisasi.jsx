import React, { useCallback, useEffect, useState } from 'react';

import GenForm from 'components/general-form';
import { STRUCTURE_INIT } from './initial';
import { Stack } from '@mui/material';
import { TableForm } from 'components/table-form';
import { structureColumns } from './initial-column';
import { structureFields } from './initial-form';

const StrukturOrganisasi = () => {
  const [object, setObject] = useState(STRUCTURE_INIT),
    [data, setData] = useState([]);

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

  useEffect(() => {}, [data]);

  const handleStructure = {
    edit: (param) => {
      setObject({ ...param, status: true });
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
      const payload = {
        id: lampiran?.id,
        proposals_id: lampiran?.proposals_id,
        bab_title: lampiran?.bab_title,
        json_data: data
      };

      console.log('payload', payload);

      // try {
      //   const result = await dispatch(updateBab(payload));
      //   if (updateBab.fulfilled.match(result)) {
      //     enqueueSnackbar('Berhasil menyimpan', { variant: 'success' });
      //   } else {
      //     enqueueSnackbar('Gagal menyimpan', { variant: 'error' });
      //   }
      // } catch (error) {
      //   enqueueSnackbar('Terjadi kesalahan', { variant: 'error' });
      // }
    }
  };

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
          columns={structureColumns(handleStructure.edit, handleStructure.delete, object?.status)}
          rows={data || []}
          expand={false}
        />
      </Stack>
    </>
  );
};

export { StrukturOrganisasi };
