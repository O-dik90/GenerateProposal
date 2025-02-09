import { Link, useNavigate } from 'react-router-dom';

import AuthRegister from './auth-forms/AuthRegister';
import AuthWrapper from './AuthWrapper';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAuth } from 'pages/protect/authProvider';
import { useEffect } from 'react';

// ================================|| REGISTER ||================================ //

export default function Register() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [navigate, user]);
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Daftar Akun</Typography>
            <Typography component={Link} to="/login" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Sudah punya akun?
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthRegister />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
