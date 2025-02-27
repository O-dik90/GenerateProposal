import { Grid, Stack, Typography } from '@mui/material';

import GenForm from 'components/general-form';
import { TableForm } from 'components/table-form';
import { lampiranColumns } from './initial-column';

const DetailIdentitas = ({ data }) => {
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

  useState(() => {
    console.log('detail', data);
  }, [data]);

  const roleMHS = [
    { key: 'act', role: 'MHS', label: 'Kegiatan' },
    { key: 'award', role: 'MHS', label: 'Penghargaan' }
  ];

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

  return (
    <Grid item xs={12}>
      <Stack direction="column" sx={{ marginTop: 5 }}>
        {roleMHS.map(({ key, label }, index) => {
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
                    object[key]?.status
                  )}
                  rows={detailData}
                  expand={false}
                />
              </Stack>
            </Grid>
          );
        })}
      </Stack>
    </Grid>
  );
};

export { DetailIdentitas };
