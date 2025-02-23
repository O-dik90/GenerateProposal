import { ArrowRightOutlined, DeleteOutlined, DownloadOutlined, EditFilled } from '@ant-design/icons';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
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
// import ExportToDocx from 'utils/table-gambar';
import GenerateDocx from 'utils/generate';
import MainCard from 'components/MainCard';
import { detailProposal } from 'store/slices/proposal';
import { format } from 'date-fns';
import { useAuth } from 'pages/protect/authProvider';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

export const INITIAL = {
  id: 0,
  user_id: '',
  title: '',
  description: '',
  pkm_category: '',
  pkm_type: 'PKM',
  pkm_desc: '',
  year: '2025',
  pkm_belmawa: 6000000,
  pkm_perguruan: 50000,
  edit_status: false
};

const ProposalTable = () => {
  const title = 'Daftar Proposal';
  const navigate = useNavigate(),
    dispatch = useDispatch(),
    { user } = useAuth(),
    { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false),
    [object, setObject] = useState(INITIAL),
    [btnAction, setBtnAction] = useState('Buat');

  const { data, loading } = useSelector((state) => state.app.proposal),
    { pkm, lomba, tahunLomba } = useSelector((state) => state.app.masterData);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [navigate, user]);

  useEffect(() => {
    if (user) {
      dispatch(fetchProposal(user.uuid));
    }
  }, [dispatch, user]);

  useEffect(() => {
    const loadMasterData = async () => {
      if (pkm.length <= 0) await dispatch(masterPkm({ name: 'PKM' }));
    };

    loadMasterData();
  }, [dispatch, pkm]);
  useEffect(() => {
    const loadMasterData = async () => {
      if (lomba.length <= 0) await dispatch(masterLomba({ name: 'LOMBA' }));
    };

    loadMasterData();
  }, [dispatch, lomba]);
  useEffect(() => {
    const loadMasterData = async () => {
      if (tahunLomba.length <= 0) await dispatch(masterTahunLomba({ name: 'TAHUN_LOMBA' }));
    };

    loadMasterData();
  }, [dispatch, tahunLomba]);

  const columns = [
    {
      field: 'title',
      headerName: 'Judul',
      headerAlign: 'center',
      minWidth: 200,
      flex: 1,
      filterable: true
    },
    {
      field: 'pkm_category',
      headerName: 'Kategori PKM',
      headerAlign: 'center',
      width: 100,
      filterable: true
    },
    {
      field: 'year',
      headerName: 'Tahun PKM',
      headerAlign: 'center',
      align: 'center',
      width: 125,
      filterable: true
    },
    {
      field: 'create_date',
      headerName: 'Tanggal Pembuatan',
      width: 175,
      align: 'center',
      headerAlign: 'center',
      filterable: false,
      valueFormatter: (params) => {
        return format(new Date(params), 'dd-MM-yyyy HH:mm');
      }
    },
    {
      field: 'update_date',
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
      field: 'pkm_belmawa',
      headerName: 'Dana Belmawa',
      width: 175,
      align: 'center',
      headerAlign: 'center',
      filterable: false,
      valueFormatter: (params) => {
        if (params) {
          return `Rp. ${formatCurrency(params)}`;
        }
        return '-';
      }
    },
    {
      field: 'pkm_perguruan',
      headerName: 'Dana Perguruan Tinggi',
      width: 175,
      align: 'center',
      headerAlign: 'center',
      filterable: false,
      valueFormatter: (params) => {
        if (params) {
          return `Rp. ${formatCurrency(params)}`;
        }
        return '-';
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 250,
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
            onClick={() => navigate(`/proposal-table/${params.row.user_id}/${params.row.id}`)}
          >
            <ArrowRightOutlined />
          </IconButton>
        </>
      )
    }
  ];

  const handleSubmit = async () => {
    let data = { ...object, user_id: user.uuid };
    try {
      if (btnAction === 'Buat') {
        const res = await dispatch(createProposal(data));
        if (createProposal.fulfilled.match(res)) {
          enqueueSnackbar('Berhasil Menambah!', { variant: 'success' });
        }
      } else {
        const res = await dispatch(updateProposal(data));
        if (updateProposal.fulfilled.match(res)) {
          enqueueSnackbar('Berhasil Menyimpan!', { variant: 'success' });
        }
      }
      setOpen(false);
      setBtnAction('Buat');
      setObject(INITIAL);
    } catch (error) {
      enqueueSnackbar('Gagal!', { variant: 'error' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Remove non-numeric characters for specific fields
    let numericValue = String(value).replace(/[^\d]/g, '');
    let numValue = parseInt(numericValue, 10) || 0;

    setObject((prevObject) => {
      let updatedObject = {
        ...prevObject,
        [name]: name === 'pkm_belmawa' || name === 'pkm_perguruan' ? numValue : value
      };

      if (name === 'pkm_category') {
        const selectedItem = pkm.find((item) => item.init === value);
        if (selectedItem) {
          updatedObject.pkm_desc = selectedItem.description;
        }
      }

      return updatedObject;
    });
  };

  // Format currency helper function
  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID').format(value);
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
      const res = await dispatch(deleteProposal({ user_id: user.uuid, item_id: param.id }));
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

  const handleGenerate = async (param) => {
    try {
      const res = await dispatch(detailProposal(param));

      if (!detailProposal.fulfilled.match(res)) {
        enqueueSnackbar('Gagal mengambil detail proposal', { variant: 'error' });
        return;
      }

      const proposal = res.payload?.[0];
      if (!proposal) {
        enqueueSnackbar('Data proposal tidak ditemukan', { variant: 'error' });
        return;
      }

      if (proposal.generate_status) {
        enqueueSnackbar('Memproses data...', { variant: 'success' });
        await GenerateDocx({
          data: {
            pendahuluan: JSON.parse(proposal.proposalDetails[0]?.json_data),
            tinjauan: JSON.parse(proposal.proposalDetails[1]?.json_data),
            pelaksanaan: JSON.parse(proposal.proposalDetails[2]?.json_data),
            kegiatan: JSON.parse(proposal.proposalDetails[3]?.json_data),
            dapus: JSON.parse(proposal.proposalDetails[4]?.json_data),
            lampiran: JSON.parse(proposal.proposalDetails[5]?.json_data)
          }
        });
      } else {
        enqueueSnackbar('Data belum komplet', { variant: 'warning' });
      }
    } catch (error) {
      console.error('Error in handleGenerate:', error);
      enqueueSnackbar('Terjadi kesalahan dalam proses', { variant: 'error' });
    }
  };

  let disableButton =
    !object.pkm_category ||
    !object.pkm_type ||
    !object.year ||
    !object.title ||
    object.pkm_perguruan < 50000 ||
    object.pkm_perguruan > 2000000 ||
    object.pkm_belmawa < 6000000 ||
    object.pkm_belmawa > 10000000;

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
        {/* <ExportToDocx /> */}
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
              <Select id="lomba" name="pkm_type" displayEmpty value={object.pkm_type} onChange={handleChange} sx={{ width: '10rem' }}>
                <MenuItem disabled value="">
                  <em>Pilih Lomba</em>
                </MenuItem>
                {lomba.map((item) => (
                  <MenuItem key={`${item.code}-${item.id}`} value={item.init}>
                    {item.description}
                  </MenuItem>
                ))}
              </Select>
              <Select id="tahun" name="year" displayEmpty value={object.year} onChange={handleChange} sx={{ width: '10rem' }}>
                <MenuItem disabled value="">
                  <em>Pilih Tahun</em>
                </MenuItem>
                {tahunLomba.map((item) => (
                  <MenuItem key={`${item.code}-${item.id}`} value={item.init}>
                    {item.description}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ marginTop: 1 }}>
              <Select id="pkm" name="pkm_category" displayEmpty value={object.pkm_category} onChange={handleChange} sx={{ width: '100%' }}>
                <MenuItem disabled value="">
                  <em>Pilih PKM</em>
                </MenuItem>
                {pkm.map((item) => (
                  <MenuItem key={`${item.init}-${item.id}`} value={item.init}>
                    {item.description}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ marginTop: 2 }}>
              <TextField
                id="pkm_belmawa"
                name="pkm_belmawa"
                label="Jumlah Belmawa"
                type="text"
                value={formatCurrency(object.pkm_belmawa)}
                onChange={handleChange}
                fullWidth
                error={object.pkm_belmawa < 6000000 || object.pkm_belmawa > 10000000}
                helperText="Pengajuan Belmawa min. Rp. 6.000.000 - Rp. 10.000.000"
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
              />

              <TextField
                id="pkm_perguruan"
                name="pkm_perguruan"
                label="Jumlah Perguruan Tinggi"
                type="text"
                value={formatCurrency(object.pkm_perguruan)}
                onChange={handleChange}
                fullWidth
                error={object.pkm_perguruan < 50000 || object.pkm_perguruan > 2000000}
                helperText="Pengajuan Perguruan Tinggi min. Rp. 50.000 - Rp. 2.000.000"
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
              />
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
            <Button type="button" variant="contained" disabled={disableButton} onClick={handleSubmit}>
              {btnAction}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProposalTable;
