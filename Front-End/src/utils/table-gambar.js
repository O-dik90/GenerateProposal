import { AlignmentType, ImageRun, Paragraph } from 'docx';
import { fetchImages } from './fetch-image';

const mapImagesToParagraphs = (imageBuffers) => {
  return imageBuffers.length > 0
    ? imageBuffers.flatMap((imageBuffer) => [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new ImageRun({
              data: imageBuffer,
              transformation: { width: 400, height: 400 }
            })
          ]
        }),
        new Paragraph({
          text: '',
          alignment: AlignmentType.CENTER
        })
      ])
    : [new Paragraph({ text: 'No images available', alignment: AlignmentType.CENTER })];
};

export const LampiranGambar = async (imageUrls) => {
  try {
    const imageBuffers = await fetchImages(imageUrls);
    if (imageBuffers.length === 0) throw new Error('No images found');

    return mapImagesToParagraphs(imageBuffers);
  } catch (error) {
    console.warn('Error Generate Image:', error);
    return [];
  }
};
