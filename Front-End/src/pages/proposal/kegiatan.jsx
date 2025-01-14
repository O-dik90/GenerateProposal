import * as Yup from 'yup';

import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Grid, IconButton, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';

import Button from '@mui/material/Button';
import GenForm from 'components/general-form';
import Stack from '@mui/material/Stack';
import { TableForm } from 'components/table-form';

export const dataKegiatan = [
  {
    no: 1,
    activity: 'Studi Literatur',
    schedule: [[1], [], [], []],
    person: 'Syarifa'
  },
  {
    no: 2,
    activity: 'Perancangan Desain Sistem, Aplikasi, dan Rangkaian',
    schedule: [[2], [], [], []],
    person: 'Syarifa'
  },
  {
    no: 3,
    activity: 'Survei alat dan bahan',
    schedule: [[3], [], [], []],
    person: 'Emerya Putri'
  },
  {
    no: 4,
    activity: 'Survei jasa manufaktur casing',
    schedule: [[4], [], [], []],
    person: 'Syarifa'
  },
  {
    no: 5,
    activity: 'Realisasi Pembuatan',
    schedule: [[], [1, 2, 3, 4], [1, 2], []],
    person: 'Zalma Zahara'
  },
  {
    no: 6,
    activity: 'Pembuatan Rangkaian Sistem',
    schedule: [[], [2, 3, 4], [1, 2, 3], []],
    person: 'Hansel'
  },
  {
    no: 7,
    activity: 'Pemrograman alat',
    schedule: [[], [3, 4], [1, 2, 3, 4], []],
    person: 'Fajar'
  },
  {
    no: 8,
    activity: 'Manufaktur rangkaian dan casing',
    schedule: [[], [3, 4], [1, 2, 3, 4], []],
    person: 'Hansel'
  },
  {
    no: 9,
    activity: 'Integrasi alat',
    schedule: [[], [4], [1, 2, 3, 4], []],
    person: 'Syarifa'
  },
  {
    no: 10,
    activity: 'Survei pengguna',
    schedule: [[], [], [4], [1, 2]],
    person: 'Emerya Putri'
  },
  {
    no: 11,
    activity: 'Evaluasi kinerja alat',
    schedule: [[], [], [], [1, 2]],
    person: 'Syarifa'
  },
  {
    no: 12,
    activity: 'Publikasi, laporan Akhir',
    schedule: [[], [], [], [3, 4]],
    person: 'Syarifa'
  },
  {
    no: 13,
    activity: 'Konsultasi dosen pembimbing',
    schedule: [[], [], [], [1, 2, 3, 4]],
    person: 'Prof. Ir. Endra Joelianto, Ph.D.'
  }
];

export const dataBiaya = [
  {
    no: 1,
    title: 'Bahan Material',
    sumber: [
      { type: 'belmawa', amount: '4.505.714,00' },
      { type: 'perguruan', amount: '556.886,00' }
    ],
    sub_total: '5.062.600,00'
  },
  {
    no: 2,
    title: 'Sewa dan Jasa',
    sumber: [
      { type: 'belmawa', amount: '1.130.300,00' },
      { type: 'perguruan', amount: '139.700,00' }
    ],
    sub_total: '1.270.000,00'
  },
  {
    no: 3,
    title: 'Transportasi lokal',
    sumber: [
      { type: 'belmawa', amount: '1.335.000,00' },
      { type: 'perguruan', amount: '165.000,00' }
    ],
    sub_total: '1.500.000,00'
  },
  {
    no: 4,
    title: 'Lain - lain',
    sumber: [
      { type: 'belmawa', amount: '1.068.000,00' },
      { type: 'perguruan', amount: '132.000,00' }
    ],
    sub_total: '1.200.000,00'
  },
  {
    no: 5,
    title: 'Rekap Sumber Dana',
    sub_total: '9.032.600,00',
    sumber: [
      { type: 'belmawa', amount: '8.039.014,00' },
      { type: 'perguruan', amount: '993.586,00' }
    ]
  }
];

