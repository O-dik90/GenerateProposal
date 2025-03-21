import { ACT_INIT, AWARD_INIT, COMMUNITY_INIT, COURSE_INIT, EDUCATION_INIT, RESEARCH_INIT } from './initial-data';
import { Grid, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import GenForm from 'components/general-form';
import PropTypes from 'prop-types';
import { TableForm } from 'components/table-form';
import { initialFields } from './initial-form';
import { lampiranColumns } from './initial-column';
import { lampiranIdentitasAsync } from 'store/slices/proposal';

const DetailIdentitas = ({ data }) => {
  const dispatch = useDispatch();
  const { identitas } = useSelector((state) => state.app.proposal);
  const [detail, setDetail] = useState({
    act: data.act || [],
    award: data.award || [],
    community_service: data.community_service || [],
    course: data.course || [],
    education: data.education || [],
    research: data.research || []
  });
  const [detailObject, setDetailObject] = useState({
    act: ACT_INIT,
    award: AWARD_INIT,
    community_service: COMMUNITY_INIT,
    course: COURSE_INIT,
    education: EDUCATION_INIT,
    research: RESEARCH_INIT
  });

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

  const handleFormDetail = useCallback(
    (values, key) => {
      setDetail((prev) => {
        const updatedDetail = {
          ...prev,
          [key]: detailObject[key]?.status
            ? prev[key]?.map((item) => (item.no === detailObject[key]?.no ? { ...item, ...values, status: false } : item))
            : [...(prev[key] || []), { ...values, no: (prev[key]?.length || 0) + 1 }]
        };

        // Update Redux state after ensuring the new state is correct
        if (identitas && Array.isArray(identitas)) {
          const updateDetails = identitas.map((item) => (item.no === data.no ? { ...item, ...updatedDetail } : item));

          dispatch(lampiranIdentitasAsync(updateDetails));
        }

        return updatedDetail; // Ensure state update reflects new values
      });

      resetDetailObject(key);
    },
    [detailObject, resetDetailObject, dispatch, identitas, data.no]
  );

  const handleDetailActions = useMemo(
    () => ({
      edit: (key) => (param) => setDetailObject((prev) => ({ ...prev, [key]: { ...param, status: true } })),
      reset: (key) => () => resetDetailObject(key),
      delete: (key) => (item) => {
        setDetail((prev) => ({
          ...prev,
          [key]: prev[key].filter((row) => row.no !== item.no).map((row, index) => ({ ...row, no: index + 1 }))
        }));
      }
    }),
    [resetDetailObject]
  );

  useEffect(() => {
    dispatch(lampiranIdentitasAsync(identitas));
  }, [dispatch, identitas]);

  return (
    <Grid item xs={12}>
      <Stack direction="column" sx={{ marginTop: 5 }}>
        {data?.role_person !== 'DOSEN' &&
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
                      detailObject[key]?.no
                    )}
                    rows={detailData}
                    expand={false}
                  />
                </Stack>
              </Grid>
            );
          })}
        {data?.role_person === 'DOSEN' &&
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
                      detailObject[key]?.no
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
  );
};

DetailIdentitas.propTypes = {
  data: PropTypes.object.isRequired
};

export { DetailIdentitas };
