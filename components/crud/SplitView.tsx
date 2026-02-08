'use client';

import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';

// ==========================================
// SplitView Props
// ==========================================

export interface SplitViewProps<T> {
  title: string;
  items: T[];
  selectedItem: T | null;
  onSelect: (item: T | null) => void;
  onCreateNew?: () => void;  // Optional - hide button if not provided
  keyExtractor: (item: T) => string;
  renderListItem: (item: T, isSelected: boolean) => React.ReactNode;
  renderForm: () => React.ReactNode;
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  emptyMessage?: string;
}

// ==========================================
// SplitView Component
// ==========================================

export function SplitView<T>({
  title,
  items,
  selectedItem,
  onSelect,
  onCreateNew,
  keyExtractor,
  renderListItem,
  renderForm,
  searchKeys = [],
  searchPlaceholder = 'Tìm kiếm...',
  emptyMessage = 'Chưa có dữ liệu',
}: SplitViewProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFormVisible, setIsMobileFormVisible] = useState(false);

  // Filter items based on search query
  const filteredItems = searchQuery.trim()
    ? items.filter((item) =>
        searchKeys.some((key) => {
          const value = item[key];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchQuery.toLowerCase());
          }
          return false;
        })
      )
    : items;

  // Show form on mobile when item is selected or creating new
  useEffect(() => {
    if (selectedItem !== null) {
      setIsMobileFormVisible(true);
    }
  }, [selectedItem]);

  // Handle back button on mobile
  const handleMobileBack = () => {
    setIsMobileFormVisible(false);
    onSelect(null);
  };

  // Handle create new
  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
      setIsMobileFormVisible(true);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-[#1E3A8A] font-heading">{title}</h1>
        <span className="text-sm text-[#6B7280]">
          {filteredItems.length} / {items.length} bản ghi
        </span>
      </div>

      {/* Split View Container */}
      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Pane - List */}
        <div
          className={`
            w-full md:w-2/5 flex flex-col
            bg-white rounded-xl shadow-md overflow-hidden
            ${isMobileFormVisible ? 'hidden md:flex' : 'flex'}
          `}
        >
          {/* List Header */}
          <div className="p-4 border-b border-[#E2E8F0] space-y-3">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="
                  w-full pl-10 pr-4 py-2.5
                  bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg
                  text-[#1E3A8A] placeholder:text-[#9CA3AF] text-sm
                  focus:outline-none focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/20
                  transition-all duration-200
                "
              />
            </div>

            {/* Add Button - only show if onCreateNew is provided */}
            {onCreateNew && (
              <Button
                variant="primary"
                size="medium"
                fullWidth
                leftIcon={<PlusIcon className="w-5 h-5" />}
                onClick={handleCreateNew}
              >
                Thêm mới
              </Button>
            )}
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-[#6B7280]">
                {emptyMessage}
              </div>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {filteredItems.map((item) => {
                  const key = keyExtractor(item);
                  const isSelected = selectedItem ? keyExtractor(selectedItem) === key : false;

                  return (
                    <div
                      key={key}
                      onClick={() => onSelect(item)}
                      className={`
                        p-4 cursor-pointer
                        transition-colors duration-150
                        hover:bg-[#F8FAFC]
                        ${isSelected ? 'bg-[#EEF2FF] border-l-4 border-l-[#1E40AF]' : ''}
                      `}
                    >
                      {renderListItem(item, isSelected)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane - Form */}
        <div
          className={`
            w-full md:w-3/5
            bg-white rounded-xl shadow-md overflow-hidden
            ${isMobileFormVisible ? 'flex flex-col' : 'hidden md:flex md:flex-col'}
          `}
        >
          {/* Mobile Back Button */}
          <div className="md:hidden p-4 border-b border-[#E2E8F0]">
            <Button variant="ghost" size="small" onClick={handleMobileBack}>
              ← Quay lại danh sách
            </Button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SplitView;
