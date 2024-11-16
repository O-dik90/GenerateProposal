import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import GenerateDocx from 'utils/generate';
import MainCard from 'components/MainCard';
import { fetchProposal } from 'store/slices/proposal';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProposalTable = () => {
  const title = 'Daftar Proposal';
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { proposal, loading } = useSelector((state) => state.app.proposal);
  useEffect(() => {
    dispatch(fetchProposal());
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
      field: 'name',
      headerName: 'Name',
      headerAlign: 'center',
      minWidth: 150,
      flex: 1,
      filterable: true
    },
    {
      field: 'deskripsi',
      headerName: 'Deskripsi',
      type: 'text',
      headerAlign: 'center',
      align: 'center',
      width: 250,
      filterable: false
    },
    {
      field: 'tanggal',
      headerName: 'Tanggal',
      width: 175,
      align: 'center',
      headerAlign: 'center',
      filterable: false
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 260,
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Button disableRipple variant="contained" color="primary" size="small" onClick={() => handleEdit(params.row.id)}>
            Edit
          </Button>
          <Button disableRipple variant="contained" color="error" size="small" sx={{ mx: 1 }} onClick={() => handleDelete(params.row.id)}>
            Delete
          </Button>
          <Button disableRipple variant="outlined" color="primary" size="small" onClick={() => handleGenerate(params.row)}>
            Generate
          </Button>
        </Box>
      )
    }
  ];

  const handleEdit = (id) => {
    navigate(`/proposal-table/${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete row with ID: ${id}`);
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
    <MainCard title={title}>
      <Button variant="contained" color="success" type="button" sx={{ marginBottom: 2 }} onClick={() => alert('proposal baru')}>
        Proposal Baru
      </Button>
      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={proposal}
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
  );
};

export default ProposalTable;
