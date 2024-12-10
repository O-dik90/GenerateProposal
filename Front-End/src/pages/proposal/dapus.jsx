import { Button, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { masterDapusRef, masterDapusStyle } from 'store/slices/master-data';
import { useDispatch, useSelector } from 'react-redux';

import { GeneralForm } from 'components/form/GeneralForm';
import TableGrid from 'components/table/TableGrid';
import { updateDapus } from 'store/slices/proposal';
import { useSnackbar } from 'notistack';

export const BOOK_INIT = {
  no: 0,
  type: '', //required
  title: '', //required
  author: [], //required
  publisher: '', //required
  publisher_place: '', //required
  issued: { date_parts: [] }, //required
  edition: '',
  volume: '',
  isbn: '',
  page: '',
  abstract: '',
  url: '',
  access: { date_parts: [] },
  style: '',
  status: false
};
export const JOURNAL_INIT = {
  no: 0,
  type: '', //required
  title: '', //required
  author: [], //required
  container_title: '', //required
  publisher: '',
  publisher_place: '',
  issued: { date_parts: [] }, //required
  volume: '', //required
  issue: '', //required
  page: '', //required
  doi: '',
  issn: '',
  abstract: '',
  url: '',
  access: { date_parts: [] },
  style: '',
  status: false
};
export const URL_INIT = {
  no: 0,
  type: '', //required
  title: '', //required
  author: [], //required
  container_title: '',
  publisher: '',
  url: '', //required
  issued: { date_parts: [] }, //required
  access: { date_parts: [] },
  abstract: '',
  language: '',
  note: '',
  style: '',
  status: false
};
const AUTHOR_INIT = {
  no: 0,
  given: '', //first name
  family: '', //last name
  status: false
};

const Dapus = () => {
  const { dapus } = useSelector((state) => state.app.proposal);
  const { style, reference } = useSelector((state) => state.app.masterData.dapus);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [object, setObject] = useState({});
  const [author, setAuthor] = useState({
    object: AUTHOR_INIT,
    data: []
  });
  const [errors, setErrors] = useState({});
  const [data, setData] = useState([]);

  const Fields = {
    author: [
      { name: 'given', label: 'Nama Depan', type: 'text', size: 6 },
      { name: 'family', label: 'Nama Belakang', type: 'text', size: 6 }
    ],
    buku: [
      { name: 'title', label: 'Judul', type: 'text', size: 4 },
      { name: 'publisher', label: 'Penerbit', type: 'text', size: 2 },
      { name: 'publisher_place', label: 'Tempat Terbit', type: 'text', size: 4 },
      { name: 'date_parts', label: 'Tanggal Terbit', type: 'date', size: 2 }
    ],
    jurnal: [
      { name: 'title', label: 'Judul', type: 'text', size: 4 },
      { name: 'container_title', label: 'Nama Jurnal', type: 'text', size: 2 },
      { name: 'volume', label: 'Volume', type: 'text', size: 2 },
      { name: 'issue', label: 'Edisi', type: 'text', size: 2 },
      { name: 'page', label: 'Halaman', type: 'text', size: 2 },
      { name: 'date_parts', label: 'Tanggal Terbit', type: 'date', size: 4 }
    ],
    url: [
      { name: 'title', label: 'Judul', type: 'text', size: 4 },
      { name: 'url', label: 'URL', type: 'text', size: 4 },
      { name: 'date_parts', label: 'Tanggal Akses', type: 'date', size: 4 }
    ]
  };
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
    const accessDateArray = object.access_date_parts?.split('-').map(Number) || [];

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

    if (type === 'webpage') {
      newEntry.access = { date_parts: [accessDateArray] };
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
      const dateArray = object.date_parts.split('-').map((value) => Number(value));
      const updatedData = data.map((item) => {
        if (item.no === object.no) {
          let updatedItem = {
            ...item,
            ...object,
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

      try {
        const dataPustaka = {
          id: dapus?.[0]?.id,
          proposals_id: dapus?.[0]?.proposals_id,
          data: data
        };
        console.log(dataPustaka);
        const res = await dispatch(updateDapus(dataPustaka));

        if (updateDapus.fulfilled.match(res)) {
          enqueueSnackbar('Berhasil menyimpan', { variant: 'success' });
        }
      } catch (error) {
        enqueueSnackbar('Gagal menyimpan data pustaka', { variant: 'error' });
      }
    }
  };
  useEffect(() => {
    const loadMasterData = async () => {
      if (!reference.length) await dispatch(masterDapusRef({ category: 'ref' }));
      if (!style.length) await dispatch(masterDapusStyle({ category: 'style' }));
    };

    loadMasterData();
  }, [dispatch, reference, style]);
  useEffect(() => {
    if (dapus?.json_data) {
      setData(dapus.json_data);
    }
  }, [dapus]);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Daftar Pustaka
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
                <MenuItem key={o.code} value={o.value}>
                  {o.name}
                </MenuItem>
              ))}
            </Select>
            <Select
              displayEmpty
              readOnly={object.status}
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
                <MenuItem key={o.code} value={o.value}>
                  {o.name}
                </MenuItem>
              ))}
            </Select>
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
          { name: 'Judul', field: 'title' }
        ]}
        rows={data}
        action
        onEdit={handlePustaka.edit}
        onUpdate={handlePustaka.update}
        onDelete={handlePustaka.delete}
        detail={handlePustaka.detail}
        actionEdit={object.status}
        expand
      />
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="success" onClick={handlePustaka.save}>
          Simpan Pustaka
        </Button>
      </Stack>
    </>
  );
};

export default Dapus;
