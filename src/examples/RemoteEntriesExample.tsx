import React, { useState } from 'react';
import { ColDef } from 'ag-grid-community';
import Ad99DataTable from '../components/DataTable';
import { RemoteEntry } from '../types/table.types';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import PrintIcon from '@mui/icons-material/Print';

// Fake API service with delay
const fakeApiService = {
  // Simulate API call with delay
  fetchData: (startRow: number, endRow: number, allData: RemoteEntry[]): Promise<{ data: RemoteEntry[], totalCount: number }> => {
    return new Promise((resolve) => {
      // Simulate network delay 500ms - 1s
      setTimeout(() => {
        const rowsThisPage = allData.slice(startRow, endRow);
        resolve({
          data: rowsThisPage,
          totalCount: allData.length
        });
      }, Math.random() * 500 + 500); // Random delay between 500-1000ms
    });
  }
};


// Status cell renderer
const StatusCellRenderer = (params: any) => {
  return (
    <span style={{
      color: '#52c41a',
      fontWeight: 500,
      fontSize: '13px'
    }}>
      {params.value}
    </span>
  );
};


// Link cell renderer
const LinkCellRenderer = (params: any) => {
  return (
    <a
      href={params.value}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: '#1890ff', textDecoration: 'none', fontWeight: 400 }}
      onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
      onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
    >
      {params.value}
    </a>
  );
};

