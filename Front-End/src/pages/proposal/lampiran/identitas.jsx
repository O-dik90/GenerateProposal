import { ACT_INIT, AWARD_INIT, COMMUNITY_INIT, COURSE_INIT, EDUCATION_INIT, ID_INIT, RESEARCH_INIT } from './initial-data';
import { Button, Divider, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { masterGender, masterLampiranRole } from 'store/slices/master-data';
import { useDispatch, useSelector } from 'react-redux';

import GenForm from 'components/general-form';
import { TableForm } from 'components/table-form';
import { initialFields } from './initial-form';
import { lampiranColumns } from './initial-column';
import { updateBab } from 'store/slices/proposal';
import { useSnackbar } from 'notistack';

const Identitas = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { gender } = useSelector((state) => state.app.masterData);
  const { role } = useSelector((state) => state.app.masterData.lampiran);
  const { lampiran, metadata: rawData } = useSelector((state) => state.app.proposal);

  const [object, setObject] = useState(ID_INIT);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState({
    act: object.act || [],
    award: object.award || [],
    community_service: object.community_service || [],
    course: object.course || [],
    education: object.education || [],
    research: object.research || []
  });
  const [detailObject, setDetailObject] = useState({
    act: ACT_INIT,
    award: AWARD_INIT,
    community_service: COMMUNITY_INIT,
    course: COURSE_INIT,
    education: EDUCATION_INIT,
    research: RESEARCH_INIT
  });

  const roleMHS = [
    { key: 'act', role: 'MHS', label: 'Kegiatan' },
    { key: 'award', role: 'MHS', label: 'Penghargaan' }
  ];

  const roleDosen = [
    { key: 'education', role: 'DOSEN', label: 'Pendidikan' },
    { key: 'course', role: 'DOSEN', label: 'Pendidikan' },
    { key: 'research', role: 'DOSEN', label: 'Penelitian' },
    { key: 'community_service', role: 'DOSEN', label: 'Pengabdian' }
  ];

  const resetDetailObject = useCallback((key) => {
    const initialStates = {
      act: ACT_INIT,
      award: AWARD_INIT,
      education: EDUCATION_INIT,
      course: COURSE_INIT,
      research: RESEARCH_INIT,
      community_service: COMMUNITY_INIT
    };
    setDetailObject((prev) => ({ ...prev, [key]: initialStates[key] || {} }));
  }, []);

  const handlePersonal = {
    edit: (param) => setObject({ ...param, status: true }),
    reset: () => {
      setOpen(false);
      setObject(ID_INIT);
    },
    delete: (param) => setData((prev) => prev.filter((item) => item.no !== param.no)?.map((item, index) => ({ ...item, no: index + 1 }))),
    save: async () => {
      const jsonData = JSON.parse(rawData[9]?.json_data);
      const payload = {
        id: rawData[9]?.id,
        proposals_id: rawData[9]?.proposals_id,
        bab_title: rawData[9]?.bab_title,
        json_data: {
          ...jsonData,
          identitas: data
        }
      };
      console.log('payload', payload);

      try {
        const res = await dispatch(updateBab(payload));
        if (updateBab.fulfilled.match(res)) {
          enqueueSnackbar('Berhasil menyimpan', { variant: 'success' });
        } else {
          enqueueSnackbar('Gagal menyimpan', { variant: 'error' });
        }
      } catch {
        enqueueSnackbar('Terjadi error', { variant: 'error' });
      }
    },
    detail: (param) => {
      setObject({ ...param, status: true });
      setDetail({
        act: param.act || [],
        award: param.award || [],
        community_service: param.community_service || [],
        course: param.course || [],
        education: param.education || [],
        research: param.research || []
      });
      setOpen((prev) => !prev);
    }
  };

  const handleForm = useCallback(
    (values) => {
      if (object?.status) {
        setData((prevData) => prevData.map((item) => (item.no === object.no ? { ...item, ...values, status: false } : item)));
      } else {
        setData((prevData) => [...prevData, { ...values, no: data.length + 1 }]);
      }
      setObject(ID_INIT);
    },
    [data.length, object.no, object?.status]
  );

  const handleDetailActions = {
    edit: (key) => (param) => setDetailObject((prev) => ({ ...prev, [key]: { ...param, status: true } })),
    reset: (key) => () => resetDetailObject(key),
    delete: (key) => (item) => {
      setDetail((prev) => ({
        ...prev,
        [key]: prev[key].filter((row) => row.no !== item.no).map((row, index) => ({ ...row, no: index + 1 }))
      }));
    }
  };
  const handleFormDetail = useCallback(
    (values, key) => {
      if (detailObject[key]?.status) {
        setDetail((prev) => ({
          ...prev,
          [key]: prev[key]?.map((item) => (item.no === detailObject[key]?.no ? { ...item, ...values, status: false } : item))
        }));

        resetDetailObject(key);
      } else {
        setDetail((prev) => ({
          ...prev,
          [key]: [...(prev[key] || []), { ...values, no: (detail[key]?.length || 0) + 1 }]
        }));
      }
    },
    [detail, detailObject, resetDetailObject]
  );
  useEffect(() => {
    const loadMasterData = async () => {
      if (!gender.length) await dispatch(masterGender({ source_name: 'GENDER' }));
    };
    loadMasterData();
  }, [dispatch, gender]);

  useEffect(() => {
    const loadMasterData = async () => {
      if (!role.length) await dispatch(masterLampiranRole({ source_name: 'ROLE_IDENTITAS' }));
    };
    loadMasterData();
  }, [dispatch, role]);

  useEffect(() => {
    setObject((prev) => ({
      ...prev,
      act: detail.act.map((item) => ({ ...item, status: false })),
      award: detail.award.map((item) => ({ ...item, status: false })),
      education: detail.education.map((item) => ({ ...item, status: false })),
      course: detail.course.map((item) => ({ ...item, status: false })),
      research: detail.research.map((item) => ({ ...item, status: false })),
      community_service: detail.community_service.map((item) => ({ ...item, status: false }))
    }));

    setData((prevData) =>
      prevData.map((item) =>
        item.no === object.no
          ? {
              ...item,
              act: detail.act,
              award: detail.award,
              education: detail.education,
              course: detail.course,
              research: detail.research,
              community_service: detail.community_service
            }
          : item
      )
    );
  }, [detail.act, detail.award, detail.community_service, detail.course, detail.education, detail.research, object.no]);

  useEffect(() => {
    if (lampiran && lampiran.identitas) {
      setData(lampiran.identitas);
    }
  }, [lampiran]);

  return (
    <Stack direction="column" spacing={3}>
      <Typography variant="h5" gutterBottom>
        Detail Identitas
      </Typography>
      <Select
        id="role_person"
        displayEmpty
        readOnly={object.status}
        value={object.role_person}
        onChange={(e) => setObject((prev) => ({ ...prev, role_person: e.target.value }))}
        sx={{ width: '15rem' }}
      >
        <MenuItem disabled value="">
          <em>Pilih Keanggotaan</em>
        </MenuItem>
        {role.map((item) => (
          <MenuItem key={item.id} value={item.name_id}>
            {item.name_id}
          </MenuItem>
        ))}
      </Select>
      <Grid item xs={12} sx={{ marginY: 15 }}>
        {object.role_person && (
          <GenForm
            formFields={initialFields.personal}
            buttonDisable={false || open}
            onSubmit={handleForm}
            titleButton={object.status ? 'Update Data Personal' : 'Tambah Data Personal'}
            initialValuesUpdate={object}
          />
        )}
        <Stack direction="column" sx={{ marginTop: 5 }}>
          <TableForm
            columns={lampiranColumns.personal(
              handlePersonal.edit,
              handlePersonal.delete,
              handlePersonal.reset,
              handlePersonal.detail,
              object.no
            )}
            rows={data || []}
            expand={false}
          />
        </Stack>
      </Grid>
      {open && (
        <Grid item xs={12}>
          <Divider sx={{ marginTop: 10, borderBottomWidth: 5 }} />
          <Stack direction="column" sx={{ marginTop: 5 }}>
            {object.role_person !== 'DOSEN' &&
              roleMHS.map(({ key, label }, index) => {
                const detailData = detail[key] || [];
                const detailStatus = detailObject[key]?.status;
                const detailFieldsData = initialFields[key];

                return (
                  <Grid item xs={12} key={`${key}-${index}`} sx={{ marginBottom: 15 }}>
                    <Typography variant="h5" gutterBottom>
                      Detail {label}
                    </Typography>
                    <Stack direction="column" spacing={5}>
                      <GenForm
                        formFields={detailFieldsData}
                        buttonDisable={false}
                        onSubmit={(values) => handleFormDetail(values, key)}
                        titleButton={detailStatus ? `Update Data ${label}` : `Tambah Data ${label}`}
                        initialValuesUpdate={detailObject[key]}
                      />
                      <TableForm
                        columns={lampiranColumns[key](
                          handleDetailActions.edit(key),
                          handleDetailActions.delete(key),
                          handleDetailActions.reset(key),
                          object[key]?.no
                        )}
                        rows={detailData}
                        expand={false}
                        detail=""
                      />
                    </Stack>
                  </Grid>
                );
              })}
            {object.role_person === 'DOSEN' &&
              roleDosen.map(({ key, label }, index) => {
                const detailData = detail[key] || [];
                const detailStatus = detailObject[key]?.status;
                const detailFieldsData = initialFields[key];
                const title = key !== 'education' ? `Tri Dharma ${label}` : label;

                return (
                  <Grid item xs={12} key={`${key}-${index}`} sx={{ marginBottom: 15 }}>
                    <Typography variant="h5" gutterBottom>
                      Detail {title}
                    </Typography>
                    <Stack direction="column" spacing={5}>
                      <GenForm
                        formFields={detailFieldsData}
                        buttonDisable={false}
                        onSubmit={(values) => handleFormDetail(values, key)}
                        titleButton={detailStatus ? `Update Data ${title}` : `Tambah Data ${title}`}
                        initialValuesUpdate={detailObject[key]}
                      />
                      <TableForm
                        columns={lampiranColumns[key](
                          handleDetailActions.edit(key),
                          handleDetailActions.delete(key),
                          handleDetailActions.reset(key),
                          object[key]?.status
                        )}
                        rows={detailData}
                        expand={false}
                        detail=""
                      />
                    </Stack>
                  </Grid>
                );
              })}
          </Stack>
        </Grid>
      )}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="success" onClick={handlePersonal.save}>
          Simpan Detail
        </Button>
      </Stack>
    </Stack>
  );
};

export { Identitas };
