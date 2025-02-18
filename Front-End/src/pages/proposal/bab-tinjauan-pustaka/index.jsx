import { Button, Grid, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { getBabProposalDetail, updateBabProposalDetail } from 'store/slices/proposal';
import { useDispatch, useSelector } from 'react-redux';

import { Columns } from './initial-column';
import { FieldsData } from './initial-form';
import GenForm from 'components/general-form';
import { TINJAUAN_INIT } from './initial-data';
import { TableForm } from 'components/table-form';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';

const Tinjauan = () => {
  const BAB_TITLE2 = 'BAB 2 TINJAUAN PUSTAKA';
  const dispatch = useDispatch();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { proposal_detail } = useSelector((state) => state.app.proposal);

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
    reset: (key) => () => {
      resetFormObject(key);
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
        bab_title: BAB_TITLE2,
        json_data: data?.tinjauan
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

  useEffect(() => {
    if (id) {
      dispatch(
        getBabProposalDetail({
          id: id,
          bab_title: BAB_TITLE2
        })
      );
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (proposal_detail?.length > 0 && BAB_TITLE2) {
      const bab2 = JSON.parse(proposal_detail[0].json_data || '[]');

      if (Array.isArray(bab2)) {
        setData({ tinjauan: bab2 });
      } else {
        setData([]);
      }
    }
    return () => {
      setData([]);
    };
  }, [proposal_detail]);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        BAB 2. TINJAUAN PUSTAKA
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
              columns={Columns.tinjauan(
                handleTinjauan.edit('tinjauan'),
                handleTinjauan.delete('tinjauan'),
                handleTinjauan.reset('tinjauan'),
                formObject['tinjauan'].no
              )}
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
