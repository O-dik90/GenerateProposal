export const BIAYA_INIT = {
  no: 1,
  title: '',
  sumber: [
    { type: 'belmawa', amount: 0 },
    { type: 'perguruan', amount: 0 }
  ],
  status: false
};

export const KEGIATAN_INIT = {
  no: 1,
  activity: '',
  person: '',
  target: [[], [], [], []],
  status: false
};

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
