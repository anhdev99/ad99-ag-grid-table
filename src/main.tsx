import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssVarsProvider } from '@mui/joy/styles';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { compactTheme } from './theme';
import RemoteEntriesExample from './examples/RemoteEntriesExample';
import './index.css';

// Register AG Grid community modules once at app startup
ModuleRegistry.registerModules([AllCommunityModule]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssVarsProvider theme={compactTheme}>
      <RemoteEntriesExample />
    </CssVarsProvider>
  </React.StrictMode>,
);
