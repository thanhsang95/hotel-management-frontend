'use client';

import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { useMemo, useState } from 'react';

// ==========================================
// Table Component Types
// ==========================================

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  selectedKey?: string | null;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
}

// ==========================================
// Table Component
// ==========================================

export function Table<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  selectedKey,
  searchable = false,
  searchKeys = [],
  searchPlaceholder = 'Tìm kiếm...',
  emptyMessage = 'Không có dữ liệu',
  isLoading = false,
  pagination = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50],
}: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || searchKeys.length === 0) return data;
    
    const lowerQuery = searchQuery.toLowerCase();
    return data.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerQuery);
        }
        if (typeof value === 'number') {
          return value.toString().includes(lowerQuery);
        }
        return false;
      })
    );
  }, [data, searchQuery, searchKeys]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortKey];
      const bValue = (b as Record<string, unknown>)[sortKey];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  // Total pages
  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sort
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Get cell value
  const getCellValue = (item: T, column: TableColumn<T>): React.ReactNode => {
    if (column.render) {
      return column.render(item);
    }
    const value = (item as Record<string, unknown>)[column.key as string];
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Có' : 'Không';
    return String(value);
  };

  // Alignment styles
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      {searchable && (
        <div className="mb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="
                w-full pl-10 pr-4 py-2.5
                bg-white border border-[#E2E8F0] rounded-lg
                text-[#1E3A8A] placeholder:text-[#9CA3AF]
                focus:outline-none focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/20
                transition-all duration-200
              "
            />
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
        <table className="w-full min-w-full divide-y divide-[#E2E8F0]">
          {/* Header */}
          <thead className="bg-[#F8FAFC]">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`
                    px-4 py-3 text-sm font-semibold text-[#1E3A8A]
                    ${alignStyles[column.align || 'left']}
                    ${column.sortable ? 'cursor-pointer select-none hover:bg-[#F3F4F6]' : ''}
                  `}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className={`flex items-center gap-1 ${column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : ''}`}>
                    {column.header}
                    {column.sortable && (
                      <span className="flex flex-col">
                        <ChevronUpIcon 
                          className={`w-3 h-3 -mb-1 ${
                            sortKey === column.key && sortDirection === 'asc' 
                              ? 'text-[#1E40AF]' 
                              : 'text-[#9CA3AF]'
                          }`} 
                        />
                        <ChevronDownIcon 
                          className={`w-3 h-3 ${
                            sortKey === column.key && sortDirection === 'desc' 
                              ? 'text-[#1E40AF]' 
                              : 'text-[#9CA3AF]'
                          }`} 
                        />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-[#E2E8F0] bg-white">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-4 py-3">
                      <div className="h-4 bg-[#E5E7EB] rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              // Empty state
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-4 py-12 text-center text-[#6B7280]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // Data rows
              paginatedData.map((item) => {
                const key = keyExtractor(item);
                const isSelected = selectedKey === key;
                
                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(item)}
                    className={`
                      transition-colors duration-150
                      ${onRowClick ? 'cursor-pointer hover:bg-[#F8FAFC]' : ''}
                      ${isSelected ? 'bg-[#EEF2FF] border-l-4 border-l-[#1E40AF]' : ''}
                    `}
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={`
                          px-4 py-3 text-sm text-[#1E3A8A]
                          ${alignStyles[column.align || 'left']}
                        `}
                      >
                        {getCellValue(item, column)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && sortedData.length > 0 && (
        <div className="flex items-center justify-between mt-4 px-2">
          {/* Page size selector */}
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <span>Hiển thị</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="
                px-2 py-1 border border-[#E2E8F0] rounded
                bg-white text-[#1E3A8A]
                focus:outline-none focus:border-[#1E40AF]
                cursor-pointer
              "
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span>/ {sortedData.length} kết quả</span>
          </div>

          {/* Page navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="
                px-2 py-1 text-sm rounded
                text-[#6B7280] hover:bg-[#F3F4F6]
                disabled:opacity-50 disabled:cursor-not-allowed
                cursor-pointer
              "
            >
              ««
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="
                px-2 py-1 text-sm rounded
                text-[#6B7280] hover:bg-[#F3F4F6]
                disabled:opacity-50 disabled:cursor-not-allowed
                cursor-pointer
              "
            >
              «
            </button>
            
            <span className="px-3 py-1 text-sm text-[#1E3A8A]">
              Trang {currentPage} / {totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="
                px-2 py-1 text-sm rounded
                text-[#6B7280] hover:bg-[#F3F4F6]
                disabled:opacity-50 disabled:cursor-not-allowed
                cursor-pointer
              "
            >
              »
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="
                px-2 py-1 text-sm rounded
                text-[#6B7280] hover:bg-[#F3F4F6]
                disabled:opacity-50 disabled:cursor-not-allowed
                cursor-pointer
              "
            >
              »»
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
