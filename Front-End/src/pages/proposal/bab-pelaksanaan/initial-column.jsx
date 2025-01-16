import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { IconButton, Stack } from '@mui/material';

export const Columns = {
  pelaksanaan: (handleEdit, handleDelete, status) => [
    { name: 'No', field: 'no', width: '4rem', align: 'center' },
    { name: 'Judul Sub Bab', field: 'title' },
    {
      name: 'Aksi',
      field: 'action',
      width: '5rem',
      cell: (value, row) => {
        return (
          <Stack direction="row" spacing={1}>
            <IconButton aria-label="edit" size="small" color="primary" onClick={() => handleEdit(row)} disabled={status}>
              <EditFilled />
            </IconButton>
            <IconButton aria-label="delete" size="small" color="error" onClick={() => handleDelete(row)} disabled={status}>
              <DeleteFilled />
            </IconButton>
          </Stack>
        );
      }
    }
  ]
};
