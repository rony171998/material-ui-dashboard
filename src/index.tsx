import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import App from './Dashboard';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={localStorage.getItem('lang') || 'es'}>

      <App />
      </LocalizationProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);