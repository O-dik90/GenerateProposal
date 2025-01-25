import { Document, ImageRun, Packer, Paragraph } from 'docx';

import React from 'react';
import { saveAs } from 'file-saver';

const ExportToDocx = () => {
  const exportDocx = async () => {
    const blob = await fetch('https://ubaicorner.com/api-genpro/public/15/fd04508c63e2234643233c1aea1d2593_15_.png')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
        return r.blob();
      })
      .catch((error) => {
        console.error('Failed to fetch image:', error);
      });
    if (!blob) return;

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph('Hello World'),
            new Paragraph({
              children: [
                new ImageRun({
                  data: blob,
                  transformation: {
                    width: 100,
                    height: 100
                  }
                })
              ]
            })
          ]
        }
      ]
    });

    Packer.toBlob(doc).then((blob) => {
      console.log(blob);
      saveAs(blob, 'example.docx');
      console.log('Document created successfully');
    });
  };

  return (
    <div className="p-4">
      <button onClick={exportDocx} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Export to Word with Image
      </button>
    </div>
  );
};

export default ExportToDocx;
