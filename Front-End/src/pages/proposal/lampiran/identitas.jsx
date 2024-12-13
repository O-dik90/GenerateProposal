import { ACT_INIT, AWARDS_INIT, COMMUNITY_INIT, COURSE_INIT, EDUCATION_INIT, ID_INIT, RESEARCH_INIT } from './initial';
import { Box, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import { Fields, columns } from './initial-form';
import React, { useEffect, useState } from 'react';
import { masterGender, masterLampiranRole } from 'store/slices/master-data';
import { useDispatch, useSelector } from 'react-redux';

import { GeneralForm } from 'components/form/GeneralForm';
import PropTypes from 'prop-types';
import TableGrid from 'components/table/TableGrid';

const Identitas = () => {
  const { gender } = useSelector((state) => state.app.masterData);
  const { role } = useSelector((state) => state.app.masterData.lampiran);
  const dispatch = useDispatch(),
    [object, setObject] = useState(ID_INIT),
    [data, setData] = useState([
      {
        no: 1,
        role_person: 'KETUA',
        name: 'odik yudi nugroho',
        gender: '',
        id_no: '',
        place_of_birth: '',
        birthday: '',
        email: '',
        phone: '',
        add_data: {
          activities: [],
          awards: [],
          education: [],
          course: [],
          research: [],
          comunity_service: []
        }
      }
    ]),
    [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!object.name) newErrors.name = 'Nama wajib diisi. Untuk Dosen disertakan gelar';
    if (!object.email) newErrors.email = 'Email wajib diisi';
    if (!object.phone) newErrors.phone = 'No Telepon wajib diisi';
    if (!object.gender) newErrors.gender = 'Jenis Kelamin wajib diisi';
    if (!object.id_no) newErrors.id_no = 'NIM / NIDM wajib diisi';
    if (!object.place_of_birth) newErrors.place_of_birth = 'Tempat Lahir wajib diisi';
    if (!object.birthday) newErrors.birthday = 'Tanggal Lahir wajib diisi';

    return newErrors;
  };

  const handleIdentitas = {
    onchange: (e) => {
      const { name, value } = e.target;
      setObject((prevData) => ({
        ...prevData,
        [name]: value
      }));
    },
    add: (e) => {
      e.preventDefault();
      const newErrors = validate();

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      } else {
        console.log('Form Data Submitted:', object);
        setErrors({});
        setData((prev) => [...prev, { ...object, no: prev.length === 0 ? 1 : prev.length + 1 }]);
      }
      setObject(ID_INIT);
    },
    edit: (param) => {
      setObject(param);
    },
    update: () => {
      const newErrors = validate();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      }

      setData((prev) => {
        const updatedData = [...prev];
        const index = updatedData.findIndex((item) => item.no === object.no);
        if (index !== -1) {
          updatedData[index] = { ...object, no: object.no };
        }
        return updatedData;
      });
      setErrors({});
      setObject(ID_INIT);
    },
    delete: (param) => {
      const updatedData = [...data];
      updatedData.splice(param, 1);
      setData(updatedData);
    },
    detail: (param) => <AdditionalData dataDetail={param} />
  };

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

  // useEffect(() => {
  //   console.log(act);
  // }, [act]);
  return (
    <Stack direction="column" spacing={2}>
      <Select
        id="role_person"
        displayEmpty
        readOnly={object.status}
        value={object.role_person}
        onChange={handleIdentitas.onchange}
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
      {object.role_person && (
        <GeneralForm
          buttonForm="Tambah Data"
          buttonDisable={false}
          formData={object}
          errors={errors}
          Fields={Fields.personal}
          handleChange={handleIdentitas.onchange}
          handleSubmit={handleIdentitas.add}
        />
      )}
      <TableGrid
        key={`grid-Identitas`}
        columns={columns.identitas}
        rows={data}
        expand
        action
        onEdit={handleIdentitas.edit}
        onDelete={handleIdentitas.delete}
        onUpdate={handleIdentitas.update}
        detail={handleIdentitas.detail}
      />
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
    }),
    [errorDetail, setErrorDetail] = useState({});

  const validate = (key) => {
    const newErrors = {};

    const validationRules = {
      act: (data) => {
        if (!data.act_name || !data.act_role || !data.act_start_date)
          return { act_name: 'Wajib diisi', act_role: 'Wajib diisi', act_start_date: 'Wajib diisi' };
      },
      award: (data) => {
        if (!data.award_name || !data.award_giver || !data.award_year)
          return {
            award_name: 'Wajib diisi',
            award_giver: 'Wajib diisi',
            award_year: 'Wajib diisi'
          };
      },
      education: (data) => {
        if (!data.degree || !data.institution || !data.major || !data.graduation_year)
          return {
            degree: 'Wajib diisi',
            major: 'Wajib diisi',
            institution: 'Wajib diisi',
            graduation_year: 'Wajib diisi'
          };
      },
      course: (data) => {
        if (!data.course_name || !data.course_type || !data.credits)
          return {
            course_name: 'Wajib diisi',
            course_type: 'Wajib diisi',
            credits: 'Wajib diisi'
          };
      },
      research: (data) => {
        if (!data.research_title || !data.research_year || !data.research_source)
          return {
            research_title: 'Wajib diisi',
            research_year: 'Wajib diisi',
            research_source: 'Wajib diisi'
          };
      },
      comunity_service: (data) => {
        if (!data.com_title || isNaN(data.com_year) || !data.com_source)
          return {
            com_title: 'Wajib diisi',
            com_year: 'Wajib diisi',
            com_source: 'Wajib diisi'
          };
      }
    };

    if (validationRules[key] && object[key]) {
      const error = validationRules[key](object[key]);
      if (error) Object.assign(newErrors, error);
    }

    return newErrors;
  };

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
    onchange: (key) => (e) => {
      const { name, value } = e.target;
      setObject((prevData) => ({
        ...prevData,
        [key]: {
          ...prevData[key],
          [name]: value
        }
      }));
    },
    add: (key) => (e) => {
      e.preventDefault();
      const newErrors = validate(key);
      if (Object.keys(newErrors).length > 0) {
        setErrorDetail(newErrors);
        return;
      }
      setDetail((prev) => ({
        ...prev,
        [key]: prev[key].length === 0 ? [{ ...object[key], no: 1 }] : [...prev[key], { ...object[key], no: prev[key].length + 1 }]
      }));
      reset(key);
      setErrorDetail({});
    },
    edit: (key) => (param) => {
      setObject((prev) => ({ ...prev, [key]: param }));
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

  useEffect(() => {
    console.log(errorDetail);
  }, [dataDetail, errorDetail]);

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
                <GeneralForm
                  buttonForm={`Tambah Detail ${key === 'act' ? 'Kegiatan' : 'Penghargaan'}`}
                  buttonDisable={false}
                  formData={object[key]}
                  errors={errorDetail}
                  Fields={Fields[key]}
                  handleChange={handleAct.onchange(key)}
                  handleSubmit={handleAct.add(key)}
                />
                <TableGrid
                  key={`grid-detail-penghargaan`}
                  columns={columns[key]}
                  rows={detail[key]}
                  expand={false}
                  action
                  onEdit={handleAct.edit(key)}
                  onDelete={handleAct.delete(key)}
                  onUpdate={handleAct.update(key)}
                />
              </Grid>
            ))}
          {dataDetail?.role_person === 'DOSEN' &&
            dosenDetail.map((item, index) => (
              <Grid item xs={12} key={`${item.key}-${index}`} sx={{ marginBottom: 15 }}>
                <Typography variant="h5" gutterBottom>
                  Detail {item.key === 'education' ? item.label : `Tri Dharma ${item.label}`}
                </Typography>
                {/* GeneralForm for adding new activities */}
                <GeneralForm
                  buttonForm={`Tambah Detail ${item.key === 'education' ? item.label : `Tri Dharma ${item.label}`}`}
                  buttonDisable={false}
                  formData={object[item.key]}
                  errors={errorDetail}
                  Fields={Fields[item.key]}
                  handleChange={handleAct.onchange(item.key)}
                  handleSubmit={handleAct.add(item.key)}
                />
                <TableGrid
                  key={`grid-detail-penghargaan`}
                  columns={columns[item.key]}
                  rows={detail[item.key]}
                  expand={false}
                  action
                  onEdit={handleAct.edit(item.key)}
                  onDelete={handleAct.delete(item.key)}
                  onUpdate={handleAct.update(item.key)}
                />
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
