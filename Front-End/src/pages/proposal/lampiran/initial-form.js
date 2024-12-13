export const Fields = {
  personal: [
    { name: 'name', label: 'Nama Lengkap', type: 'text', size: 6 },
    { name: 'email', label: 'Alamat Email', type: 'email', size: 3 },
    { name: 'phone', label: 'No Telepon/HP', type: 'text', size: 3 },
    { name: 'id_no', label: 'NIM / NIDM', type: 'text', size: 4 },
    {
      name: 'gender',
      label: 'Jenis Kelamin',
      type: 'select',
      options: [
        { value: 'L', label: 'Laki-laki' },
        { value: 'P', label: 'Perempuan' }
      ],
      size: 2
    },
    { name: 'place_of_birth', label: 'Tempat Lahir', type: 'text', size: 3 },
    { name: 'birthday', label: 'Tanggal Lahir', type: 'date', size: 3 }
  ],
  act: [
    { name: 'act_name', label: 'Nama Kegiatan', type: 'text', size: 4 },
    { name: 'act_role', label: 'Status Kegiatan', type: 'text', size: 4 },
    { name: 'act_start_date', label: 'Tanggal Mulai Kegiatan', type: 'date', size: 2 },
    { name: 'act_end_date', label: 'Tanggal Selesai Kegiatan', type: 'date', size: 2 }
  ],
  award: [
    { name: 'award_name', label: 'Jenis Penghargaan', type: 'text', size: 5 },
    { name: 'award_giver', label: 'Pihak Pemberi Penghargaan', type: 'text', size: 5 },
    { name: 'award_year', label: 'Tanggal', type: 'date', size: 2 }
  ],
  education: [
    { name: 'degree', label: 'Jenjang', type: 'text', size: 2 },
    { name: 'institution', label: 'Asal Universitas', type: 'text', size: 4 },
    { name: 'major', label: 'Jurusan', type: 'text', size: 4 },
    { name: 'graduation_year', label: 'Tahun', type: 'date', size: 2 }
  ],
  course: [
    { name: 'course_name', label: 'Mata Kuliah', type: 'text', size: 4 },
    { name: 'course_type', label: 'Wajib/Pilihan', type: 'text', size: 4 },
    { name: 'credits', label: 'SKS', type: 'text', size: 2 }
  ],
  research: [
    { name: 'research_title', label: 'Judul Penelitian', type: 'text', size: 4 },
    { name: 'research_source', label: 'Sumber', type: 'text', size: 4 },
    { name: 'research_year', label: 'Tahun', type: 'text', size: 2 }
  ],
  comunity_service: [
    { name: 'com_title', label: 'Judul', type: 'text', size: 4 },
    { name: 'com_source', label: 'Sumber', type: 'text', size: 4 },
    { name: 'com_year', label: 'Tahun', type: 'year', size: 2 }
  ]
};

export const columns = {
  identitas: [
    { name: 'No', field: 'no', width: '4rem' },
    { name: 'Jabatan', field: 'role_person', width: '6rem' },
    { name: 'Nama Lengkap', field: 'name' }
  ],
  act: [
    { name: 'No', field: 'no', width: '4rem' },
    { name: 'Jenis Kegiatan', field: 'act_name' },
    { name: 'Status dalam Kegiatan', field: 'act_role' },
    { name: 'Tanggal mulai Kegiatan', field: 'act_start_date', width: '15rem' },
    { name: 'Tanggal selesai Kegiatan', field: 'act_end_date', width: '15rem' }
  ],
  award: [
    { name: 'No', field: 'no', width: '4rem' },
    { name: 'Jenis Penghargaan', field: 'award_name' },
    { name: 'Pihak Pemberi Penghargaan', field: 'award_giver', width: '20rem' },
    { name: 'Tahun', field: 'award_year', width: '10rem' }
  ],
  education: [
    { name: 'No', field: 'no', width: '4rem' },
    { name: 'Pendidikan', field: 'degree' },
    { name: 'Jurusan', field: 'major' },
    { name: 'Asal Universitas', field: 'institution' },
    { name: 'Tahun', field: 'graduation_year', width: '15rem' }
  ],
  course: [
    { name: 'No', field: 'no', width: '4rem' },
    { name: 'Mata Kuliah', field: 'course_name' },
    { name: 'Wajib/Pilihan', field: 'course_type' },
    { name: 'SKS', field: 'credits', width: '5rem' }
  ],
  research: [
    { name: 'No', field: 'no', width: '4rem' },
    { name: 'Judul Penelitian', field: 'research_title' },
    { name: 'Sumber', field: 'research_source' },
    { name: 'Tahun', field: 'research_year' }
  ],
  comunity_service: [
    { name: 'No', field: 'no', width: '4rem' },
    { name: 'Judul', field: 'com_title' },
    { name: 'Sumber', field: 'com_source' },
    { name: 'Tahun', field: 'com_year' }
  ]
};
