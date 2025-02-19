import { AlignmentType, Paragraph, Table, TableCell, TableRow, TextRun, VerticalAlign, WidthType } from 'docx';

export const rows = [
  {
    no: '1',
    jenis: 'Bahan habis pakai',
    ref: 'materials',
    sumber: [
      { type: 'belmawa', label: 'Belmawa', besaran: 'Rp4.505.714,00' },
      { type: 'perguruan', label: 'Perguruan Tinggi', besaran: 'Rp556.886,00' }
    ]
  },
  {
    no: '2',
    jenis: 'Sewa dan Jasa',
    ref: 'services',
    sumber: [
      { type: 'belmawa', label: 'Belmawa', besaran: 'Rp1.130.300,00' },
      { type: 'perguruan', label: 'Perguruan Tinggi', besaran: 'Rp139.700,00' }
    ]
  },
  {
    no: '3',
    jenis: 'Transportasi lokal',
    ref: 'transports',
    sumber: [
      { type: 'belmawa', label: 'Belmawa', besaran: 'Rp1.335.000,00' },
      { type: 'perguruan', label: 'Perguruan Tinggi', besaran: 'Rp165.000,00' }
    ]
  },
  {
    no: '4',
    jenis: 'Lain - lain',
    ref: 'others',
    sumber: [
      { type: 'belmawa', label: 'Belmawa', besaran: 'Rp1.068.000,00' },
      { type: 'perguruan', label: 'Perguruan Tinggi', besaran: 'Rp132.000,00' }
    ]
  }
];
export const finals = {
  text: 'Jumlah',
  total: 'Rp9.042.600,00',
  jenis: 'Rekap Sumber Dana',
  sumber: [
    { type: 'Belmawa', besaran: 'Rp4.505.714,00' },
    { type: 'Perguruan Tinggi', besaran: 'Rp556.886,00' },
    { type: 'Jumlah', besaran: 'Rp5.062.600,00' }
  ]
};

export const tableBiaya = (data) => {
  const headers = [
    { text: 'No', width: 10 },
    { text: 'Jenis Pengeluaran', width: 40 },
    { text: 'Sumber Dana', width: 25 },
    { text: 'Besaran Dana (Rp)', width: 25 }
  ];

  const updatedData = rows.map((item) => {
    const ref = item.ref;
    if (data.cost[ref]) {
      return {
        ...item,
        sub_total: data.cost[ref]['belmawa'] + data.cost[ref]['perguruan'],
        sumber: item.sumber.map((sumberItem) => {
          return {
            ...sumberItem,
            besaran: data.cost[ref][sumberItem.type].toString()
          };
        })
      };
    }
    return item;
  });

  const updateFinals = {
    ...finals,
    total:
      data.cost['materials']['belmawa'] +
      data.cost['services']['belmawa'] +
      data.cost['transports']['belmawa'] +
      data.cost['others']['belmawa'] +
      data.cost['materials']['perguruan'] +
      data.cost['services']['perguruan'] +
      data.cost['transports']['perguruan'] +
      data.cost['others']['perguruan'],
    sumber: [
      {
        type: 'belmawa',
        label: 'Belmawa',
        besaran:
          data.cost['materials']['belmawa'] +
          data.cost['services']['belmawa'] +
          data.cost['transports']['belmawa'] +
          data.cost['others']['belmawa']
      },
      {
        type: 'perguruan',
        label: 'Perguruan Tinggi',
        besaran:
          data.cost['materials']['perguruan'] +
          data.cost['services']['perguruan'] +
          data.cost['transports']['perguruan'] +
          data.cost['others']['perguruan']
      },
      {
        type: 'jumlah',
        label: 'Jumlah',
        besaran:
          data.cost['materials']['belmawa'] +
          data.cost['services']['belmawa'] +
          data.cost['transports']['belmawa'] +
          data.cost['others']['belmawa'] +
          data.cost['materials']['perguruan'] +
          data.cost['services']['perguruan'] +
          data.cost['transports']['perguruan'] +
          data.cost['others']['perguruan']
      }
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
        createCell(row.sumber[0]?.label),
        createCell(row.sumber[0]?.besaran.toString(), { align: AlignmentType.RIGHT })
      ]
    });

    const sumberRows = row.sumber.slice(1).map(
      (sumber) =>
        new TableRow({
          children: [createCell(sumber.label), createCell(sumber.besaran, { align: AlignmentType.RIGHT })]
        })
    );

    return [firstRow, ...sumberRows];
  };

  const createSummaryRow = () => {
    return new TableRow({
      children: [
        createCell(updateFinals.text, { colSpan: 3, bold: true, align: AlignmentType.CENTER }),
        createCell(updateFinals.total, { bold: true, align: AlignmentType.RIGHT })
      ]
    });
  };

  const createFinalDataRows = () => {
    const firstRow = new TableRow({
      children: [
        createCell(updateFinals.jenis, { rowSpan: updateFinals.sumber.length, colSpan: 2, bold: true, align: AlignmentType.CENTER }),
        createCell(updateFinals.sumber[0]?.label),
        createCell(updateFinals.sumber[0]?.besaran.toString(), { align: AlignmentType.RIGHT })
      ]
    });

    const sumberRows = updateFinals.sumber.slice(1).map(
      (sumber) =>
        new TableRow({
          children: [createCell(sumber.label), createCell(sumber.besaran.toString(), { align: AlignmentType.RIGHT })]
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
    rows: [createHeaderRow(), ...updatedData.flatMap(createDataRows), createSummaryRow(), ...createFinalDataRows()],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    }
  });
};
