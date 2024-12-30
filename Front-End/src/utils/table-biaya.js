import { Table, TableRow, TableCell, Paragraph, TextRun, AlignmentType, VerticalAlign, WidthType } from 'docx';

export const tableBiaya = () => {
  const headers = [
    { text: 'No', width: 10 },
    { text: 'Jenis Pengeluaran', width: 40 },
    { text: 'Sumber Dana', width: 25 },
    { text: 'Besaran Dana (Rp)', width: 25 }
  ];

  const rows = [
    {
      no: '1',
      jenis: 'Bahan habis pakai',
      sumber: [
        { type: 'Belmawa', besaran: 'Rp4.505.714,00' },
        { type: 'Perguruan Tinggi', besaran: 'Rp556.886,00' }
      ]
    },
    {
      no: '2',
      jenis: 'Sewa dan jasa',
      sumber: [
        { type: 'Belmawa', besaran: 'Rp1.130.300,00' },
        { type: 'Perguruan Tinggi', besaran: 'Rp139.700,00' }
      ]
    },
    {
      no: '3',
      jenis: 'Transportasi lokal',
      sumber: [
        { type: 'Belmawa', besaran: 'Rp1.335.000,00' },
        { type: 'Perguruan Tinggi', besaran: 'Rp165.000,00' }
      ]
    },
    {
      no: '4',
      jenis: 'Lain - lain',
      sumber: [
        { type: 'Belmawa', besaran: 'Rp1.068.000,00' },
        { type: 'Perguruan Tinggi', besaran: 'Rp132.000,00' }
      ]
    }
  ];

  const finals = {
    text: 'Jumlah',
    total: 'Rp9.042.600,00',
    jenis: 'Rekap Sumber Dana',
    sumber: [
      { type: 'Belmawa', besaran: 'Rp4.505.714,00' },
      { type: 'Perguruan Tinggi', besaran: 'Rp556.886,00' },
      { type: 'Jumlah', besaran: 'Rp5.062.600,00' }
    ]
  };

  const createHeaderRow = () => {
    return new TableRow({
      children: headers.map((header) => createCell(header.text, { width: header.width, bold: true, align: AlignmentType.CENTER }))
    });
  };

  const createDataRows = (row) => {
    const firstRow = new TableRow({
      children: [
        createCell(row.no, { rowSpan: row.sumber.length, align: AlignmentType.CENTER }),
        createCell(row.jenis, { rowSpan: row.sumber.length, align: AlignmentType.LEFT }),
        createCell(row.sumber[0]?.type),
        createCell(row.sumber[0]?.besaran, { align: AlignmentType.RIGHT })
      ]
    });

    const sumberRows = row.sumber.slice(1).map(
      (sumber) =>
        new TableRow({
          children: [createCell(sumber.type), createCell(sumber.besaran, { align: AlignmentType.RIGHT })]
        })
    );

    return [firstRow, ...sumberRows];
  };

  const createSummaryRow = () => {
    return new TableRow({
      children: [
        createCell(finals.text, { colSpan: 3, bold: true, align: AlignmentType.CENTER }),
        createCell(finals.total, { bold: true, align: AlignmentType.RIGHT })
      ]
    });
  };

  const createFinalDataRows = () => {
    const firstRow = new TableRow({
      children: [
        createCell(finals.jenis, { rowSpan: finals.sumber.length, colSpan: 2, bold: true, align: AlignmentType.CENTER }),
        createCell(finals.sumber[0]?.type),
        createCell(finals.sumber[0]?.besaran, { align: AlignmentType.RIGHT })
      ]
    });

    const sumberRows = finals.sumber.slice(1).map(
      (sumber) =>
        new TableRow({
          children: [createCell(sumber.type), createCell(sumber.besaran, { align: AlignmentType.RIGHT })]
        })
    );

    return [firstRow, ...sumberRows];
  };

  const createCell = (text, options = {}) => {
    const { rowSpan, colSpan, bold, align = AlignmentType.LEFT, width } = options;
    return new TableCell({
      rowSpan,
      columnSpan: colSpan,
      verticalAlign: VerticalAlign.CENTER,
      children: [
        new Paragraph({
          children: [new TextRun({ text: text || '', bold })],
          alignment: align
        })
      ],
      width: width
        ? {
            size: width,
            type: WidthType.PERCENTAGE
          }
        : undefined
    });
  };

  // Return the full table
  return new Table({
    rows: [createHeaderRow(), ...rows.flatMap(createDataRows), createSummaryRow(), ...createFinalDataRows()],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    }
  });
};
