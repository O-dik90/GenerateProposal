import { AlignmentType, HeadingLevel, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';

const createRow = (cells, columnSizes = [], isHeader = false) => {
  const numColumns = cells.length;
  const finalColumnSizes = columnSizes.length === numColumns ? columnSizes : Array(numColumns).fill(100 / numColumns);

  return new TableRow({
    children: cells.map(
      (cell, index) =>
        new TableCell({
          width: { size: finalColumnSizes[index], type: WidthType.PERCENTAGE },
          verticalAlignment: AlignmentType.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: cell,
                  bold: isHeader,
                  size: 24
                })
              ]
            })
          ]
        })
    )
  });
};

const createRowIdentitas = (cells, isHeader = false) =>
  new TableRow({
    children: cells.map(
      (cell, index) =>
        new TableCell({
          width: { size: [10, 45, 45][index], type: WidthType.PERCENTAGE },
          verticalAlignment: AlignmentType.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: cell,
                  bold: isHeader,
                  size: 24
                })
              ]
            })
          ]
        })
    )
  });

const newLine = new Paragraph('');

const Title = (title) =>
  new Paragraph({
    text: title,
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.START
  });

export const lampiranIdentitas = (data) => {
  const IDENTITAS = [
    { name: 'Nama Lengkap', value: data.name },
    { name: 'Jenis Kelamin', value: data.gender === 'L' ? 'Laki-laki' : 'Perempuan' },
    { name: 'Program Studi', value: data.major },
    { name: 'NIM', value: data.id_no },
    { name: 'Tanggal Lahir', value: data.birth_date },
    { name: 'Tempat Lahir', value: data.birth_place },
    { name: 'Alamat E-mail', value: data.email },
    { name: 'Nomor Telepon/HP', value: data.phone }
  ];

  const TableIdentitas = new Table({
    rows: IDENTITAS.map((item, index) => createRowIdentitas([`${index + 1}`, item.name, item.value])),
    width: { size: 100, type: WidthType.PERCENTAGE }
  });

  const TableKegiatan = new Table({
    rows: [
      createRow(['No', 'Jenis Kegiatan', 'Status dalam Kegiatan', 'Waktu dan Tempat'], [10, 35, 30, 25], true),
      ...data.act.map((item, index) => createRow([`${index + 1}`, item.act_name, item.act_role, item.act_start_date], [10, 35, 30, 25]))
    ],
    width: { size: 100, type: WidthType.PERCENTAGE }
  });

  const TablePenghargaan = new Table({
    rows: [
      createRow(['No', 'Jenis Penghargaan', 'Pihak Pemberi Penghargaan', 'Tahun'], [10, 35, 35, 20], true),
      ...data.award.map((item, index) => createRow([`${index + 1}`, item.award_name, item.award_giver, item.award_year], [10, 35, 30, 25]))
    ],
    width: { size: 100, type: WidthType.PERCENTAGE }
  });

  const TablePendidikan = new Table({
    rows: [
      createRow(['No', 'Jenjang', 'Bidang Ilmu', 'Institusi', 'Tahun Lulus'], [10, 15, 25, 30, 20], true),
      ...data.education.map((item, index) =>
        createRow([`${index + 1}`, item.degree, item.major, item.institution, item.graduation_year], [10, 15, 25, 30, 20])
      )
    ],
    width: { size: 100, type: WidthType.PERCENTAGE }
  });

  const TableTriDharmaPendidikan = new Table({
    rows: [
      createRow(['No', 'Mata Kuliah', 'Wajib / Pilihan', 'Tahun'], [10, 35, 35, 20], true),
      ...data.course.map((item, index) => createRow([`${index + 1}`, item.course_name, item.course_type, item.credits], [10, 35, 30, 25]))
    ],
    width: { size: 100, type: WidthType.PERCENTAGE }
  });

  const TableTriDharmaPenelitian = new Table({
    rows: [
      createRow(['No', 'Penelitian', 'Sumber', 'Tahun'], [10, 35, 35, 20], true),
      ...data.research.map((item, index) =>
        createRow([`${index + 1}`, item.research_title, item.research_source, item.research_year], [10, 35, 30, 25])
      )
    ],
    width: { size: 100, type: WidthType.PERCENTAGE }
  });

  const TableTriDharmaPengabdian = new Table({
    rows: [
      createRow(['No', 'Judul', 'Sumber', 'Tahun'], [10, 35, 35, 20], true),
      ...data.community_service.map((item, index) =>
        createRow([`${index + 1}`, item.community_title, item.community_title, item.com_year], [10, 35, 30, 25])
      )
    ],
    width: { size: 100, type: WidthType.PERCENTAGE }
  });

  if (data.role_person === 'DOSEN') {
    return [
      newLine,
      Title('A. Identitas Diri Dosen Pembimbing'),
      TableIdentitas,
      newLine,
      Title('B. Pendidikan'),
      TablePendidikan,
      newLine,
      Title('Tri Dharma Pendidikan'),
      TableTriDharmaPendidikan,
      newLine,
      Title('Tri Dharma Penelitian'),
      TableTriDharmaPenelitian,
      newLine,
      Title('Tri Dharma Pengabdian'),
      TableTriDharmaPengabdian
    ];
  }

  return [
    newLine,
    Title(`A. Identitas Diri ${data?.role_person === 'ANGGOTA' ? `${data?.role_person} ${data?.no - 1}` : `${data?.role_person}`}`),
    TableIdentitas,
    newLine,
    Title('B. Kegiatan Kemahasiswaan'),
    TableKegiatan,
    newLine,
    Title('C. Penghargaan'),
    TablePenghargaan
  ];
};
