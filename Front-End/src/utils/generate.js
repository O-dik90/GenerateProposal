import {
  AlignmentType,
  Document,
  Footer,
  Header,
  HeadingLevel,
  NumberFormat,
  Packer,
  PageNumber,
  PageOrientation,
  Paragraph,
  TextRun,
  convertMillimetersToTwip
} from 'docx';

import { saveAs } from 'file-saver';

const GenerateDocx = ({ data }) => {
  const {
    latarBelakang = 'Latar Belakang',
    rumusanMasalah = 'Rumusan Masalah',
    tujuan = 'Tujuan',
    luaran = 'Luaran',
    manfaat = 'Manfaat',
    fileName = 'document.docx'
  } = data || {};

  // Header with page numbers
  const header = new Header({
    children: [
      new Paragraph({
        children: [new TextRun({ children: [PageNumber.CURRENT] })],
        alignment: AlignmentType.RIGHT
      })
    ]
  });

  // Footer configurations
  const noFooter = new Footer({
    children: [new Paragraph({ text: '' })]
  });

  const romanFooter = new Footer({
    children: [
      new Paragraph({
        children: [new TextRun({ children: [PageNumber.CURRENT] })],
        alignment: AlignmentType.RIGHT
      })
    ]
  });

  const mainContent = [
    new Paragraph({
      text: 'BAB 1 PENDAHULUAN',
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true
    }),
    new Paragraph({
      text: '1.1. Latar Belakang',
      heading: HeadingLevel.HEADING_2
    }),
    new Paragraph({
      text: latarBelakang,
      style: 'wellSpaced'
    }),
    new Paragraph({
      text: '1.2. Rumusan Masalah',
      heading: HeadingLevel.HEADING_2
    }),
    new Paragraph({
      text: rumusanMasalah,
      style: 'wellSpaced'
    }),
    new Paragraph({
      text: '1.3. Tujuan',
      heading: HeadingLevel.HEADING_2
    }),
    new Paragraph({
      text: tujuan,
      style: 'wellSpaced'
    }),
    new Paragraph({
      text: '1.4. Luaran',
      heading: HeadingLevel.HEADING_2
    }),
    new Paragraph({
      text: luaran,
      style: 'wellSpaced'
    }),
    new Paragraph({
      text: '1.5. Manfaat',
      heading: HeadingLevel.HEADING_2
    }),
    new Paragraph({
      text: manfaat,
      style: 'wellSpaced'
    }),
    new Paragraph({
      text: 'DAFTAR PUSTAKA',
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true
    })
  ];

  const doc = new Document({
    styles: {
      default: {
        heading1: {
          run: { size: '12pt', bold: true },
          paragraph: {
            spacing: { line: 276, after: 0 },
            alignment: AlignmentType.CENTER
          }
        },
        heading2: {
          run: { size: '12pt', bold: true },
          paragraph: {
            spacing: { line: 276, before: 0, after: 0 },
            alignment: AlignmentType.LEFT
          }
        },
        document: {
          run: { size: '12pt', font: 'Times New Roman' },
          paragraph: { alignment: AlignmentType.JUSTIFIED }
        }
      },
      paragraphStyles: [
        {
          id: 'wellSpaced',
          name: 'Well Spaced',
          basedOn: 'Normal',
          quickFormat: true,
          paragraph: {
            spacing: { line: 276, before: 0, after: 0 }
          }
        }
      ]
    },

    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.PORTRAIT,
              height: convertMillimetersToTwip(297),
              width: convertMillimetersToTwip(210)
            },
            margin: {
              top: convertMillimetersToTwip(30),
              bottom: convertMillimetersToTwip(30),
              left: convertMillimetersToTwip(40),
              right: convertMillimetersToTwip(30)
            },

            pageNumbers: { formatType: NumberFormat.LOWER_ROMAN }
          }
        },
        children: [
          new Paragraph({
            text: 'DAFTAR ISI',
            heading: HeadingLevel.HEADING_1,
            pageBreakBefore: true
          }),
          new Paragraph({
            text: 'DAFTAR GAMBAR',
            heading: HeadingLevel.HEADING_1,
            pageBreakBefore: true
          }),
          new Paragraph({
            text: 'DAFTAR TABLE',
            heading: HeadingLevel.HEADING_1,
            pageBreakBefore: true
          })
        ],

        footers: { default: romanFooter }
      },
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.PORTRAIT,
              height: convertMillimetersToTwip(297),
              width: convertMillimetersToTwip(210)
            },
            margin: {
              top: convertMillimetersToTwip(30),
              bottom: convertMillimetersToTwip(30),
              left: convertMillimetersToTwip(40),
              right: convertMillimetersToTwip(30)
            },
            pageNumbers: {
              start: 1,
              formatType: NumberFormat.DECIMAL
            }
          }
        },

        headers: { default: header },
        children: mainContent,
        footers: { default: noFooter }
      }
    ]
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, fileName);
  });
};

export default GenerateDocx;
