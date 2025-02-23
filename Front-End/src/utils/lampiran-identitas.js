import { AlignmentType, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';

const createRow = (cells, isHeader = false) =>
  new TableRow({
    children: cells.map(
      (cell, index) =>
        new TableCell({
          width: { size: [10, 30, 30, 30][index], type: WidthType.PERCENTAGE }, // Column width distribution
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER, // Center align content
              children: [
                new TextRun({
                  text: cell,
                  bold: isHeader, // Apply bold text for the header row
                  size: 24 // Font size in half-points (24 = 12pt)
                })
              ]
            })
          ]
        })
    )
  });

export const lampiranIdentitas = (data) => {
  console.log('kegiatan', data);

  const rows = [
    createRow(['No', 'Jenis Kegiatan', 'Status dalam Kegiatan', 'Waktu dan Tempat'], true), // Header row with bold text
    ...data.map((item, index) => createRow([`${index + 1}`, item.name, item.role, item.period]))
  ];

  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE }
  });
};
