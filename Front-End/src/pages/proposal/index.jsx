import * as Yup from 'yup';

import { ArrowRightOutlined, DeleteOutlined, DownloadOutlined, EditFilled } from '@ant-design/icons';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@mui/material';
import { Form, Formik } from 'formik';
import { createProposal, deleteProposal, fetchProposal, updateProposal } from 'store/slices/proposal';
import { masterLomba, masterPkm, masterTahunLomba } from 'store/slices/master-data';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import GenerateDocx from 'utils/generate';
import MainCard from 'components/MainCard';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// Validation schema using Yup
const validationSchema = Yup.object({
  type: Yup.string().required('Pilih Lomba'),
  year: Yup.string().required('Pilih Tahun'),
  category: Yup.string().required('Pilih PKM'),
  title: Yup.string().required('Judul Proposal diperlukan'),
  description: Yup.string().required('Deskripsi diperlukan').min(10, 'Deskripsi harus lebih dari 10 karakter')
});

export const INITIAL = {
  id: 0,
  user_id: 1,
  title: '',
  description: '',
  category: '',
  type: '',
  year: '',
  creation_date: '',
  last_update: '',
  edit_status: false
};

const ProposalTable = () => {
  const title = 'Daftar Proposal';
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false),
    [object, setObject] = useState(INITIAL),
    [btnAction, setBtnAction] = useState('Buat');

  const { data, loading } = useSelector((state) => state.app.proposal),
    { pkm, lomba, tahun_lomba } = useSelector((state) => state.app.masterData);

  useEffect(() => {
    dispatch(fetchProposal(1));
    dispatch(masterPkm({ source_name: 'PKM' }));
    dispatch(masterLomba({ source_name: 'LOMBA' }));
    dispatch(masterTahunLomba({ source_name: 'TAHUN_LOMBA' }));
  }, [dispatch]);

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false
    },
    {
      field: 'title',
      headerName: 'Judul',
      headerAlign: 'center',
      minWidth: 150,
      flex: 1,
      filterable: true
    },
    {
      field: 'description',
      headerName: 'Deskripsi',
      type: 'text',
      headerAlign: 'center',
      align: 'center',
      width: 250,
      filterable: false
    },
    {
      field: 'creation_date',
      headerName: 'Tanggal',
      width: 175,
      align: 'center',
      headerAlign: 'center',
      filterable: false,
      valueFormatter: (params) => {
        return format(new Date(params), 'dd-MM-yyyy HH:mm');
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton variant="contained" color="primary" onClick={() => handleEdit(params.row.id)}>
            <EditFilled />
          </IconButton>
          <IconButton disableRipple variant="contained" color="error" sx={{ mx: 1 }} onClick={() => handleDelete(params.row)}>
            <DeleteOutlined />
          </IconButton>
          <IconButton disableRipple variant="outlined" color="primary" onClick={() => handleGenerate(params.row)}>
            <DownloadOutlined />
          </IconButton>
          <IconButton
            disableRipple
            variant="outlined"
            color="primary"
            sx={{ marginLeft: 3 }}
            onClick={() => navigate(`/proposal-table/${params.row.id}`)}
          >
            <ArrowRightOutlined />
          </IconButton>
        </>
      )
    }
  ];

  const handleEdit = (id) => {
    const editData = data.find((item) => item.id === id);
    setObject((prevObject) => ({
      ...prevObject,
      ...editData,
      edit_status: true
    }));
    setBtnAction('Update');
    setOpen(true);
  };

  const handleDelete = (param) => {
    dispatch(deleteProposal(param));
  };

  const handleClose = () => {
    setOpen(false);
    setBtnAction('Buat');
    setObject(INITIAL);
  };

  const handleGenerate = (param) => {
    GenerateDocx({
      data: {
        latarBelakang: 'Your background text here',
        rumusanMasalah: 'Your problem statement here',
        tujuan: 'Your objectives here',
        luaran: 'Your outputs here',
        manfaat: 'Your benefits here',
        fileName: `${param.name}-document.docx`
      }
    });
  };

  const handleDialog = () => {
    setOpen(true);
  };

  return (
    <>
      <MainCard title={title}>
        <Button variant="contained" color="success" type="button" sx={{ marginBottom: 2 }} onClick={() => handleDialog()}>
          Proposal Baru
        </Button>
        <Box sx={{ width: '100%' }}>
          <DataGrid
            rows={data}
            columns={columns}
            loading={loading}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5 }
              },
              filter: {
                filterModel: {
                  items: []
                }
              }
            }}
            disableColumnFilter={false}
            disableColumnSelector={true}
            disableDensitySelector={true}
            disableRowSelectionOnClick
          />
        </Box>
      </MainCard>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          component: 'form'
        }}
      >
        <DialogTitle>Proposal Baru</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={object}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              values.preventDefault();

              // Perform the create or update action
              if (btnAction === 'Buat') {
                dispatch(createProposal(values));
              } else {
                dispatch(updateProposal(values));
              }

              handleClose();
            }}
          >
            {({ values, handleChange, handleBlur, errors, touched }) => (
              <Form>
                <Box sx={{ width: '100%' }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    useFlexGap
                    sx={{
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap'
                    }}
                  >
                    <FormControl error={touched.type && !!errors.type}>
                      <Select
                        id="lomba"
                        name="type"
                        displayEmpty
                        value={values.type}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{ width: '10rem' }}
                      >
                        <MenuItem disabled value="">
                          <em>Pilih Lomba</em>
                        </MenuItem>
                        {lomba.map((item) => (
                          <MenuItem key={item.id} value={item.code}>
                            {item.value}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{touched.type && errors.type}</FormHelperText>
                    </FormControl>
                    <FormControl error={!!errors.year && touched.year}>
                      <Select
                        id="tahun"
                        name="year"
                        displayEmpty
                        value={values.year}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{ width: '10rem' }}
                      >
                        <MenuItem disabled value="">
                          <em>Pilih Tahun</em>
                        </MenuItem>
                        {tahun_lomba.map((item) => (
                          <MenuItem key={item.id} value={item.code}>
                            {item.value}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{touched.year && errors.year}</FormHelperText>
                    </FormControl>
                    <FormControl error={!!errors.category && touched.category} fullWidth>
                      <Select id="pkm" name="category" displayEmpty value={values.category} onChange={handleChange} onBlur={handleBlur}>
                        <MenuItem disabled value="">
                          <em>Pilih PKM</em>
                        </MenuItem>
                        {pkm.map((item) => (
                          <MenuItem key={item.id} value={item.code}>
                            {item.value}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{touched.category && errors.category}</FormHelperText>
                    </FormControl>
                  </Stack>
                  <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="judul_proposal"
                    name="title"
                    label="Judul Proposal"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title && !!errors.title}
                    helperText={touched.title && errors.title}
                  />
                  <TextField
                    required
                    margin="dense"
                    id="deskripsi"
                    name="description"
                    label="Deskripsi Singkat IDE"
                    type="textarea"
                    fullWidth
                    variant="outlined"
                    multiline
                    maxRows={5}
                    minRows={3}
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && !!errors.description}
                    helperText={touched.description && errors.description}
                  />
                </Box>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!values.type || !values.year || !values.category || !values.title || !values.description}
                  >
                    {btnAction}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProposalTable;
