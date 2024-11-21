import { ArrowRightOutlined, DeleteOutlined, DownloadOutlined, EditFilled } from '@ant-design/icons';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, Stack, TextField } from '@mui/material';
import { masterLomba, masterPkm } from 'store/slices/master-data';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import GenerateDocx from 'utils/generate';
import MainCard from 'components/MainCard';
import { fetchProposal } from 'store/slices/proposal';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const INITIAL = {
  id: '',
  title: '',
  deskripsi: '',
  lomba: '',
  pkm: '',
  status: false
};

const ProposalTable = () => {
  const title = 'Daftar Proposal';
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false),
    [object, setObject] = useState(INITIAL);

  const { data, loading } = useSelector((state) => state.app.proposal),
    { masterData } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(fetchProposal(1));
    console.log('fetchProposal');
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
          <IconButton disableRipple variant="contained" color="error" sx={{ mx: 1 }} onClick={() => handleDelete(params.row.id)}>
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
    navigate(`/proposal-table/${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete row with ID: ${id}`);
  };
  const handleClose = () => {
    setOpen(false);
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
    dispatch(masterPkm({ source_name: 'PKM' }));
    dispatch(masterLomba({ source_name: 'LOMBA' }));
  };

  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

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
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            console.log(object);
            handleClose();
          }
        }}
      >
        <DialogTitle>Proposal Baru</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%' }}>
            <Stack direction="row" spacing={2}>
              <Select
                id="lomba"
                displayEmpty
                value={object.lomba}
                onChange={(e) => setObject({ ...object, lomba: e.target.value })}
                inputProps={{ 'aria-label': 'Without label' }}
                sx={{ width: '10rem' }}
              >
                <MenuItem disabled value="">
                  <em>Pilih Lomba</em>
                </MenuItem>
                {masterData.lomba.map((item) => (
                  <MenuItem key={item.id} value={item.code}>
                    {item.value}
                  </MenuItem>
                ))}
              </Select>
              <Select
                id="pkm"
                displayEmpty
                value={object.pkm}
                onChange={(e) => setObject({ ...object, pkm: e.target.value })}
                inputProps={{ 'aria-label': 'Without label' }}
                sx={{ width: '100%' }}
              >
                <MenuItem disabled value="">
                  <em>Pilih PKM</em>
                </MenuItem>
                {masterData.pkm.map((item) => (
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
              name="judul_proposal"
              label="Judul Proposal"
              type="text"
              fullWidth
              variant="outlined"
              value={object.title}
              onChange={(e) => setObject({ ...object, title: e.target.value })}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="deskripsi"
              name="deskripsi"
              label="Deskripsi Singkat IDE"
              type="textarea"
              fullWidth
              variant="outlined"
              multiline
              maxRows={5}
              minRows={3}
              value={object.deskripsi}
              onChange={(e) => setObject({ ...object, deskripsi: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Buat</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProposalTable;
