import { AlignmentType, Document, ImageRun, Packer, Paragraph, TextRun } from 'docx';

import React from 'react';
import { saveAs } from 'file-saver';

export const mapImagesToParagraphs = (imageBuffers) => {
  return imageBuffers.flatMap((imageBuffer) => [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new ImageRun({
          data: imageBuffer,
          transformation: {
            width: 500,
            height: 400
          }
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: '',
          bold: true,
          size: 24
        })
      ]
    })
  ]);
};

const ExportToDocx = () => {
  const exportDocx = async () => {
    const imageUrls = [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      'https://images.unsplash.com/photo-1521747116042-5a810fda9664'
    ];

    const imageBuffers = await fetchImages(imageUrls);
    if (imageBuffers.length === 0) return;

    const paragraphs = mapImagesToParagraphs(imageBuffers);

    const doc = new Document({
      sections: [{ children: paragraphs }]
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, 'example.docx');
    });
  };

  return (
    <div className="p-4">
      <button onClick={exportDocx} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Export to Word with Images
      </button>
    </div>
  );
};

export default ExportToDocx;
