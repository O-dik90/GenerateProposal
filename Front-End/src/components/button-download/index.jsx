import { Button } from '@mui/material';
import React from 'react';

const FileDownloader = () => {
  const fileUrl = 'https://ubaicorner.com/api/genpro/public/Template_Surat_Pernyataan_Ketua.docx';

  return (
    <Button variant="contained" color="primary" component="a" href={fileUrl} target="_blank" rel="noopener noreferrer">
      Download Template File
    </Button>
  );
};

export default FileDownloader;
