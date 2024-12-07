import { ArrowRightOutlined, DeleteOutlined, DownloadOutlined, EditFilled } from '@ant-design/icons';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@mui/material';
import { createProposal, deleteProposal, fetchProposal, updateProposal } from 'store/slices/proposal';
import { masterLomba, masterPkm, masterTahunLomba } from 'store/slices/master-data';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import GenerateDocx from 'utils/generate';
import MainCard from 'components/MainCard';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

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
  const navigate = useNavigate(),
    dispatch = useDispatch(),
    { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false),
    [object, setObject] = useState(INITIAL),
    [btnAction, setBtnAction] = useState('Buat');

  const { data, loading } = useSelector((state) => state.app.proposal),
    { pkm, lomba, tahun_lomba } = useSelector((state) => state.app.masterData);

  useEffect(() => {
    dispatch(fetchProposal(1));
  }, [dispatch]);

  useEffect(() => {
    const loadMasterData = async () => {
      if (pkm.length === 0) {
        await dispatch(masterPkm({ source_name: 'PKM' }));
      }
      if (lomba.length === 0) {
        await dispatch(masterLomba({ source_name: 'LOMBA' }));
      }
      if (tahun_lomba.length === 0) {
        await dispatch(masterTahunLomba({ source_name: 'TAHUN_LOMBA' }));
      }
    };

    loadMasterData();
  }, [dispatch, pkm.length, lomba.length, tahun_lomba.length]);

  const columns = [
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
      field: 'last_update',
      headerName: 'Tanggal Update',
      width: 175,
      align: 'center',
      headerAlign: 'center',
      filterable: false,
      valueFormatter: (params) => {
        if (params) {
          return format(new Date(params), 'dd-MM-yyyy HH:mm');
        }
        return '-';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (btnAction === 'Buat') {
        const res = await dispatch(createProposal(object));
        if (createProposal.fulfilled.match(res)) {
          enqueueSnackbar('Berhasil Menambah!', { variant: 'success' });
        }
      } else {
        const res = await dispatch(updateProposal(object));
        if (updateProposal.fulfilled.match(res)) {
          enqueueSnackbar('Berhasil Menyimpan!', { variant: 'success' });
        }
      }
    } catch (error) {
      enqueueSnackbar('Gagal!', { variant: 'error' });
    }
    setOpen(false);
    setBtnAction('Buat');
    setObject(INITIAL);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObject((prevObject) => ({
      ...prevObject,
      [name]: value
    }));
  };

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

  const handleDelete = async (param) => {
    try {
      const res = await dispatch(deleteProposal(param));
      if (deleteProposal.fulfilled.match(res)) {
        enqueueSnackbar('Berhasil Menghapus!', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Gagal!', { variant: 'error' });
    }
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

  return (
    <>
      <MainCard title={title}>
        <Button variant="contained" color="success" type="button" sx={{ marginBottom: 2 }} onClick={() => setOpen(true)}>
          Proposal Baru
        </Button>
        <Box sx={{ width: '100%' }}>
          <DataGrid
            rows={data}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 }
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
          <Box sx={{ width: '100%' }}>
            <Stack direction="row" spacing={2}>
              <Select id="lomba" name="type" displayEmpty value={object.type} onChange={handleChange} sx={{ width: '10rem' }}>
                <MenuItem disabled value="">
                  <em>Pilih Lomba</em>
                </MenuItem>
                {lomba.map((item) => (
                  <MenuItem key={item.id} value={item.code}>
                    {item.value}
                  </MenuItem>
                ))}
              </Select>
              <Select id="tahun" name="year" displayEmpty value={object.year} onChange={handleChange} sx={{ width: '10rem' }}>
                <MenuItem disabled value="">
                  <em>Pilih Tahun</em>
                </MenuItem>
                {tahun_lomba.map((item) => (
                  <MenuItem key={item.id} value={item.code}>
                    {item.value}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ marginTop: 1 }}>
              <Select id="pkm" name="category" displayEmpty value={object.category} onChange={handleChange} sx={{ width: '100%' }}>
                <MenuItem disabled value="">
                  <em>Pilih PKM</em>
                </MenuItem>
                {pkm.map((item) => (
                  <MenuItem key={item.id} value={item.code}>
                    {item.value}
                  </MenuItem>
                ))}
              </Select>
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
              value={object.title}
              onChange={handleChange}
              error={object.title === ''}
              helperText={object.title === '' ? 'Judul Proposal harus diisi, boleh belum fix' : ''}
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
              value={object.description}
              onChange={handleChange}
              error={object.description === ''}
              helperText={object.description === '' ? 'Deskripsi Singkat IDE harus diisi' : ''}
            />
          </Box>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="button"
              variant="contained"
              disabled={!object.type || !object.year || !object.category || !object.title || !object.description}
              onClick={(e) => handleSubmit(e)}
            >
              {btnAction}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProposalTable;
