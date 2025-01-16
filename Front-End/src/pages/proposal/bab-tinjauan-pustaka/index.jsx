import { Button, Grid, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Columns } from './initial-column';
import { FieldsData } from './initial-form';
import GenForm from 'components/general-form';
import { TINJAUAN_INIT } from './initial-data';
import { TableForm } from 'components/table-form';
import { updateBab } from 'store/slices/proposal';
import { useSnackbar } from 'notistack';

const Tinjauan = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { tinjauan: DataTinjauan, metadata: rawData } = useSelector((state) => state.app.proposal);

  const [data, setData] = useState([]);
  const [formObject, setFormObject] = useState({ tinjauan: TINJAUAN_INIT });

  const resetFormObject = useCallback((key) => {
    setFormObject((prev) => ({ ...prev, [key]: TINJAUAN_INIT }));
  }, []);

  const handleFormSubmit = useCallback(
    (values, key) => {
      setData((prevData) => {
        const updatedData = [...(prevData[key] || [])];
        if (formObject[key]?.status) {
          const index = updatedData.findIndex((item) => item.no === formObject[key].no);
          if (index !== -1) updatedData[index] = { ...values, no: formObject[key].no, status: false };
        } else {
          updatedData.push({ ...values, no: updatedData.length + 1 });
        }
        return { ...prevData, [key]: updatedData };
      });
      resetFormObject(key);
    },
    [formObject, resetFormObject]
  );

  const handleTinjauan = {
    edit: (key) => (item) => {
      setFormObject((prev) => ({ ...prev, [key]: { ...item, status: true } }));
    },
    delete: (key) => (item) => {
      setData((prevData) => {
        const updatedData = (prevData[key] || []).filter((row) => row.no !== item.no).map((row, index) => ({ ...row, no: index + 1 })); // Reindex rows
        return { ...prevData, [key]: updatedData };
      });
    },
    detail: (item) => (
      <>
        <Typography variant="h5" gutterBottom component="div">
          Deskripsi
        </Typography>
        {item?.description && (
          <Typography variant="body1" gutterBottom component="div">
            {item.description}
          </Typography>
        )}
      </>
    ),
    save: async () => {
      const newData = {
        id: rawData[5]?.id,
        proposals_id: rawData[5]?.proposals_id,
        bab_title: rawData[5]?.bab_title,
        json_data: data?.tinjauan
      };

      try {
        const res = await dispatch(updateBab(newData));
        if (updateBab.fulfilled.match(res)) {
          enqueueSnackbar('Berhasil menyimpan', { variant: 'success' });
        } else {
          enqueueSnackbar('Gagal menyimpan', { variant: 'error' });
        }
      } catch {
        enqueueSnackbar('Terjadi error', { variant: 'error' });
      }
    }
  };

  useEffect(() => {
    if (Array.isArray(DataTinjauan)) {
      setData({ tinjauan: DataTinjauan });
    } else {
      setData([]);
    }
  }, [DataTinjauan]);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        BAB 2. Tinjauan Pustaka
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Typography variant="h6" gutterBottom>
            Tuliskan judul dan deskripsi pada tinjauan pustaka yang akan digunakan dalam penelitian.
          </Typography>

          <Stack direction="column" spacing={5}>
            <GenForm
              formFields={FieldsData['tinjauan']}
              buttonDisable={false}
              onSubmit={(values) => handleFormSubmit(values, 'tinjauan')}
              titleButton={formObject['tinjauan'].status ? `Update Data` : `Tambah Data`}
              initialValuesUpdate={formObject['tinjauan']}
            />
            <TableForm
              columns={Columns.tinjauan(handleTinjauan.edit('tinjauan'), handleTinjauan.delete('tinjauan'), false)}
              rows={data.tinjauan || []}
              expand
              detail={handleTinjauan.detail}
            />
          </Stack>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="success" onClick={handleTinjauan.save}>
          Simpan Tinjauan Pustaka
        </Button>
      </Stack>
    </>
  );
};

export default Tinjauan;
