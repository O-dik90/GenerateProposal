import { Button } from '@mui/material';
import React from 'react';

const FileDownloader = () => {
  const fileUrl = 'https://genproposal.ubaicorner.com/public/file_master/template_surat_Pernyataan_Ketua.docx';

  return (
    <Button variant="contained" color="primary" component="a" href={fileUrl} target="_blank" rel="noopener noreferrer">
      Download Template File
    </Button>
  );
};

export default FileDownloader;
