import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { deleteFileLampiran, getListLampiran, updateFileLampiran, uploadFileLampiran } from 'store/slices/proposal';

import { ATTACHMENT_INIT } from './initial-data';
import { CloudUploadOutlined } from '@ant-design/icons';
import { TableForm } from 'components/table-form';
import { attachmentColumns } from './initial-column';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';

const state = {
  key: 'attachment',
  type: 'ATTACHMENT',
  allowExtension: ['image/jpeg', 'image/png', 'image/jpg']
};

const FilePendukung = () => {
  const [data, setData] = useState([]);
  const [object, setObject] = useState({
    attachment: ATTACHMENT_INIT
  });
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const param = useParams();

  const fileTypeError = useMemo(
    () => object.attachment.selectedFile && !state.allowExtension.includes(object.attachment.ext),
    [object.attachment]
  );

  const handleFileChange = (key) => (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setObject((prev) => ({
        ...prev,
        [key]: { ...prev[key], selectedFile: file, filename: file.name, ext: file.type }
      }));
    }
  };

  const handleFile = {
    edit: (key) => (item) => {
      setObject((prev) => ({
        ...prev,
        [key]: { ...prev[key], filename: item.description, status: true, image_id: item.id, proposal_id: item.proposal_id }
      }));
    },
    delete: () => async (item) => {
      if (!item?.id) {
        enqueueSnackbar('No file to delete.', { variant: 'warning' });
        return;
      }

      setIsLoading(true);
      try {
        const res = await dispatch(deleteFileLampiran({ id: item.id, proposal_id: item.proposal_id }));
        if (deleteFileLampiran.fulfilled.match(res)) {
          enqueueSnackbar('File deleted successfully.', { variant: 'success' });
          refreshData();
        } else {
          enqueueSnackbar(res.payload?.message || 'Failed to delete file.', { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar('An error occurred during file deletion.', { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    },
    reset: (key) => () => {
      setObject((prev) => ({
        ...prev,
        [key]: ATTACHMENT_INIT
      }));
    }
  };

  const handleUploadFile = async () => {
    if (!object.attachment.selectedFile || fileTypeError) {
      enqueueSnackbar('Invalid file. Please upload a JPEG or PNG file.', { variant: 'warning' });
      return;
    }

    const uploadData = new FormData();
    uploadData.append('file', object.attachment.selectedFile);
    uploadData.append('data', JSON.stringify({ type: state.type, proposal_id: param.id }));
    uploadData.append('proposal_id', param.id);

    setIsLoading(true);
    try {
      const res = await dispatch(uploadFileLampiran(uploadData));
      if (uploadFileLampiran.fulfilled.match(res)) {
        enqueueSnackbar('File uploaded successfully.', { variant: 'success' });
        refreshData();
      } else {
        enqueueSnackbar(res.payload?.message || 'Failed to upload file.', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('An error occurred during file upload.', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }

    setObject((prev) => ({
      ...prev,
      attachment: ATTACHMENT_INIT
    }));
  };

  const handleUpdateFile = async () => {
    if (!object.attachment.selectedFile || fileTypeError) {
      enqueueSnackbar('Invalid file. Please upload a JPEG or PNG file.', { variant: 'warning' });
      return;
    }

    const uploadData = new FormData();
    uploadData.append('file', object.attachment.selectedFile);
    uploadData.append('data', JSON.stringify({ type: state.type, proposal_id: param.id, image_id: object.attachment.image_id }));
    uploadData.append('proposal_id', param.id);

    setIsLoading(true);
    try {
      const res = await dispatch(updateFileLampiran(uploadData));
      if (updateFileLampiran.fulfilled.match(res)) {
        enqueueSnackbar('File updated successfully.', { variant: 'success' });
        refreshData();
      } else {
        enqueueSnackbar(res.payload?.message || 'Failed to update file.', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('An error occurred during file update.', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
    setObject((prev) => ({
      ...prev,
      attachment: ATTACHMENT_INIT
    }));
  };

  const refreshData = async () => {
    const res = await dispatch(getListLampiran({ proposal_id: param.id, type: state.type }));
    if (getListLampiran.fulfilled.match(res)) {
      const formattedData = res.payload.files?.map((item, index) => ({
        ...item,
        no: index + 1
      }));
      setData(formattedData ?? []);
    } else {
      enqueueSnackbar(res.payload?.message || 'Failed to fetch data.', { variant: 'error' });
    }
  };

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Silahkan upload file lampiran
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button variant="outlined" component="label" size="small" startIcon={<CloudUploadOutlined />} disabled={isLoading}>
          Choose File
          <input accept={state.allowExtension.join(',')} type="file" hidden onChange={handleFileChange(state.key)} />
        </Button>
        <Typography variant="body1" sx={{ fontWeight: 500, color: 'primary.main' }}>
          {object[state.key].filename || 'No file selected'}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={2} my={2}>
        {!object[state.key].status ? (
          <Button variant="contained" color="primary" onClick={handleUploadFile} disabled={isLoading}>
            Tambah Data
          </Button>
        ) : (
          <Button variant="contained" color="secondary" onClick={handleUpdateFile} disabled={isLoading}>
            Update Data
          </Button>
        )}
      </Stack>
      <TableForm
        columns={attachmentColumns(
          handleFile.edit(state.key),
          handleFile.delete(),
          handleFile.reset(state.key),
          object[state.key].image_id
        )}
        rows={data}
        expand={false}
      />
    </Box>
  );
};

export { FilePendukung };
