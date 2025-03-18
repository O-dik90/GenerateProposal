export const fetchImages = async (imageUrls) => {
  if (!imageUrls || imageUrls.length === 0) {
    console.warn('Image not found');
    return [];
  }

  try {
    const imagePromises = imageUrls.map(async (url) => {
      const response = await fetch('https://ubaicorner.com/api-genproposal/public' + url.file_path);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const blob = await response.blob();
      return await blob.arrayBuffer();
    });

    return await Promise.all(imagePromises);
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};
