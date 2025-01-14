import * as Yup from 'yup';

// ** Regional Identitas
export const initialFields = {
  personal: [
    {
      name: 'name',
      label: 'Nama Lengkap',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 6
    },
    {
      name: 'email',
      label: 'Alamat Email',
      type: 'email',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    },
    {
      name: 'phone',
      label: 'No Telepon/HP',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi').max(13, 'No Telepon/HP maksimal 13 angka'),
      width: 2
    },
    {
      name: 'id_no',
      label: 'NIM / NIDM',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    },
    {
      name: 'gender',
      label: 'Jenis Kelamin',
      type: 'select',
      options: [
        { value: 'L', label: 'Laki-laki' },
        { value: 'P', label: 'Perempuan' }
      ],
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 2
    },
    {
      name: 'birth_date',
      label: 'Tanggal Lahir',
      type: 'date',
      InputLabelProps: { shrink: true },
      placeholder: '',
      validation: Yup.date().required('Wajib diisi'),
      width: 2
    },
    {
      name: 'birth_place',
      label: 'Tempat Lahir',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    }
  ],
  act: [
    {
      name: 'act_name',
      label: 'Nama Kegiatan',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    },
    {
      name: 'act_role',
      label: 'Status Kegiatan',
      type: 'text',
      placeholder: 'Masukkan Kegiatan',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    },
    {
      name: 'act_start_date',
      label: 'Tanggal Mulai Kegiatan',
      type: 'date',
      InputLabelProps: { shrink: true },
      placeholder: '',
      validation: Yup.date().required('Wajib diisi'),
      width: 2
    },
    {
      name: 'act_end_date',
      label: 'Tanggal Mulai Kegiatan',
      type: 'date',
      InputLabelProps: { shrink: true },
      placeholder: '',
      validation: Yup.date(),
      width: 2
    }
  ],
  award: [
    {
      name: 'award_name',
      label: 'Jenis Penghargaan',
      type: 'text',
      placeholder: 'Masukkan Jenis Penghargaan',
      validation: Yup.string().required('Wajib diisi'),
      width: 5
    },
    {
      name: 'award_giver',
      label: 'Pihak Pemberi Penghargaan',
      type: 'text',
      placeholder: 'Masukkan Pemberi Penghargaan',
      validation: Yup.string().required('Wajib diisi'),
      width: 5
    },
    {
      name: 'award_year',
      label: 'Tahun',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi').length(4, 'Tahun harus 4 angka'),
      width: 2
    }
  ],
  education: [
    {
      name: 'degree',
      label: 'Jenjang',
      type: 'text',
      placeholder: 'Masukkan Jenjang',
      validation: Yup.string().required('Wajib diisi'),
      width: 2
    },
    {
      name: 'institution',
      label: 'Asal Universitas',
      type: 'text',
      placeholder: 'Masukkan Asal Universitas',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    },
    {
      name: 'major',
      label: 'Jurusan',
      type: 'text',
      placeholder: 'Masukkan Jurusan',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    },
    {
      name: 'graduation_year',
      label: 'Tahun',
      type: 'date',
      InputLabelProps: { shrink: true },
      placeholder: '',
      validation: Yup.date().required('Wajib diisi'),
      width: 2
    }
  ],
  course: [
    {
      name: 'course_name',
      label: 'Mata Kuliah',
      type: 'text',
      placeholder: 'Masukkan Mata Kuliah',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    },
    {
      name: 'course_type',
      label: 'Wajib/Pilihan',
      type: 'text',
      placeholder: 'Masukkan Wajib/Pilihan',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    },
    {
      name: 'credits',
      label: 'SKS',
      type: 'text',
      placeholder: 'Masukkan SKS',
      validation: Yup.string().required('Wajib diisi'),
      width: 2
    }
  ],
  research: [
    {
      name: 'research_title',
      label: 'Judul Penelitian',
      type: 'text',
      placeholder: 'Masukkan Judul Penelitian',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    },
    {
      name: 'research_source',
      label: 'Sumber',
      type: 'text',
      placeholder: 'Masukkan Sumber',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    },
    {
      name: 'research_year',
      label: 'Tahun',
      type: 'date',
      InputLabelProps: { shrink: true },
      placeholder: '',
      validation: Yup.date().required('Wajib diisi'),
      width: 2
    }
  ],
  community_service: [
    {
      name: 'community_title',
      label: 'Judul',
      type: 'text',
      placeholder: 'Masukkan Judul',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    },
    {
      name: 'community_source',
      label: 'Sumber',
      type: 'text',
      placeholder: 'Masukkan Sumber',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    },
    {
      name: 'com_year',
      label: 'Tahun',
      type: 'date',
      InputLabelProps: { shrink: true },
      placeholder: '',
      validation: Yup.date().required('Wajib diisi'),
      width: 2
    }
  ]
};

