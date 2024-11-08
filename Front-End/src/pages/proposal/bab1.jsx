import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MainCard from 'components/MainCard';
import TextField from '@mui/material/TextField';

const Pendahuluan = () => {
  const [bab1, setBab1] = useState({
    main: {
      latar_belakang: '',
      rumusan_masalah: 'Berdasarkan latar belakang tersebut, dapat dibuat beberapa rumusan masalah sebagai berikut:',
      tujuan: 'Dari rumusan masalah di atas, berikut merupakan beberapa tujuan pada program ini:',
      luaran: 'Luaran-luaran yang diperlukan pada program ini antara lain:',
      mamfaat: ''
    },
    rumusan_masalah_items: [],
    tujuan_items: [],
    luaran_items: ['Laporan Kemajuan', 'Laporan Akhir', 'Prototipe atau Produk Fungsional', 'Akun Sosial Media'],
    mamfaat_items: []
  });

  const [RMasalah, setRMasalah] = useState('');
  const [TMasalah, setTMasalah] = useState('');
  const [MMasalah, setMMasalah] = useState('');

  const [RMasalahList, setRMasalahList] = useState([]);
  const [TMasalahList, setTMasalahList] = useState([]);
  const [MMasalahList, setMMasalahList] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    setBab1((prev) => {
      return {
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value
        }
      };
    });

    onSendData(bab1);
  };

  const handleChangeR = (e) => {
    setRMasalah(e.currentTarget.value);
  };

  const handleChangeT = (e) => {
    setTMasalah(e.currentTarget.value);
  };

  const handleChangeM = (e) => {
    setMMasalah(e.currentTarget.value);
  };

  const handleAdd = (option) => {
    switch (option) {
      case 'RUMUSAN':
        setRMasalahList((prevData) => [...prevData, RMasalah]);
        rm.push(RMasalah);
        setRMasalah('');
        break;
      case 'TUJUAN':
        setTMasalahList((prevData) => [...prevData, TMasalah]);
        tm.push(TMasalah);
        setTMasalah('');
        break;
      case 'MAMFAAT':
        setMMasalahList((prevData) => [...prevData, MMasalah]);
        mm.push(MMasalah);
        setMMasalah('');
        break;
      default:
    }

    setBab1((prevData) => ({
      ...prevData,
      ['rumusan_masalah_items']: rm
    }));

    setBab1((prevData) => ({
      ...prevData,
      ['tujuan_items']: tm
    }));

    setBab1((prevData) => ({
      ...prevData,
      ['mamfaat_items']: mm
    }));

    onSendData(bab1);
  };

  return (
    <MainCard title="BAB 1. PENDAHULUAN">
      {/* <Typography variant="h4" gutterBottom>
            BAB 1. PENDAHULUAN
        </Typography> */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="1.1. Latar Belakang"
            name="main.latar_belakang"
            variant="outlined"
            value={bab1.main.latar_belakang}
            onChange={handleChange}
            fullWidth
            multiline
            rows={8}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="1.2. Rumusan Masalah"
            name="main.rumusan_masalah"
            variant="outlined"
            value={bab1.main.rumusan_masalah}
            //{bab1.rumusan_masalah}
            //onChange={handleChange}
            fullWidth
            aria-readonly
          />
          <br />
          <br />
          <TextField
            label="Isi Rumusan Masalah"
            name="rumusan_masalah_items.rumusan_masalah_item"
            variant="outlined"
            value={RMasalah}
            //{bab1.rumusan_masalah}
            onChange={(e) => handleChangeR(e)}
            //onChange={handleChange}
            fullWidth
          />
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              handleAdd('RUMUSAN');
            }}
            style={{ marginTop: '16px', marginBottom: '16px' }}
          >
            Tambah Rumusan Masalah
          </Button>
          <table>
            <thead>
              <tr>
                <th width="5%">No</th>
                <th>Rumusan Masalah</th>
                <th width="15%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {/* {console.log(bab1.rumusan_masalah_items)} */}
              {...RMasalahList.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="1.3. Tujuan"
            name="main.tujuan"
            type="text"
            multiline
            //rows={8}
            variant="outlined"
            value={bab1.main.tujuan}
            //onChange={handleChange}
            aria-readonly
            fullWidth
          />
          <br />
          <br />
          <TextField
            label="Isi Tujuan"
            name="tujuan_items.tujuan_item"
            variant="outlined"
            value={TMasalah}
            //{bab1.rumusan_masalah}
            onChange={(e) => handleChangeT(e)}
            //onChange={handleChange}
            fullWidth
          />
          <Button
            variant="contained"
            color="success"
            //onClick={handleAdd}
            onClick={() => {
              handleAdd('TUJUAN');
            }}
            style={{ marginTop: '16px', marginBottom: '16px' }}
          >
            Tambah Tujuan
          </Button>
          <br />
          <table>
            <thead>
              <tr>
                <th width="5%">No</th>
                <th>Tujuan</th>
                <th width="15%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {/* {console.log(bab1.rumusan_masalah_items)} */}
              {...TMasalahList.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="1.4. Luaran"
            name="main.luaran"
            type="text"
            //multiline
            rows={8}
            variant="outlined"
            value={bab1.main.luaran}
            aria-readonly
            //onChange={handleChange}
            fullWidth
          />
          <br />
          <br />
          <table>
            <thead>
              <tr>
                <th width="5%">No</th>
                <th>Luaran</th>
              </tr>
            </thead>
            <tbody>
              {/* {console.log(bab1.rumusan_masalah_items)} */}
              {...bab1.luaran_items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="1.5. Manfaat"
            name="main.mamfaat"
            type="text"
            variant="outlined"
            value={bab1.main.mamfaat}
            onChange={handleChange}
            fullWidth
          />
          <br />
          <br />
          <TextField
            label="Isi Mamfaat"
            name="mamfaat_items.mamfaat_item"
            variant="outlined"
            value={MMasalah}
            //{bab1.rumusan_masalah}
            onChange={(e) => handleChangeM(e)}
            //onChange={handleChange}
            fullWidth
          />
          <Button
            variant="contained"
            color="success"
            //onClick={handleAdd}
            onClick={() => {
              handleAdd('MAMFAAT');
            }}
            style={{ marginTop: '16px', marginBottom: '16px' }}
          >
            Tambah Mamfaat
          </Button>
          <br />
          <table>
            <thead>
              <tr>
                <th width="5%">No</th>
                <th>Mamfaat</th>
                <th width="15%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {/* {console.log(bab1.rumusan_masalah_items)} */}
              {...MMasalahList.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Grid>
      </Grid>
      <br />
      {/* <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            style={{ marginTop: '16px', marginBottom : '16px' }}
        >
        +
        </Button> */}
    </MainCard>
  );
};

export default Pendahuluan;
