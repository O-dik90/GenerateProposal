import { Document, ImageRun, Packer, Paragraph } from 'docx';

import React from 'react';
import { saveAs } from 'file-saver';

const ExportToDocx = () => {
  const exportDocx = async () => {
    const response = await fetch('http://localhost:3000/proxy-image');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();

    console.log('Image fetched:', imageBuffer.byteLength, 'bytes'); // Debugging

    if (!imageBuffer || imageBuffer.byteLength === 0) {
      console.error('Failed to fetch image data');
      return;
    }

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph('Hello World'),
            new Paragraph({
              children: [
                new ImageRun({
                  data: imageBuffer,
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
      saveAs(blob, 'example.docx');
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
