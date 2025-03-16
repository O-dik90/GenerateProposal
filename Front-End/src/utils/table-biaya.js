import { AlignmentType, Paragraph, Table, TableCell, TableRow, TextRun, VerticalAlign, WidthType } from 'docx';

export const tableBiaya = (data) => {
  console.log('biaya', data);
  const headers = [
    { text: 'No', width: 10 },
    { text: 'Jenis Pengeluaran', width: 40 },
    { text: 'Sumber Dana', width: 25 },
    { text: 'Besaran Dana (Rp)', width: 25 }
  ];

  const rows = [
    { no: '1', jenis: 'Bahan habis pakai', ref: 'materials' },
    { no: '2', jenis: 'Sewa dan jasa', ref: 'services' },
    { no: '3', jenis: 'Transportasi lokal', ref: 'transports' },
    { no: '4', jenis: 'Lain - lain', ref: 'others' }
  ];

  const updatedData = (data, rows) => {
    if (!data?.cost) return rows;

    return rows.map((item) => {
      const ref = item.ref;
      const sumber = [
        { label: 'Belmawa', besaran: `Rp ${data.cost?.[ref]?.belmawa?.toLocaleString('id-ID') || '0'}` },
        { label: 'Perguruan Tinggi', besaran: `Rp ${data.cost?.[ref]?.perguruan?.toLocaleString('id-ID') || '0'}` }
      ];

      return { ...item, sumber };
    });
  };

  const getSafeValue = (obj, path, defaultValue = 0) => {
    return path.reduce((acc, key) => acc?.[key] ?? defaultValue, obj);
  };

  const updateFinals = {
    text: 'Jumlah',
    total: `Rp ${['materials', 'services', 'transports', 'others']
      .reduce((sum, key) => sum + getSafeValue(data?.cost, [key, 'belmawa']) + getSafeValue(data?.cost, [key, 'perguruan']), 0)
      .toLocaleString('id-ID')}`,
    jenis: 'Rekap Sumber Dana',
    sumber: [
      {
        label: 'Belmawa',
        besaran: `Rp ${['materials', 'services', 'transports', 'others']
          .reduce((sum, key) => sum + getSafeValue(data?.cost, [key, 'belmawa']), 0)
          .toLocaleString('id-ID')}`
      },
      {
        label: 'Perguruan Tinggi',
        besaran: `Rp ${['materials', 'services', 'transports', 'others']
          .reduce((sum, key) => sum + getSafeValue(data?.cost, [key, 'perguruan']), 0)
          .toLocaleString('id-ID')}`
      },
      {
        label: 'Jumlah',
        besaran: `Rp ${['materials', 'services', 'transports', 'others']
          .reduce((sum, key) => sum + getSafeValue(data?.cost, [key, 'belmawa']) + getSafeValue(data?.cost, [key, 'perguruan']), 0)
          .toLocaleString('id-ID')}`
      }
    ]
  };

  const createHeaderRow = () =>
    new TableRow({
      children: headers.map((header) => createCell(header.text, { width: header.width, bold: true, align: AlignmentType.CENTER }))
    });

  const createDataRows = (row) => {
    const firstRow = new TableRow({
      children: [
        createCell(row.no, { rowSpan: row.sumber.length, align: AlignmentType.CENTER }),
        createCell(row.jenis, { rowSpan: row.sumber.length, align: AlignmentType.LEFT }),
        createCell(row.sumber[0]?.label),
        createCell(row.sumber[0]?.besaran, { align: AlignmentType.RIGHT })
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

  const createSummaryRow = () =>
    new TableRow({
      children: [
        createCell(updateFinals.text, { colSpan: 3, bold: true, align: AlignmentType.CENTER }),
        createCell(updateFinals.total, { bold: true, align: AlignmentType.RIGHT })
      ]
    });

  const createFinalDataRows = () => {
    const firstRow = new TableRow({
      children: [
        createCell(updateFinals.jenis, { rowSpan: updateFinals.sumber.length, colSpan: 2, bold: true, align: AlignmentType.CENTER }),
        createCell(updateFinals.sumber[0]?.label, { bold: true }),
        createCell(updateFinals.sumber[0]?.besaran, { align: AlignmentType.RIGHT, bold: true })
      ]
    });

    const sumberRows = updateFinals.sumber.slice(1).map(
      (sumber) =>
        new TableRow({
          children: [createCell(sumber.label, { bold: true }), createCell(sumber.besaran, { align: AlignmentType.RIGHT, bold: true })]
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
      width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined
    });
  };

  return new Table({
    rows: [createHeaderRow(), ...updatedData(data, rows).flatMap(createDataRows), createSummaryRow(), ...createFinalDataRows()],
    width: { size: 100, type: WidthType.PERCENTAGE }
  });
};