const RemoteEntriesExample: React.FC = () => {
  // Generate 1000 rows of sample data
  const generateData = (): RemoteEntry[] => {
    const baseData = [
      { name: 'Góp ý', code: 'FEEDBACK', remoteEntry: '/remotes/feedback-app/remoteEntry.js', baseUrl: 'feedback', icon: '🟧' },
      { name: 'Thông báo', code: 'NOTIFICATIONS', remoteEntry: '/remotes/notifications-app/remoteEntry.js', baseUrl: 'notifications', icon: '🟧' },
      { name: 'Thông tin cá nhân', code: 'PROFILES', remoteEntry: '/remotes/profiles-app/remoteEntry.js', baseUrl: 'profiles', icon: '👤' },
      { name: 'Danh bạ', code: 'CONTACTS', remoteEntry: '/remotes/contacts-app/remoteEntry.js', baseUrl: 'contacts', icon: '📇' },
      { name: 'Trò chuyện', code: 'APPSCHAT', remoteEntry: '/remotes/chat-app/remoteEntry.js', baseUrl: 'apps/chat', icon: '💬' },
      { name: 'KPIs', code: 'APPSKPIS', remoteEntry: '/remotes/kpis-app/remoteEntry.js', baseUrl: 'apps/kpis', icon: '📊' },
      { name: 'Trung tâm ứng dụng', code: 'APP-CENTER', remoteEntry: '/remotes/app-center/remoteEntry.js', baseUrl: 'app-center', icon: '⬛' },
      { name: 'Hệ thống xác thực', code: 'IDENTITY', remoteEntry: 'http://identitysystem:5000', baseUrl: 'https://devlogin.dthu.edu.vn', icon: '🔷' },
      { name: 'DOffice', code: 'APPSDOFFICE', remoteEntry: '/remotes/doffice-app/remoteEntry.js', baseUrl: 'apps/doffice', icon: '📧' },
      { name: 'Hỗ trợ điểm danh', code: 'APPSATTENDO', remoteEntry: '/remotes/attendo-app/remoteEntry.js', baseUrl: 'apps/attendo', icon: '🔵' },
      { name: 'Tài chính', code: 'APPSFINANCE', remoteEntry: '/remotes/finance-app/remoteEntry.js', baseUrl: 'apps/finance', icon: '💵' },
      { name: 'Hướng dẫn', code: 'APPSDOCS', remoteEntry: '/remotes/docs-app/remoteEntry.js', baseUrl: 'apps/docs', icon: '🔴' },
      { name: 'Cài đặt', code: 'SETTINGS', remoteEntry: '/remotes/settings-app/remoteEntry.js', baseUrl: '/settings', icon: '⚙️' },
    ];

    const data: RemoteEntry[] = [];
    for (let i = 1; i <= 1000; i++) {
      const base = baseData[i % baseData.length];
      data.push({
        id: String(i),
        name: `${base.name} ${i}`,
        code: `${base.code}_${i}`,
        remoteEntry: base.remoteEntry,
        baseUrl: base.baseUrl,
        version: '1.0.0',
        status: 'Đang sử dụng',
        created: `03:27:${String(22 + (i % 60)).padStart(2, '0')} 18/11/2025`,
        icon: base.icon,
      });
    }
    return data;
  };

  const [rowData] = useState<RemoteEntry[]>(generateData());

  // Column definitions
  const columnDefs: ColDef[] = [
    {
      headerName: 'Ảnh & Tên',
      field: 'name',
      minWidth: 180,
      flex: 1,
    },
    {
      headerName: 'Mã',
      field: 'code',
      minWidth: 140,
      flex: 0.9,
      cellStyle: { color: '#1890ff', fontWeight: 500 },
    },
    {
      headerName: 'Remote Entry',
      field: 'baseUrl',
      minWidth: 160,
      flex: 1,
    },
    {
      headerName: 'Base Url',
      field: 'remoteEntry',
      minWidth: 240,
      flex: 1.8,
      cellRenderer: LinkCellRenderer,
    },
    {
      headerName: 'Version',
      field: 'version',
      width: 90,
      sortable: true,
    },
    {
      headerName: 'Trạng thái',
      field: 'status',
      minWidth: 130,
      flex: 0.8,
      cellRenderer: StatusCellRenderer,
    },
    {
      headerName: 'Created',
      field: 'created',
      minWidth: 170,
      flex: 1,
      sortable: true,
    },
  ];

  const [mode] = useState<'pagination' | 'infinite'>('infinite');

  // Handle fetch data for infinite scroll
  const handleFetchData = async (startRow: number, endRow: number) => {
    console.log(`📡 Fetching rows ${startRow} to ${endRow}...`);
    const result = await fakeApiService.fetchData(startRow, endRow, rowData);
    console.log(`✅ Loaded ${result.data.length} rows`);
    return result;
  };

  // Action toolbar handlers
  const handleAdd = () => {
    console.log('➕ Add new entry');
    alert('Add new entry clicked!');
  };

  const handleExport = (selectedRows: RemoteEntry[]) => {
    console.log('📥 Export data', selectedRows);
    const message = selectedRows.length
      ? selectedRows.map((row) => row.name).join(', ')
      : 'Không có bản ghi nào được chọn';
    alert(`Export (${selectedRows.length}): ${message}`);
  };

  const handleDelete = (selectedRows: RemoteEntry[]) => {
    console.log('🗑️ Delete selected', selectedRows);
    const message = selectedRows.length
      ? selectedRows.map((row) => row.name).join(', ')
      : 'Không có bản ghi nào được chọn';
    alert(`Delete (${selectedRows.length}): ${message}`);
  };

  const rowActions = (row: RemoteEntry) => ([
    {
      key: 'edit',
      label: 'Chỉnh sửa',
      icon: <EditRoundedIcon fontSize="small" />,
      onClick: () => alert(`Edit ${row.name}`),
    },
    {
      key: 'copy',
      label: 'Sao chép',
      icon: <ContentCopyRoundedIcon fontSize="small" />,
      onClick: () => alert(`Copy ${row.name}`),
    },
    {
      key: 'delete',
      label: 'Xóa',
      color: 'danger' as const,
      icon: <DeleteRoundedIcon fontSize="small" />,
      onClick: () => alert(`Delete ${row.name}`),
    },
  ]);

  return (
    <div style={{ padding: '20px', minHeight: '100vh', height: '100vh', background: '#f0f2f5', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Ad99DataTable
          columnDefs={columnDefs}
          rowData={rowData}
          onFetchData={mode === 'infinite' ? handleFetchData : undefined}
          onAdd={handleAdd}
          onExport={handleExport}
          onDelete={handleDelete}
          getRowActions={rowActions}
          showActionToolbar={true}
          pagination={mode === 'pagination'}
          paginationPageSize={50}
          domLayout="normal"
          rowModelType={mode === 'pagination' ? 'clientSide' : 'infinite'}
          toolbarConfig={{
            showAdd: true,        // Ẩn/hiện nút Add (mặc định: true)
            showExport: false,    // Ẩn/hiện nút Export (mặc định: true)
            showDelete: true,     // Ẩn/hiện nút Delete (mặc định: true)
            customActions: [      // Thêm các nút tùy chỉnh
              {
                key: 'refresh',
                icon: <RefreshIcon />,
                tooltip: 'Làm mới',
                color: 'primary',
                variant: 'plain',
                onClick: (selectedRows) => {
                  console.log('Refresh clicked', selectedRows);
                },
                disabled: (selectedRows) => selectedRows.length === 0
              },
              {
                key: 'print',
                icon: <PrintIcon />,
                tooltip: 'In',
                color: 'neutral',
                onClick: (selectedRows) => {
                  // Logic in
                  console.log('Print clicked', selectedRows);
                }
              }
            ]
          }}
        />
      </div>
    </div>
  );
};

export default RemoteEntriesExample;
