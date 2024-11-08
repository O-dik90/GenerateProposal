//** DAPUS ADD PAGE */

import React, { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

const Form = ({ onAdd, onEdit, onUpdate }) => {
  const [formData, setFormData] = useState({
    author: 'Hendra Pratama',
    //author_swap : "",
    title_journal: 'Jiwa Yang Lapar',
    publisher: 'Airlangga',
    publish_year: '2011',
    volume: 'VII'
  });

  const [isVisible, setisVisible] = useState(true);

  useEffect(() => {
    const length = Object.keys(onEdit).length;
    if (length > 0) {
      setFormData({
        author: onEdit.author,
        title_journal: onEdit.title_journal,
        publisher: onEdit.publisher,
        publish_year: onEdit.publish_year,
        volume: onEdit.volume
      });
      setisVisible(false);
    }
  }, [onEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    //console.log(formData);
    //setFormData({ author: 'Fakhruddin Zuhri', title_journal: 'Jiwa Yang Kesepian', publisher: 'Airlangga', publish_year : '2012', volume : 'X' });
    setFormData({ author: '', title_journal: '', publisher: '', publish_year: '', volume: '' });
    setisVisible(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log(formData);
    onUpdate(formData);
    setFormData({ author: '', title_journal: '', publisher: '', publish_year: '', volume: '' });
    setisVisible(true);
  };

  return (
    <>
      {/* <Formik
        initialValues={{
          author: '',
          publish_year: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          author: Yup.string().max(255).required('Penulis Harus Diisi'),
          publish_year: Yup.string().max(255).required('Tahun Terbit Harus Diisi')
        })}
      > */}
      {/* {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => ( */}
      <form noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={10}>
            <TextField
              label="Daftar Penulis"
              name="author"
              variant="outlined"
              value={formData.author}
              onChange={handleChange}
              fullWidth
              //error={Boolean(touched.author && errors.author)}
              helperText="Jika terdapat lebih dari 1 penulis bisa dipisah dengan menggunakan tanda koma"
            />
            {/* {touched.author && errors.author && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.author}
                  </FormHelperText>
                )} */}
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Tahun Terbit"
              name="publish_year"
              variant="outlined"
              value={formData.publish_year}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Judul Jurnal"
              name="title_journal"
              multiline
              rows={2}
              variant="outlined"
              value={formData.title_journal}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={10}>
            <TextField
              label="Penerbit"
              name="publisher"
              multiline
              variant="outlined"
              value={formData.publisher}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Volume"
              name="volume"
              multiline
              variant="outlined"
              value={formData.volume}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
        <br />
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          style={{ display: isVisible ? 'block' : 'none', marginTop: '16px', marginBottom: '16px' }}
        >
          Tambah Daftar Pustaka
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleUpdate}
          style={{ display: isVisible ? 'none' : 'block', marginTop: '16px', marginBottom: '16px' }}
        >
          Update
        </Button>
      </form>
      {/* )}
    </Formik> */}
    </>
  );
};

export default Form;
