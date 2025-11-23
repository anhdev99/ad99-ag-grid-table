import { ColDef } from 'ag-grid-community';

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
