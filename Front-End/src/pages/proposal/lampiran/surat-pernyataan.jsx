import { Box, Button, Typography, styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { deleteFileLampiran, getListLampiran, uploadFileLampiran } from 'store/slices/proposal';
import { useDispatch, useSelector } from 'react-redux';

import { API_URL } from 'api/base-url';
import { useSnackbar } from 'notistack';

const PreviewImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '300px',
  marginTop: '20px'
});

const SuratPernyataan = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { document, metadata: rawData } = useSelector((state) => state.app.proposal);
  const [formData, setFormData] = useState({
    type: 'STATEMENT',
    selectedFile: null
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert('Please upload a JPEG or PNG file.');
        return;
      }

      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, selectedFile: file }));
      setPreviewUrl(url);
    }
  };

  // Handle file upload
  const handleUploadFile = async () => {
    const { selectedFile, type } = formData;

    if (!selectedFile) {
      alert('Silahkan pilih file terlebih dahulu.');
      return;
    }
    const data = JSON.stringify({
      type,
      proposals_id: rawData[9]?.proposals_id
    });
    const uploadData = new FormData();
    uploadData.append('images', selectedFile);
    uploadData.append('data', data);

    setIsLoading(true);

    try {
      const res = await dispatch(uploadFileLampiran(uploadData));

      console.log(res);
      if (uploadFileLampiran.fulfilled.match(res)) {
        enqueueSnackbar('Berhasil menyimpan', { variant: 'success' });
      } else {
        enqueueSnackbar(`${res.payload?.message}`, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Terjadi masalah', { variant: 'error' });
    } finally {
      dispatch(getListLampiran({ proposals_id: rawData[9]?.proposals_id, type: 'STATEMENT' }));
      setIsLoading(false);
    }
  };

  // Handle file deletion
  const handleRemoveFile = async () => {
    if (!document[0]?.id) {
      alert('No file to delete.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await dispatch(deleteFileLampiran({ id: document[0]?.id }));
      if (deleteFileLampiran.fulfilled.match(res)) {
        enqueueSnackbar('Berhasil menyimpan', { variant: 'success' });
      } else {
        enqueueSnackbar(`${res.payload?.message}`, { variant: 'error' });
      }
      setFormData((prev) => ({ ...prev, selectedFile: null }));
      setPreviewUrl('');
    } catch (error) {
      enqueueSnackbar('Terjadi masalah', { variant: 'error' });
    } finally {
      dispatch(getListLampiran({ proposals_id: rawData[9]?.proposals_id, type: 'STATEMENT' }));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('document', document);
    if (!previewUrl && document?.[0]?.url) {
      setPreviewUrl(API_URL + document[0]?.url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document]);

  useEffect(() => {
    dispatch(getListLampiran({ proposals_id: rawData[9]?.proposals_id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Silahkan upload surat pernyataan.
      </Typography>

      <input accept="image/jpeg, image/png" id="upload-input" type="file" style={{ display: 'none' }} onChange={handleFileChange} />
      <label htmlFor="upload-input">
        {document.length <= 0 && (
          <Button variant="contained" component="span" disabled={isLoading}>
            Pilih File
          </Button>
        )}
      </label>
      <Box component="form" textAlign="left" sx={{ maxWidth: 600, mx: 'auto' }}>
        {previewUrl && (
          <Box mt={2} textAlign="center">
            <PreviewImage src={previewUrl} alt="Preview" />
            <Box mt={2}>
              {document.length <= 0 && (
                <Button variant="contained" color="primary" onClick={handleUploadFile} sx={{ marginRight: 1 }} disabled={isLoading}>
                  Upload File
                </Button>
              )}
              <Button variant="outlined" color="error" onClick={handleRemoveFile} disabled={isLoading}>
                Hapus File
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export { SuratPernyataan };
