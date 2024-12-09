import { Grid, Typography } from '@mui/material';

import Button from '@mui/material/Button';
import React from 'react';
import Stack from '@mui/material/Stack';

const Lampiran = () => {
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
