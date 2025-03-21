import { AlignmentType, Paragraph, Table, TableCell, TableRow, TextRun, VerticalAlign, WidthType } from 'docx';

const INIT_DATA = {
  no: 1,
  category: '',
  budget_source: '',
  output_type: '',
  status: false,
  total_price: 0,
  unit_price: 0,
  volume: 0
};

export const tableAnggaran = (data = {}) => {
  console.log('anggaran', data);

  const defaultData = [INIT_DATA];

  const safeGet = (obj, path, defaultValue) => path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);

  const newData = [
    {
      data: safeGet(data, ['materials'], defaultData),
      subtotal: safeGet(data, ['cost', 'materials', 'belmawa'], 0) + safeGet(data, ['cost', 'materials', 'perguruan'], 0),
      title: 'Belanja material (maksimal 60%)'
    },
    {
      data: safeGet(data, ['transports'], defaultData),
      subtotal: safeGet(data, ['cost', 'transports', 'belmawa'], 0) + safeGet(data, ['cost', 'transports', 'perguruan'], 0),
      title: 'Belanja transportasi (maksimal 15%)'
    },
    {
      data: safeGet(data, ['services'], defaultData),
      subtotal: safeGet(data, ['cost', 'services', 'belmawa'], 0) + safeGet(data, ['cost', 'services', 'perguruan'], 0),
      title: 'Belanja jasa (maksimal 30%)'
    },
    {
      data: safeGet(data, ['others'], defaultData),
      subtotal: safeGet(data, ['cost', 'others', 'belmawa'], 0) + safeGet(data, ['cost', 'others', 'perguruan'], 0),
      title: 'Belanja lainnya (maksimal 15%)'
    }
  ];

  const GrandTotal = newData.reduce((acc, item) => acc + (item.subtotal || 0), 0);

  const rows = [
    new TableRow({
      children: ['No', 'Jenis Pengeluaran', 'Volume', 'Harga Satuan (Rp)', 'Total (Rp)'].map(
        (text) =>
          new TableCell({
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text, bold: true, size: 24 })]
              })
            ]
          })
      )
    }),

    ...newData.flatMap((item, index) => {
      if (item.data.length === 0) {
        return [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: `${index + 1}` })]
                  })
                ]
              }),
              new TableCell({
                columnSpan: 4,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: `${item.title}` })]
                  })
                ]
              })
            ]
          })
        ];
      }

      const sectionRows = [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `${index + 1}` })]
                })
              ]
            }),
            new TableCell({
              columnSpan: 4,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: item.title })]
                })
              ]
            })
          ]
        })
      ];

      sectionRows.push(
        ...item.data.map(
          (row, rowIndex) =>
            new TableRow({
              children: [
                rowIndex === 0
                  ? new TableCell({
                      rowSpan: item.data.length,
                      children: [new Paragraph('')]
                    })
                  : null,
                ...['output_type', 'volume', 'unit_price', 'total_price'].map(
                  (key) =>
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: key === 'unit_price' || key === 'total_price' ? AlignmentType.RIGHT : AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text:
                                key === 'unit_price' || key === 'total_price'
                                  ? `Rp. ${new Intl.NumberFormat('id-ID').format(row[key] || 0)}`
                                  : row[key]?.toString() || '-'
                            })
                          ]
                        })
                      ]
                    })
                )
              ].filter(Boolean) // Remove null values
            })
        )
      );

      sectionRows.push(
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 4,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: 'SUB TOTAL' })]
                })
              ]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `Rp. ${new Intl.NumberFormat('id-ID').format(item.subtotal)}`
                    })
                  ]
                })
              ]
            })
          ]
        })
      );

      return sectionRows;
    }),

    new TableRow({
      children: [
        new TableCell({
          columnSpan: 4,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'GRAND TOTAL' })]
            })
          ]
        }),
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: `Rp. ${new Intl.NumberFormat('id-ID').format(GrandTotal)}`
                })
              ]
            })
          ]
        })
      ]
    })
  ];

  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE }
  });
};
