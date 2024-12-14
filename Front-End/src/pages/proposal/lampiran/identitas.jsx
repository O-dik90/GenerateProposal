import { ACT_INIT, AWARDS_INIT, COMMUNITY_INIT, COURSE_INIT, EDUCATION_INIT, ID_INIT, RESEARCH_INIT } from './initial';
import { Box, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import { initialFields } from './initial-form';
import React, { useCallback, useEffect, useState } from 'react';
import { masterGender, masterLampiranRole } from 'store/slices/master-data';
import { useDispatch, useSelector } from 'react-redux';

import GenForm from 'components/general-form';
import PropTypes from 'prop-types';
import { TableForm } from 'components/table-form';
import { lampiranColumns } from './initial-column';

const Identitas = () => {
  const { gender } = useSelector((state) => state.app.masterData);
  const { role } = useSelector((state) => state.app.masterData.lampiran);
  const dispatch = useDispatch(),
    [object, setObject] = useState(ID_INIT),
    [data, setData] = useState([]);

  const handlePersonal = {
    edit: (param) => {
      setObject({ ...param, status: true });
    },
    delete: (param) => {
      const updatedData = [...data];
      updatedData.splice(param, 1);
      setData(updatedData);
    },
    detail: (param) => <AdditionalData dataDetail={param} />,
    save: async () => {
      const payload = {
        id: biaya[0]?.id,
        proposals_id: biaya[0]?.proposals_id,
        bab_title: biaya[0]?.bab_title,
        json_data: data
      };

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
    console.log(data);
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

export const AdditionalData = ({ dataDetail = {} }) => {
  const [detail, setDetail] = useState({
    act: [],
    award: [],
    education: [],
    course: [],
    research: [],
    comunity_service: []
  });

  const [object, setObject] = useState({
    act: ACT_INIT,
    award: AWARDS_INIT,
    education: EDUCATION_INIT,
    course: COURSE_INIT,
    research: RESEARCH_INIT,
    comunity_service: COMMUNITY_INIT
  });

  const dosenDetail = [
    { key: 'education', label: 'Pendidikan' },
    { key: 'course', label: 'Pendidikan' },
    { key: 'research', label: 'Penelitian' },
    { key: 'comunity_service', label: 'Pengabdian' }
  ];
  const reset = (key) => {
    switch (key) {
      case 'act':
        setObject((prev) => ({ ...prev, act: ACT_INIT }));
        break;
      case 'award':
        setObject((prev) => ({ ...prev, award: AWARDS_INIT }));
        break;
      case 'education':
        setObject((prev) => ({ ...prev, education: EDUCATION_INIT }));
        break;
      case 'course':
        setObject((prev) => ({ ...prev, course: COURSE_INIT }));
        break;
      case 'research':
        setObject((prev) => ({ ...prev, research: RESEARCH_INIT }));
        break;
      case 'comunity_service':
        setObject((prev) => ({ ...prev, comunity_service: COMMUNITY_INIT }));
        break;
      default:
        break;
    }
  };
  const handleAct = {
    edit: (key) => (param) => {
      setObject((prev) => ({ ...prev, [key]: { ...param, status: true } }));
    },
    update: (key) => () => {
      setDetail((prev) => ({
        ...prev,
        [key]: prev[key].map((item) => (item.no === object[key].no ? { ...item, ...object[key] } : item))
      }));
      reset(key);
    },
    delete: (key) => (item) => {
      setDetail((prev) => ({
        ...prev,
        [key]: prev[key].filter((row) => row.no !== item.no).map((row, index) => ({ ...row, no: index + 1 }))
      }));
    }
  };

  const handleForm = useCallback(
    (values, key) => {
      if (object[key]?.status) {
        setDetail((prevDetail) => ({
          ...prevDetail,
          [key]: prevDetail[key]?.map((item) => (item.no === object[key]?.no ? { ...item, ...values, status: false } : item))
        }));
        reset(key);
      } else {
        const newItem = { ...values, no: detail[key]?.length + 1 };
        setDetail((prevDetail) => ({
          ...prevDetail,
          [key]: [...(prevDetail[key] || []), newItem]
        }));
      }
    },
    [detail, object]
  );

  useEffect(() => {
    dataDetail.add_data = { ...dataDetail.add_data, ...detail };
    console.log('detail', dataDetail);
  }, [dataDetail, detail]);

  return (
    <>
      <Box sx={{ margin: 5 }}>
        <Grid container>
          {dataDetail?.role_person !== 'DOSEN' &&
            ['act', 'award'].map((key, index) => (
              <Grid item xs={12} key={`${key}-${index}`} sx={{ marginBottom: 15 }}>
                <Typography variant="h5" gutterBottom>
                  Detail {key === 'act' ? 'Kegiatan' : 'Penghargaan'}
                </Typography>
                {/* GeneralForm for adding new activities */}
                <Stack direction="column" spacing={5}>
                  <GenForm
                    formFields={initialFields[key]}
                    buttonDisable={false}
                    onSubmit={(values) => handleForm(values, key)}
                    titleButton={
                      object[key]?.status
                        ? `Update Data ${key === 'act' ? 'Kegiatan' : 'Penghargaan'}`
                        : `Tambah Data ${key === 'act' ? 'Kegiatan' : 'Penghargaan'}`
                    }
                    initialValuesUpdate={object[key]}
                  />
                  <TableForm
                    columns={lampiranColumns[key](handleAct.edit(key), handleAct.delete(key), object[key].status)}
                    rows={detail[key] || []}
                    expand={false}
                    detail={''}
                  />
                </Stack>
              </Grid>
            ))}
          {dataDetail?.role_person === 'DOSEN' &&
            dosenDetail.map((item, index) => (
              <Grid item xs={12} key={`${item.key}-${index}`} sx={{ marginBottom: 15 }}>
                <Typography variant="h5" gutterBottom>
                  Detail {item.key === 'education' ? item.label : `Tri Dharma ${item.label}`}
                </Typography>
                <Stack direction="column" spacing={5}>
                  <GenForm
                    formFields={initialFields[item.key]}
                    buttonDisable={false}
                    onSubmit={(values) => handleForm(values, item.key)}
                    titleButton={
                      object[item.keykey]?.status
                        ? `Update Data ${item.key === 'education' ? item.label : `Tri Dharma ${item.label}`}`
                        : `Tambah Data ${item.key === 'education' ? item.label : `Tri Dharma ${item.label}`}`
                    }
                    initialValuesUpdate={object[item.key]}
                  />
                  <TableForm
                    columns={lampiranColumns[item.key](handleAct.edit(item.key), handleAct.delete(item.key), object[item.key].status)}
                    rows={detail[item.key] || []}
                    expand={false}
                    detail={''}
                  />
                </Stack>
              </Grid>
            ))}
        </Grid>
      </Box>
    </>
  );
};

AdditionalData.propTypes = {
  dataDetail: PropTypes.object
};

export { Identitas };
