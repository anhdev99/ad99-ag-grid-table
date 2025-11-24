import { useState, useMemo, useCallback, useEffect, useRef, memo } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { AgGridReact } from 'ag-grid-react';
import { Sheet, IconButton, Box, Menu, MenuItem, Dropdown, MenuButton, ListItemDecorator } from '@mui/joy';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { DataTableContextMenuItem, DataTableProps, DataTableRowAction } from '../types/table.types';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import './DataTable.css';

const Ad99DataTable = memo(function Ad99DataTable<T = any>({
  columnDefs,
  rowData,
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
  toolbarConfig,
  contextMenuItems,
  getRowActions,
}: DataTableProps<T>) {
  const gridApiRef = useRef<any>(null);
  const selectedCountRef = useRef(0);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [lastCellContext, setLastCellContext] = useState<any>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const preventBrowserContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);
  
  // Merge toolbar config with defaults
  const effectiveToolbarConfig = useMemo(() => ({
    showAdd: toolbarConfig?.showAdd ?? true,
    showExport: toolbarConfig?.showExport ?? true,
    showDelete: toolbarConfig?.showDelete ?? true,
    customActions: toolbarConfig?.customActions ?? [],
  }), [toolbarConfig]);
  
  // Store callbacks in refs to avoid triggering processedColumnDefs changes
  const callbacksRef = useRef<{
    onAdd?: DataTableProps<T>['onAdd'];
    onExport?: DataTableProps<T>['onExport'];
    onDelete?: DataTableProps<T>['onDelete'];
  }>({ onAdd, onExport, onDelete });

  const rowSelectionOptions = useMemo(() => ({
    mode: 'multiRow' as const,
    checkboxes: (params: any) => !!params.data && params.node?.rowPinned !== 'top',
    headerCheckbox: true,
    selectAll: 'currentPage' as const,
    enableClickSelection: false,
  }), []);

  // Keep refs in sync
  useEffect(() => {
    callbacksRef.current = { onAdd, onExport, onDelete };
  }, [onAdd, onExport, onDelete]);

  // Custom header checkbox to support infinite row model - memoized
  const HeaderSelectAllComponent = memo((props: any) => {
    const { api } = props;
    const [selectionInfo, setSelectionInfo] = useState(() => ({ total: 0, selected: 0 }));
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const recomputeSelection = useCallback(() => {
      // Debounce để tránh tính toán quá nhiều lần
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      timerRef.current = setTimeout(() => {
        let total = 0;
        let selected = 0;

        api.forEachNode((node: any) => {
          if (node.rowPinned === 'top' || !node.data) return;
          total += 1;
          if (node.isSelected()) selected += 1;
        });

        setSelectionInfo((prev) => (prev.total === total && prev.selected === selected) ? prev : { total, selected });
      }, 50);
    }, [api]);

    useEffect(() => {
      const events = ['selectionChanged', 'rowDataUpdated', 'modelUpdated'];
      recomputeSelection();
      events.forEach(event => api.addEventListener(event, recomputeSelection));
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        events.forEach(event => api.removeEventListener(event, recomputeSelection));
      };
    }, [api, recomputeSelection]);

    const { total, selected } = selectionInfo;
    const isAllSelected = total > 0 && selected === total;
    const indeterminate = !isAllSelected && selected > 0 && selected < total;

    const toggleSelectAll = useCallback(() => {
      const shouldSelect = !isAllSelected;
      api.forEachNode((node: any) => {
        if (node.rowPinned === 'top' || !node.data) return;
        node.setSelected(shouldSelect);
      });
    }, [api, isAllSelected]);

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
  });

  // Default grid options
  const defaultColDef = useMemo(() => ({
    sortable: false,
    filter: false,
    suppressHeaderMenuButton: true,
    resizable: true,
  }), []);

  // Memoize datasource to prevent re-creation on every render
  const datasource = useMemo(() => {
    if (rowModelType !== 'infinite') return undefined;
    
    return {
      getRows: async (params: any) => {
        const startRow = params.startRow || 0;
        const endRow = params.endRow || 100;
        try {
          if (onFetchData) {
            const result = await onFetchData(startRow, endRow);
            params.successCallback(result.data, result.totalCount);
          } else {
            const rowsThisPage = rowData.slice(startRow, endRow);
            const lastRow = rowData.length;
            params.successCallback(rowsThisPage, lastRow);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          params.failCallback();
        }
      },
      rowCount: undefined
    };
  }, [rowModelType, onFetchData, rowData]);

  const getSelectedRows = useCallback((): T[] => {
    if (!gridApiRef.current?.getSelectedRows) return [];
    return gridApiRef.current.getSelectedRows() as T[];
  }, []);

  const handleExportClick = useCallback(() => {
    const selectedRows = getSelectedRows();
    callbacksRef.current.onExport?.(selectedRows);
  }, [getSelectedRows]);

  const handleDeleteClick = useCallback(() => {
    const selectedRows = getSelectedRows();
    callbacksRef.current.onDelete?.(selectedRows);
  }, [getSelectedRows]);

  const handleCellContextMenu = useCallback((cellEvent: any) => {
    const mouseEvent = cellEvent?.event;
    if (mouseEvent?.preventDefault) {
      mouseEvent.preventDefault();
      setLastCellContext(cellEvent);
      setContextMenu({ x: mouseEvent.clientX, y: mouseEvent.clientY });
    }
  }, []);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  const copyTextToClipboard = useCallback((text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        // fallback below
      });
      return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }, []);

  const copyRows = useCallback((includeHeaders = false) => {
    const api = gridApiRef.current;
    const selected = getSelectedRows();
    if (api?.copySelectedRowsToClipboard) {
      if (selected.length > 0) {
        api.copySelectedRowsToClipboard({ includeHeaders });
        return;
      }
    }

    if (lastCellContext) {
      const headerText =
        includeHeaders
          ? lastCellContext.colDef?.headerName
            ?? lastCellContext.column?.getColId?.()
            ?? ''
          : '';
      const cellText = lastCellContext.value ?? '';
      const text = includeHeaders ? `${headerText}\n${cellText}` : String(cellText);
      copyTextToClipboard(text);
    }
  }, [getSelectedRows, lastCellContext, copyTextToClipboard]);

  const defaultContextMenuItems: DataTableContextMenuItem[] = useMemo(() => ([
    { key: 'copy', label: 'Sao chép', shortcut: 'Ctrl+C', icon: <ContentCopyRoundedIcon fontSize="small" />, action: () => copyRows(false) },
    { key: 'copyHeaders', label: 'Sao chép kèm tiêu đề', shortcut: '', icon: <ContentCopyRoundedIcon fontSize="small" />, action: () => copyRows(true) },
  ]), [copyRows]);

  const effectiveContextMenuItems = useMemo(
    () => contextMenuItems ?? defaultContextMenuItems,
    [contextMenuItems, defaultContextMenuItems]
  );

  const selectionChangeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const handleSelectionChanged = useCallback(() => {
    // Throttle để tránh refresh quá nhiều
    if (selectionChangeTimerRef.current) return;
    
    selectionChangeTimerRef.current = setTimeout(() => {
      const nextCount = getSelectedRows().length;
      if (selectedCountRef.current !== nextCount) {
        selectedCountRef.current = nextCount;
        gridApiRef.current?.refreshCells({
          columns: ['action-menu'],
          force: false,
          suppressFlash: true,
        });
      }
      selectionChangeTimerRef.current = null;
    }, 100);
  }, [getSelectedRows]);

  useEffect(() => {
    if (!contextMenu) return;
    const handleGlobalClick = (e: MouseEvent) => {
      if (contextMenuRef.current && contextMenuRef.current.contains(e.target as Node)) return;
      setContextMenu(null);
    };
    window.addEventListener('mousedown', handleGlobalClick);
    window.addEventListener('scroll', closeContextMenu, true);
    return () => {
      window.removeEventListener('mousedown', handleGlobalClick);
      window.removeEventListener('scroll', closeContextMenu, true);
    };
  }, [contextMenu, closeContextMenu]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (selectionChangeTimerRef.current) {
        clearTimeout(selectionChangeTimerRef.current);
      }
    };
  }, []);

  // Inject custom action column and loading behavior
  const processedColumnDefs = useMemo(() => {
    const totalColumns = columnDefs.length + 2; // +1 action column, +1 selection column added by grid

    const actionColumn: any = {
      colId: 'action-menu',
      headerName: '',
      width: 40,
      minWidth: 40,
      maxWidth: 40,
      resizable: false,
      cellClass: 'dt-first-col',
      suppressHeaderMenuButton: true,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        // Action toolbar row - show Add/Export/Delete together
        if (params.node.rowPinned === 'top' && showActionToolbar) {
          const selectedRows = getSelectedRows();
          return (
            <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center', justifyContent: 'flex-start', px: 0.5, height: '100%', width: '100%' }}>
              {effectiveToolbarConfig.showExport && (
                <IconButton size="sm" variant="plain" color="neutral" onClick={handleExportClick}>
                  <FileDownloadRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              )}
              {effectiveToolbarConfig.showDelete && (
                <IconButton
                  size="sm"
                  variant="plain"
                  color="danger"
                  onClick={handleDeleteClick}
                  disabled={selectedCountRef.current === 0}
                >
                  <DeleteRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              )}
              {effectiveToolbarConfig.customActions?.map((action) => (
                <IconButton
                  key={action.key}
                  size="sm"
                  variant={action.variant ?? 'plain'}
                  color={action.color ?? 'neutral'}
                  onClick={() => action.onClick?.(selectedRows)}
                  disabled={action.disabled?.(selectedRows) ?? false}
                  title={action.tooltip}
                >
                  {action.icon}
                </IconButton>
              ))}
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
                {(getRowActions?.(params.data) ?? ([
                  { key: 'edit', label: 'Chỉnh sửa', icon: <EditRoundedIcon fontSize="small" /> },
                  { key: 'copy', label: 'Sao chép', icon: <ContentCopyRoundedIcon fontSize="small" /> },
                  { key: 'delete', label: 'Xóa', icon: <DeleteRoundedIcon fontSize="small" />, color: 'danger' },
                ] as DataTableRowAction<T>[])).map((action) => (
                  <MenuItem
                    key={action.key}
                    color={action.color === 'danger' ? 'danger' : 'neutral'}
                    sx={{ gap: 1.25, py: 0.75 }}
                    onClick={() => action.onClick?.(params.data)}
                  >
                    {action.icon && (
                      <ListItemDecorator sx={{ color: action.color === 'danger' ? 'danger.plainColor' : 'neutral.plainColor' }}>
                        {action.icon}
                      </ListItemDecorator>
                    )}
                    {action.label}
                  </MenuItem>
                ))}
              </Menu>
            </Dropdown>
          </Box>
        );
      },
      colSpan: (params: any) => {
        if (params.node.rowPinned === 'top') return totalColumns - 1; // span over selection + data columns to the right
        if (!params.data) return totalColumns; // loading row span all
        return 1;
      },
    };

    const userColumns = columnDefs.map((col: any) => ({
      ...col,
      sortable: false,
      filter: false,
      suppressHeaderMenuButton: true,
      cellRenderer: (params: any) => {
        if (params.node.rowPinned === 'top') return null; // Hide in action toolbar row
        if (!params.data) return null; // Hide during loading
        return params.value;
      },
    }));

    return [actionColumn, ...userColumns];
  }, [
    columnDefs, 
    handleDeleteClick, 
    handleExportClick, 
    showActionToolbar, 
    getRowActions, 
    getSelectedRows,
    effectiveToolbarConfig.showExport,
    effectiveToolbarConfig.showDelete,
    effectiveToolbarConfig.customActions
  ]);

  return (
    <Sheet 
      variant="outlined"
      className={`data-table-container ${className}`}
      sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}
    >
      <div
        className="ag-theme-balham data-table-grid"
        onContextMenu={preventBrowserContextMenu}
      > 
        <AgGridReact
          columnDefs={processedColumnDefs}
          rowData={rowModelType === 'clientSide' ? rowData : undefined}
          pinnedTopRowData={showActionToolbar ? [{ __actionToolbar: true }] : undefined}
          defaultColDef={defaultColDef}
          rowSelection={rowSelectionOptions}
          selectionColumnDef={{
            headerName: '',
            width: 40,
            minWidth: 40,
            maxWidth: 40,
            resizable: false,
            headerClass: 'dt-center-checkbox-header',
            cellClass: 'dt-center-checkbox ag-selection-checkbox-col',
            headerComponent: HeaderSelectAllComponent,
            cellRenderer: (params: any) => {
              if (params.node.rowPinned === 'top' && showActionToolbar) {
                return effectiveToolbarConfig.showAdd ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <IconButton size="sm" variant="plain" color="primary" onClick={() => callbacksRef.current.onAdd?.()}>
                      <AddRoundedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : null;
              }
              return undefined;
            },
          }}
          pagination={rowModelType === 'clientSide' ? pagination : false}
          paginationPageSize={paginationPageSize}
          domLayout={domLayout}
          animateRows={true}
          rowModelType={rowModelType}
          onGridReady={({ api }) => { gridApiRef.current = api; }}
          onCellContextMenu={handleCellContextMenu}
          onSelectionChanged={handleSelectionChanged}
          theme="legacy"
          // No external selection tracking needed; header listens to events
          datasource={datasource}
          cacheBlockSize={100}
          cacheOverflowSize={2}
          maxConcurrentDatasourceRequests={1}
          infiniteInitialRowCount={1}
          maxBlocksInCache={10}
        />
        {contextMenu && (
          <div
            className="dt-context-menu"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            role="menu"
            ref={contextMenuRef}
          >
            {effectiveContextMenuItems.map((item) => (
              <button
                key={item.key}
                className="dt-context-menu-item"
                onClick={() => { item.action(); closeContextMenu(); }}
              >
                <span className="dt-context-icon">{item.icon}</span>
                <span className="dt-context-label">{item.label}</span>
                {item.shortcut && <span className="dt-context-shortcut">{item.shortcut}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </Sheet>
  );
}) as <T = any>(props: DataTableProps<T>) => React.ReactElement;

export default Ad99DataTable;
