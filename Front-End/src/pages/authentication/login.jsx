import { Link, useNavigate } from 'react-router-dom';

import AuthLogin from './auth-forms/AuthLogin';
import AuthWrapper from './AuthWrapper';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAuth } from 'pages/protect/authProvider';
import { useEffect } from 'react';

// ================================|| LOGIN ||================================ //

export default function Login() {
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
            <Typography variant="h3">Akun Masuk</Typography>
            <Typography component={Link} to="/register" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Belum punya akun?
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin isDemo={false} />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