const BIAYA_INIT = {
  no: 1,
  title: '',
  sumber: [
    { type: 'belmawa', amount: 0 },
    { type: 'perguruan', amount: 0 }
  ],
  status: false
};

const KEGIATAN_INIT = {
  no: 1,
  activity: '',
  person: '',
  target: [[], [], [], []],
  status: false
};

const Columns = {
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
  Kegiatan: (handleEdit, handleDelete, status) => [
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

const FieldsData = {
  kegiatan: [
    {
      name: 'activity',
      label: 'Nama Kegiatan',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    },
    {
      name: 'person',
      label: 'Penanggungjawab Kegiatan',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    }
  ]
};

const Kegiatan = () => {
  const [object, setObject] = useState({
    biaya: BIAYA_INIT,
    kegiatan: KEGIATAN_INIT
  });
  const [data, setData] = useState({
    biaya: dataBiaya,
    kegiatan: []
  });

  const reset = useCallback((key) => {
    setObject((prev) => ({ ...prev, [key]: initialStateForKey(key) }));
  }, []);

  const initialStateForKey = (key) => {
    switch (key) {
      case 'kegiatan':
      default:
        return KEGIATAN_INIT;
    }
  };
  const handleKegiatan = {
    edit: (key) => (param) => {
      setObject((prev) => ({ ...prev, [key]: { ...param, status: true } }));
    },
    delete: (key) => (item) => {
      setData((prev) => ({
        ...prev,
        [key]: prev[key].filter((row) => row.no !== item.no).map((row, index) => ({ ...row, no: index + 1 }))
      }));
    }
  };

  const handleForm = useCallback(
    (values, key) => {
      if (object[key]?.status) {
        setData((prevData) => ({
          ...prevData,
          [key]: prevData[key]?.map((item) => (item.no === object[key]?.no ? { ...item, ...values, status: false } : item))
        }));
        reset(key);
      } else {
        const newItem = { ...values, no: (object[key]?.length || 0) + 1 };
        setData((prevData) => ({
          ...prevData,
          [key]: [...(prevData[key] || []), newItem]
        }));
      }
    },
    [object, reset]
  );

  // useEffect(() => {
  //   if (biaya) {
  //     setData({
  //       biaya: biaya?.json_data?.biaya || [],
  //       kegiatan: biaya?.json_data?.kegiatan || []
  //     });
  //   }
  // }, [biaya]);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        BAB 4. BIAYA DAN JADWAL KEGIATAN
      </Typography>

      <Grid item xs={12} sx={{ marginTop: 2 }}>
        <Typography variant="h5" gutterBottom>
          4.1 Anggaran Biaya
        </Typography>
        <Typography variant="h6" gutterBottom>
          Kalkulasi anggaran biaya akan ditampilkan setelah meng-upload data lampiran untuk anggaran kegiatan.
        </Typography>

        <TableForm
          columns={Columns.Biaya(handleKegiatan.edit('biaya'), handleKegiatan.delete('biaya'), false)}
          rows={data?.biaya || []}
          expand={false}
          detail=""
        />
      </Grid>

      <Grid item xs={12} sx={{ marginTop: 2 }}>
        <Typography variant="h5" gutterBottom>
          4.2 Jadwal Kegiatan
        </Typography>
        <Typography variant="h6" gutterBottom>
          Tuliskan jadwal kegiatan yang akan digunakan dalam penelitian.
        </Typography>

        <Stack direction="column" spacing={5}>
          <GenForm
            formFields={FieldsData['kegiatan']}
            buttonDisable={false}
            onSubmit={(values) => handleForm(values, 'kegiatan')}
            titleButton={object['kegiatan'].status ? `Update Data ` : `Tambah Data `}
            initialValuesUpdate={object['kegiatan']}
          />

          <TableForm
            columns={Columns.Kegiatan(handleKegiatan.edit('kegiatan'), handleKegiatan.delete('kegiatan'), false)}
            rows={data?.kegiatan || []}
            expand={false}
            detail=""
          />
        </Stack>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="success" onClick={() => {}}>
          Simpan Kegiatan
        </Button>
      </Stack>
    </>
  );
};

export default Kegiatan;
