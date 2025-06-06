import { AUTHOR_INIT, BOOK_INIT, JOURNAL_INIT, URL_INIT } from './initial-data';
import { Button, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { getBabProposalDetail, updateBabProposalDetail, updateChangesAsync } from 'store/slices/proposal';
import { masterDapusRef, masterDapusStyle } from 'store/slices/master-data';
import { useDispatch, useSelector } from 'react-redux';

import ConfirmDialog from 'components/dialog/ConfirmDialog';
import { Fields } from './initial-column';
import { GeneralForm } from 'components/form/GeneralForm';
import PropTypes from 'prop-types';
import TableGrid from 'components/table/TableGrid';
import { isEqual } from 'lodash';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { INIT_CHANGEDATA } from '../detail';

const Dapus = ({ confirmSave }) => {
  const originalDataRef = useRef(null);
  const BAB_TITLE5 = 'DAFTAR PUSTAKA';
  const { proposal_detail } = useSelector((state) => state.app.proposal);
  const { style, reference } = useSelector((state) => state.app.masterData.dapus);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const [object, setObject] = useState({});
  const [author, setAuthor] = useState({
    object: AUTHOR_INIT,
    data: []
  });
  const [errors, setErrors] = useState({});
  const [data, setData] = useState([]);

  const validateAuthor = () => {
    const newErrors = {};
    if (!author.object.given && author.data.length === 0) newErrors.given = 'Nama depan wajib diisi';
    if (!author.object.family && author.data.length === 0) newErrors.family = 'Nama belakang wajib diisi';
    return newErrors;
  };
  const validatePustaka = () => {
    const newErrors = {};
    if (!object.title) newErrors.title = 'Judul wajib diisi';
    if (!object.type) newErrors.type = 'Tahun terbit wajib diisi';

    switch (object.type) {
      case 'book':
        if (!object.publisher) newErrors.publisher = 'Penerbit wajib diisi';
        if (!object.publisher_place) newErrors.publisher_place = 'Tempat penerbit wajib diisi';
        break;

      case 'article-journal':
        if (!object.container_title) newErrors.container_title = 'Judul jurnal wajib diisi';
        if (!object.volume) newErrors.volume = 'Volume wajib diisi';
        if (!object.issue) newErrors.issue = 'Edisi wajib diisi';
        if (!object.page) newErrors.page = 'Halaman wajib diisi';
        break;

      case 'article':
        if (!object.url) newErrors.url = 'URL wajib diisi';
        if (!object.language) newErrors.language = 'Bahasa wajib diisi';
        break;

      default:
        break;
    }
    return newErrors;
  };

  const handleCloseModal = () => {
    dispatch(updateChangesAsync(INIT_CHANGEDATA));
  };

  const handleAuthor = {
    onchange: (e) => {
      const { name, value } = e.target;
      setAuthor((prev) => ({
        ...prev,
        object: { ...prev.object, [name]: value }
      }));
    },
    save: (e) => {
      e.preventDefault();

      const validationErrors = validateAuthor();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setAuthor((prev) => ({
        ...prev,
        data: [...prev.data, { ...prev.object, no: prev.data.length + 1 }],
        object: AUTHOR_INIT
      }));
      setErrors({});
    },
    edit: (author) => {
      setErrors({});
      setAuthor((prev) => ({ ...prev, object: { ...author, status: true } }));
    },
    update: () => {
      const validationErrors = validateAuthor();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setAuthor((prev) => ({
        ...prev,
        data: prev.data.map((item) => {
          if (item.no === author.object.no) {
            return { ...author.object, status: false };
          }
          return item;
        }),
        object: AUTHOR_INIT
      }));
      setErrors({});
    },
    delete: (no) => {
      const updatedAuthors = author.data
        .filter((item) => item.no !== no)
        .map((item, index) => ({
          ...item,
          no: index + 1
        }));
      setAuthor((prev) => ({
        ...prev,
        data: updatedAuthors
      }));
    },
    disabled: !author.object.given || !author.object.family || author.object.status
  };
  const handleSave = (type) => (e) => {
    e.preventDefault();

    const pustakaErrors = validatePustaka();
    const authorErrors = validateAuthor();
    const combinedErrors = { ...pustakaErrors, ...authorErrors };

    if (Object.keys(combinedErrors).length > 0) {
      setErrors(combinedErrors);
      return;
    }

    const dateArray = object.date_parts?.split('-').map(Number) || [];
    const dateAccess = object.access?.split('-').map(Number) || [];

    // Prepare the new data entry
    const newEntry = {
      ...object,
      no: data.length + 1,
      author: author.data.map((o) => ({
        given: o.given,
        family: o.family
      })),
      issued: { date_parts: [dateArray] },
      data_additional: author.data
    };

    if (type === 'book' || type === 'webpage') {
      newEntry.accessed = { date_parts: [dateAccess] };
    }

    setData((prevData) => [...prevData, newEntry]);
    setAuthor({ object: AUTHOR_INIT, data: [] });
    setObject({});
    setErrors({});
  };
  const handleBuku = {
    save: handleSave('book'),
    disabled: object.status
  };
  const handleJurnal = {
    save: handleSave('article-journal'),
    disabled: object.status
  };
  const handleUrl = {
    save: handleSave('webpage'),
    disabled: object.status
  };
  const handlePustaka = {
    ontype: (e) => {
      const { value } = e.target;
      switch (value) {
        case 'book':
          setObject({
            ...BOOK_INIT,
            type: value
          });
          break;
        case 'article-journal':
          setObject({
            ...JOURNAL_INIT,
            type: value
          });
          break;
        case 'webpage':
          setObject({
            ...URL_INIT,
            type: value
          });
          break;
      }
    },
    onchange: (e) => {
      const { name, value } = e.target;
      setObject({
        ...object,
        [name]: value
      });
    },
    edit: (param) => {
      setObject({
        ...param,
        status: true
      });
      setAuthor((prev) => ({
        ...prev,
        data: param.data_additional
      }));
    },
    update: () => {
      const validationErrors = validatePustaka();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      const dateArray = object.date_parts?.split('-').map((value) => Number(value));
      const updatedData = data.map((item) => {
        if (item.no === object.no) {
          let updatedItem = {
            ...item,
            ...object,
            status: false,
            author: author.data.map((o) => ({
              given: o.given,
              family: o.family
            })),
            issued: {
              date_parts: [dateArray]
            },
            data_additional: author.data
          };

          // Type-specific updates
          switch (object.type) {
            case 'book':
              updatedItem = {
                ...updatedItem,
                publisher: object.publisher,
                publisher_place: object.publisher_place
              };
              break;

            case 'article-journal':
              updatedItem = {
                ...updatedItem,
                container_title: object.container_title,
                volume: object.volume,
                issue: object.issue,
                page: object.page
              };
              break;

            case 'webpage':
              updatedItem = {
                ...updatedItem,
                url: object.url,
                access: object.access,
                language: object.language
              };
              break;

            default:
              break;
          }
          return updatedItem;
        }
        return item;
      });
      setData(updatedData);
      setObject({});
      setAuthor({
        object: AUTHOR_INIT,
        data: []
      });
      setErrors({});
    },
    delete: (param) => {
      const updatedData = data
        .filter((item) => item.no !== param.no)
        .map((item, index) => ({
          ...item,
          no: index + 1
        }));
      setData(updatedData);
    },
    save: async () => {
      if (!data || data.length === 0) {
        enqueueSnackbar('Data pustaka kosong', { variant: 'error' });
        return;
      }

      if (object.status === true) {
        enqueueSnackbar('Mohon update checklist action dahulu', { variant: 'info' });
        return;
      }

      try {
        const dataPustaka = {
          bab_title: BAB_TITLE5,
          json_data: data
        };
        const res = await dispatch(updateBabProposalDetail({ id: Number(id), data: dataPustaka }));

        if (updateBabProposalDetail.fulfilled.match(res)) {
          enqueueSnackbar('Berhasil menyimpan', { variant: 'success' });
        } else {
          enqueueSnackbar('Gagal menyimpan', { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar('Gagal menyimpan data pustaka', { variant: 'error' });
      } finally {
        dispatch(getBabProposalDetail({ id, bab_title: BAB_TITLE5 }));
        setObject({});
        setAuthor({ object: AUTHOR_INIT, data: [] });
        setErrors({});
      }

      handleCloseModal();
    }
  };
  useEffect(() => {
    const loadMasterData = async () => {
      if (reference?.length <= 0) await dispatch(masterDapusRef({ category: 'ref' }));
    };

    loadMasterData();
  }, [dispatch, reference]);

  useEffect(() => {
    const loadMasterData = async () => {
      if (style?.length <= 0) await dispatch(masterDapusStyle({ category: 'style' }));
    };

    loadMasterData();
  }, [dispatch, style]);

  useEffect(() => {
    if (id) {
      dispatch(getBabProposalDetail({ id, bab_title: BAB_TITLE5 }));
    }
  }, [dispatch, id]);
  useEffect(() => {
    if (proposal_detail?.length > 0 && BAB_TITLE5) {
      const bab5 = JSON.parse(proposal_detail[0].json_data || '[]');
      if (Array.isArray(bab5)) {
        setData(bab5);
        originalDataRef.current = bab5;
      }
    }
    return () => {
      setData([]);
    };
  }, [proposal_detail]);

  useEffect(() => {
    if (originalDataRef.current !== null && Object.keys(data).length > 0 && !isEqual(data, originalDataRef.current)) {
      dispatch(
        updateChangesAsync({
          ...INIT_CHANGEDATA,
          changesData: true
        })
      );
    }
  }, [data, dispatch]);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        DAFTAR PUSTAKA
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <Select
              displayEmpty
              readOnly={object.status}
              value={object.type || ''}
              onChange={handlePustaka.ontype}
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ width: '10rem' }}
            >
              <MenuItem disabled value="">
                <em>Referensi</em>
              </MenuItem>
              {reference.map((o) => (
                <MenuItem key={o.id} value={o.init}>
                  {o.description}
                </MenuItem>
              ))}
            </Select>
            {/* <Select
              displayEmpty
              readOnly={true}
              inputProps={{ 'aria-label': 'Without label' }}
              value={object.style || ''}
              onChange={handlePustaka.onchange}
              sx={{ width: '10rem' }}
              name="style"
            >
              <MenuItem disabled value="">
                <em>Gaya Penulisan</em>
              </MenuItem>
              {style.map((o) => (
                <MenuItem key={o.id} value={o.init}>
                  {o.description}
                </MenuItem>
              ))}
            </Select> */}
          </Stack>
        </Grid>
        {object.style && (
          <Grid item xs={12}>
            <GeneralForm
              buttonForm="Tambah Pengarang"
              buttonDisable={handleAuthor.disabled}
              formData={author.object}
              errors={errors}
              Fields={Fields.author}
              handleChange={handleAuthor.onchange}
              handleSubmit={handleAuthor.save}
            />
            <TableGrid
              columns={[
                { name: 'No', field: 'no', width: '4rem' },
                { name: 'Nama Depan', field: 'given' },
                { name: 'Nama Belakang', field: 'family' }
              ]}
              rows={author.data || []}
              action
              onEdit={handleAuthor.edit}
              onUpdate={handleAuthor.update}
              onDelete={(row) => handleAuthor.delete(row.no)}
              expand={false}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          {object.style && object.type === 'book' && (
            <>
              <Typography variant="body1" gutterBottom sx={{ marginTop: 1 }}>
                Pengisian daftar pustaka buku
              </Typography>
              <GeneralForm
                buttonForm="Tambah Pustaka Buku"
                buttonDisable={handleBuku.disabled}
                formData={object}
                errors={errors}
                Fields={Fields.buku}
                handleChange={handlePustaka.onchange}
                handleSubmit={handleBuku.save}
              />
            </>
          )}
          {object.style && object.type === 'article-journal' && (
            <>
              <Typography variant="body1" gutterBottom sx={{ marginTop: 1 }}>
                Pengisian daftar pustaka Jurnal
              </Typography>
              <GeneralForm
                buttonForm="Tambah Pustaka Jurnal"
                buttonDisable={handleJurnal.disabled}
                formData={object}
                errors={errors}
                Fields={Fields.jurnal}
                handleChange={handlePustaka.onchange}
                handleSubmit={handleJurnal.save}
              />
            </>
          )}
          {object.style && object.type === 'webpage' && (
            <>
              <Typography variant="body1" gutterBottom sx={{ marginTop: 1 }}>
                Pengisian daftar pustaka Webpage
              </Typography>
              <GeneralForm
                buttonForm="Tambah Pustaka Url"
                buttonDisable={handleUrl.disabled}
                formData={object}
                errors={errors}
                Fields={Fields.url}
                handleChange={handlePustaka.onchange}
                handleSubmit={handleUrl.save}
              />
            </>
          )}
        </Grid>
      </Grid>
      <TableGrid
        columns={[
          { name: 'No', field: 'no', width: '4rem' },
          { name: 'Judul', field: 'title' },
          { name: 'Daftar Pustaka', field: 'citation' }
        ]}
        rows={data || []}
        action
        onEdit={handlePustaka.edit}
        onUpdate={handlePustaka.update}
        onDelete={handlePustaka.delete}
        actionEdit={object.status}
        expand={false}
      />
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="success" onClick={handlePustaka.save}>
          Simpan Pustaka
        </Button>
      </Stack>

      <ConfirmDialog
        open={confirmSave}
        title={`${BAB_TITLE5}`}
        message="Simpan perubahan data?"
        onClose={handleCloseModal}
        onConfirm={handlePustaka.save}
      />
    </>
  );
};

Dapus.propTypes = {
  confirmSave: PropTypes.bool.isRequired
};

export default Dapus;
