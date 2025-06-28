import * as Yup from 'yup';

import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { useEffect, useState } from 'react';

import AnimateButton from 'components/@extended/AnimateButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { Formik } from 'formik';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { userRegister } from 'store/slices/user';

export default function AuthRegister() {
  const [level, setLevel] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleClickConfirmPw = () => {
    setShowPassword1(!showPassword1);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const res = await dispatch(userRegister(values));
      if (res.meta.requestStatus === 'fulfilled') {
        Promise.resolve()
          .then(() => enqueueSnackbar('Registrasi berhasil, silahkan login', { variant: 'success' }))
          .finally(navigate('/'));
      }
    } catch (error) {
      if (error.response.status === 409) {
        console.log(error);
        setErrors({ submit: 'Email sudah terdaftar' });
      } else {
        setErrors({ submit: error.message });
      }
    }
    setSubmitting(false);
  };

  return (
    <>
      <Formik
        initialValues={{
          name: '',
          lastname: '',
          email: '',
          password: '',
          confPassword: '',
          role: 'user'
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(50).required('Nama wajib diisi'),
          email: Yup.string().email('Format email salah').max(50).required('Email wajib diisi'),
          password: Yup.string().min(8, 'Minimal 8 karakter').max(12).required('Password wajib diisi'),
          confPassword: Yup.string()
            .min(8, 'Minimal 8 karakter')
            .max(12)
            .oneOf([Yup.ref('password'), null], 'Password harus sama')
            .required('Konfirrmasi password wajib diisi')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="name-signup">Nama*</InputLabel>
                  <OutlinedInput
                    id="name-login"
                    type="name"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Nama Pengguna"
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                    inputProps={{ maxLength: 50 }}
                  />
                </Stack>
                {touched.name && errors.name && (
                  <FormHelperText error id="helper-text-name-signup">
                    {errors.name}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-signup">Alamat Email*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="pengguna@email.com"
                    inputProps={{ maxLength: 50 }}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email-signup">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-signup">Kata Sandi*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    inputProps={{ maxLength: 12 }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="******"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="helper-text-password-signup">
                    {errors.password}
                  </FormHelperText>
                )}
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="confPassword-signup">Konfirmasi Kata Sandi*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.confPassword && errors.confPassword)}
                    id="confPassword-login"
                    type={showPassword1 ? 'text' : 'password'}
                    value={values.confPassword}
                    name="confPassword"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickConfirmPw}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="******"
                    inputProps={{ maxLength: 12 }}
                  />
                </Stack>
                {touched.confPassword && errors.confPassword && (
                  <FormHelperText error id="helper-text-password-signup">
                    {errors.confPassword}
                  </FormHelperText>
                )}
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Buat Akun
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
