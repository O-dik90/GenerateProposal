import { Document, Media, Packer, Paragraph } from 'docx';

import React from 'react';
import { saveAs } from 'file-saver';

const ExportToDocx = () => {
  const exportDocx = async () => {
    // Create a new Word document
    const doc = new Document();

    // Add a paragraph with some text
    const paragraph = new Paragraph('Hello, this is an exported Word document with an image!');

    // Image URL
    const imageUrl = 'https://raw.githubusercontent.com/dolanmiu/docx/ccd655ef8be3828f2c4b1feb3517a905f98409d9/demo/images/cat.jpg'; // Replace with your image URL
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();
    const imageBuffer = await imageBlob.arrayBuffer();

    // Add the image to the document
    const image = Media.addImage(doc, imageBuffer);

    // Add the image and paragraph to the document's section
    doc.addSection({
      children: [
        paragraph,
        new Paragraph({
          children: [image]
        })
      ]
    });

    // Generate and save the document as a .docx file
    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'example_with_image.docx');
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
