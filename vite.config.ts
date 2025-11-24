import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReusableAgGridTable',
      fileName: (format) => format === 'es' ? 'index.mjs' : 'index.cjs',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'ag-grid-community',
        'ag-grid-react',
        '@mui/joy',
        '@mui/icons-material',
        'react-spinners',
        '@emotion/react',
        '@emotion/styled',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'ag-grid-community': 'AgGrid',
          'ag-grid-react': 'AgGridReact',
          '@mui/joy': 'MuiJoy',
          '@mui/icons-material': 'MuiIcons',
          'react-spinners': 'ReactSpinners',
          '@emotion/react': 'emotionReact',
          '@emotion/styled': 'emotionStyled',
        },
      },
    },
  },
});
