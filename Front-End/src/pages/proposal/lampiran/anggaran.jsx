import { BUDGET_INIT, DETAIL_BUDGET_INIT } from './initial-data';
import { Button, Grid, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import GenForm from 'components/general-form';
import { TableForm } from 'components/table-form';
import { budgetColumns } from './initial-column';
import { budgetFields } from './initial-form';
import { updateLampiranProposalDetail } from 'store/slices/proposal';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';

const Anggaran = () => {
  const BAB_TITLE6 = 'LAMPIRAN';
  const { id } = useParams();
  const [data, setData] = useState(BUDGET_INIT),
    [object, setObject] = useState({
      materials: DETAIL_BUDGET_INIT,
      services: DETAIL_BUDGET_INIT,
      transports: DETAIL_BUDGET_INIT,
      others: DETAIL_BUDGET_INIT
    }),
    dispatch = useDispatch(),
    { enqueueSnackbar } = useSnackbar(),
    { lampiran } = useSelector((state) => state.app.proposal);

  const budget = [
    { key: 'materials', label: 'Bahan Material', limit: '60' },
    { key: 'services', label: 'Sewa dan Jasa', limit: '15' },
    { key: 'transports', label: 'Transportasi', limit: '30' },
    { key: 'others', label: 'lain - lain', limit: '15' }
  ];

  const calculateTotalCosts = () => {
    const calculateCostByCategory = (categoryData, budgetSource) =>
      (categoryData || []).reduce((total, item) => (item.budget_source === budgetSource ? total + item.total_price : total), 0);

    setData((prevData) => {
      const calculateCategoryCost = (category) => ({
        belmawa: calculateCostByCategory(prevData[category], 'belmawa'),
        perguruan: calculateCostByCategory(prevData[category], 'perguruan')
      });

      return {
        ...prevData,
        cost: {
          materials: calculateCategoryCost('materials'),
          services: calculateCategoryCost('services'),
          transports: calculateCategoryCost('transports'),
          others: calculateCategoryCost('others')
        }
      };
    });
  };

  const reset = useCallback((key) => {
    setObject((prev) => ({ ...prev, [key]: initialStateForKey(key) }));
  }, []);

  const initialStateForKey = (key) => {
    switch (key) {
      case 'materials':
      case 'services':
      case 'transports':
      case 'others':
      default:
        return DETAIL_BUDGET_INIT;
    }
  };

  const handleBudget = {
    edit: (key) => (param) => {
      setObject((prev) => ({ ...prev, [key]: { ...param, status: true } }));
    },
    reset: (key) => () => {
      reset(key);
    },
    delete: (key) => (item) => {
      setData((prev) => ({
        ...prev,
        [key]: prev[key].filter((row) => row.no !== item.no).map((row, index) => ({ ...row, no: index + 1 }))
      }));
      calculateTotalCosts();
    },
    save: async () => {
      const jsonData = JSON.parse(lampiran[0]?.json_data);
      const payload = {
        bab_title: BAB_TITLE6,
        json_data: {
          ...jsonData,
          anggaran: data
        }
      };
      console.log('payload', payload);

      try {
        const res = await dispatch(updateLampiranProposalDetail({ id: Number(id), data: payload }));

        if (updateLampiranProposalDetail.fulfilled.match(res)) {
          enqueueSnackbar('Berhasil menyimpan', { variant: 'success' });
        } else {
          enqueueSnackbar('Gagal menyimpan', { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar('Gagal menyimpan data pustaka', { variant: 'error' });
      }
    }
  };

  const handleForm = useCallback(
    (values, key) => {
      const calculateTotalPrice = (unitPrice, volume) => Number(unitPrice) * volume;

      if (object[key]?.status) {
        setData((prevData) => ({
          ...prevData,
          [key]: prevData[key]?.map((item) =>
            item.no === object[key]?.no
              ? {
                  ...item,
                  ...values,
                  total_price: calculateTotalPrice(values.unit_price, values.volume),
                  status: false
                }
              : item
          )
        }));
        reset(key);
      } else {
        const newItem = {
          ...values,
          no: (data[key]?.length || 0) + 1,
          total_price: calculateTotalPrice(values.unit_price, values.volume),
          status: false
        };
        setData((prevData) => ({
          ...prevData,
          [key]: [...(prevData[key] || []), newItem]
        }));
      }
      calculateTotalCosts();
    },
    [data, object, reset]
  );

  useEffect(() => {
    if (!lampiran.length) {
      setData(BUDGET_INIT);
      return;
    }

    try {
      const bab6 = lampiran[0].json_data !== null ? JSON.parse(lampiran[0].json_data) : BUDGET_INIT;
      console.log(bab6);
      if (bab6.anggaran && typeof bab6.anggaran === 'object') {
        setData((prev) => (JSON.stringify(prev) !== JSON.stringify(bab6.anggaran) ? bab6.anggaran : prev));
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error parsing JSON data:', error.message);
      setData([]);
    }

    return () => setData(BUDGET_INIT);
  }, [lampiran]);

  return (
    <>
      {budget.map(({ key, label, limit }, index) => {
        const budgetData = data[key] || [];
        const budgetStatus = object[key]?.status;
        const budgetFieldsData = budgetFields[key];
        const { belmawa = 0, perguruan = 0 } = data.cost?.[key] || {};

        return (
          <Grid item xs={12} key={`${key}-${index}`} sx={{ marginBottom: 15 }}>
            <Typography variant="h5" gutterBottom>
              {`Detail ${label}`}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {`Pengeluaran Maksimal ${limit}%`}
            </Typography>
            <Stack direction="column" spacing={5}>
              <GenForm
                formFields={budgetFieldsData}
                buttonDisable={false}
                onSubmit={(values) => handleForm(values, key)}
                titleButton={budgetStatus ? `Update Data ` : `Tambah Data `}
                initialValuesUpdate={object[key]}
              />
              <TableForm
                columns={budgetColumns(handleBudget.edit(key), handleBudget.delete(key), handleBudget.reset(key), object[key]?.no)}
                rows={budgetData}
                expand={false}
                detail=""
              />
            </Stack>
            <Stack direction="column" spacing={1} sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                {`Sub Total Rp. ${belmawa + perguruan}`}
              </Typography>
            </Stack>
          </Grid>
        );
      })}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="success" onClick={handleBudget.save}>
          Simpan Detail
        </Button>
      </Stack>
    </>
  );
};

export { Anggaran };
