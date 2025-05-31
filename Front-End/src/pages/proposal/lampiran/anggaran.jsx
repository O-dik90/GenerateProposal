import { BUDGET_INIT, DETAIL_BUDGET_INIT } from './initial-data';
import { Button, Grid, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getLampiranProposalDetail, updateChangesAsync, updateLampiranProposalDetail } from 'store/slices/proposal';
import { useDispatch, useSelector } from 'react-redux';

import { BAB_TITLE6 } from './identitas';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import GenForm from 'components/general-form';
import { INIT_CHANGEDATA } from '../detail';
import PropTypes from 'prop-types';
import { TableForm } from 'components/table-form';
import { budgetColumns } from './initial-column';
import { budgetFields } from './initial-form';
import cloneDeep from 'lodash/cloneDeep';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';

const Anggaran = ({ confirmSave }) => {
  const { id } = useParams();
  const originalDataRef = useRef(null);
  const [data, setData] = useState(BUDGET_INIT);
  const [budgetData, setBudgetData] = useState({ belmawa: 0, perguruan: 0 });
  const [editingItem, setEditingItem] = useState({
    materials: DETAIL_BUDGET_INIT,
    services: DETAIL_BUDGET_INIT,
    transports: DETAIL_BUDGET_INIT,
    others: DETAIL_BUDGET_INIT
  });
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { lampiran, data: rawBudget } = useSelector((state) => state.app.proposal);

  const budget = useMemo(
    () => [
      { key: 'materials', label: 'Bahan Material', limit: 60 },
      { key: 'services', label: 'Sewa dan Jasa', limit: 15 },
      { key: 'transports', label: 'Transportasi', limit: 30 },
      { key: 'others', label: 'lain - lain', limit: 15 }
    ],
    []
  );

  const calculateTotalPrice = (unitPrice = 0, volume = 0) => Number(unitPrice) * Number(volume);

  const calculateTotalCosts = useCallback((newData) => {
    const calculateCostByCategory = (categoryData, budgetSource) =>
      (categoryData || []).reduce((total, item) => (item.budget_source === budgetSource ? total + item.total_price : total), 0);

    const updatedCost = ['materials', 'services', 'transports', 'others'].reduce((acc, key) => {
      acc[key] = {
        belmawa: calculateCostByCategory(newData[key], 'belmawa'),
        perguruan: calculateCostByCategory(newData[key], 'perguruan')
      };
      return acc;
    }, {});

    return updatedCost;
  }, []);

  const validateBudget = useCallback(
    (values, key) => {
      const category = budget.find((item) => item.key === key);
      const limitPercentage = category ? category.limit : 100;
      const belmawaLimit = (limitPercentage / 100) * budgetData.belmawa;
      const perguruanLimit = (limitPercentage / 100) * budgetData.perguruan;
      const newItemTotal = calculateTotalPrice(values.unit_price, values.volume);
      const currentBelmawaTotal = data.cost?.[key]?.belmawa || 0;
      const currentPerguruanTotal = data.cost?.[key]?.perguruan || 0;
      const newBelmawaTotal = values.budget_source === 'belmawa' ? currentBelmawaTotal + newItemTotal : currentBelmawaTotal;
      const newPerguruanTotal = values.budget_source === 'perguruan' ? currentPerguruanTotal + newItemTotal : currentPerguruanTotal;

      if (values.budget_source === 'belmawa' && newBelmawaTotal > belmawaLimit) {
        enqueueSnackbar(`Anggaran Belmawa untuk ${category.label} melebihi batas ${limitPercentage}%`, { variant: 'warning' });
        return;
      }

      if (values.budget_source === 'perguruan' && newPerguruanTotal > perguruanLimit) {
        enqueueSnackbar(`Anggaran Perguruan untuk ${category.label} melebihi batas ${limitPercentage}%`, { variant: 'warning' });
        return;
      }

      const newItem = {
        ...values,
        no: (data[key]?.length || 0) + 1,
        total_price: newItemTotal,
        status: false
      };

      setData((prevData) => {
        const updated = {
          ...prevData,
          [key]: [...(prevData[key] || []), newItem]
        };
        const updatedCost = calculateTotalCosts(updated);
        return { ...updated, cost: updatedCost };
      });
    },
    [budget, budgetData.belmawa, budgetData.perguruan, data, enqueueSnackbar, calculateTotalCosts]
  );

  const reset = useCallback((key) => {
    setEditingItem((prev) => ({ ...prev, [key]: DETAIL_BUDGET_INIT }));
  }, []);

  const handleEdit = useCallback(
    (key) => (param) => {
      setEditingItem((prev) => ({ ...prev, [key]: { ...param, status: true } }));
    },
    []
  );

  const handleReset = useCallback(
    (key) => () => {
      reset(key);
    },
    [reset]
  );

  const handleDelete = useCallback(
    (key) => (item) => {
      setData((prev) => {
        const updated = prev[key].filter((row) => row.no !== item.no).map((row, index) => ({ ...row, no: index + 1 }));
        const newData = { ...prev, [key]: updated };
        const newCost = calculateTotalCosts(newData);
        return { ...newData, cost: newCost };
      });
    },
    [calculateTotalCosts]
  );

  const handleSave = useCallback(async () => {
    const jsonData = JSON.parse(lampiran[0]?.json_data);
    const payload = {
      bab_title: BAB_TITLE6,
      json_data: { ...jsonData, anggaran: data }
    };

    try {
      const res = await dispatch(updateLampiranProposalDetail({ id: Number(id), data: payload }));
      if (updateLampiranProposalDetail.fulfilled.match(res)) {
        enqueueSnackbar('Berhasil menyimpan', { variant: 'success' });
        originalDataRef.current = cloneDeep(data);
        dispatch(updateChangesAsync(INIT_CHANGEDATA));
      } else {
        enqueueSnackbar('Gagal menyimpan', { variant: 'error' });
      }
    } catch {
      enqueueSnackbar('Gagal menyimpan data pustaka', { variant: 'error' });
    }
  }, [dispatch, enqueueSnackbar, lampiran, id, data]);

  const handleBudget = {
    edit: handleEdit,
    reset: handleReset,
    delete: handleDelete,
    save: handleSave
  };

  const handleForm = useCallback(
    (values, key) => {
      if (editingItem[key]?.status) {
        setData((prevData) => {
          const updated = prevData[key]?.map((item) =>
            item.no === editingItem[key]?.no
              ? {
                  ...item,
                  ...values,
                  total_price: calculateTotalPrice(values.unit_price, values.volume),
                  status: false
                }
              : item
          );
          const newData = { ...prevData, [key]: updated };
          const newCost = calculateTotalCosts(newData);
          return { ...newData, cost: newCost };
        });
        reset(key);
      } else {
        validateBudget(values, key);
      }
    },
    [editingItem, reset, validateBudget, calculateTotalCosts]
  );

  useEffect(() => {
    if (!lampiran.length) {
      setData(BUDGET_INIT);
      return;
    }
    try {
      const bab6 = lampiran[0].json_data !== null ? JSON.parse(lampiran[0].json_data) : BUDGET_INIT;
      if (bab6.anggaran && typeof bab6.anggaran === 'object') {
        setData(bab6.anggaran);
        originalDataRef.current = cloneDeep(bab6.anggaran);
      } else {
        setData([]);
        originalDataRef.current = [];
      }
    } catch {
      setData([]);
      originalDataRef.current = [];
    }
    return () => setData(BUDGET_INIT);
  }, [lampiran]);

  useEffect(() => {
    if (rawBudget) {
      const metaData = rawBudget.find((item) => item.id === Number(id));
      setBudgetData({
        belmawa: Number(metaData?.pkm_belmawa),
        perguruan: Number(metaData?.pkm_perguruan)
      });
    }
  }, [id, rawBudget]);

  const cleanData = (data) => {
    const clone = cloneDeep(data);
    ['materials', 'services', 'transports', 'others'].forEach((key) => {
      clone[key] = clone[key]?.map(({ status, ...item }) => item);
    });
    if (clone.cost) {
      Object.entries(clone.cost).forEach(([key, value]) => {
        clone.cost[key] = {
          belmawa: Math.round(value.belmawa),
          perguruan: Math.round(value.perguruan)
        };
      });
    }
    return clone;
  };

  useEffect(() => {
    if (originalDataRef.current && typeof data === 'object') {
      const cleanedCurrent = cleanData(data);
      const cleanedOriginal = cleanData(originalDataRef.current);
      const hasChanged = JSON.stringify(cleanedCurrent) !== JSON.stringify(cleanedOriginal);
      dispatch(updateChangesAsync({ ...INIT_CHANGEDATA, changesData: hasChanged }));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(getLampiranProposalDetail({ id, bab_title: BAB_TITLE6 }));
    }
  }, [dispatch, id]);

  return (
    <>
      {budget.map(({ key, label, limit }, index) => {
        const budgetData = data[key] || [];
        const budgetStatus = editingItem[key]?.status;
        const budgetFieldsData = budgetFields[key];
        const { belmawa = 0, perguruan = 0 } = data.cost?.[key] || {};

        return (
          <Grid item xs={12} key={`${key}-${index}`} sx={{ marginBottom: 15 }}>
            <Typography variant="h5" gutterBottom>{`Detail ${label}`}</Typography>
            <Typography variant="h6" gutterBottom>{`Pengeluaran Maksimal ${limit}%`}</Typography>
            <Stack direction="column" spacing={5}>
              <GenForm
                formFields={budgetFieldsData}
                buttonDisable={false}
                onSubmit={(values) => handleForm(values, key)}
                titleButton={budgetStatus ? `Update Data ` : `Tambah Data `}
                initialValuesUpdate={editingItem[key]}
              />
              <TableForm
                columns={budgetColumns(handleBudget.edit(key), handleBudget.delete(key), handleBudget.reset(key), editingItem[key])}
                rows={budgetData}
                expand={false}
                detail=""
              />
            </Stack>
            <Stack direction="column" spacing={1} sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>{`Sub Total Rp. ${belmawa + perguruan}`}</Typography>
            </Stack>
          </Grid>
        );
      })}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="success" onClick={handleBudget.save}>
          Simpan Detail
        </Button>
      </Stack>
      <ConfirmDialog
        open={confirmSave}
        title={`${BAB_TITLE6} - Susunan Tim`}
        message="Simpan perubahan data?"
        onClose={() => dispatch(updateChangesAsync(INIT_CHANGEDATA))}
        onConfirm={handleBudget.save}
      />
    </>
  );
};

Anggaran.propTypes = {
  confirmSave: PropTypes.bool.isRequired
};

export { Anggaran };
