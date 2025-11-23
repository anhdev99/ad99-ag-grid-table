import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssVarsProvider } from '@mui/joy/styles';
import { compactTheme } from './theme';
import RemoteEntriesExample from './examples/RemoteEntriesExample';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssVarsProvider theme={compactTheme}>
      <RemoteEntriesExample />
    </CssVarsProvider>
  </React.StrictMode>,
);
