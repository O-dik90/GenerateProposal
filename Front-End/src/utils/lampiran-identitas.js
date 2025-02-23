import { AlignmentType, HeadingLevel, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';

let IDENTITAS = [
  { name: 'Nama Lengkap', value: 'Emya' },
  { name: 'Jenis Kelamin', value: 'Perempuan' },
  { name: 'Program Studi', value: 'Teknik Fisika' },
  { name: 'NIM', value: '13321054' },
  { name: 'Tanggal Lahir', value: '17 Agustus 2001' },
  { name: 'Alamat E-mail', value: 'Emya@email.com' },
  { name: 'Nomor Telepon/HP', value: '08561788377' }
];

let ACT = [
  { name: 'Dies Natalis HMFT ITB 2022', role: 'Ketua Divisi Event', period: 'November 2022 - Februari 2023' },
  { name: 'ITB In Move', role: 'Event', period: 'Januari - Maret 2022' },
  { name: 'Ganesha IoTech', role: 'Public Relation', period: 'Januari - Maret 2022' }
];

let AWARD = [
  { name: 'Juara 1 Innovation & Research National Competition 2021', giver: 'ITERA', year: '2021' },
  { name: 'Juara 2 ICCP Cathodic Paper Competition', giver: 'ITS', year: '2022' }
];

const createRow = (cells, columnSizes = [], isHeader = false) => {
  const numColumns = cells.length;

  const finalColumnSizes = columnSizes.length === numColumns ? columnSizes : Array(numColumns).fill(100 / numColumns);

  return new TableRow({
    children: cells.map(
      (cell, index) =>
        new TableCell({
          width: { size: finalColumnSizes[index], type: WidthType.PERCENTAGE },
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

export const lampiranIdentitas = () => {
  const TableIdentitas = new Table({
    rows: [...IDENTITAS.map((item, index) => createRowIdentitas([`${index + 1}`, item.name, item.value]))],
    width: { size: 100, type: WidthType.PERCENTAGE }
  });
  const TableKegiatan = new Table({
    rows: [
      createRow(['No', 'Jenis Kegiatan', 'Status dalam Kegiatan', 'Waktu dan Tempat'], [10, 35, 30, 25], true),
      ...ACT.map((item, index) => createRow([`${index + 1}`, item.name, item.role, item.period], [10, 35, 30, 25]))
    ],
    width: { size: 100, type: WidthType.PERCENTAGE }
  });

  const TablePenghargaan = new Table({
    rows: [
      createRow(['No', 'Jenis Penghargaan', 'Pihak Pemberi Penghargaan', 'Tahun'], [10, 35, 35, 20], true),
      ...AWARD.map((item, index) => createRow([`${index + 1}`, item.name, item.giver, item.year], [10, 35, 30, 25]))
    ],
    width: { size: 100, type: WidthType.PERCENTAGE }
  });

  return [
    newLine,
    Title('A. Identitas Diri'),
    TableIdentitas,
    newLine,
    Title('B. Kegiatan Kemahasiswaan'),
    TableKegiatan,
    newLine,
    Title('C. Penghargaan'),
    TablePenghargaan
  ];
};
