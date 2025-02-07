import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AuthProvider } from 'pages/protect/authProvider';
import AutoLoginCheck from 'pages/protect/autoLoginCheck';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import ScrollTop from 'components/ScrollTop';
import { SnackbarProvider } from 'notistack';
import ThemeCustomization from 'themes';
import router from 'routes';
import store from 'store';
export default function App() {
  console.log('MODE', import.meta.env.MODE);
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeCustomization>
          <ScrollTop>
            <AuthProvider>
              <AutoLoginCheck />
              <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right', autoHideDuration: 3000 }}>
                <RouterProvider router={router} />
              </SnackbarProvider>
            </AuthProvider>
          </ScrollTop>
        </ThemeCustomization>
      </LocalizationProvider>
    </Provider>
  );
}
