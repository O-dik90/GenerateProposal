import { AlignmentType, Paragraph, Table, TableCell, TableRow, TextRun, VerticalAlign, WidthType } from 'docx';

export const tableBiaya = (data) => {
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
        { type: 'Belmawa', besaran: 'Rp 0' },
        { type: 'Perguruan Tinggi', besaran: 'Rp 0' }
      ]
    },
    {
      no: '2',
      jenis: 'Sewa dan jasa',
      sumber: [
        { type: 'Belmawa', besaran: 'Rp 0' },
        { type: 'Perguruan Tinggi', besaran: 'Rp 0' }
      ]
    },
    {
      no: '3',
      jenis: 'Transportasi lokal',
      sumber: [
        { type: 'Belmawa', besaran: 'Rp 0' },
        { type: 'Perguruan Tinggi', besaran: 'Rp 0' }
      ]
    },
    {
      no: '4',
      jenis: 'Lain - lain',
      sumber: [
        { type: 'Belmawa', besaran: 'Rp 0' },
        { type: 'Perguruan Tinggi', besaran: 'Rp 0' }
      ]
    }
  ];

  const finals = {
    text: 'Jumlah',
    total: 'Rp 0',
    jenis: 'Rekap Sumber Dana',
    sumber: [
      { type: 'Belmawa', besaran: 'Rp 0' },
      { type: 'Perguruan Tinggi', besaran: 'Rp 0' },
      { type: 'Jumlah', besaran: 'Rp 0' }
    ]
  };

  const updatedData = () => {
    if (!data || !data.cost) {
      return rows;
    }
    return rows.map((item) => {
      const ref = item.ref;
      if (data.cost[ref]) {
        return {
          ...item,
          sub_total: (data.cost[ref]['belmawa'] || 0) + (data.cost[ref]['perguruan'] || 0),
          sumber: item.sumber.map((sumberItem) => {
            return {
              ...sumberItem,
              besaran: data.cost[ref][sumberItem.type]?.toString() || 'Rp 0,00'
            };
          })
        };
      }
      return item;
    });
  };

  const getSafeValue = (obj, path, defaultValue = 0) => {
    return path.reduce((acc, key) => acc?.[key] ?? defaultValue, obj);
  };

  const updateFinals = {
    ...finals,
    total: ['materials', 'services', 'transports', 'others'].reduce(
      (sum, key) => sum + getSafeValue(data?.cost, [key, 'belmawa']) + getSafeValue(data?.cost, [key, 'perguruan']),
      0
    ),
    sumber: [
      {
        type: 'belmawa',
        label: 'Belmawa',
        besaran: ['materials', 'services', 'transports', 'others'].reduce((sum, key) => sum + getSafeValue(data?.cost, [key, 'belmawa']), 0)
      },
      {
        type: 'perguruan',
        label: 'Perguruan Tinggi',
        besaran: ['materials', 'services', 'transports', 'others'].reduce(
          (sum, key) => sum + getSafeValue(data?.cost, [key, 'perguruan']),
          0
        )
      },
      {
        type: 'jumlah',
        label: 'Jumlah',
        besaran: ['materials', 'services', 'transports', 'others'].reduce(
          (sum, key) => sum + getSafeValue(data?.cost, [key, 'belmawa']) + getSafeValue(data?.cost, [key, 'perguruan']),
          0
        )
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

  const createSummaryRow = () =>
    new TableRow({
      children: [
        createCell(updateFinals.text, { colSpan: 3, bold: true, align: AlignmentType.CENTER }),
        createCell(updateFinals.total.toString(), { bold: true, align: AlignmentType.RIGHT })
      ]
    });

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
      width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined
    });
  };

  return new Table({
    rows: [createHeaderRow(), ...updatedData().flatMap(createDataRows), createSummaryRow(), ...createFinalDataRows()],
    width: { size: 100, type: WidthType.PERCENTAGE }
  });
};
