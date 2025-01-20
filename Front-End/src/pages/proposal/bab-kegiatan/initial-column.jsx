import { DeleteFilled, EditFilled, RedoOutlined } from '@ant-design/icons';
import { IconButton, Stack } from '@mui/material';

export const Columns = {
  Biaya: () => [
    { name: 'No', field: 'no', width: '4rem', align: 'center' },
    { name: 'Judul', field: 'title' },
    {
      name: 'Dana Belmawa (Rp.)',
      field: 'sumber[0][amount]',
      width: '15rem',
      align: 'right',
      cell: (value, row) => row.sumber.find((s) => s.type === 'belmawa')?.amount || '-'
    },
    {
      name: 'Dana Perguruan Tinggi (Rp.)',
      field: 'sumber[1][amount]',
      width: '15rem',
      align: 'right',
      cell: (value, row) => row.sumber.find((s) => s.type === 'perguruan')?.amount || '-'
    },
    { name: 'Total Pengeluaran (Rp.)', field: 'sub_total', align: 'right', width: '20rem' }
  ],
  Kegiatan: (handleEdit, handleDelete, handleReset, status) => [
    { name: 'No', field: 'no', width: '4rem', align: 'center' },
    { name: 'Nama Kegiatan', field: 'activity' },
    { name: 'Penanggung Jawab', field: 'person', width: '20rem' },
    {
      name: 'Aksi',
      field: 'action',
      width: '5rem',
      cell: (value, row) => {
        return (
          <Stack direction="row" spacing={1}>
            {!status ? (
              <IconButton aria-label="edit" size="small" color="primary" onClick={() => handleEdit(row)} disabled={status}>
                <EditFilled />
              </IconButton>
            ) : (
              <IconButton aria-label="reset" size="small" color="primary" onClick={() => handleReset()} disabled={row && status}>
                <RedoOutlined />
              </IconButton>
            )}
            <IconButton aria-label="delete" size="small" color="error" onClick={() => handleDelete(row)} disabled={status}>
              <DeleteFilled />
            </IconButton>
          </Stack>
        );
      }
    }
  ]
};
