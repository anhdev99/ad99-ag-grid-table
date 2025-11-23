import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { AgGridReact } from 'ag-grid-react';
import { Panel } from 'rsuite';
import TableToolbar from './TableToolbar';
import { DataTableProps } from '../types/table.types';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import './DataTable.css';

function DataTable<T = any>({
  columnDefs,
  rowData,
  onSearch,
  onRefresh,
  onAdvancedSearch,
  searchPlaceholder = 'Nhập từ khóa tìm kiếm',
  showToolbar = true,
  showFilter = true,
  showRefresh = true,
  showAdvancedSearch = true,
  pagination = true,
  paginationPageSize = 20,
  domLayout = 'autoHeight',
  className = '',
  rowModelType = 'clientSide',
  onFetchData,
}: DataTableProps<T>) {
  const [filteredData, setFilteredData] = useState<T[]>(rowData);
  const [initialLoading, setInitialLoading] = useState(rowModelType === 'infinite');
  const firstLoadRef = useRef(rowModelType === 'infinite');

  // Reset first load marker when switching model type
  useEffect(() => {
    if (rowModelType === 'infinite') {
      firstLoadRef.current = true;
      setInitialLoading(true);
    } else {
      firstLoadRef.current = false;
      setInitialLoading(false);
    }
  }, [rowModelType]);

  // Sync filteredData when rowData changes
  useEffect(() => {
    setFilteredData(rowData);
  }, [rowData]);

  // Default grid options
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  // Handle search from toolbar
  const handleSearch = useCallback((searchValue: string) => {
    if (!searchValue) {
      setFilteredData(rowData);
      if (onSearch) onSearch(searchValue);
      return;
    }

    const filtered = rowData.filter((row: any) => {
      return Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchValue.toLowerCase())
      );
    });
    
    setFilteredData(filtered);
    if (onSearch) onSearch(searchValue);
  }, [rowData, onSearch]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setFilteredData(rowData);
    if (onRefresh) onRefresh();
  }, [rowData, onRefresh]);

  // Inject custom loading cell renderer for first two technical columns (checkbox + index)
  const processedColumnDefs = useMemo(() => {
    if (rowModelType !== 'infinite') return columnDefs;
    return columnDefs.map((col: any, idx: number) => {
      // Keep checkbox column as-is; we will hide its content when row not loaded
      if (idx === 0) {
        return {
          ...col,
          cellRenderer: (params: any) => {
            if (!params.data) return null; // empty during loading
            return null; // default checkbox rendering
          },
        };
      }
      // Use index column (second) to span across all remaining columns and show loading text
      if (idx === 1) {
        return {
          ...col,
          cellRenderer: (params: any) => {
            if (!params.data) {
              return (
                <div className="dt-loading-full-cell" role="status" aria-label="Đang tải dữ liệu">
                  <ClipLoader size={16} color="#1890ff" speedMultiplier={0.9} />
                  <span style={{ marginLeft: 6 }}>Đang tải...</span>
                </div>
              );
            }
            // Preserve original index value
            return params.value;
          },
          colSpan: (params: any) => (!params.data ? columnDefs.length - 1 : 1), // span all remaining columns except checkbox
          valueGetter: col.valueGetter,
        };
      }
      // Other columns: when loading placeholders, return null so spanned cell covers them
      return {
        ...col,
        cellRenderer: (params: any) => {
          if (!params.data) return null;
          // Default rendering when data loaded
          return params.value;
        },
      };
    });
  }, [columnDefs, rowModelType]);

  return (
    <Panel 
      bordered 
      className={`data-table-container ${className}`}
      bodyFill
    >
      {showToolbar && (
        <TableToolbar
          onSearch={handleSearch}
          onRefresh={handleRefresh}
          onAdvancedSearch={onAdvancedSearch}
          searchPlaceholder={searchPlaceholder}
          showFilter={showFilter}
          showRefresh={showRefresh}
          showAdvancedSearch={showAdvancedSearch}
        />
      )}
      
      <div className={`ag-theme-balham data-table-grid ${rowModelType === 'infinite' && initialLoading ? 'dt-grid-collapsed' : ''}`}> 
        <AgGridReact
          columnDefs={processedColumnDefs}
          rowData={rowModelType === 'clientSide' ? filteredData : undefined}
          defaultColDef={defaultColDef}
          pagination={rowModelType === 'clientSide' ? pagination : false}
          paginationPageSize={paginationPageSize}
          domLayout={domLayout}
          rowSelection="multiple"
          animateRows={true}
          suppressRowClickSelection={true}
          rowModelType={rowModelType}
          datasource={rowModelType === 'infinite' ? {
            getRows: async (params) => {
              // Only show overlay for the very first request
              if (firstLoadRef.current) {
                setInitialLoading(true);
              }
              const startRow = params.startRow || 0;
              const endRow = params.endRow || 100;
              try {
                if (onFetchData) {
                  const result = await onFetchData(startRow, endRow);
                  params.successCallback(result.data, result.totalCount);
                } else {
                  const rowsThisPage = filteredData.slice(startRow, endRow);
                  const lastRow = filteredData.length;
                  params.successCallback(rowsThisPage, lastRow);
                }
              } catch (error) {
                console.error('Error fetching data:', error);
                params.failCallback();
              } finally {
                if (firstLoadRef.current) {
                  firstLoadRef.current = false;
                  setInitialLoading(false);
                }
              }
            }
          } : undefined}
          cacheBlockSize={100}
          cacheOverflowSize={2}
          maxConcurrentDatasourceRequests={1}
          /* Tăng số hàng giả ban đầu để tránh màn hình trắng khi đang tải nhanh */
          infiniteInitialRowCount={20}
          maxBlocksInCache={10}
          suppressLoadingOverlay={true}
          /* Keep built-in loading for non-custom columns; could be enhanced further */
          loadingCellRendererParams={{ loadingMessage: 'Đang tải...' }}
        />
        {rowModelType === 'infinite' && initialLoading && (
          <div className="dt-loading-overlay" role="status" aria-live="polite">
            <ClipLoader size={42} color="#1890ff" speedMultiplier={1} />
            <p>Đang tải dữ liệu...</p>
            <div className="dt-skeleton-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="dt-skeleton-full-row" />
              ))}
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}

export default DataTable;
