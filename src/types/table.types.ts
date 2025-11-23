import { ColDef } from 'ag-grid-community';

export interface TableToolbarProps {
  onSearch?: (value: string) => void;
  onRefresh?: () => void;
  onAdvancedSearch?: () => void;
  searchPlaceholder?: string;
  showFilter?: boolean;
  showRefresh?: boolean;
  showAdvancedSearch?: boolean;
}

export interface DataTableProps<T = any> {
  columnDefs: ColDef[];
  rowData: T[];
  onSearch?: (value: string) => void;
  onRefresh?: () => void;
  onAdvancedSearch?: () => void;
  searchPlaceholder?: string;
  showToolbar?: boolean;
  showFilter?: boolean;
  showRefresh?: boolean;
  showAdvancedSearch?: boolean;
  pagination?: boolean;
  paginationPageSize?: number;
  domLayout?: 'normal' | 'autoHeight' | 'print';
  className?: string;
  rowModelType?: 'clientSide' | 'infinite';
  onFetchData?: (startRow: number, endRow: number) => Promise<{ data: T[], totalCount: number }>;
  // Action toolbar handlers
  onAdd?: () => void;
  onExport?: () => void;
  onDelete?: () => void;
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
