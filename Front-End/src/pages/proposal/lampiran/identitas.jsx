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
      const dataDetail = data.find((item) => item.no === param.no);
      console.log('params', dataDetail);
      return <AdditionalData detail={param} updateDetail={handleDetail} />;
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

  const handleDetail = (param) => {
    console.log('data update', param);
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

const AdditionalData = ({ data = {}, updateDetail = () => {} }) => {
  const initialDetailState = {
    act: data?.add_data?.act || [],
    award: data?.add_data?.award || [],
    education: data?.add_data?.education || [],
    course: data?.add_data?.course || [],
    research: data?.add_data?.research || [],
    comunity_service: data?.add_data?.comunity_service || []
  };

  const [detail, setDetail] = useState(initialDetailState);

  const initialObjectState = {
    act: ACT_INIT,
    award: AWARDS_INIT,
    education: EDUCATION_INIT,
    course: COURSE_INIT,
    research: RESEARCH_INIT,
    comunity_service: COMMUNITY_INIT
  };

  const [object, setObject] = useState(initialObjectState);

  const dosenDetail = [
    { key: 'education', label: 'Pendidikan' },
    { key: 'course', label: 'Pendidikan' },
    { key: 'research', label: 'Penelitian' },
    { key: 'comunity_service', label: 'Pengabdian' }
  ];

  const resetObjectKey = useCallback((key) => {
    setObject((prev) => ({ ...prev, [key]: initialStateForKey(key) }));
  }, []);

  const initialStateForKey = (key) => {
    const initialStates = {
      act: ACT_INIT,
      award: AWARDS_INIT,
      education: EDUCATION_INIT,
      course: COURSE_INIT,
      research: RESEARCH_INIT,
      comunity_service: COMMUNITY_INIT
    };
    return initialStates[key] || {};
  };

  const handleAct = {
    edit: (key) => (param) => {
      setObject((prev) => ({ ...prev, [key]: { ...param, status: true } }));
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
      const isEdit = object[key]?.status;

      setDetail((prevDetail) => {
        const updatedData = isEdit
          ? prevDetail[key].map((item) => (item.no === object[key]?.no ? { ...item, ...values, status: false } : item))
          : [...(prevDetail[key] || []), { ...values, no: (prevDetail[key]?.length || 0) + 1 }];

        return { ...prevDetail, [key]: updatedData };
      });

      resetObjectKey(key);

      updateDetail({ ...data, add_data: detail });
    },
    [data, detail, object, resetObjectKey, updateDetail]
  );

  useEffect(() => {
    console.log('detail data', data);
  }, [data]);

  const renderSection = (keys, isDosen) =>
    keys.map((keyItem, index) => {
      const { key, label } = isDosen ? keyItem : { key: keyItem, label: keyItem === 'act' ? 'Kegiatan' : 'Penghargaan' };

      const title = isDosen ? `Tri Dharma ${label}` : key === 'act' ? 'Kegiatan' : 'Penghargaan';

      return (
        <Grid item xs={12} key={`${key}-${index}`} sx={{ marginBottom: 15 }}>
          <Typography variant="h5" gutterBottom>
            Detail {key === 'education' ? label : title}
          </Typography>
          <Stack direction="column" spacing={5}>
            <GenForm
              formFields={initialFields[key]}
              buttonDisable={false}
              onSubmit={(values) => handleForm(values, key)}
              titleButton={object[key]?.status ? `Update Data ${title}` : `Tambah Data ${title}`}
              initialValuesUpdate={object[key]}
            />
            <TableForm
              columns={lampiranColumns[key](handleAct.edit(key), handleAct.delete(key), object[key]?.status)}
              rows={detail[key] || []}
              expand={false}
              detail={''}
            />
          </Stack>
        </Grid>
      );
    });

  return (
    <Box sx={{ margin: 5 }}>
      <Grid container>{data?.role_person !== 'DOSEN' ? renderSection(['act', 'award'], false) : renderSection(dosenDetail, true)}</Grid>
    </Box>
  );
};

AdditionalData.propTypes = {
  data: PropTypes.object.isRequired,
  updateDetail: PropTypes.func
};

export { Identitas };
