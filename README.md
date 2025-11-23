# Reusable AG-Grid Table Component

Component table có thể tái sử dụng được xây dựng với React, RSuite và AG-Grid.

## 🎯 Tính năng

- ✅ Component DataTable có thể tái sử dụng
- ✅ Hỗ trợ TypeScript đầy đủ
- ✅ Responsive design
- ✅ Pagination tích hợp
- ✅ Column sorting & filtering
- ✅ Row selection (single/multiple)
- ✅ Custom cell renderers
- ✅ Icon support

## 📦 Cài đặt

```bash
npm install
```

## 🚀 Chạy ứng dụng

```bash
npm run dev
```

## 📖 Cách sử dụng

### 1. Import component

```tsx
import { DataTable } from './components';
import { ColDef } from 'ag-grid-community';
import 'rsuite/dist/rsuite.min.css';
```

### 2. Define column definitions

```tsx
const columnDefs: ColDef[] = [
  {
    headerName: 'Tên',
    field: 'name',
    flex: 1,
  },
  {
    headerName: 'Mã',
    field: 'code',
    flex: 1,
  },
  // ... thêm columns
];
```

### 3. Sử dụng DataTable component

```tsx
<DataTable
  columnDefs={columnDefs}
  rowData={data}
  pagination={true}
  paginationPageSize={20}
/>
```

## 🎨 Tùy chỉnh

### DataTable Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `columnDefs` | `ColDef[]` | required | Định nghĩa các cột |
| `rowData` | `T[]` | required | Dữ liệu hiển thị |
| `pagination` | `boolean` | `true` | Enable pagination |
| `paginationPageSize` | `number` | `20` | Số rows mỗi page |
| `domLayout` | `'normal' \| 'autoHeight' \| 'print'` | `'autoHeight'` | Chế độ layout của AG Grid |
| `className` | `string` | `''` | Custom CSS class |
| `rowModelType` | `'clientSide' \| 'infinite'` | `'clientSide'` | Chế độ load dữ liệu |
| `onFetchData` | `(startRow: number, endRow: number) => Promise<{ data: T[]; totalCount: number }>` | - | Callback fetch data khi chạy infinite scroll |
| `onAdd` | `() => void` | - | Callback cho nút thêm ở action toolbar (pinned row) |
| `onExport` | `() => void` | - | Callback cho nút export ở action toolbar |
| `onDelete` | `() => void` | - | Callback cho nút xóa ở action toolbar |
| `showActionToolbar` | `boolean` | `true` | Hiển thị hàng pinned với các nút hành động |

### Custom Cell Renderers

```tsx
const CustomCellRenderer = (params: any) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span>{params.value}</span>
    </div>
  );
};

const columnDefs: ColDef[] = [
  {
    headerName: 'Name',
    field: 'name',
    cellRenderer: CustomCellRenderer,
  },
];
```

## 📁 Cấu trúc thư mục

```
src/
├── components/
│   ├── DataTable.tsx          # Main table component
│   ├── DataTable.css
│   └── index.ts
├── types/
│   └── table.types.ts         # TypeScript types
├── examples/
│   └── RemoteEntriesExample.tsx  # Example usage
├── main.tsx
└── index.css
```

## 🔧 Công nghệ sử dụng

- **React 18** - UI library
- **TypeScript** - Type safety
- **AG-Grid** - Advanced data grid
- **RSuite** - UI component library
- **Vite** - Build tool

## 📝 Ví dụ

Xem file `src/examples/RemoteEntriesExample.tsx` để biết cách sử dụng chi tiết.

## 🤝 Đóng góp

Feel free to submit issues and enhancement requests!

## 📄 License

MIT
