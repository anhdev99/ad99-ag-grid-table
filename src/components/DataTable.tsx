import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { AgGridReact } from 'ag-grid-react';
import { Sheet, IconButton, Box, Menu, MenuItem, Dropdown, MenuButton, ListItemDecorator, Tooltip } from '@mui/joy';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
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
  onAdd,
  onExport,
  onDelete,
  showActionToolbar = true,
}: DataTableProps<T>) {
  const [filteredData, setFilteredData] = useState<T[]>(rowData);
  const [initialLoading, setInitialLoading] = useState(rowModelType === 'infinite');
  const firstLoadRef = useRef(rowModelType === 'infinite');
  const gridApiRef = useRef<any>(null);
  // Store callbacks in refs to avoid triggering processedColumnDefs changes
  const callbacksRef = useRef({ onAdd, onExport, onDelete });

  // Keep refs in sync
  useEffect(() => {
    callbacksRef.current = { onAdd, onExport, onDelete };
  }, [onAdd, onExport, onDelete]);

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

  // Custom header component using AG Grid events (no polling)
  const HeaderSelectAllComponent = useCallback((props: any) => {
    const { api } = props;
    const [selectionInfo, setSelectionInfo] = useState(() => ({ total: 0, selected: 0 }));

    const recomputeSelection = useCallback(() => {
      let total = 0;
      let selected = 0;

      if (rowModelType === 'clientSide') {
        api.forEachNodeAfterFilterAndSort((node: any) => {
          if (node.rowPinned === 'top' || !node.data) return;
          total += 1;
          if (node.isSelected()) selected += 1;
        });
      } else {
        api.forEachNode((node: any) => {
          if (node.rowPinned === 'top' || !node.data) return;
          total += 1;
          if (node.isSelected()) selected += 1;
        });
      }

      setSelectionInfo((prev) => (prev.total === total && prev.selected === selected) ? prev : { total, selected });
    }, [api, rowModelType]);

    useEffect(() => {
      const events = ['selectionChanged', 'rowDataUpdated', 'modelUpdated', 'filterChanged'];
      recomputeSelection();
      events.forEach(event => api.addEventListener(event, recomputeSelection));
      return () => {
        events.forEach(event => api.removeEventListener(event, recomputeSelection));
      };
    }, [api, recomputeSelection]);

    const { total, selected } = selectionInfo;
    const isAllSelected = total > 0 && selected === total;
    const indeterminate = !isAllSelected && selected > 0 && selected < total;

    const toggleSelectAll = () => {
      if (rowModelType === 'clientSide') {
        api.forEachNodeAfterFilterAndSort((node: any) => {
          if (node.rowPinned === 'top' || !node.data) return;
          node.setSelected(!isAllSelected);
        });
      } else {
        api.forEachNode((node: any) => {
          if (node.rowPinned === 'top' || !node.data) return;
          node.setSelected(!isAllSelected);
        });
      }
    };

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <div
          className="ag-selection-checkbox dt-header-checkbox"
          role="checkbox"
          aria-checked={isAllSelected}
          aria-label={isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
          onClick={toggleSelectAll}
          style={{ cursor: 'pointer' }}
        >
          <span
            className={`ag-icon ${
              isAllSelected
                ? 'ag-icon-checkbox-checked'
                : indeterminate
                  ? 'ag-icon-checkbox-indeterminate'
                  : 'ag-icon-checkbox-unchecked'
            }`}
          />
        </div>
      </Box>
    );
  }, [rowModelType]);

  // Sync filteredData when rowData changes
  useEffect(() => {
    setFilteredData(rowData);
  }, [rowData]);

  // Default grid options
  const defaultColDef = useMemo(() => ({
    sortable: false,
    filter: false,
    suppressMenu: true,
    suppressHeaderMenuButton: true,
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

  // Memoize datasource to prevent re-creation on every render
  const datasource = useMemo(() => {
    if (rowModelType !== 'infinite') return undefined;
    
    return {
      getRows: async (params: any) => {
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
    };
  }, [rowModelType, onFetchData, filteredData]);

  // Inject custom loading cell renderer + action toolbar for first two technical columns
  const processedColumnDefs = useMemo(() => {
    console.log('🔄 processedColumnDefs recalculated');
    return columnDefs.map((col: any, idx: number) => {
      // Apply fixed narrow width to first two columns in all modes
      const baseCol: any = {
        ...col,
        sortable: false,
        filter: false,
        suppressMenu: true,
        suppressHeaderMenuButton: true,
      };
      if (idx === 0 || idx === 1) {
        baseCol.width = 40;
        baseCol.minWidth = 40;
        baseCol.maxWidth = 40;
        baseCol.resizable = false;
      }
      if (rowModelType === 'infinite' && idx === 1 && baseCol.headerCheckboxSelection) {
        delete baseCol.headerCheckboxSelection;
      }
      // If not infinite model, only return width-adjusted columns (no special loading/pinned logic)
      if (rowModelType !== 'infinite') {
        return baseCol;
      }
      // First column: Action menu OR add button for action toolbar row
      if (idx === 0) {
        return {
          ...baseCol,
          cellRenderer: (params: any) => {
            // Action toolbar row - show Add button
            if (params.node.rowPinned === 'top' && showActionToolbar) {
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <IconButton size="sm" variant="plain" color="primary" onClick={() => callbacksRef.current.onAdd?.()}>
                    <AddRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>
              );
            }
            if (!params.data) {
              return (
                <div className="dt-loading-full-cell dt-loading-merged-left" role="status" aria-label="Đang tải dữ liệu">
                  <ClipLoader size={16} color="#1890ff" speedMultiplier={0.9} />
                  <span style={{ marginLeft: 6 }}>Đang tải...</span>
                </div>
              );
            }
            // Regular row - show action menu
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Dropdown>
                  <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{ root: { size: 'sm', variant: 'plain', color: 'neutral' } }}
                  >
                    <MoreHorizIcon sx={{ fontSize: 18 }} />
                  </MenuButton>
                  <Menu
                    size="sm"
                    placement="bottom-start"
                    className="dt-row-menu"
                    sx={{ minWidth: 170, py: 0.5 }}
                  >
                    <MenuItem sx={{ gap: 1.25, py: 0.75 }}>
                      <ListItemDecorator sx={{ color: 'neutral.plainColor' }}>
                        <EditRoundedIcon fontSize="small" />
                      </ListItemDecorator>
                      Chỉnh sửa
                    </MenuItem>
                    <MenuItem sx={{ gap: 1.25, py: 0.75 }}>
                      <ListItemDecorator sx={{ color: 'neutral.plainColor' }}>
                        <ContentCopyRoundedIcon fontSize="small" />
                      </ListItemDecorator>
                      Sao chép
                    </MenuItem>
                    <MenuItem color="danger" sx={{ gap: 1.25, py: 0.75 }}>
                      <ListItemDecorator sx={{ color: 'danger.plainColor' }}>
                        <DeleteRoundedIcon fontSize="small" />
                      </ListItemDecorator>
                      Xóa
                    </MenuItem>
                  </Menu>
                </Dropdown>
              </Box>
            );
          },
          colSpan: (params: any) => {
            if (!params.data) return columnDefs.length; // merge all columns on loading rows
            return 1;
          },
        };
      }
      // Second column (checkbox)
      if (idx === 1) {
        return {
          ...baseCol,
          headerComponent: HeaderSelectAllComponent,
          headerClass: 'dt-center-checkbox-header',
          checkboxSelection: (params: any) => {
            if (params.node.rowPinned === 'top') return false;
            if (!params.data) return false;
            return true;
          },
          cellRenderer: (params: any) => {
            if (params.node.rowPinned === 'top' && showActionToolbar) {
              return (
                <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center', justifyContent: 'flex-start', px: 1.25, height: '100%', width: '100%' }}>
                  <IconButton size="sm" variant="plain" color="neutral" onClick={() => callbacksRef.current.onExport?.()}>
                    <FileDownloadRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                  <IconButton size="sm" variant="plain" color="danger" onClick={() => callbacksRef.current.onDelete?.()}>
                    <DeleteRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              );
            }
            if (!params.data) {
              return null; // loading placeholder handled by first column merged cell
            }
            return null; // allow built-in checkbox
          },
          colSpan: (params: any) => {
            if (params.node.rowPinned === 'top' && showActionToolbar) return columnDefs.length - 1;
            if (!params.data) return 1; // first column already spans everything
            return 1;
          },
          cellClass: (params: any) => {
            if (params.node.rowPinned === 'top') return 'dt-action-toolbar-cell';
            if (!params.data) return 'dt-loading-align-left';
            return 'dt-center-checkbox';
          }
        };
      }
      // Other columns (idx > 1): when loading placeholders or pinned, return null
      return {
        ...baseCol,
        cellRenderer: (params: any) => {
          if (params.node.rowPinned === 'top') return null; // Hide in action toolbar row
          if (!params.data) return null; // Hide during loading
          // Default rendering when data loaded
          return params.value;
        },
      };
    });
  }, [columnDefs, rowModelType, showActionToolbar]);

  return (
    <Sheet 
      variant="outlined"
      className={`data-table-container ${className}`}
      sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}
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
          pinnedTopRowData={showActionToolbar ? [{ __actionToolbar: true }] : undefined}
          defaultColDef={defaultColDef}
          pagination={rowModelType === 'clientSide' ? pagination : false}
          paginationPageSize={paginationPageSize}
          domLayout={domLayout}
          rowSelection="multiple"
          animateRows={true}
          suppressRowClickSelection={true}
          rowModelType={rowModelType}
          onGridReady={({ api }) => { gridApiRef.current = api; }}
          // No external selection tracking needed; header listens to events
          datasource={datasource}
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
    </Sheet>
  );
}

export default DataTable;
