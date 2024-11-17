import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import ScrollTop from 'components/ScrollTop';
import ThemeCustomization from 'themes';
import router from 'routes';
import store from 'store';

export default function App() {
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeCustomization>
          <ScrollTop>
            <RouterProvider router={router} />
          </ScrollTop>
        </ThemeCustomization>
      </LocalizationProvider>
    </Provider>
  );
}
