import { Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getBabProposalDetail, updateBabProposalDetail } from 'store/slices/proposal';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TableGrid from 'components/table/TableGrid';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const INIT_LUARAN = [
  { no: 1, data: 'Laporan kemajuan', status: false },
  { no: 2, data: 'Laporan akhir', status: false }
];

const Pendahuluan = () => {
  const BAB_TITLE = 'BAB 1 PENDAHULUAN';
  const { id } = useParams(),
    { enqueueSnackbar } = useSnackbar(),
    dispatch = useDispatch();
  const { proposal_detail } = useSelector((state) => state.app.proposal);
  const [rumusan, setRumusan] = useState({
      no: 1,
      data: '',
      status: false
    }),
    [tujuan, setTujuan] = useState({
      no: 1,
      data: '',
      status: false
    }),
    // [luaran, setLuaran] = useState({
    //   no: 1,
    //   data: '',
    //   status: false
    // }),
    [manfaat, setManfaat] = useState({
      no: 1,
      data: '',
      status: false
    }),
    [data, setData] = useState({
      latar_belakang: '',
      rumusan_masalah: [],
      tujuan: [],
      luaran: INIT_LUARAN,
      manfaat: []
    });

  useEffect(() => {
    if (id) {
      dispatch(
        getBabProposalDetail({
          id: Number(id),
          bab_title: BAB_TITLE
        })
      );
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (proposal_detail.length > 0 && BAB_TITLE === 'BAB 1 PENDAHULUAN') {
      const bab1 = JSON.parse(proposal_detail[0].json_data || '{}');
      if (bab1) {
        setData({
          latar_belakang: bab1.latar_belakang,
          rumusan_masalah: bab1.rumusan_masalah === null ? [] : bab1.rumusan_masalah,
          tujuan: bab1.tujuan === null ? [] : bab1.tujuan,
          luaran: bab1.luaran === null ? INIT_LUARAN : bab1.luaran,
          manfaat: bab1.manfaat === null ? [] : bab1.manfaat
        });
      }
    }
    return () => {
      setData({
        latar_belakang: '',
        rumusan_masalah: [],
        tujuan: [],
        luaran: INIT_LUARAN,
        manfaat: []
      });
    };
  }, [proposal_detail]);

  // Handler for adding a new item to a specific array
  const handleRumusan = {
    onchange: (e) => {
      setRumusan({ ...rumusan, data: e.target.value });
    },
    tambah: (e) => {
      e.preventDefault();
      setData({
        ...data,
        rumusan_masalah: [...data.rumusan_masalah, { no: data.rumusan_masalah.length + 1, data: rumusan.data }]
      });
      setRumusan({ ...rumusan, no: rumusan.no + 1, data: '', status: false });
    },
    edit: (params) => {
      setRumusan({ ...rumusan, no: params.no, data: params.data, status: true });
    },
    update: () => {
      setData({
        ...data,
        rumusan_masalah: data.rumusan_masalah.map((item) => {
          if (item.no === rumusan.no) {
            return { ...item, data: rumusan.data };
          }
          return item;
        })
      });
      setRumusan({ ...rumusan, no: 1, data: '', status: false });
    },
    delete: (params) => {
      const filteredData = data.rumusan_masalah.filter((item) => item.no !== params.no);
      // Reindex the remaining items
      const reindexedData = filteredData.map((item, index) => ({
        ...item,
        no: index + 1
      }));
      setData({
        ...data,
        rumusan_masalah: reindexedData
      });
    }
  };

  const handleTujuan = {
    onchange: (e) => {
      setTujuan({ ...tujuan, data: e.target.value });
    },
    tambah: (e) => {
      e.preventDefault();
      setData({
        ...data,
        tujuan: [...data.tujuan, { no: data.tujuan.length + 1, data: tujuan.data }]
      });
      setTujuan({ ...tujuan, no: tujuan.no + 1, data: '', status: false });
    },
    edit: (params) => {
      setTujuan({ ...tujuan, no: params.no, data: params.data, status: true });
    },
    update: () => {
      setData({
        ...data,
        tujuan: data.tujuan.map((item) => {
          if (item.no === tujuan.no) {
            return { ...item, data: tujuan.data };
          }
          return item;
        })
      });
      setTujuan({ ...tujuan, no: tujuan.no + 1, data: '', status: false });
    },
    delete: (params) => {
      const filteredData = data.tujuan.filter((item) => item.no !== params.no);
      const reindexedData = filteredData.map((item, index) => ({
        ...item,
        no: index + 1
      }));
      setData({
        ...data,

        tujuan: reindexedData
      });
    }
  };

  // const handleLuaran = {
  //   onchange: (e) => {
  //     setLuaran({ ...luaran, data: e.target.value });
  //   },
  //   tambah: (e) => {
  //     e.preventDefault();
  //     setData({
  //       ...data,
  //       luaran: [...data.luaran, { no: data.luaran.length + 1, data: luaran.data }]
  //     });
  //     setLuaran({ ...luaran, no: luaran.no + 1, data: '', status: false });
  //   },
  //   edit: (params) => {
  //     setLuaran({ ...luaran, no: params.no, data: params.data, status: true });
  //   },
  //   update: () => {
  //     setData({
  //       ...data,
  //       luaran: data.luaran.map((item) => {
  //         if (item.no === luaran.no) {
  //           return { ...item, data: luaran.data };
  //         }
  //         return item;
  //       })
  //     });
  //     setLuaran({ ...luaran, no: luaran.no + 1, data: '', status: false });
  //   },
  //   delete: (params) => {
  //     const filteredData = data.luaran.filter((item) => item.no !== params.no);
  //     const reindexedData = filteredData.map((item, index) => ({
  //       ...item,
  //       no: index + 1
  //     }));
  //     setData({
  //       ...data,

  //       luaran: reindexedData
  //     });
  //   }
  // };

  const handleManfaat = {
    onchange: (e) => {
      setManfaat({ ...manfaat, data: e.target.value });
    },
    tambah: (e) => {
      e.preventDefault();
      setData({
        ...data,
        manfaat: [...data.manfaat, { no: data.manfaat.length + 1, data: manfaat.data }]
      });
      setManfaat({ ...manfaat, no: manfaat.no + 1, data: '', status: false });
    },
    edit: (params) => {
      setManfaat({ ...manfaat, no: params.no, data: params.data, status: true });
    },
    update: () => {
      setData({
        ...data,
        manfaat: data.manfaat.map((item) => {
          if (item.no === manfaat.no) {
            return { ...item, data: manfaat.data };
          }
          return item;
        })
      });
      setManfaat({ ...manfaat, no: manfaat.no + 1, data: '', status: false });
    },
    delete: (params) => {
      const filteredData = data.manfaat.filter((item) => item.no !== params.no);
      const reindexedData = filteredData.map((item, index) => ({
        ...item,
        no: index + 1
      }));
      setData({
        ...data,

        manfaat: reindexedData
      });
    }
  };

  const handleSimpan = () => {
    try {
      dispatch(updateBabProposalDetail({ id: Number(id), data: { json_data: data, bab_title: 'BAB 1' } }));
      enqueueSnackbar('Berhasil Menyimpan!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Gagal Menyimpan!', { variant: 'error' });
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        BAB 1. PENDAHULUAN
      </Typography>

      <Typography variant="h5" gutterBottom>
        1.1 Latar Belakang
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            label="Latar Belakang"
            name="latar_belakang"
            variant="outlined"
            value={data.latar_belakang ?? ''}
            onChange={(e) => setData({ ...data, latar_belakang: e.target.value })}
            fullWidth
            multiline
            rows={8}
          />
        </Grid>

        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Typography variant="h5" gutterBottom>
            1.2 Rumusan Masalah
          </Typography>
          <Typography variant="body1" gutterBottom>
            Berdasarkan latar belakang tersebut, dapat dibuat beberapa rumusan masalah sebagai berikut:
          </Typography>
          <TextField label="Rumusan Masalah" variant="outlined" value={rumusan.data} onChange={handleRumusan.onchange} fullWidth />
          <Button
            variant="contained"
            color="primary"
            onClick={handleRumusan.tambah}
            sx={{ marginY: 2 }}
            disabled={rumusan.status || !rumusan.data}
          >
            Tambah Rumusan Masalah
          </Button>
          <TableGrid
            key="grid-rumusan"
            columns={[
              { name: 'No', field: 'no', width: '4rem' },
              { name: 'Rumusan Masalah', field: 'data' }
            ]}
            rows={data.rumusan_masalah ?? []}
            expand={false}
            action
            onEdit={handleRumusan.edit}
            onDelete={handleRumusan.delete}
            onUpdate={handleRumusan.update}
            actionedit={rumusan.status}
          />
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Typography variant="h5" gutterBottom>
            1.3 Tujuan
          </Typography>
          <Typography variant="body1" gutterBottom>
            Dari rumusan masalah di atas, berikut merupakan beberapa tujuan pada program ini:
          </Typography>
          <TextField label="Tujuan" variant="outlined" value={tujuan.data} onChange={handleTujuan.onchange} fullWidth />
          <Button
            variant="contained"
            color="primary"
            onClick={handleTujuan.tambah}
            sx={{ marginY: 2 }}
            disabled={tujuan.status || !tujuan.data}
          >
            Tambah Tujuan
          </Button>
          <TableGrid
            key="grid-tujuan"
            columns={[
              { name: 'No', field: 'no', width: '4rem' },
              { name: 'Tujuan', field: 'data' }
            ]}
            rows={data.tujuan ?? []}
            expand={false}
            action
            onEdit={handleTujuan.edit}
            onDelete={handleTujuan.delete}
            onUpdate={handleTujuan.update}
            actionedit={tujuan.status}
          />
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Typography variant="h5" gutterBottom>
            1.4 Luaran
          </Typography>
          <Typography variant="body1" gutterBottom>
            Luaran-luaran yang diperlukan pada program ini antara lain:
          </Typography>
          {/* <TextField label="Luaran" variant="outlined" value={luaran.data} onChange={handleLuaran.onchange} fullWidth />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLuaran.tambah}
            sx={{ marginY: 2 }}
            disabled={luaran.status || !luaran.data}
          >
            Tambah Luaran
          </Button> */}
          <TableGrid
            key="grid-luaran"
            columns={[
              { name: 'No', field: 'no', width: '4rem' },
              { name: 'Rumusan Masalah', field: 'data' }
            ]}
            rows={data.luaran ?? []}
            expand={false}
            // action
            // onEdit={handleLuaran.edit}
            // onDelete={handleLuaran.delete}
            // onUpdate={handleLuaran.update}
            // actionedit={luaran.status}
          />
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Typography variant="h5" gutterBottom>
            1.5 Manfaat
          </Typography>
          <Typography variant="body1" gutterBottom>
            Berdasarkan tujuan yang dibuat, maka didapat manfaat sebagai berikut:
          </Typography>
          <TextField label="Manfaat" variant="outlined" value={manfaat.data} onChange={handleManfaat.onchange} fullWidth />
          <Button
            variant="contained"
            color="primary"
            onClick={handleManfaat.tambah}
            sx={{ marginY: 2 }}
            disabled={manfaat.status || !manfaat.data}
          >
            Tambah Manfaat
          </Button>
          <TableGrid
            key="grid-manfaat"
            columns={[
              { name: 'No', field: 'no', width: '4rem' },
              { name: 'Manfaat', field: 'data' }
            ]}
            rows={data.manfaat ?? []}
            expand={false}
            action
            onEdit={handleManfaat.edit}
            onDelete={handleManfaat.delete}
            onUpdate={handleManfaat.update}
            actionedit={manfaat.status}
          />
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="success" onClick={handleSimpan}>
          Simpan Pendahuluan
        </Button>
      </Stack>
    </>
  );
};

export default Pendahuluan;
