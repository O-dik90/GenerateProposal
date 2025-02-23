import { AlignmentType, Paragraph, ShadingType, Table, TableCell, TableRow, VerticalAlign, WidthType } from 'docx';

// export const data = [
//   {
//     activity: 'Studi Literatur',
//     schedule: [[1], [], [], []],
//     person: 'Syarifa'
//   },
//   {
//     activity: 'Perancangan Desain Sistem, Aplikasi, dan Rangkaian',
//     schedule: [[2], [], [], []],
//     person: 'Syarifa'
//   },
//   {
//     activity: 'Survei alat dan bahan',
//     schedule: [[3], [], [], []],
//     person: 'Emerya Putri'
//   },
//   {
//     activity: 'Survei jasa manufaktur casing',
//     schedule: [[4], [], [], []],
//     person: 'Syarifa'
//   },
//   {
//     activity: 'Realisasi Pembuatan',
//     schedule: [[], [1, 2, 3, 4], [1, 2], []],
//     person: 'Zalma Zahara'
//   },
//   {
//     activity: 'Pembuatan Rangkaian Sistem',
//     schedule: [[], [2, 3, 4], [1, 2, 3], []],
//     person: 'Hansel'
//   },
//   {
//     activity: 'Pemrograman alat',
//     schedule: [[], [3, 4], [1, 2, 3, 4], []],
//     person: 'Fajar'
//   },
//   {
//     activity: 'Manufaktur rangkaian dan casing',
//     schedule: [[], [3, 4], [1, 2, 3, 4], []],
//     person: 'Hansel'
//   },
//   {
//     activity: 'Integrasi alat',
//     schedule: [[], [4], [1, 2, 3, 4], []],
//     person: 'Syarifa'
//   },
//   {
//     activity: 'Survei pengguna',
//     schedule: [[], [], [4], [1, 2]],
//     person: 'Emerya Putri'
//   },
//   {
//     activity: 'Evaluasi kinerja alat',
//     schedule: [[], [], [], [1, 2]],
//     person: 'Syarifa'
//   },
//   {
//     activity: 'Publikasi, laporan Akhir',
//     schedule: [[], [], [], [3, 4]],
//     person: 'Syarifa'
//   },
//   {
//     activity: 'Konsultasi dosen pembimbing',
//     schedule: [[], [], [], [1, 2, 3, 4]],
//     person: 'Prof. Ir. Endra Joelianto, Ph.D.'
//   }
// ];

export const tableKegiatan = (data) => {
  console.log('kegiatan', data);
  const rows = [
    new TableRow({
      children: [
        new TableCell({
          rowSpan: 2,
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ text: 'No', alignment: AlignmentType.CENTER })],
          width: { size: 4, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: 'D9D9D9' }
        }),
        new TableCell({
          rowSpan: 2,
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ text: 'Jenis Kegiatan', alignment: AlignmentType.CENTER })],
          width: { size: 24, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: 'D9D9D9' }
        }),
        ...Array.from(
          { length: 4 },
          (_, i) =>
            new TableCell({
              columnSpan: 4,
              verticalAlign: VerticalAlign.CENTER,
              children: [new Paragraph({ text: `Bulan ${i + 1}`, alignment: AlignmentType.CENTER })],
              shading: { type: ShadingType.CLEAR, fill: 'D9D9D9' },
              width: { size: 12, type: WidthType.PERCENTAGE }
            })
        ),
        new TableCell({
          rowSpan: 2,
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ text: 'Personal Penanggung Jawab', alignment: AlignmentType.CENTER })],
          width: { size: 24, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: 'D9D9D9' }
        })
      ]
    }),
    // Add header row for weeks
    new TableRow({
      children: [
        ...Array.from({ length: 4 }, () =>
          Array.from(
            { length: 4 },
            (_, j) =>
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ text: `${j + 1}`, alignment: AlignmentType.CENTER })],
                shading: { type: ShadingType.CLEAR, fill: 'E7E6E6' },
                width: { size: 3, type: WidthType.PERCENTAGE }
              })
          )
        ).flat()
      ]
    }),
    // Add activity rows with shading
    ...data.map(
      (item, index) =>
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: `${index + 1}`, alignment: AlignmentType.CENTER })],
              shading: { type: ShadingType.CLEAR, fill: 'FFFFFF' }
            }),
            new TableCell({
              children: [new Paragraph({ text: item.activity, alignment: AlignmentType.CENTER })],
              shading: { type: ShadingType.CLEAR, fill: 'FFFFFF' }
            }),
            ...Array.from({ length: 4 }, (_, i) =>
              Array.from(
                { length: 4 },
                (_, j) =>
                  new TableCell({
                    children: [new Paragraph(item.target?.[i]?.includes(j + 1) ? '✓' : '')],
                    shading: { type: ShadingType.CLEAR, fill: item.schedule?.[i]?.includes(j + 1) ? 'A9A9A9' : 'FFFFFF' }
                  })
              )
            ).flat(),
            new TableCell({
              children: [new Paragraph({ text: item.person, alignment: AlignmentType.CENTER })],
              shading: { type: ShadingType.CLEAR, fill: 'FFFFFF' }
            })
          ]
        })
    )
  ];

  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE }
  });
};
