import { Button, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import { masterLampiranID, masterLampiranRef } from 'store/slices/master-data';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { ID_INIT } from './initial';
import React from 'react';

const Lampiran = () => {
  const { id, ref } = useSelector((state) => state.app.masterData.lampiran);
  const dispatch = useDispatch();

  const [object, setObject] = useState({});

  const handleLampiran = {
    oncategory: (e) => {
      const { value } = e.target;
      switch (value) {
        case 'Identitas':
          setObject({
            ...ID_INIT,
            category: value
          });
          break;
        default:
          setObject({});
      }
    },
    onchange: (e) => {
      const { name, value } = e.target;
      setObject({
        ...object,
        [name]: value
      });
    }
  };
  useEffect(() => {
    const loadMasterData = async () => {
      if (!ref.length) await dispatch(masterLampiranRef({ source_name: 'LAMPIRAN' }));
      if (!id.length) await dispatch(masterLampiranID({ source_name: 'L1' }));
    };

    loadMasterData();
  }, [ref, id, dispatch]);

  useEffect(() => {
    console.log(object);
  }, [object]);
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Lampiran
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Typography variant="h6" gutterBottom>
            Berisikan tentang lampiran data yang diperlukan dalam pembuatan proposal.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Select
              displayEmpty
              readOnly={false}
              value={object.category || ''}
              onChange={handleLampiran.oncategory}
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ width: '10rem' }}
            >
              <MenuItem disabled value="">
                <em>Kategori</em>
              </MenuItem>
              {ref.map((o) => (
                <MenuItem key={o.code} value={o.value}>
                  {o.value}
                </MenuItem>
              ))}
            </Select>
            {object?.category === 'Identitas' && (
              <Select
                displayEmpty
                readOnly={false}
                value={object.role_person || ''}
                onChange={handleLampiran.onchange}
                inputProps={{ 'aria-label': 'Without label' }}
                sx={{ width: '10rem' }}
                name="role_person"
              >
                <MenuItem disabled value="">
                  <em>Jabatan</em>
                </MenuItem>
                {id.map((o) => (
                  <MenuItem key={`${o.code}-${o.value}`} value={o.value}>
                    {o.value}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Stack>

          {/* <GeneralForm
            buttonForm="Tambah Pustaka Buku"
            buttonDisable={handleTinjauan.disable}
            formData={object}
            errors={errors}
            Fields={Fields}
            handleChange={handleTinjauan.onchange}
            handleSubmit={handleTinjauan.add}
          />
          <TableGrid
            key="grid-tinjauan"
            columns={[
              { name: 'No', field: 'no', width: '4rem' },
              { name: 'Judul', field: 'title' }
            ]}
            rows={data}
            expand={true}
            action
            onEdit={handleTinjauan.edit}
            onDelete={handleTinjauan.delete}
            onUpdate={handleTinjauan.update}
            actionedit={false}
            detail={handleTinjauan.detail}
          />*/}
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="success">
          Simpan Lampiran
        </Button>
      </Stack>
    </>
  );
};

export default Lampiran;
