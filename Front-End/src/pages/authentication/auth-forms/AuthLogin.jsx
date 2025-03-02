import * as Yup from 'yup';

import React, { useEffect } from 'react';
import { getMe, userLogin } from 'store/slices/auth';

import AnimateButton from 'components/@extended/AnimateButton';
import Button from '@mui/material/Button';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import FormHelperText from '@mui/material/FormHelperText';
import { Formik } from 'formik';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

export default function AuthLogin() {
  const [showPassword, setShowPassword] = useState(false),
    dispatch = useDispatch(),
    { enqueueSnackbar } = useSnackbar(),
    navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const res = await dispatch(userLogin({ email: values.email, password: values.password }));

      if (userLogin.fulfilled.match(res)) {
        enqueueSnackbar('Berhasil Masuk', { variant: 'success' });
        navigate('/');
      }
    } catch (error) {
      setErrors({ submit: error.message });
      enqueueSnackbar(`${error.message}`, { variant: 'error' });
    }
    setSubmitting(false);
  };

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().max(255).required('Password is required')
      })}
      onSubmit={handleSubmit}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-login">Email Address</InputLabel>
                <OutlinedInput
                  id="email-login"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                />
              </Stack>
              {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-login">Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  id="password-login"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
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
                  placeholder="Enter password"
                />
              </Stack>
              {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
            </Grid>
            {/* <Grid item xs={12} sx={{ mt: -1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Link variant="h6" component={RouterLink} color="text.primary">
                  Forgot Password?
                </Link>
              </Stack>
            </Grid> */}
            {errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}
            <Grid item xs={12}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting || !values.email || !values.password}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Masuk
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
