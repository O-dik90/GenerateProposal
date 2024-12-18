import { Box, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import { DEFAULT_ID_INIT, ID_INIT } from './initial';
import React, { useCallback, useEffect, useState } from 'react';
import { masterGender, masterLampiranRole } from 'store/slices/master-data';
import { useDispatch, useSelector } from 'react-redux';

import GenForm from 'components/general-form';
import { TableForm } from 'components/table-form';
import { initialFields } from './initial-form';
import { lampiranColumns } from './initial-column';

const Identitas = () => {
  const { gender } = useSelector((state) => state.app.masterData);
  const { role } = useSelector((state) => state.app.masterData.lampiran),
    { lampiran } = useSelector((state) => state.app.proposal);
  const dispatch = useDispatch(),
    [object, setObject] = useState(ID_INIT),
    [data, setData] = useState(DEFAULT_ID_INIT);

  const roleDosen = [
    { key: 'education', role: 'DOSEN', label: 'Pendidikan' },
    { key: 'course', role: 'DOSEN', label: 'Pendidikan' },
    { key: 'research', role: 'DOSEN', label: 'Penelitian' },
    { key: 'comunity_service', role: 'DOSEN', label: 'Pengabdian' }
  ];
  const roleMHS = [
    { key: 'act', role: 'MHS', label: 'Kegiatan' },
    { key: 'award', role: 'MHS', label: 'Penghargaan' }
  ];

  const renderSection = (role, data, onEdit, onDelete) => {
    return role.map((item, index) => (
      <Grid item xs={12} key={`${item.key}-${index}`} sx={{ marginBottom: 15 }}>
        <Typography variant="h5" gutterBottom>
          Detail {item.label}
        </Typography>
        <Stack direction="column" sx={{ marginBottom: 5 }}>
          <TableForm columns={lampiranColumns[item.key](onEdit, onDelete)} rows={data[item.key] || []} expand={false} />
        </Stack>
      </Grid>
    ));
  };

  const handlePersonal = {
    edit: (param) => {
      setObject({ ...param, status: true });
    },
    delete: (param) => {
      const updatedData = data.filter((item) => item.no !== param.no).map((item, index) => ({ ...item, no: index + 1 }));
      setData(updatedData);
    },
    save: async () => {
      const payload = {
        id: lampiran?.id,
        proposals_id: lampiran?.proposals_id,
        bab_title: lampiran?.bab_title,
        json_data: data
      };

      console.log('payload', payload);
    },
    detail: (param) => {
      console.log('detail', param);
      return (
        <Box sx={{ margin: 5 }}>
          <Grid container>
            {param?.role_person !== 'DOSEN'
              ? renderSection(roleMHS, param, handleDetail.edit, handleDetail.delete)
              : renderSection(roleDosen, param, handleDetail.edit, handleDetail.delete)}
          </Grid>
        </Box>
      );
    }
  };

  const handleDetail = {
    edit: (param) => {
      console.log(param);
    },
    delete: (param) => {
      console.log(param);
    }
  };

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
      setObject(ID_INIT);
    },
    [data, object.no, object?.status]
  );

  useEffect(() => {
    const loadMasterData = async () => {
      if (role.length <= 0) {
        await dispatch(masterLampiranRole({ source_name: 'ROLE_IDENTITAS' }));
      }
      if (gender.length <= 0) {
        await dispatch(masterGender({ source_name: 'GENDER' }));
      }
    };

    loadMasterData();
  }, [dispatch, gender, role]);

  useEffect(() => {
    console.log('parent', data);
  }, [data]);

  return (
    <Stack direction="column" spacing={2}>
      <Select
        id="role_person"
        displayEmpty
        readOnly={object.status}
        value={object.role_person}
        onChange={(e) =>
          setObject((prevObject) => ({
            ...prevObject,
            role_person: e.target.value
          }))
        }
        sx={{ width: '15rem' }}
        name="role_person"
      >
        <MenuItem disabled value="">
          <em>Pilih Keanggotaan</em>
        </MenuItem>
        {role.map((item) => (
          <MenuItem key={item.id} value={item.code}>
            {item.value}
          </MenuItem>
        ))}
      </Select>
      <Grid item xs={12} key={`Identitas`} sx={{ marginBottom: 15 }}>
        <Typography variant="h5" gutterBottom>
          Detail Identitas
        </Typography>
        {/* GeneralForm for adding new activities */}
        {object.role_person && (
          <GenForm
            formFields={initialFields.personal}
            buttonDisable={false}
            onSubmit={(values) => handleForm(values)}
            titleButton={object?.status ? `Update Data Personal` : `Tambah Data Personal`}
            initialValuesUpdate={object}
          />
        )}

        <Stack direction="column" sx={{ marginTop: 5 }}>
          <TableForm
            columns={lampiranColumns.personal(handlePersonal.edit, handlePersonal.delete, object.status)}
            rows={data || []}
            expand
            detail={handlePersonal.detail}
          />
        </Stack>
      </Grid>
    </Stack>
  );
};

export { Identitas };
