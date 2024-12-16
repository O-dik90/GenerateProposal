import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { IconButton, Stack } from '@mui/material';

// ** Regional Identitas
export const lampiranColumns = {
  personal: (handleEdit, handleDelete, status) => [
    { name: 'No', field: 'no', width: '4rem', align: 'center' },
    { name: 'Nama', field: 'name', width: '30rem' },
    { name: 'Jabatan', field: 'role_person' },
    { name: 'Email', field: 'email' },
    { name: 'No. HP', field: 'phone' },
    { name: 'NIP / NIDM', field: 'id_no' },
    { name: 'L / P', field: 'gender', align: 'center' },
    { name: 'Kota Asal', field: 'birth_place' },
    { name: 'Tanggal Lahir', field: 'birth_date', align: 'center' },
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
  ],
  act: (handleEdit, handleDelete, status) => [
    { name: 'No', field: 'no', width: '4rem', align: 'center' },
    { name: 'Jenis Kegiatan', field: 'act_name' },
    { name: 'Status dalam Kegiatan', field: 'act_role' },
    { name: 'Tanggal mulai Kegiatan', field: 'act_start_date', width: '15rem' },
    { name: 'Tanggal selesai Kegiatan', field: 'act_end_date', width: '15rem' },
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
  ],
  award: (handleEdit, handleDelete, status) => [
    { name: 'No', field: 'no', width: '4rem', align: 'center' },
    { name: 'Jenis Penghargaan', field: 'award_name' },
    { name: 'Pihak Pemberi Penghargaan', field: 'award_giver', width: '20rem' },
    { name: 'Tahun', field: 'award_year', width: '10rem' },
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
  ],
  education: (handleEdit, handleDelete, status) => [
    { name: 'No', field: 'no', width: '4rem', align: 'center' },
    { name: 'Jenjang', field: 'degree' },
    { name: 'Asal Universitas', field: 'institution' },
    { name: 'Jurusan', field: 'major' },
    { name: 'Tahun', field: 'graduation_year', width: '10rem' },
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
  ],
  course: (handleEdit, handleDelete, status) => [
    { name: 'No', field: 'no', width: '4rem', align: 'center' },
    { name: 'Mata Kuliah', field: 'course_name' },
    { name: 'Wajib/Pilihan', field: 'course_type' },
    { name: 'SKS', field: 'credits', width: '10rem' },
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
  ],
  research: (handleEdit, handleDelete, status) => [
    { name: 'No', field: 'no', width: '4rem', align: 'center' },
    { name: 'Judul Penelitian', field: 'research_title' },
    { name: 'Tahun', field: 'research_year', width: '10rem' },
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
  ],
  comunity_service: (handleEdit, handleDelete, status) => [
    { name: 'No', field: 'no', width: '4rem', align: 'center' },
    { name: 'Nama Kegiatan', field: 'comunity_service_name' },
    { name: 'Tahun', field: 'comunity_service_year', width: '10rem' },
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

// ** Regional Anggaran
export const budgetColumns = (handleEdit, handleDelete, status) => [
  { name: 'No', field: 'no', width: '4rem', align: 'center' },
  { name: 'Jenis Pengeluaran', field: 'output_type' },
  { name: 'Jumlah', field: 'volume', width: '5rem' },
  { name: 'Harga Satuan (Rp)', field: 'unit_price', width: '10rem' },
  { name: 'Total Harga (Rp)', field: 'total_price', width: '10rem' },
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
];
// ** Regional Susunan Tim
export const structureColumns = (handleEdit, handleDelete, status) => [
  { name: 'No', field: 'no', width: '4rem', align: 'center' },
  { name: 'Nama Lengkap', field: 'name' },
  { name: 'Program Studi', field: 'program' },
  { name: 'NIM / NIDM', field: 'id_no' },
  { name: 'Bidang Ilmu', field: 'major' },
  { name: 'Alokasi Waktu (jam/minggu)', field: 'time_allocation' },
  { name: 'Uraian Tugas', field: 'tas_description' },
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
];
