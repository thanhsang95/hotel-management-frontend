'use client';

import { useState, useRef, useEffect } from 'react';
import { CompanyProfile } from '../../lib/types';

export interface CompanySelectProps {
  value: string;
  companyProfiles: CompanyProfile[];
  onSelect: (companyName: string) => void;
  onAddNew: (name: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
}

export function CompanySelect({
  value,
  companyProfiles,
  onSelect,
  onAddNew,
  error,
  required,
  className = '',
}: CompanySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync search with external value
  useEffect(() => {
    setSearch(value);
  }, [value]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = companyProfiles.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setIsOpen(true);
    onSelect(e.target.value);
  };

  const handleSelect = (company: CompanyProfile) => {
    setSearch(company.name);
    onSelect(company.name);
    setIsOpen(false);
  };

  const handleAddNew = () => {
    if (newCompanyName.trim()) {
      onAddNew(newCompanyName.trim());
      setSearch(newCompanyName.trim());
      onSelect(newCompanyName.trim());
      setNewCompanyName('');
      setShowAddForm(false);
      setIsOpen(false);
    }
  };

  const inputStyle = 'w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent';
  const errorInputStyle = 'border-[#EF4444] focus:ring-[#EF4444]';

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder="Tìm hoặc chọn công ty..."
            className={`${inputStyle} ${error ? errorInputStyle : ''} ${className}`}
            id="input-company-name"
          />
          {/* Dropdown arrow */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Add new button */}
        <button
          type="button"
          onClick={() => {
            setShowAddForm(true);
            setNewCompanyName(search);
          }}
          className="px-3 py-2.5 rounded-lg border border-[#3B82F6] text-[#3B82F6] hover:bg-[#EFF6FF] text-sm font-medium flex-shrink-0"
          title="Thêm công ty mới"
        >
          +
        </button>
      </div>

      {/* Dropdown list */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              Không tìm thấy công ty
            </div>
          ) : (
            filtered.map((company) => (
              <button
                key={company.id}
                type="button"
                onClick={() => handleSelect(company)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-[#EFF6FF] ${
                  company.name === value ? 'bg-[#EFF6FF] font-medium text-[#1E3A8A]' : ''
                }`}
              >
                <div>{company.name}</div>
                {company.taxCode && (
                  <div className="text-xs text-gray-400">MST: {company.taxCode}</div>
                )}
              </button>
            ))
          )}
        </div>
      )}

      {/* Add new company inline form */}
      {showAddForm && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg p-3">
          <div className="text-sm font-medium mb-2">Thêm công ty mới</div>
          <input
            type="text"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
            placeholder="Tên công ty"
            className={`${inputStyle} mb-2`}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddNew();
              }
            }}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleAddNew}
              disabled={!newCompanyName.trim()}
              className="px-3 py-1.5 text-sm bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] disabled:opacity-50"
            >
              Thêm
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-[#EF4444] mt-1">{error}</p>}
    </div>
  );
}
