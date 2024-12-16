import { ACT_INIT, AWARDS_INIT, COMMUNITY_INIT, COURSE_INIT, EDUCATION_INIT, ID_INIT, RESEARCH_INIT } from './initial';
import { Box, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { masterGender, masterLampiranRole } from 'store/slices/master-data';
import { useDispatch, useSelector } from 'react-redux';

import GenForm from 'components/general-form';
import PropTypes from 'prop-types';
import { TableForm } from 'components/table-form';
import { initialFields } from './initial-form';
import { lampiranColumns } from './initial-column';

const Identitas = () => {
  const { gender } = useSelector((state) => state.app.masterData);
  const { role } = useSelector((state) => state.app.masterData.lampiran),
    { lampiran } = useSelector((state) => state.app.proposal);
  const dispatch = useDispatch(),
    [object, setObject] = useState(ID_INIT),
    [data, setData] = useState([]);

  const handlePersonal = {
    edit: (param) => {
      setObject({ ...param, status: true });
    },
    delete: (param) => {
      const updatedData = data.filter((item) => item.no !== param.no).map((item, index) => ({ ...item, no: index + 1 }));
      setData(updatedData);
    },
    detail: (param) => {
      return <AdditionalData dataDetail={param} updateDetail={handleAddtional} />;
    },
    save: async () => {
      const payload = {
        id: lampiran?.id,
        proposals_id: lampiran?.proposals_id,
        bab_title: lampiran?.bab_title,
        json_data: data
      };

      console.log('payload', payload);
    }
  };

  //still infinity rendering
  const handleAddtional = useCallback((newDetail) => {
    console.log('newDetail', newDetail);
  }, []);

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

export const AdditionalData = ({ dataDetail = {}, updateDetail }) => {
  const [detail, setDetail] = useState(() => ({
    act: dataDetail.act || [],
    award: dataDetail.award || [],
    education: dataDetail.education || [],
    course: dataDetail.course || [],
    research: dataDetail.research || [],
    comunity_service: dataDetail.comunity_service || []
  }));

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

  // Reset logic for `object` state.
  const reset = useCallback((key) => {
    setObject((prev) => ({ ...prev, [key]: initialStateForKey(key) }));
  }, []);

  const initialStateForKey = (key) => {
    switch (key) {
      case 'act':
        return ACT_INIT;
      case 'award':
        return AWARDS_INIT;
      case 'education':
        return EDUCATION_INIT;
      case 'course':
        return COURSE_INIT;
      case 'research':
        return RESEARCH_INIT;
      case 'comunity_service':
        return COMMUNITY_INIT;
      default:
        return {};
    }
  };

  // Logic for editing, updating, and deleting rows in the table.
  const handleAct = {
    edit: (key) => (param) => {
      setObject((prev) => ({ ...prev, [key]: { ...param, status: true } }));
    },
    update: (key) => () => {
      setDetail((prev) => ({
        ...prev,
        [key]: prev[key].map((item) => (item.no === object[key].no ? { ...item, ...object[key], status: false } : item))
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
        const newItem = { ...values, no: (detail[key]?.length || 0) + 1 };
        setDetail((prevDetail) => ({
          ...prevDetail,
          [key]: [...(prevDetail[key] || []), newItem]
        }));
      }
    },
    [detail, object, reset]
  );

  useEffect(() => {
    const updatedDataDetail = {
      ...dataDetail,
      add_data: {
        ...dataDetail.add_data,
        ...detail
      }
    };

    console.log('Updating parent with new detail:', updatedDataDetail);
    updateDetail(updatedDataDetail);
  }, [detail, dataDetail, updateDetail]);

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
                      object[item.key]?.status
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
  dataDetail: PropTypes.object.isRequired,
  updateDetail: PropTypes.func
};

export { Identitas };
