import React, { useState } from 'react';
import { Input, IconButton, Button, Box } from '@mui/joy';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { TableToolbarProps } from '../types/table.types';
import './TableToolbar.css';

const TableToolbar: React.FC<TableToolbarProps> = ({
  onSearch,
  onRefresh,
  onAdvancedSearch,
  searchPlaceholder = 'Nhập từ khóa tìm kiếm',
  showFilter = true,
  showRefresh = true,
  showAdvancedSearch = true,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleAdvancedSearch = () => {
    if (onAdvancedSearch) {
      onAdvancedSearch();
    }
  };

  return (
    <Box className="table-toolbar">
      <Box className="toolbar-container">
        <Box className="toolbar-left">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            startDecorator={<SearchRoundedIcon />}
            size="sm"
            sx={{ width: 300 }}
          />
        </Box>
        
        <Box className="toolbar-actions">
          {showFilter && (
            <Button 
              variant="outlined"
              color="neutral"
              size="sm"
            >
              Tìm kiếm
            </Button>
          )}
          
          {showRefresh && (
            <Button 
              variant="outlined"
              color="neutral"
              onClick={handleRefresh}
              startDecorator={<RefreshRoundedIcon />}
              size="sm"
            >
              Làm mới
            </Button>
          )}
          
          {showAdvancedSearch && (
            <Button 
              variant="solid"
              color="primary"
              onClick={handleAdvancedSearch}
              startDecorator={<SearchRoundedIcon />}
              size="sm"
            >
              Tìm kiếm nâng cao
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TableToolbar;
