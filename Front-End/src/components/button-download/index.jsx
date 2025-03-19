import { Button } from '@mui/material';
import React from 'react';

const DOWNLOAD_URL = import.meta.env.VITE_URL_TEMPLATE_STATEMENT;
const FileDownloader = () => {
  return (
    <Button variant="contained" color="primary" component="a" href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
      Download Template File
    </Button>
  );
};

export default FileDownloader;
