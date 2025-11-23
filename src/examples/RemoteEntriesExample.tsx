import React, { useState } from 'react';
import { ColDef } from 'ag-grid-community';
import DataTable from '../components/DataTable';
import { RemoteEntry } from '../types/table.types';

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
      headerName: '',
      width: 60,
      sortable: false,
      filter: false,
      suppressHeaderMenuButton: true,
      resizable: false,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: '',
      width: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      sortable: false,
      filter: false,
      suppressHeaderMenuButton: true,
      resizable: false,
    },
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

  const [mode, setMode] = useState<'pagination' | 'infinite'>('infinite');

  const handleSearch = (value: string) => {
    console.log('Search:', value);
  };

  const handleRefresh = () => {
    console.log('Refreshing data...');
  };

  const handleAdvancedSearch = () => {
    console.log('Opening advanced search...');
  };

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

  const handleExport = () => {
    console.log('📥 Export data');
    alert('Export data clicked!');
  };

  const handleDelete = () => {
    console.log('🗑️ Delete selected');
    alert('Delete selected items clicked!');
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', height: '100vh', background: '#f0f2f5', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>Chế độ hiển thị:</span>
        <button 
          onClick={() => setMode('pagination')}
          style={{
            padding: '8px 16px',
            background: mode === 'pagination' ? '#1890ff' : '#fff',
            color: mode === 'pagination' ? '#fff' : '#333',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Phân trang
        </button>
        <button 
          onClick={() => setMode('infinite')}
          style={{
            padding: '8px 16px',
            background: mode === 'infinite' ? '#1890ff' : '#fff',
            color: mode === 'infinite' ? '#fff' : '#333',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Infinite Scroll
        </button>
        <span style={{ color: '#666', fontSize: '13px' }}>
          ({mode === 'pagination' ? 'Phân trang với pagination' : 'Kéo xuống để load thêm'})
        </span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <DataTable
          columnDefs={columnDefs}
          rowData={rowData}
          onSearch={handleSearch}
          onRefresh={handleRefresh}
          onAdvancedSearch={handleAdvancedSearch}
          onFetchData={mode === 'infinite' ? handleFetchData : undefined}
          onAdd={handleAdd}
          onExport={handleExport}
          onDelete={handleDelete}
          showActionToolbar={true}
          searchPlaceholder="Nhập từ khóa tìm kiếm"
          showToolbar={false}
          showFilter={true}
          showRefresh={true}
          showAdvancedSearch={true}
          pagination={mode === 'pagination'}
          paginationPageSize={50}
          domLayout="normal"
          rowModelType={mode === 'pagination' ? 'clientSide' : 'infinite'}
        />
      </div>
    </div>
  );
};

export default RemoteEntriesExample;
