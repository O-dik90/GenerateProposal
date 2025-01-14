import { BUDGET_INIT, DETAIL_BUDGET_INIT } from './initial';
import { Grid, Stack, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';

import GenForm from 'components/general-form';
import { TableForm } from 'components/table-form';
import { budgetColumns } from './initial-column';
import { budgetFields } from './initial-form';

const Anggaran = () => {
  const [data, setData] = useState(BUDGET_INIT),
    [object, setObject] = useState({
      materials: DETAIL_BUDGET_INIT,
      services: DETAIL_BUDGET_INIT,
      transports: DETAIL_BUDGET_INIT,
      others: DETAIL_BUDGET_INIT
    });

  const budget = [
    { key: 'materials', label: 'Bahan Material', limit: '60' },
    { key: 'services', label: 'Sewa dan Jasa', limit: '15' },
    { key: 'transports', label: 'Transportasi', limit: '30' },
    { key: 'others', label: 'lain - lain', limit: '15' }
  ];

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
    delete: (key) => (item) => {
      setData((prev) => ({
        ...prev,
        [key]: prev[key].filter((row) => row.no !== item.no).map((row, index) => ({ ...row, no: index + 1 }))
      }));
    }
  };

  const handleForm = useCallback(
    (values, key) => {
      if (object[key]?.status) {
        setData((prevData) => ({
          ...prevData,
          [key]: prevData[key]?.map((item) => (item.no === object[key]?.no ? { ...item, ...values, status: false } : item))
        }));
        reset(key);
      } else {
        const newItem = { ...values, no: (object[key]?.length || 0) + 1 };
        setData((prevData) => ({
          ...prevData,
          [key]: [...(prevData[key] || []), newItem]
        }));
      }
    },
    [object, reset]
  );

  return (
    <>
      {budget.map(({ key, label, limit }, index) => {
        const budgetData = data[key] || [];
        const budgetStatus = object[key]?.status;
        const budgetFieldsData = budgetFields[key];

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
                columns={budgetColumns(handleBudget.edit(key), handleBudget.delete(key), object[key]?.status)}
                rows={budgetData}
                expand={false}
                detail=""
              />
            </Stack>
          </Grid>
        );
      })}
    </>
  );
};

export { Anggaran };
