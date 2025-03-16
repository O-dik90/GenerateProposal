import { AlignmentType, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';

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

export const LampiranOrganisasi = (listData) => {
  console.log(listData);

  const TableOrganisasi = new Table({
    rows: [
      createRow(
        ['No', 'Nama / NIM', 'Program Studi', 'Bidang Ilmu', 'Alokasi Waktu (jam/minggu)', 'Uraian Tugas'],
        [10, 20, 20, 17.5, 17.5, 20],
        true
      ),
      ...(listData || []).map((item, index) =>
        createRow(
          [`${index + 1}`, item.name, item.program, item.major, `${item.time_allocation}`, item.task_description],
          [10, 20, 20, 17.5, 17.5, 20]
        )
      )
    ],
    width: { size: 100, type: WidthType.PERCENTAGE }
  });

  return TableOrganisasi;
};
