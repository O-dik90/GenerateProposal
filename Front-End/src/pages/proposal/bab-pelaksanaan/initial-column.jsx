import { DeleteFilled, EditFilled, RedoOutlined } from '@ant-design/icons';
import { IconButton, Stack } from '@mui/material';

export const Columns = {
  pelaksanaan: (handleEdit, handleDelete, handleReset, data) => [
    { name: 'No', field: 'no', width: '4rem', align: 'center' },
    { name: 'Judul Sub Bab', field: 'title' },
    {
      name: 'Aksi',
      field: 'action',
      width: '5rem',
      cell: (value, row) => {
        return (
          <Stack direction="row" spacing={1}>
            {data.no !== row.no ? (
              <IconButton aria-label="edit" size="small" color="primary" onClick={() => handleEdit(row)}>
                <EditFilled />
              </IconButton>
            ) : (
              <IconButton aria-label="reset" size="small" color="primary" onClick={() => handleReset()}>
                <RedoOutlined />
              </IconButton>
            )}
            <IconButton aria-label="delete" size="small" color="error" onClick={() => handleDelete(row)} disabled={data.no === row.no}>
              <DeleteFilled />
            </IconButton>
          </Stack>
        );
      }
    }
  ]
};
