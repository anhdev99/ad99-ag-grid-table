# ad99-ag-grid-table

[![npm version](https://img.shields.io/npm/v/ad99-ag-grid-table.svg)](https://www.npmjs.com/package/ad99-ag-grid-table)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-ready React data table component built on AG Grid with enhanced toolbar actions, context menus, and infinite scroll support.

## Features

- **Action Toolbar** - Built-in add/export/delete actions with pinned row
- **Row Actions Menu** - Customizable per-row action menu
- **Context Menu** - Right-click menu with copy/paste functionality
- **Data Loading** - Client-side and infinite scroll with loading states
- **TypeScript** - Full type safety and IntelliSense support

## Installation

```bash
npm install ad99-ag-grid-table ag-grid-community ag-grid-react @mui/joy @mui/icons-material react-spinners @emotion/react @emotion/styled
```

## Quick Start

```tsx
import { Ad99DataTable } from 'ad99-ag-grid-table';
import 'ad99-ag-grid-table/style.css';
import type { ColDef } from 'ag-grid-community';

const columnDefs: ColDef[] = [
  { headerName: '', width: 60 },
  { headerName: '', width: 50, checkboxSelection: true, headerCheckboxSelection: true },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'code', headerName: 'Code', flex: 1 },
];

function App() {
  return (
    <Ad99DataTable
      columnDefs={columnDefs}
      rowData={data}
      onAdd={() => console.log('Add')}
      onExport={(selected) => console.log('Export', selected)}
      onDelete={(selected) => console.log('Delete', selected)}
      pagination
      paginationPageSize={20}
    />
  );
}
```

## API Reference

### Core Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `columnDefs` | `ColDef[]` | Yes | Column definitions |
| `rowData` | `T[]` | Yes | Data array |
| `rowModelType` | `'clientSide' \| 'infinite'` | No | Data loading mode (default: `'clientSide'`) |
| `pagination` | `boolean` | No | Enable pagination (default: `true`) |
| `paginationPageSize` | `number` | No | Rows per page (default: `20`) |

### Action Handlers

| Prop | Type | Description |
|------|------|-------------|
| `onAdd` | `() => void` | Add button click handler |
| `onExport` | `(rows: T[]) => void` | Export selected rows handler |
| `onDelete` | `(rows: T[]) => void` | Delete selected rows handler |
| `onFetchData` | `(start: number, end: number) => Promise<{data: T[], totalCount: number}>` | Infinite scroll data fetcher |

### Customization

| Prop | Type | Description |
|------|------|-------------|
| `getRowActions` | `(row: T) => DataTableRowAction<T>[]` | Custom row action menu items |
| `contextMenuItems` | `DataTableContextMenuItem[]` | Custom context menu items |
| `showActionToolbar` | `boolean` | Show/hide action toolbar (default: `true`) |
| `className` | `string` | Custom CSS class |
| `domLayout` | `'normal' \| 'autoHeight' \| 'print'` | AG Grid layout mode |

## Advanced Usage

### Infinite Scroll

```tsx
<Ad99DataTable
  rowModelType="infinite"
  onFetchData={async (startRow, endRow) => {
    const response = await fetch(`/api/data?start=${startRow}&end=${endRow}`);
    const { data, total } = await response.json();
    return { data, totalCount: total };
  }}
  columnDefs={columnDefs}
/>
```

### Custom Row Actions

```tsx
const getRowActions = (row: any) => [
  { key: 'edit', label: 'Edit', onClick: () => handleEdit(row) },
  { key: 'duplicate', label: 'Duplicate', onClick: () => handleDuplicate(row) },
  { key: 'delete', label: 'Delete', color: 'danger', onClick: () => handleDelete(row) },
];

<Ad99DataTable getRowActions={getRowActions} {...otherProps} />
```

### Custom Context Menu

```tsx
const contextMenuItems = [
  { key: 'copy', label: 'Copy', shortcut: 'Ctrl+C', action: handleCopy },
  { key: 'paste', label: 'Paste', shortcut: 'Ctrl+V', action: handlePaste },
];

<Ad99DataTable contextMenuItems={contextMenuItems} {...otherProps} />
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build library
npm run build

# Run validation
npm run validate
```

## Publishing

### NPM Registry

```bash
npm run deploy:patch  # 1.0.0 → 1.0.1
npm run deploy:minor  # 1.0.0 → 1.1.0
npm run deploy:major  # 1.0.0 → 2.0.0
```

### GitHub Packages

```bash
npm run deploy:github:patch
npm run deploy:github:minor
npm run deploy:github:major
```

### Local Installation

```bash
npm pack
# Install in another project
npm install ../ad99-ag-grid-table-1.0.0.tgz
```

## Tech Stack

- React 19
- TypeScript 5
- AG Grid 34
- Material UI Joy
- Vite 5

## License

MIT © [anhdev99](https://github.com/anhdev99)
