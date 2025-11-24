# ad99-ag-grid

Bảng dữ liệu tái sử dụng xây dựng trên React + AG Grid, thêm action toolbar và menu tùy chỉnh. Đã đóng gói dạng library để dự án khác có thể `npm install` hoặc `npm pack` để dùng nội bộ.

## 🎯 Tính năng chính

- Action toolbar (Thêm / Xuất / Xóa) trên hàng pinned đầu
- Row action menu có thể truyền từ ngoài (getRowActions)
- Context menu chuột phải: Sao chép / Sao chép kèm tiêu đề (hoặc tự cấu hình)
- Hỗ trợ clientSide và infinite scroll, hiển thị loading row khi fetch
- Pagination, multi-select, custom cell renderer, TypeScript ready

## 🚀 Cài đặt & chạy (dev)

```bash
npm install
npm run dev
```

## 📦 Dùng trong dự án khác

```bash
npm install ad99-ag-grid-table \
  ag-grid-community ag-grid-react \
  @mui/joy @mui/icons-material \
  react-spinners @emotion/react @emotion/styled
```

```ts
import 'ad99-ag-grid-table/style.css';
```

Build & đóng gói phát hành nội bộ:
1. `npm run build` → tạo `dist/index.mjs`, `dist/index.cjs`, `dist/style.css`, `dist/types`.
2. `npm pack` → sinh file `.tgz` để dự án khác `npm install ../ad99-ag-grid-table-1.0.0.tgz`.
   (Hoặc `npm publish` nếu muốn đưa lên npm registry của bạn.)

## 📖 Sử dụng nhanh

```tsx
import { Ad99DataTable } from 'ad99-ag-grid-table';
import 'ad99-ag-grid-table/style.css';
import { ColDef } from 'ag-grid-community';

const columnDefs: ColDef[] = [
  { headerName: '', width: 60 },
  { headerName: '', width: 50, checkboxSelection: true, headerCheckboxSelection: true },
  { headerName: 'Tên', field: 'name', flex: 1 },
  { headerName: 'Mã', field: 'code', flex: 1 },
];

const rowActions = (row: any) => [
  { key: 'edit', label: 'Chỉnh sửa', onClick: () => console.log('Edit', row) },
  { key: 'copy', label: 'Sao chép', onClick: () => console.log('Copy', row) },
  { key: 'delete', label: 'Xóa', color: 'danger', onClick: () => console.log('Delete', row) },
];

<Ad99DataTable
  columnDefs={columnDefs}
  rowData={data}
  onAdd={() => console.log('Add')}
  onExport={(selected) => console.log('Export', selected)}
  onDelete={(selected) => console.log('Delete', selected)}
  getRowActions={rowActions}
  contextMenuItems={[
    { key: 'copy', label: 'Sao chép', shortcut: 'Ctrl+C', action: () => console.log('Copy') },
    { key: 'copyHeaders', label: 'Sao chép kèm tiêu đề', action: () => console.log('Copy headers') },
  ]}
  pagination
  paginationPageSize={20}
  rowModelType="clientSide"
/>;
```

## ⚙️ DataTable Props

| Prop | Type | Default | Mô tả |
| --- | --- | --- | --- |
| `columnDefs` | `ColDef[]` | required | Định nghĩa cột |
| `rowData` | `T[]` | required | Dữ liệu hiển thị |
| `pagination` | `boolean` | `true` | Bật/tắt pagination (clientSide) |
| `paginationPageSize` | `number` | `20` | Số dòng mỗi trang |
| `domLayout` | `'normal' \| 'autoHeight' \| 'print'` | `'autoHeight'` | Layout AG Grid |
| `className` | `string` | `''` | CSS class tùy chỉnh |
| `rowModelType` | `'clientSide' \| 'infinite'` | `'clientSide'` | Chế độ load dữ liệu |
| `onFetchData` | `(startRow, endRow) => Promise<{ data: T[]; totalCount: number }>` | - | Fetch dữ liệu khi dùng infinite scroll |
| `onAdd` | `() => void` | - | Click nút Thêm (pinned row) |
| `onExport` | `(selectedRows: T[]) => void` | - | Click nút Xuất, nhận danh sách dòng đang chọn |
| `onDelete` | `(selectedRows: T[]) => void` | - | Click nút Xóa, nhận danh sách dòng đang chọn |
| `showActionToolbar` | `boolean` | `true` | Hiển thị hàng hành động pinned |
| `contextMenuItems` | `DataTableContextMenuItem[]` | copy & copyWithHeaders | Menu chuột phải tùy chỉnh |
| `getRowActions` | `(row: T) => DataTableRowAction<T>[]` | preset Edit/Copy/Delete | Tùy biến menu hành động trên từng dòng |

## 📁 Cấu trúc

```
src/
├── components/
│   ├── DataTable.tsx
│   ├── DataTable.css
│   └── index.ts
├── types/
│   └── table.types.ts
├── examples/
│   └── RemoteEntriesExample.tsx
├── main.tsx
└── index.css
```

## 🧪 Demo

Xem `src/examples/RemoteEntriesExample.tsx` để thấy cấu hình đầy đủ (infinite scroll, row actions, context menu).

## 🔧 Tech

React 18, TypeScript, AG Grid, Vite.
