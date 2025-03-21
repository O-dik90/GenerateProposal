const DOWNLOAD_URL = import.meta.env.VITE_API_BASE_URL;
export const fetchImages = async (imageUrls) => {
  if (!imageUrls || imageUrls.length === 0) {
    console.warn('Image not found');
    return [];
  }

  try {
    const imagePromises = imageUrls.map(async (url) => {
      try {
        const response = await fetch(`${DOWNLOAD_URL}/public` + url.file_path);

        if (!response.ok) {
          if (response.status === 500) {
            console.error('Server error (500): Unable to fetch image', url.file_path);
          } else {
            console.error(`HTTP error: ${response.status} while fetching ${url.file_path}`);
          }
          return null; // Return null for failed requests
        }

        const blob = await response.blob();
        return await blob.arrayBuffer();
      } catch (fetchError) {
        console.error('Fetch failed for', url.file_path, fetchError);
        return null;
      }
    });

    const images = await Promise.all(imagePromises);
    return images.filter((img) => img !== null); // Remove failed requests from results
  } catch (error) {
    console.error('Unexpected error while fetching images', error);
    return [];
  }
};