//** Regional Anggaran
export const budgetFields = {
  materials: [
    {
      name: 'output_type',
      label: 'Jenis Pengeluaran',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    },
    {
      name: 'budget_source',
      label: 'Sumber Dana',
      type: 'select',
      options: [
        { value: 'belmawa', label: 'Belmawa' },
        { value: 'perguruan', label: 'Perguruan Tinggi' }
      ],
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 2
    },
    {
      name: 'volume',
      label: 'Volume',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 2
    },
    {
      name: 'unit_price',
      label: 'Harga Satuan (Rp)',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 2
    },
    {
      name: 'total_price',
      label: 'Total Harga (Rp)',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 2
    }
  ],
  services: [
    {
      name: 'output_type',
      label: 'Jenis Pengeluaran',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    },
    {
      name: 'budget_source',
      label: 'Sumber Dana',
      type: 'select',
      options: [
        { value: 'belmawa', label: 'Belmawa' },
        { value: 'perguruan', label: 'Perguruan Tinggi' }
      ],
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 2
    },
    {
      name: 'volume',
      label: 'Volume',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 2
    },
    {
      name: 'unit_price',
      label: 'Harga Satuan (Rp)',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 2
    },
    {
      name: 'total_price',
      label: 'Total Harga (Rp)',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 2
    }
  ],
  transports: [
    {
      name: 'output_type',
      label: 'Jenis Pengeluaran',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    },
    {
      name: 'budget_source',
      label: 'Sumber Dana',
      type: 'select',
      options: [
        { value: 'belmawa', label: 'Belmawa' },
        { value: 'perguruan', label: 'Perguruan Tinggi' }
      ],
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 2
    },
    {
      name: 'volume',
      label: 'Volume',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 2
    },
    {
      name: 'unit_price',
      label: 'Harga Satuan (Rp)',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 2
    },
    {
      name: 'total_price',
      label: 'Total Harga (Rp)',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 2
    }
  ],
  others: [
    {
      name: 'output_type',
      label: 'Jenis Pengeluaran',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 4
    },
    {
      name: 'budget_source',
      label: 'Sumber Dana',
      type: 'select',
      options: [
        { value: 'belmawa', label: 'Belmawa' },
        { value: 'perguruan', label: 'Perguruan Tinggi' }
      ],
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 2
    },
    {
      name: 'volume',
      label: 'Volume',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 2
    },
    {
      name: 'unit_price',
      label: 'Harga Satuan (Rp)',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 2
    },
    {
      name: 'total_price',
      label: 'Total Harga (Rp)',
      type: 'text',
      placeholder: '',
      validation: Yup.string().required('Wajib diisi'),
      width: 2
    }
  ]
};

// ** Regional Susunan Tim
export const structureFields = [
  {
    name: 'name',
    label: 'Nama Lengkap',
    type: 'text',
    placeholder: '',
    validation: Yup.string().required('Wajib diisi'),
    width: 4
  },
  {
    name: 'program',
    label: 'Program Studi',
    type: 'text',
    placeholder: '',
    validation: Yup.string().required('Wajib diisi'),
    width: 4
  },
  {
    name: 'id_no',
    label: 'NIM / NIDM',
    type: 'text',
    placeholder: '',
    validation: Yup.string().required('Wajib diisi'),
    width: 2
  },
  {
    name: 'time_allocation',
    label: 'Alokasi Waktu (jam/minggu)',
    type: 'number',
    placeholder: '',
    validation: Yup.string().required('Wajib diisi').min(1, 'Minimal 1 jam/minggu'),
    width: 2
  },
  {
    name: 'major',
    label: 'Bidang Ilmu',
    type: 'text',
    placeholder: '',
    validation: Yup.string().required('Wajib diisi')
  },
  {
    name: 'tas_description',
    label: 'Uraian Tugas',
    type: 'textarea',
    placeholder: '',
    validation: Yup.string().required('Wajib diisi'),
    row: 5,
    width: 12
  }
];
