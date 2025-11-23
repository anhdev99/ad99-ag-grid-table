import React, { useState } from 'react';
import { Input, InputGroup, Button } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import ReloadIcon from '@rsuite/icons/Reload';
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
    <div className="table-toolbar">
      <div className="toolbar-container">
        <div className="toolbar-left">
          <InputGroup inside className="search-input">
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={handleSearchChange}
            />
            <InputGroup.Button>
              <SearchIcon />
            </InputGroup.Button>
          </InputGroup>
        </div>
        
        <div className="toolbar-actions">
          {showFilter && (
            <Button 
              appearance="default" 
              className="toolbar-button"
              size="md"
            >
              Tìm kiếm
            </Button>
          )}
          
          {showRefresh && (
            <Button 
              appearance="default" 
              onClick={handleRefresh}
              className="toolbar-button"
              size="md"
            >
              <ReloadIcon /> Làm mới
            </Button>
          )}
          
          {showAdvancedSearch && (
            <Button 
              appearance="primary" 
              onClick={handleAdvancedSearch}
              className="toolbar-button-primary"
              size="md"
            >
              <SearchIcon /> Tìm kiếm nâng cao
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableToolbar;
