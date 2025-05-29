import { Button, Grid, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getBabProposalDetail, updateBabProposalDetail, updateChangesAsync } from 'store/slices/proposal';
import { useDispatch, useSelector } from 'react-redux';

import { Columns } from './initial-column';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import { FieldsData } from './initial-form';
import GenForm from 'components/general-form';
import { INIT_CHANGEDATA } from '../detail';
import { PELAKSANAAN_INIT } from './initial-data';
import PropTypes from 'prop-types';
import { TableForm } from 'components/table-form';
import isEqual from 'lodash.isequal';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';

const Pelaksanaan = ({ confirmSave }) => {
  const BAB_TITLE3 = 'BAB 3 TAHAP PELAKSANAAN';
  const originalDataRef = useRef(null);
  const { id } = useParams();
  const { proposal_detail } = useSelector((state) => state.app.proposal),
    dispatch = useDispatch(),
    { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState([]),
    [formObject, setFormObject] = useState({ pelaksanaan: PELAKSANAAN_INIT });

  const resetFormObject = useCallback((key) => {
    setFormObject((prev) => ({ ...prev, [key]: PELAKSANAAN_INIT }));
  }, []);

  const handleCloseModal = () => {
    dispatch(updateChangesAsync(INIT_CHANGEDATA));
  };

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

  const handlePelaksanan = {
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
        bab_title: BAB_TITLE3,
        json_data: data?.pelaksanaan
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

  useEffect(() => {
    if (id) {
      dispatch(
        getBabProposalDetail({
          id: id,
          bab_title: BAB_TITLE3
        })
      );
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (proposal_detail?.length > 0 && BAB_TITLE3) {
      const bab3 = JSON.parse(proposal_detail[0].json_data || '[]');
      if (Array.isArray(bab3)) {
        const newData = { pelaksanaan: bab3 };
        setData(newData);

        originalDataRef.current = newData;
      }
    }
    return () => {
      setData([]);
    };
  }, [proposal_detail]);

  useEffect(() => {
    if (originalDataRef.current !== null && Object.keys(data).length > 0 && !isEqual(data, originalDataRef.current)) {
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
        BAB 3. TAHAP PELAKSANAAN
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Typography variant="h6" gutterBottom>
            Tuliskan judul dan deskripsi di tahap pelaksanakaan yang akan digunakan dalam penelitian.
          </Typography>
          <Stack direction="column" spacing={5}>
            <GenForm
              formFields={FieldsData['pelaksanaan']}
              buttonDisable={false}
              onSubmit={(values) => handleFormSubmit(values, 'pelaksanaan')}
              titleButton={formObject['pelaksanaan'].status ? `Update Data` : `Tambah Data`}
              initialValuesUpdate={formObject['pelaksanaan']}
            />
            <TableForm
              columns={Columns.pelaksanaan(
                handlePelaksanan.edit('pelaksanaan'),
                handlePelaksanan.delete('pelaksanaan'),
                handlePelaksanan.reset('pelaksanaan'),
                formObject['pelaksanaan']
              )}
              rows={data.pelaksanaan || []}
              expand
              detail={handlePelaksanan.detail}
            />
          </Stack>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="success" onClick={handlePelaksanan.save}>
          Simpan Pelaksanaan
        </Button>
      </Stack>

      <ConfirmDialog
        open={confirmSave}
        title={`${BAB_TITLE3}`}
        message="Simpan perubahan data?"
        onClose={handleCloseModal}
        onConfirm={handlePelaksanan.save}
      />
    </>
  );
};

Pelaksanaan.propTypes = {
  confirmSave: PropTypes.bool.isRequired
};

export default Pelaksanaan;
