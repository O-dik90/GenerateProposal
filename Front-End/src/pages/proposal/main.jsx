import {
  AlignmentType,
  Document,
  Footer,
  Header,
  HeadingLevel,
  LevelFormat,
  NumberFormat,
  Packer,
  PageNumber,
  PageOrientation,
  Paragraph,
  TextRun,
  convertInchesToTwip,
  convertMillimetersToTwip
} from 'docx';
import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Form from './dapus-add';
import MainCard from 'components/MainCard';
import Pendahuluan from './bab1';
import Table from './dapus-list';
import { saveAs } from 'file-saver';

const Proposal = () => {
  const [data, setData] = useState([]);
  const [dataSelected, setdataSelected] = useState([]);
  const [editIndex, seteditIndex] = useState(null);

  const handleAdd = (newData) => {
    setData((prevData) => [...prevData, newData]);
  };

  const GenerateDocx = () => {
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

    const noFooter = new Footer({
      children: [
        new Paragraph({
          text: '' // No page number
        })
      ]
    });

    //Footer Roman Page Number i,ii,iii
    const footer = new Footer({
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

    const doc = new Document({
      styles: {
        default: {
          heading1: {
            run: {
              size: '12pt',
              bold: true
            },
            paragraph: {
              spacing: {
                line: 276,
                after: 0
              },
              alignment: AlignmentType.CENTER
            }
          },
          heading2: {
            run: {
              size: '12pt',
              bold: true
            },
            paragraph: {
              spacing: {
                line: 276,
                before: 0,
                after: 0
              },
              alignment: AlignmentType.LEFT
            }
          },
          document: {
            run: {
              size: '12pt',
              font: 'Times New Roman'
            },
            paragraph: {
              alignment: AlignmentType.JUSTIFIED
            }
          }
        },
        paragraphStyles: [
          {
            id: 'wellSpaced',
            name: 'Well Spaced',
            basedOn: 'Normal',
            quickFormat: true,
            paragraph: {
              //spacing: { line: 276, before: 20 * 72 * 0.1, after: 20 * 72 * 0.05 },
              spacing: {
                line: 276,
                before: 0,
                after: 0
              }
              //indent: {
              //firstLine: convertInchesToTwip(0.5)
              //}
            }
          },
          {
            id: 'aside',
            name: 'Aside',
            basedOn: 'Normal',
            next: 'Normal',
            paragraph: {
              indent: {
                left: convertInchesToTwip(0.5),
                hanging: convertInchesToTwip(0.25)
              },
              spacing: {
                line: 276,
                before: 0,
                after: 0
              }
            }
          }
        ]
      },
      numbering: {
        config: [
          {
            reference: 'my-crazy-numbering',
            levels: [
              {
                level: 0,
                format: LevelFormat.DECIMAL,
                text: '%1.',
                alignment: AlignmentType.LEFT,
                start: 1
              },
              {
                level: 1,
                format: LevelFormat.DECIMAL,
                text: '%2.',
                alignment: AlignmentType.LEFT,
                start: 1,
                previousLevel: 0
              },
              {
                level: 2,
                format: LevelFormat.DECIMAL,
                text: '%3.',
                alignment: AlignmentType.LEFT,
                start: 1,
                previousLevel: 1
              },
              {
                level: 3,
                format: LevelFormat.DECIMAL,
                text: '%4.',
                alignment: AlignmentType.LEFT,
                start: 1,
                previousLevel: 2
              }
            ]
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
              pageNumbers: {
                formatType: NumberFormat.LOWER_ROMAN
              }
            }
          },
          children: [
            new Paragraph({
              text: 'DAFTAR ISI',
              heading: HeadingLevel.HEADING_1, // Apply the custom heading1 style
              pageBreakBefore: true
            }),
            new Paragraph({
              text: 'DAFTAR GAMBAR',
              heading: HeadingLevel.HEADING_1, // Apply the custom heading1 style
              pageBreakBefore: true
            }),
            new Paragraph({
              text: 'DAFTAR TABLE',
              heading: HeadingLevel.HEADING_1, // Apply the custom heading1 style
              pageBreakBefore: true
            })
          ],
          footers: {
            default: footer
          }
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
          headers: {
            default: header
          },
          children: [
            new Paragraph({
              text: 'BAB 1 PENDAHULUAN',
              heading: HeadingLevel.HEADING_1, // Apply the custom heading1 style
              pageBreakBefore: true
            }),
            new Paragraph({
              text: '1.1. Latar Belakang',
              heading: HeadingLevel.HEADING_2
            }),
            new Paragraph({
              text: dataPendahuluan.main.latar_belakang,
              style: 'wellSpaced'
            }),

            /*  new Paragraph({
                text: '1.1. Latar Belakang',
                heading: HeadingLevel.HEADING_2
              }),
              new Paragraph({
                text: text1_1,
                style: 'wellSpaced', // Apply the custom style
              }),*/
            /*new Paragraph({
                text: 'Salah satu penjualan terbesar di industri mamin adalah penjualan daging ayam broiler. Konsumsi daging broiler di Indonesia tergolong tinggi. Indonesia adalah negara ke-12 di dunia dengan konsumsi domestik daging broiler terbanyak (Index Mundi, 2022). Menurut laporan Badan Pusat Statistik, pada tahun 2021, jumlah produksi ayam broiler mencapai hampir 160 ribu ton (BPS, 2022). Menurut Pusat Data dan Sistem Informasi Pertanian (2022), populasi ayam ras pedaging mencapai 3,17 miliar ekor pada tahun 2022, dan pada tahun 2025 dan 2026 diperkirakan mencapai 3,28 miliar ekor dan 3,35 miliar ekor. Dari populasi tersebut, pada tahun 2025 produksi daging ayam ras diperkirakan mencapai 3,56 juta ton, dan pada tahun 2026 mencapai 3,65 juta ton. ',
                style: 'wellSpaced', // Apply the custom style
              }),*/
            new Paragraph({
              text: '1.2. Rumusan Masalah',
              heading: HeadingLevel.HEADING_2
            }),
            new Paragraph({
              text: dataPendahuluan.main.rumusan_masalah,
              style: 'wellSpaced'
            }),

            ...dataPendahuluan.rumusan_masalah_items.map(
              (item) =>
                new Paragraph({
                  text: item,
                  numbering: {
                    reference: 'my-crazy-numbering',
                    level: 0
                  },
                  style: 'aside'
                })
            ),

            // {...dataPendahuluan.rumusan_masalah_items.map((item, index) => (
            //   new Paragraph({
            //     text: item,
            //     numbering: {
            //         reference: "my-crazy-numbering",
            //         level: 0,
            //     },
            //     style: "aside",
            //   })
            //  ))},

            new Paragraph({
              text: '1.3. Tujuan',
              heading: HeadingLevel.HEADING_2
            }),
            new Paragraph({
              text: dataPendahuluan.main.tujuan,
              style: 'wellSpaced'
            }),
            ...dataPendahuluan.tujuan_items.map(
              (item) =>
                new Paragraph({
                  text: item,
                  numbering: {
                    reference: 'my-crazy-numbering',
                    level: 1
                  },
                  style: 'aside'
                })
            ),
            new Paragraph({
              text: '1.4. Luaran',
              heading: HeadingLevel.HEADING_2
            }),
            new Paragraph({
              text: dataPendahuluan.main.luaran,
              style: 'wellSpaced'
            }),
            ...dataPendahuluan.luaran_items.map(
              (item) =>
                new Paragraph({
                  text: item,
                  numbering: {
                    reference: 'my-crazy-numbering',
                    level: 2
                  },
                  style: 'aside'
                })
            ),

            new Paragraph({
              text: '1.5. Mamfaat',
              heading: HeadingLevel.HEADING_2
            }),
            new Paragraph({
              text: dataPendahuluan.main.mamfaat,
              style: 'wellSpaced'
            }),
            ...dataPendahuluan.mamfaat_items.map(
              (item) =>
                new Paragraph({
                  text: item,
                  numbering: {
                    reference: 'my-crazy-numbering',
                    level: 3
                  },
                  style: 'aside'
                })
            ),
            new Paragraph({
              text: 'DAFTAR PUSTAKA',
              heading: HeadingLevel.HEADING_1, // Apply the custom heading1 style
              pageBreakBefore: true
            }),
            ...data.map(
              (item) =>
                new Paragraph({
                  children: [new TextRun(`${item.author}.${item.publish_year}.${item.title_journal}.${item.publisher}.${item.volume}.`)]
                })
            )
          ],

          footers: {
            default: noFooter
          }
        }
      ]
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, 'example.docx');
    });
  };
  const [dataPendahuluan, setDataPendahuluan] = useState([]);
  const handleDataPendahuluan = (data) => {
    setDataPendahuluan(data);
    console.log(data);
  };

  const handleChildData = (data, idx) => {
    seteditIndex(idx);
    console.log(idx);
    setdataSelected(data);
  };

  const handleDeleteData = (data) => {
    setData(data);
  };

  const handleUpdate = (dataEdit) => {
    const updatedItems = data.map((item, index) => (index === editIndex ? dataEdit : item));
    setData(updatedItems);
  };

  return (
    <div>
      <Pendahuluan onSendData={handleDataPendahuluan} />
      <br />
      <MainCard title="DAFTAR PUSTAKA">
        <Form onAdd={handleAdd} onUpdate={handleUpdate} onEdit={dataSelected} />
        <Table data={data} onSendData={handleChildData} onRealData={handleDeleteData} />
      </MainCard>
      <Button variant="contained" color="primary" onClick={GenerateDocx} style={{ marginTop: '16px', marginBottom: '16px' }}>
        Generate Docx
      </Button>
    </div>
  );
};

export default Proposal;
