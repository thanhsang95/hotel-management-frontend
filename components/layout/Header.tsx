'use client';

import {
    Bars3Icon,
    BellIcon,
    GlobeAltIcon,
    MagnifyingGlassIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

// ==========================================
// Header Component Types
// ==========================================

interface HeaderProps {
  onMenuClick?: () => void;
  showMobileMenu?: boolean;
}

// ==========================================
// Header Component
// ==========================================

export function Header({ onMenuClick, showMobileMenu = true }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications count
  const notificationCount = 3;

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };

  return (
    <header className="
      fixed top-0 left-0 right-0 z-30
      h-16 bg-white
      border-b border-[#E2E8F0]
      shadow-sm
    ">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        {/* Left Section: Mobile Menu + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          {showMobileMenu && (
            <button
              onClick={onMenuClick}
              className="
                lg:hidden p-2 rounded-lg
                text-[#6B7280] hover:text-[#1E3A8A] hover:bg-[#F3F4F6]
                transition-colors duration-200
                cursor-pointer
              "
              aria-label="Toggle menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          )}

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1E40AF] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="hidden sm:block font-heading font-semibold text-[#1E3A8A]">
              Hotel Management
            </span>
          </div>
        </div>

        {/* Center Section: Global Search */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'vi' ? 'Tìm kiếm...' : 'Search...'}
              className="
                w-full pl-10 pr-4 py-2
                bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg
                text-[#1E3A8A] placeholder:text-[#9CA3AF]
                focus:outline-none focus:border-[#1E40AF] focus:bg-white focus:ring-2 focus:ring-[#1E40AF]/20
                transition-all duration-200
              "
            />
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="
              flex items-center gap-1.5 px-3 py-2 rounded-lg
              text-sm font-medium text-[#6B7280]
              hover:text-[#1E3A8A] hover:bg-[#F3F4F6]
              transition-colors duration-200
              cursor-pointer
            "
            aria-label={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          >
            <GlobeAltIcon className="w-5 h-5" />
            <span className="hidden sm:inline">{language === 'vi' ? 'VI' : 'EN'}</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="
                relative p-2 rounded-lg
                text-[#6B7280] hover:text-[#1E3A8A] hover:bg-[#F3F4F6]
                transition-colors duration-200
                cursor-pointer
              "
              aria-label="Notifications"
            >
              <BellIcon className="w-6 h-6" />
              {notificationCount > 0 && (
                <span className="
                  absolute top-1 right-1
                  w-4 h-4 rounded-full
                  bg-[#EF4444] text-white text-xs font-medium
                  flex items-center justify-center
                ">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="
                absolute right-0 top-full mt-2
                w-72 bg-white rounded-lg shadow-lg border border-[#E2E8F0]
                z-50
              ">
                <div className="p-3 border-b border-[#E2E8F0]">
                  <h3 className="font-semibold text-[#1E3A8A]">
                    {language === 'vi' ? 'Thông báo' : 'Notifications'}
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-3 hover:bg-[#F8FAFC] cursor-pointer border-b border-[#E2E8F0]">
                    <p className="text-sm text-[#1E3A8A]">Phòng A301 cần dọn dẹp</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">5 phút trước</p>
                  </div>
                  <div className="p-3 hover:bg-[#F8FAFC] cursor-pointer border-b border-[#E2E8F0]">
                    <p className="text-sm text-[#1E3A8A]">Khách mới check-in: John Smith</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">15 phút trước</p>
                  </div>
                  <div className="p-3 hover:bg-[#F8FAFC] cursor-pointer">
                    <p className="text-sm text-[#1E3A8A]">Tỷ giá USD đã được cập nhật</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">1 giờ trước</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="
                flex items-center gap-2 p-2 rounded-lg
                hover:bg-[#F3F4F6]
                transition-colors duration-200
                cursor-pointer
              "
              aria-label="User menu"
            >
              <UserCircleIcon className="w-8 h-8 text-[#6B7280]" />
              <span className="hidden lg:block text-sm font-medium text-[#1E3A8A]">
                Admin User
              </span>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="
                absolute right-0 top-full mt-2
                w-48 bg-white rounded-lg shadow-lg border border-[#E2E8F0]
                z-50
              ">
                <div className="p-3 border-b border-[#E2E8F0]">
                  <p className="font-medium text-[#1E3A8A]">Admin User</p>
                  <p className="text-sm text-[#6B7280]">admin@hotel.com</p>
                </div>
                <div className="p-1">
                  <button className="
                    w-full px-3 py-2 text-left text-sm rounded
                    text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1E3A8A]
                    transition-colors duration-200
                    cursor-pointer
                  ">
                    {language === 'vi' ? 'Cài đặt' : 'Settings'}
                  </button>
                  <button className="
                    w-full px-3 py-2 text-left text-sm rounded
                    text-[#EF4444] hover:bg-[#FEE2E2]
                    transition-colors duration-200
                    cursor-pointer
                  ">
                    {language === 'vi' ? 'Đăng xuất' : 'Logout'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
}

export default Header;
