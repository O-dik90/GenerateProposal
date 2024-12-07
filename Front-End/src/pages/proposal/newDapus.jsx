import { Box, Button, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { masterDapusRef, masterDapusStyle } from 'store/slices/master-data';
import { useDispatch, useSelector } from 'react-redux';

import { GeneralForm } from 'components/form/GeneralForm';
import TableGrid from 'components/table/TableGrid';
import { useSnackbar } from 'notistack';

const DAPUS_INIT = {
  no: 0,
  style: '',
  reference: '',
  authors_name: [''],
  title: '',
  publisher: '',
  year: '',
  edition: '',
  authors_data: [],
  status: false
};

const PENGARANG_INIT = {
  no: 0,
  first_name: '',
  last_name: '',
  status: false
};

const NewDapus = () => {
  const { dapus } = useSelector((state) => state.app.proposal);
  const { style, reference } = useSelector((state) => state.app.masterData.dapus);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [object, setObject] = useState({
    author: PENGARANG_INIT,
    dapus: DAPUS_INIT,
    status: false
  });
  const [errors, setErrors] = useState({});
  const [data, setData] = useState([]);

  const Fields = {
    author: [
      { name: 'first_name', label: 'Nama Depan', type: 'text', size: 6 },
      { name: 'last_name', label: 'Nama Belakang', type: 'text', size: 6 }
    ],
    buku: [
      { name: 'title', label: 'Judul', type: 'text', size: 4 },
      { name: 'year', label: 'Tahun Terbit', type: 'text', size: 2 },
      { name: 'edition', label: 'Edisi', type: 'text', size: 2 },
      { name: 'publisher', label: 'Penerbit', type: 'text', size: 4 }
    ],
    jurnal: [
      { name: 'title', label: 'Judul', type: 'text', size: 4 },
      { name: 'year', label: 'Tahun Terbit', type: 'text', size: 2 },
      { name: 'volume', label: 'Volume', type: 'text', size: 2 },
      { name: 'page', label: 'Halaman', type: 'text', size: 2 }
    ]
  };

  const validateAuthor = () => {
    const newErrors = {};
    if (!object.author.first_name) newErrors.first_name = 'Nama depan wajib diisi';
    if (!object.author.last_name) newErrors.last_name = 'Nama belakang wajib diisi';
    return newErrors;
  };

  const validateBuku = () => {
    const newErrors = {};
    if (!object.dapus.title) newErrors.title = 'Judul wajib diisi';
    if (!object.dapus.year) newErrors.year = 'Tahun terbit wajib diisi';
    if (!object.dapus.publisher) newErrors.publisher = 'Penerbit wajib diisi';
    if (!object.dapus.reference) newErrors.title = 'Gaya Penulisan dan referensi wajib dipilih.';
    return newErrors;
  };
  const validateJurnal = () => {
    const newErrors = {};
    if (!object.dapus.title) newErrors.title = 'Judul wajib diisi';
    if (!object.dapus.year) newErrors.year = 'Tahun terbit wajib diisi';
    if (!object.dapus.volume) newErrors.publisher = 'Penerbit wajib diisi';
    if (!object.dapus.reference) newErrors.title = 'Gaya Penulisan dan referensi wajib dipilih.';
    return newErrors;
  };

  const handlePengarang = {
    onchange: (e) => {
      const { name, value } = e.target;
      setObject((prev) => ({
        ...prev,
        author: {
          ...prev.author,
          [name]: value
        }
      }));
    },
    save: (e) => {
      e.preventDefault();
      const validationErrors = validateAuthor();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setObject((prev) => ({
        ...prev,
        dapus: {
          ...prev.dapus,
          authors_data: [
            ...prev.dapus.authors_data,
            {
              ...prev.author,
              no: prev.dapus.authors_data.length + 1
            }
          ]
        },
        author: PENGARANG_INIT
      }));
      setErrors({});
    },
    edit: (author) => {
      setErrors({});
      setObject((prev) => ({ ...prev, author }));
    },
    update: () => {
      const validationErrors = validateAuthor();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setObject((prev) => ({
        ...prev,
        dapus: {
          ...prev.dapus,
          authors_data: prev.dapus.authors_data.map((item) =>
            item.no === object.author.no
              ? {
                  ...item,
                  first_name: object.author.first_name,
                  last_name: object.author.last_name
                }
              : item
          )
        },
        author: PENGARANG_INIT
      }));
    },
    delete: (no) => {
      const updatedAuthors = object.dapus.authors_data
        .filter((item) => item.no !== no)
        .map((item, index) => ({
          ...item,
          no: index + 1
        }));
      setObject((prev) => ({
        ...prev,
        dapus: { ...prev.dapus, authors_data: updatedAuthors }
      }));
    }
  };
  const handleDapusBuku = {
    save: (e) => {
      e.preventDefault();
      const validationErrors = validateBuku();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      console.log(object.dapus);
      const no = data !== null ? data.length + 1 : 1;

      const newEntry = {
        ...object.dapus,
        no,
        authors_name: Array.isArray(object.dapus.authors_data)
          ? object.dapus.authors_data.map((item) => `${item.first_name} ${item.last_name}`).join(',')
          : ''
      };

      setData(data !== null ? [...data, newEntry] : [newEntry]);

      setObject({
        author: PENGARANG_INIT,
        dapus: DAPUS_INIT
      });
      setErrors({});
    }
  };

  const handleDapusJurnal = {
    save: (e) => {
      console.log('jurnal');
      e.preventDefault();
      const validationErrors = validateJurnal();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      console.log(object.dapus);
      const no = data !== null ? data.length + 1 : 1;

      const newEntry = {
        ...object.dapus,
        no,
        authors_name: Array.isArray(object.dapus.authors_data)
          ? object.dapus.authors_data.map((item) => `${item.first_name} ${item.last_name}`).join(',')
          : ''
      };

      setData(data !== null ? [...data, newEntry] : [newEntry]);

      setObject({
        author: PENGARANG_INIT,
        dapus: DAPUS_INIT
      });
      setErrors({});
    }
  };

  const handlePustaka = {
    onchange: (e) => {
      const { name, value } = e.target;
      setObject((prev) => ({
        ...prev,
        dapus: {
          ...prev.dapus,
          [name]: value
        }
      }));
    },
    edit: (param) => {
      console.log('edit', param);
      if (param.reference === 'buku') {
        setObject((prev) => ({ ...prev, dapus: { ...param, status: true } }));
      } else if (param.reference === 'jurnal') {
        setObject((prev) => ({ ...prev, dapus: { ...param, status: true } }));
      }
    },
    update: () => {
      const indexToUpdate = data.findIndex((item) => item.no === object.dapus.no);

      if (indexToUpdate !== -1) {
        data.splice(indexToUpdate, 1, {
          ...data[indexToUpdate],

          authors_data: object.dapus.authors_data,
          authors_name: Array.isArray(object.dapus.authors_data)
            ? object.dapus.authors_data.map((o) => `${o.first_name} ${o.last_name}`).join(', ') // Join names
            : data[indexToUpdate].authors_data,
          title: object.dapus.title,
          publisher: object.dapus.publisher,
          year: object.dapus.year,
          edition: object.dapus.edition
        });
      }
      setData([...data]);
      setObject({
        author: PENGARANG_INIT,
        dapus: DAPUS_INIT
      });
    },
    delete: (param) => {
      const filteredDapus = data
        .filter((item) => item.no !== param.no)
        .map((item, index) => ({
          ...item,
          no: index + 1
        }));
      setData(filteredDapus);
    },
    save: () => {
      if (!data || data.length === 0) {
        enqueueSnackbar('Data pustaka kosong', { variant: 'error' });
        return;
      }

      try {
        const dataPustaka = {
          id: dapus?.[0]?.id,
          proposals_id: dapus?.[0]?.proposals_id,
          json_data: data
        };
        console.log(dataPustaka);
        enqueueSnackbar('Data berhasil disimpan', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar('Gagal menyimpan data pustaka', { variant: 'error' });
      }
    },
    detail: (row) => {
      const detailRow = row && (
        <>
          <Typography variant="body1" gutterBottom component="div">
            <strong>No</strong> {row.no}
          </Typography>
          <Typography variant="body1" gutterBottom component="div">
            <strong>Kategori</strong> {row.reference}
          </Typography>
          <Typography variant="body1" gutterBottom component="div">
            <strong>Penulis</strong> {row.authors_name}
          </Typography>
        </>
      );
      return <Box sx={{ padding: 2 }}>{detailRow}</Box>;
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
    if (dapus?.[0]?.json_data) {
      setData(dapus[0].json_data);
    }
  }, [dapus]);

  useEffect(() => {
    console.log(object);
  }, [object]);

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
              value={object.dapus.style}
              onChange={(e) =>
                setObject((prev) => ({
                  ...prev,
                  dapus: {
                    ...prev.dapus,
                    style: e.target.value
                  }
                }))
              }
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ width: '10rem' }}
            >
              <MenuItem disabled value="">
                <em>Gaya Penulisan</em>
              </MenuItem>
              {style.map((o) => (
                <MenuItem key={o.code} value={o.code} disabled={o.name !== 'MLA'}>
                  {o.name}
                </MenuItem>
              ))}
            </Select>
            <Select
              displayEmpty
              value={object.dapus.reference}
              onChange={(e) =>
                setObject((prev) => ({
                  ...prev,
                  dapus: {
                    ...prev.dapus,
                    reference: e.target.value
                  }
                }))
              }
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ width: '10rem' }}
            >
              <MenuItem disabled value="">
                <em>Referensi</em>
              </MenuItem>
              {reference.map((o) => (
                <MenuItem key={o.code} value={o.code} disabled={o.code !== 'buku' && o.code !== 'jurnal'}>
                  {o.name}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Grid>
        {object.dapus.style && (
          <Grid item xs={12}>
            <GeneralForm
              buttonForm="Tambah Pengarang"
              formData={object.author}
              errors={errors}
              Fields={Fields.author}
              handleChange={handlePengarang.onchange}
              handleSubmit={handlePengarang.save}
            />
            <TableGrid
              columns={[
                { name: 'No', field: 'no', width: '4rem' },
                { name: 'Nama Depan', field: 'first_name' },
                { name: 'Nama Belakang', field: 'last_name' }
              ]}
              rows={object.dapus.authors_data}
              action
              onEdit={handlePengarang.edit}
              onUpdate={handlePengarang.update}
              onDelete={(row) => handlePengarang.delete(row.no)}
              expand={false}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          {object.dapus.reference === 'buku' && (
            <>
              <Typography variant="body1" gutterBottom sx={{ marginTop: 1 }}>
                Pengisian daftar pustaka buku
              </Typography>
              <GeneralForm
                buttonForm="Tambah Pustaka Buku"
                formData={object.dapus}
                errors={errors}
                Fields={Fields.buku}
                handleChange={handlePustaka.onchange}
                handleSubmit={handleDapusBuku.save}
              />
            </>
          )}
          {object.dapus.reference === 'jurnal' && (
            <>
              <Typography variant="body1" gutterBottom sx={{ marginTop: 1 }}>
                Pengisian daftar pustaka Jurnal
              </Typography>
              <GeneralForm
                buttonForm="Tambah Pustaka Jurnal"
                formData={object.dapus}
                errors={errors}
                Fields={Fields.jurnal}
                handleChange={handlePustaka.onchange}
                handleSubmit={handleDapusJurnal.save}
              />
            </>
          )}
        </Grid>
      </Grid>
      <TableGrid
        columns={[
          { name: 'No', field: 'no', width: '4rem' },
          { name: 'Kategori', field: 'reference', width: '6rem' },
          { name: 'Judul', field: 'title' },
          { name: 'Tahun', field: 'year', width: '4rem' }
        ]}
        rows={data}
        action
        onEdit={handlePustaka.edit}
        onUpdate={handlePustaka.update}
        onDelete={handlePustaka.delete}
        detail={handlePustaka.detail}
        actionEdit={object.dapus.status}
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

export default NewDapus;
