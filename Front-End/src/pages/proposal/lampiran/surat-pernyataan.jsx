import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, styled } from '@mui/material';

const PreviewImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '300px',
  marginTop: '20px'
});

const SuratPernyataan = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Please upload a JPEG or PNG file.');
        return;
      }

      // Create a preview URL
      const url = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
  };

  useEffect(() => {
    console.log(selectedFile);
  }, [selectedFile]);

  return (
    <Box textAlign="left">
      <Typography variant="h6" gutterBottom>
        Silahkan upload surat pernyataan.
      </Typography>
      <input accept="image/jpeg, image/png" id="upload-input" type="file" style={{ display: 'none' }} onChange={handleFileChange} />
      <label htmlFor="upload-input">
        <Button variant="contained" component="span">
          Unggah File
        </Button>
      </label>

      {previewUrl && (
        <Box mt={2} textAlign="center">
          <PreviewImage src={previewUrl} alt="Preview" />
          <Box mt={2}>
            <Button variant="outlined" color="error" onClick={handleRemoveFile}>
              Hapus File
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export { SuratPernyataan };
