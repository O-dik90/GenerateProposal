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
import { LampiranGambarAttach, LampiranGambarState } from './table-gambar';

import { LampiranOrganisasi } from './table-organisasi';
import { enqueueSnackbar } from 'notistack';
import { lampiranIdentitas } from './lampiran-identitas';
import { saveAs } from 'file-saver';
import { tableAnggaran } from './table-anggaran';
import { tableBiaya } from './table-biaya';
import { tableKegiatan } from './table-kegiatan';

const GenerateDocx = async ({ data }) => {
  const { pendahuluan, tinjauan, kegiatan, pelaksanaan, lampiran, dapus, images } = data;

  const ImageStatement = images.filter((image) => image.file_type === 'STATEMENT');
  const ImageAttach = images.filter((image) => image.file_type === 'ATTACHMENT');
  console.log('testing data', lampiran);

  // Helper to create paragraphs from an array
  const createParagraphsFromArray = (items, style = 'wellSpaced') =>
    Array.isArray(items)
      ? items.map(
          (item) =>
            new Paragraph({
              text: `${item.no || ''}. ${item.data || ''}`,
              style
            })
        )
      : [];

  // Helper to create paragraphs for structured JSON data
  const createParagraphsFromJSON = (items, noSub = 1, style = 'wellSpaced') =>
    Array.isArray(items)
      ? items.flatMap((item) => [
          new Paragraph({
            text: `${noSub}.${item.no} ${item.title || ''}`,
            heading: HeadingLevel.HEADING_2
          }),
          new Paragraph({
            text: item.description || '',
            style
          })
        ])
      : [];

  const createDapus = (items, style = 'wellSpaced') =>
    Array.isArray(items)
      ? items.flatMap((item) => [
          new Paragraph({
            text: item.citation || '',
            style
          })
        ])
      : [];
  // Header with page numbers
  const header = new Header({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            children: [PageNumber.CURRENT]
          })
        ],
        alignment: AlignmentType.RIGHT
      })
    ]
  });

  //lampiran identitas
  const createTableIdentitas = (dataIdentitas) =>
    Array.isArray(dataIdentitas) ? dataIdentitas.flatMap((item) => lampiranIdentitas(item)) : [];

  // Footer configurations
  const emptyFooter = new Footer({
    children: [new Paragraph({ text: '' })]
  });

  const romanFooter = new Footer({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            children: [PageNumber.CURRENT]
          })
        ],
        alignment: AlignmentType.RIGHT
      })
    ]
  });

  const lampiranStatement = ImageStatement && (await LampiranGambarState(ImageStatement ?? []));
  const lampiranAttach = ImageAttach && (await LampiranGambarAttach(ImageAttach ?? []));

  // Main document content
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
      text: pendahuluan?.latar_belakang || '',
      style: 'wellSpaced'
    }),
    new Paragraph({
      text: '1.2. Rumusan Masalah',
      heading: HeadingLevel.HEADING_2
    }),
    new Paragraph({
      text: `Berdasarkan latar belakang tersebut, dapat dibuat beberapa rumusan masalah sebagai berikut:`,
      style: 'wellSpaced'
    }),
    ...createParagraphsFromArray(pendahuluan?.rumusan_masalah),
    new Paragraph({
      text: '1.3. Tujuan',
      heading: HeadingLevel.HEADING_2
    }),
    new Paragraph({
      text: `Adapun tujuan dari PKM Karsa Cipta ini adalah sebagai berikut:`,
      style: 'wellSpaced'
    }),
    ...createParagraphsFromArray(pendahuluan?.tujuan),
    new Paragraph({
      text: '1.4. Luaran',
      heading: HeadingLevel.HEADING_2
    }),
    new Paragraph({
      text: `Luaran wajib kegiatan PKM-KC:`,
      style: 'wellSpaced'
    }),
    ...createParagraphsFromArray(pendahuluan?.luaran),
    new Paragraph({
      text: '1.5. Manfaat',
      heading: HeadingLevel.HEADING_2
    }),
    new Paragraph({
      text: `Berdasarkan tujuan yang dibuat, maka didapat manfaat sebagai berikut:`,
      style: 'wellSpaced'
    }),
    ...createParagraphsFromArray(pendahuluan?.manfaat),
    //tinjauan pustaka
    new Paragraph({
      text: 'BAB 2 TINJAUAN PUSTAKA',
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true
    }),
    ...createParagraphsFromJSON(tinjauan, 2),
    //tahap pelaksanaan
    new Paragraph({
      text: 'BAB 3 PELAKSANAAN',
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true
    }),
    ...createParagraphsFromJSON(pelaksanaan, 3),
    //biaya dan jadwal kegiatan
    new Paragraph({
      text: 'BAB 4 BIAYA DAN JADWAL KEGIATAN',
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true
    }),
    new Paragraph({
      text: `4.1 Biaya`,
      heading: HeadingLevel.HEADING_2
    }),
    tableBiaya(lampiran?.anggaran !== null ? lampiran?.anggaran : []),
    new Paragraph({
      text: `4.2 Jadwal Kegiatan`,
      heading: HeadingLevel.HEADING_2
    }),
    tableKegiatan(kegiatan),
    new Paragraph({
      text: 'DAFTAR PUSTAKA',
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true
    }),
    ...createDapus(dapus),
    new Paragraph({
      text: 'LAMPIRAN',
      heading: HeadingLevel.HEADING_2,
      size: '14pt',
      pageBreakBefore: true
    }),
    new Paragraph({
      text: `Lampiran 1.  Biodata Ketua dan Anggota serta Dosen Pendamping`,
      heading: HeadingLevel.HEADING_2,
      alignment: AlignmentType.START
    }),
    ...createTableIdentitas(lampiran?.identitas),
    new Paragraph({
      text: `Lampiran 2.  Justifikasi Anggaran Kegiatan`,
      heading: HeadingLevel.HEADING_2,
      alignment: AlignmentType.START
    }),
    tableAnggaran(lampiran?.anggaran),
    new Paragraph({
      text: `Lampiran 3.  Susunan Tim Pengusul dan Pembagian Tugas`,
      heading: HeadingLevel.HEADING_2,
      alignment: AlignmentType.START
    }),
    LampiranOrganisasi(lampiran?.organisasi),
    new Paragraph({
      text: `Lampiran 4.  Surat Pernyataan Ketua`,
      heading: HeadingLevel.HEADING_2,
      alignment: AlignmentType.START
    }),
    ...lampiranStatement,
    new Paragraph({
      text: `Lampiran 5.  Gambaran Konsep Karya Inovatif yang Akan Dihasilkan `,
      heading: HeadingLevel.HEADING_2,
      alignment: AlignmentType.START
    }),
    ...lampiranAttach
  ];

  // Document configuration
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
      // Roman numbered sections
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
            text: 'DAFTAR TABEL',
            heading: HeadingLevel.HEADING_1,
            pageBreakBefore: true
          })
        ],
        footers: { default: romanFooter }
      },
      // Main content with decimal page numbering
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
        footers: { default: emptyFooter }
      }
    ]
  });

  // Generate and save the document
  Packer.toBlob(doc)
    .then((blob) => {
      saveAs(blob, data.title || 'document.docx');
      enqueueSnackbar('Berhasil memproses dokumen!', { variant: 'success' });
    })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar(`Gagal memproses dokumen! ${error.message}`, { variant: 'error' });
    });
};

export default GenerateDocx;
