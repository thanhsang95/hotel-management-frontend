'use client';

import {
    BuildingOfficeIcon,
    ChartBarIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ClipboardDocumentListIcon,
    Cog6ToothIcon,
    CubeIcon,
    CurrencyDollarIcon,
    HomeIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    UsersIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

// ==========================================
// Menu Item Types
// ==========================================

interface MenuItem {
  label: string;
  path?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
}

// ==========================================
// Menu Configuration
// ==========================================

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: HomeIcon,
  },
  {
    label: 'Đặt phòng',
    path: '/bookings',
    icon: ClipboardDocumentListIcon,
  },
  {
    label: 'Cấu hình hệ thống',
    icon: BuildingOfficeIcon,
    children: [
      { label: 'Khách sạn', path: '/system/hotels', icon: BuildingOfficeIcon },
    ],
  },
  {
    label: 'Quản lý phòng',
    icon: CubeIcon,
    children: [
      { label: 'Loại phòng', path: '/rooms/types', icon: CubeIcon },
      { label: 'Hạng phòng', path: '/rooms/categories', icon: CubeIcon },
      { label: 'Phòng', path: '/rooms/list', icon: CubeIcon },
      { label: 'Trạng thái phòng', path: '/rooms/timeline', icon: CubeIcon },
      { label: 'Định nghĩa tình trạng phòng', path: '/rooms/status-definitions', icon: CubeIcon },
    ],
  },
  {
    label: 'Quản lý giá',
    icon: CurrencyDollarIcon,
    children: [
      { label: 'Mã tiền tệ', path: '/pricing/currencies', icon: CurrencyDollarIcon },
      { label: 'Tỷ giá', path: '/pricing/exchange', icon: CurrencyDollarIcon },
      { label: 'Mã giá', path: '/pricing/rates', icon: CurrencyDollarIcon },
    ],
  },
  {
    label: 'Marketing & Phân phối',
    icon: ChartBarIcon,
    children: [
      { label: 'Phân khúc', path: '/marketing/segments', icon: ChartBarIcon },
      { label: 'Nguồn', path: '/marketing/sources', icon: ChartBarIcon },
      { label: 'Kênh', path: '/marketing/channels', icon: ChartBarIcon },
    ],
  },
  {
    label: 'Đối tác',
    icon: UsersIcon,
    children: [
      { label: 'Hồ sơ công ty', path: '/partners/companies', icon: UsersIcon },
    ],
  },
  {
    label: 'Cài đặt',
    icon: Cog6ToothIcon,
    children: [
      { label: 'Nhân viên', path: '/settings/employees', icon: UserGroupIcon },
      { label: 'Vai trò & Phân quyền', path: '/settings/roles', icon: ShieldCheckIcon },
    ],
  },
];

// ==========================================
// Sidebar Props
// ==========================================

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

// ==========================================
// Sidebar Component
// ==========================================

export function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Toggle submenu — accordion: only one open at a time
  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [label]  // Close all others, open only this one
    );
  };

  // Check if path is active
  const isPathActive = (path: string) => pathname === path;

  // Check if any child is active
  const hasActiveChild = (item: MenuItem) => {
    return item.children?.some((child) => child.path && isPathActive(child.path));
  };

  // Render menu item
  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.label);
    const isActive = item.path ? isPathActive(item.path) : hasActiveChild(item);
    const Icon = item.icon;

    if (hasChildren) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleExpanded(item.label)}
            className={`
              w-full flex items-center justify-between
              px-4 py-3 rounded-lg
              text-white/80 hover:text-white hover:bg-white/10
              transition-all duration-200
              cursor-pointer
              ${isActive ? 'text-white bg-white/10' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </div>
            {!isCollapsed && (
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            )}
          </button>
          
          {/* Submenu */}
          {!isCollapsed && isExpanded && item.children && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children.map((child) => renderMenuItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // Regular menu item (with link)
    return (
      <Link
        key={item.label}
        href={item.path || '/'}
        className={`
          flex items-center gap-3
          px-4 py-3 rounded-lg
          text-white/80 hover:text-white hover:bg-white/10
          transition-all duration-200
          ${isActive ? 'text-white bg-white/15 border-l-4 border-[#F59E0B] -ml-[4px] pl-[calc(1rem+4px)]' : ''}
          ${depth > 0 ? 'text-sm' : ''}
        `}
        onClick={() => {
          // Close mobile menu on navigation
          if (window.innerWidth < 1024) {
            onClose();
          }
        }}
      >
        <Icon className={`flex-shrink-0 ${depth > 0 ? 'w-4 h-4' : 'w-5 h-5'}`} />
        {!isCollapsed && <span className="font-medium">{item.label}</span>}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40
          h-screen pt-16
          bg-[#1E3A8A]
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Close button (mobile) */}
        <button
          onClick={onClose}
          className="
            absolute top-20 right-4
            lg:hidden
            p-1 rounded
            text-white/60 hover:text-white hover:bg-white/10
            transition-colors duration-200
            cursor-pointer
          "
          aria-label="Close menu"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Menu Items */}
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto px-3 py-4 space-y-1">
          {menuItems.map((item) => renderMenuItem(item))}
        </nav>

        {/* Collapse Toggle (desktop only) */}
        <button
          onClick={onToggleCollapse}
          className="
            hidden lg:flex
            absolute bottom-4 right-0
            transform translate-x-1/2
            w-6 h-6 rounded-full
            bg-white shadow-md
            items-center justify-center
            text-[#1E3A8A] hover:bg-[#F3F4F6]
            transition-colors duration-200
            cursor-pointer
          "
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeftIcon
            className={`w-4 h-4 transition-transform duration-200 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
