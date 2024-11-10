import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/MainCard';
import { useNavigate } from 'react-router-dom';

const ProposalTable = () => {
  const title = 'Proposal Table';
  const navigate = useNavigate();
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
      flex: 1
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 100
    },
    {
      field: 'city',
      headerName: 'City',
      width: 200,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Button variant="contained" color="primary" size="small" sx={{ mr: 1 }} onClick={() => handleEdit(params.row.name)}>
            Edit
          </Button>
          <Button variant="contained" color="error" size="small" onClick={() => handleDelete(params.row.id)}>
            Delete
          </Button>
        </Box>
      )
    }
  ];

  // Define some sample rows
  const rows = [
    { id: 1, name: 'Alice', age: 25, city: 'New York' },
    { id: 2, name: 'Bob', age: 30, city: 'Chicago' },
    { id: 3, name: 'Carol', age: 28, city: 'Los Angeles' },
    { id: 4, name: 'David', age: 35, city: 'San Francisco' },
    { id: 5, name: 'Eve', age: 22, city: 'Seattle' },

    { id: 6, name: 'Frank', age: 27, city: 'Boston' }
  ];

  const handleEdit = (id) => {
    navigate(`/proposal-table/${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete row with ID: ${id}`);
  };

  return (
    <MainCard title={title}>
      <Button variant="contained" color="success" type="button" sx={{ marginY: 2 }} onClick={() => alert('proposal baru')}>
        Proposal Baru
      </Button>
      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5
              }
            }
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </Box>
    </MainCard>
  );
};

export default ProposalTable;
