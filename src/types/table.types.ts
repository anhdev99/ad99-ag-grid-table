import { ColDef } from 'ag-grid-community';
import { ReactNode } from 'react';

export interface DataTableContextMenuItem {
  key: string;
  label: string;
  shortcut?: string;
  icon?: ReactNode;
  action: () => void;
}

export interface DataTableRowAction<T = any> {
  key: string;
  label: string;
  icon?: ReactNode;
  color?: 'primary' | 'neutral' | 'danger';
  onClick?: (rowData: T) => void;
}

export interface DataTableProps<T = any> {
  columnDefs: ColDef[];
  rowData: T[];
  pagination?: boolean;
  paginationPageSize?: number;
  domLayout?: 'normal' | 'autoHeight' | 'print';
  className?: string;
  rowModelType?: 'clientSide' | 'infinite';
  onFetchData?: (startRow: number, endRow: number) => Promise<{ data: T[], totalCount: number }>;
  // Action toolbar handlers
  onAdd?: () => void;
  onExport?: (selectedRows: T[]) => void;
  onDelete?: (selectedRows: T[]) => void;
  showActionToolbar?: boolean;
  contextMenuItems?: DataTableContextMenuItem[];
  getRowActions?: (rowData: T) => DataTableRowAction<T>[];
}

export interface RemoteEntry {
  id: string;
  name: string;
  code: string;
  remoteEntry: string;
  baseUrl: string;
  version: string;
  status?: string;
  created?: string;
  icon?: string;
  [key: string]: any;
}
