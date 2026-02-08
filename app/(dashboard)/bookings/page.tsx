'use client';

import {
    FunnelIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { useCallback, useMemo, useRef, useState } from 'react';
import { BookingDrawer } from '../../../components/booking/BookingDrawer';
import { Badge } from '../../../components/ui/Badge';
import { useMockData } from '../../../lib/context/MockDataContext';
import { Reservation, ReservationStatus, ReservationType } from '../../../lib/types';

// ==========================================
// Status Badge Configuration
// ==========================================

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const statusConfig: Record<ReservationStatus, { variant: BadgeVariant; label: string }> = {
  Confirmed: { variant: 'info', label: 'Xác nhận' },
  Pending: { variant: 'neutral', label: 'Chờ xử lý' },
  CheckedIn: { variant: 'success', label: 'Đã nhận phòng' },
  CheckedOut: { variant: 'neutral', label: 'Đã trả phòng' },
  NoShow: { variant: 'warning', label: 'No-show' },
  Cancelled: { variant: 'danger', label: 'Đã hủy' },
};

const typeConfig: Record<ReservationType, { color: string; label: string }> = {
  FIT: { color: 'bg-[#EDE9FE] text-[#5B21B6]', label: 'FIT' },
  GIT: { color: 'bg-[#FFF7ED] text-[#9A3412]', label: 'GIT' },
  'Walk-in': { color: 'bg-[#ECFDF5] text-[#065F46]', label: 'Walk-in' },
};

// ==========================================
// Helper Functions
// ==========================================

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getRoomCount(reservation: Reservation): number {
  const holdCount = reservation.roomHolds.reduce((sum, h) => sum + h.quantity, 0);
  const assignCount = reservation.roomAssignments.filter(a => a.status === 'assigned').length;
  return Math.max(holdCount, assignCount);
}

// ==========================================
// StatusBadge Component
// ==========================================

function StatusBadge({ status }: { status: ReservationStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} size="small" dot>
      {config.label}
    </Badge>
  );
}

// ==========================================
// TypeBadge Component
// ==========================================

function TypeBadge({ type }: { type: ReservationType }) {
  const config = typeConfig[type];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

// ==========================================
// Booking List Page
// ==========================================

export default function BookingListPage() {
  const { reservations } = useMockData();

  // --- State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCompany, setFilterCompany] = useState<string>('all');
  const [filterCheckInFrom, setFilterCheckInFrom] = useState('');
  const [filterCheckInTo, setFilterCheckInTo] = useState('');
  const [filterCheckOutFrom, setFilterCheckOutFrom] = useState('');
  const [filterCheckOutTo, setFilterCheckOutTo] = useState('');
  const [filterRoomMin, setFilterRoomMin] = useState('');
  const [filterRoomMax, setFilterRoomMax] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // --- Drawer State ---
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [editingReservation, setEditingReservation] = useState<Reservation | undefined>(undefined);
  const drawerKeyRef = useRef(0);

  // --- Unique company names for company filter dropdown ---
  const companyOptions = useMemo(() => {
    const companies = reservations
      .map((r) => r.companyName)
      .filter((c): c is string => !!c);
    return [...new Set(companies)].sort();
  }, [reservations]);

  // --- Filtered Data ---
  const filteredReservations = useMemo(() => {
    let result = reservations;

    // Search by name, code, or company
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.bookingName.toLowerCase().includes(q) ||
          r.registrationCode.toLowerCase().includes(q) ||
          (r.companyName && r.companyName.toLowerCase().includes(q))
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter((r) => r.status === filterStatus);
    }

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter((r) => r.reservationType === filterType);
    }

    // Filter by company
    if (filterCompany !== 'all') {
      result = result.filter((r) => r.companyName === filterCompany);
    }

    // Filter by check-in date range
    if (filterCheckInFrom) {
      result = result.filter((r) => r.checkIn >= filterCheckInFrom);
    }
    if (filterCheckInTo) {
      result = result.filter((r) => r.checkIn <= filterCheckInTo);
    }

    // Filter by check-out date range
    if (filterCheckOutFrom) {
      result = result.filter((r) => r.checkOut >= filterCheckOutFrom);
    }
    if (filterCheckOutTo) {
      result = result.filter((r) => r.checkOut <= filterCheckOutTo);
    }

    // Filter by room count
    if (filterRoomMin) {
      const min = parseInt(filterRoomMin, 10);
      if (!isNaN(min)) result = result.filter((r) => getRoomCount(r) >= min);
    }
    if (filterRoomMax) {
      const max = parseInt(filterRoomMax, 10);
      if (!isNaN(max)) result = result.filter((r) => getRoomCount(r) <= max);
    }

    // Sort by check-in date descending (newest first)
    return [...result].sort((a, b) => b.checkIn.localeCompare(a.checkIn));
  }, [reservations, searchQuery, filterStatus, filterType, filterCompany, filterCheckInFrom, filterCheckInTo, filterCheckOutFrom, filterCheckOutTo, filterRoomMin, filterRoomMax]);

  // --- Summary Statistics ---
  const stats = useMemo(() => {
    const total = reservations.length;
    const confirmed = reservations.filter((r) => r.status === 'Confirmed').length;
    const checkedIn = reservations.filter((r) => r.status === 'CheckedIn').length;
    const pending = reservations.filter((r) => r.status === 'Pending').length;
    return { total, confirmed, checkedIn, pending };
  }, [reservations]);

  // --- Active Filters Count ---
  const activeFilterCount =
    (filterStatus !== 'all' ? 1 : 0) +
    (filterType !== 'all' ? 1 : 0) +
    (filterCompany !== 'all' ? 1 : 0) +
    (filterCheckInFrom ? 1 : 0) +
    (filterCheckInTo ? 1 : 0) +
    (filterCheckOutFrom ? 1 : 0) +
    (filterCheckOutTo ? 1 : 0) +
    (filterRoomMin ? 1 : 0) +
    (filterRoomMax ? 1 : 0);

  // --- Handlers ---
  const handleRowClick = useCallback((reservation: Reservation) => {
    setEditingReservation(reservation);
    setDrawerMode('edit');
    drawerKeyRef.current += 1;
    setDrawerOpen(true);
  }, []);

  const handleCreateNew = useCallback(() => {
    setEditingReservation(undefined);
    setDrawerMode('create');
    drawerKeyRef.current += 1;
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    setEditingReservation(undefined);
  }, []);

  const clearFilters = () => {
    setFilterStatus('all');
    setFilterType('all');
    setFilterCompany('all');
    setFilterCheckInFrom('');
    setFilterCheckInTo('');
    setFilterCheckOutFrom('');
    setFilterCheckOutTo('');
    setFilterRoomMin('');
    setFilterRoomMax('');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A8A] font-heading">
            Quản lý Booking
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Danh sách đặt phòng và quản lý booking
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="
            flex items-center gap-2
            px-4 py-2.5 rounded-lg
            bg-[#1E3A8A] text-white
            hover:bg-[#1E40AF]
            transition-colors duration-200
            shadow-sm hover:shadow-md
            cursor-pointer
            font-medium text-sm
          "
          id="btn-create-booking"
        >
          <PlusIcon className="w-5 h-5" />
          Tạo Booking
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
          <p className="text-sm text-[#6B7280]">Tổng booking</p>
          <p className="text-2xl font-bold text-[#1E3A8A] mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
          <p className="text-sm text-[#6B7280]">Đã xác nhận</p>
          <p className="text-2xl font-bold text-[#3B82F6] mt-1">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
          <p className="text-sm text-[#6B7280]">Đã nhận phòng</p>
          <p className="text-2xl font-bold text-[#10B981] mt-1">{stats.checkedIn}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
          <p className="text-sm text-[#6B7280]">Chờ xử lý</p>
          <p className="text-2xl font-bold text-[#F59E0B] mt-1">{stats.pending}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
        <div className="p-4 flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, mã booking, công ty..."
              className="
                w-full pl-10 pr-4 py-2.5 rounded-lg
                border border-[#E2E8F0]
                text-sm text-[#1F2937]
                placeholder-[#9CA3AF]
                focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-[#1E40AF]
                transition-all duration-200
              "
              id="input-search-booking"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] cursor-pointer"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg
              border text-sm font-medium
              transition-all duration-200 cursor-pointer
              ${showFilters || activeFilterCount > 0
                ? 'border-[#1E40AF] bg-[#EFF6FF] text-[#1E40AF]'
                : 'border-[#E2E8F0] text-[#6B7280] hover:border-[#CBD5E1] hover:text-[#374151]'
              }
            `}
            id="btn-toggle-filters"
          >
            <FunnelIcon className="w-4 h-4" />
            Bộ lọc
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#1E40AF] text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-[#EF4444] hover:text-[#DC2626] cursor-pointer font-medium"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        {showFilters && (
          <div className="px-4 pb-4 border-t border-[#F3F4F6] pt-3 space-y-3">
            {/* Row 1: Status, Type, Company */}
            <div className="flex flex-wrap gap-3">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[#4B5563] whitespace-nowrap">Trạng thái:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] shadow-sm text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-[#1E40AF] cursor-pointer"
                  id="select-filter-status"
                >
                  <option value="all">Tất cả</option>
                  <option value="Confirmed">Xác nhận</option>
                  <option value="Pending">Chờ xử lý</option>
                  <option value="CheckedIn">Đã nhận phòng</option>
                  <option value="CheckedOut">Đã trả phòng</option>
                  <option value="NoShow">No-show</option>
                  <option value="Cancelled">Đã hủy</option>
                </select>
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[#4B5563] whitespace-nowrap">Loại:</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] shadow-sm text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-[#1E40AF] cursor-pointer"
                  id="select-filter-type"
                >
                  <option value="all">Tất cả</option>
                  <option value="FIT">FIT</option>
                  <option value="GIT">GIT</option>
                  <option value="Walk-in">Walk-in</option>
                </select>
              </div>

              {/* Company Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[#4B5563] whitespace-nowrap">Công ty:</label>
                <select
                  value={filterCompany}
                  onChange={(e) => setFilterCompany(e.target.value)}
                  className="px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] shadow-sm text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-[#1E40AF] cursor-pointer"
                  id="select-filter-company"
                >
                  <option value="all">Tất cả</option>
                  {companyOptions.map((company) => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Check-in range, Check-out range, Room count */}
            <div className="flex flex-wrap gap-3">
              {/* Check-in Date Range */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[#4B5563] whitespace-nowrap">Check-in:</label>
                <input
                  type="date"
                  value={filterCheckInFrom}
                  onChange={(e) => setFilterCheckInFrom(e.target.value)}
                  className="px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] shadow-sm text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-[#1E40AF] cursor-pointer"
                  id="input-filter-checkin-from"
                />
                <span className="text-sm text-[#9CA3AF]">→</span>
                <input
                  type="date"
                  value={filterCheckInTo}
                  onChange={(e) => setFilterCheckInTo(e.target.value)}
                  className="px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] shadow-sm text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-[#1E40AF] cursor-pointer"
                  id="input-filter-checkin-to"
                />
              </div>

              {/* Check-out Date Range */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[#4B5563] whitespace-nowrap">Check-out:</label>
                <input
                  type="date"
                  value={filterCheckOutFrom}
                  onChange={(e) => setFilterCheckOutFrom(e.target.value)}
                  className="px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] shadow-sm text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-[#1E40AF] cursor-pointer"
                  id="input-filter-checkout-from"
                />
                <span className="text-sm text-[#9CA3AF]">→</span>
                <input
                  type="date"
                  value={filterCheckOutTo}
                  onChange={(e) => setFilterCheckOutTo(e.target.value)}
                  className="px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] shadow-sm text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-[#1E40AF] cursor-pointer"
                  id="input-filter-checkout-to"
                />
              </div>

              {/* Room Count Range */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[#4B5563] whitespace-nowrap">Phòng:</label>
                <input
                  type="number"
                  min="0"
                  value={filterRoomMin}
                  onChange={(e) => setFilterRoomMin(e.target.value)}
                  placeholder="Min"
                  className="w-16 px-2 py-2 bg-white rounded-lg border border-[#E2E8F0] shadow-sm text-sm text-[#1F2937] text-center focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-[#1E40AF]"
                  id="input-filter-room-min"
                />
                <span className="text-sm text-[#9CA3AF]">→</span>
                <input
                  type="number"
                  min="0"
                  value={filterRoomMax}
                  onChange={(e) => setFilterRoomMax(e.target.value)}
                  placeholder="Max"
                  className="w-16 px-2 py-2 bg-white rounded-lg border border-[#E2E8F0] shadow-sm text-sm text-[#1F2937] text-center focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-[#1E40AF]"
                  id="input-filter-room-max"
                />
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full" id="table-booking-list">
            <thead>
              <tr className="border-t border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Mã Booking
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Tên Booking
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden md:table-cell">
                  Công ty
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Check-in
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">
                  Check-out
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden sm:table-cell">
                  Phòng
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden sm:table-cell">
                  Loại
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-[#9CA3AF]">
                    <div className="flex flex-col items-center gap-2">
                      <MagnifyingGlassIcon className="w-8 h-8 text-[#D1D5DB]" />
                      <p className="text-sm">Không tìm thấy booking nào</p>
                      {activeFilterCount > 0 && (
                        <button
                          onClick={clearFilters}
                          className="text-sm text-[#3B82F6] hover:text-[#1D4ED8] cursor-pointer font-medium"
                        >
                          Xóa bộ lọc để xem tất cả
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    onClick={() => handleRowClick(reservation)}
                    className="
                      hover:bg-[#F8FAFC]
                      transition-colors duration-150
                      cursor-pointer
                      group
                    "
                    id={`row-booking-${reservation.id}`}
                  >
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-mono text-[#6B7280] group-hover:text-[#1E40AF] transition-colors">
                        {reservation.registrationCode}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        {reservation.vip && (
                          <span className="text-xs bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.5 rounded font-semibold">
                            VIP
                          </span>
                        )}
                        <span className="text-sm font-medium text-[#1F2937]">
                          {reservation.bookingName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-[#6B7280]">
                        {reservation.companyName || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-[#1F2937]">
                        {formatDate(reservation.checkIn)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-sm text-[#1F2937]">
                        {formatDate(reservation.checkOut)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F3F4F6] text-sm font-medium text-[#374151]">
                        {getRoomCount(reservation)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <StatusBadge status={reservation.status} />
                    </td>
                    <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                      <TypeBadge type={reservation.reservationType} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Results count */}
        <div className="px-4 py-3 border-t border-[#E2E8F0] flex items-center justify-between text-sm text-[#6B7280]">
          <span>
            Hiển thị {filteredReservations.length} / {reservations.length} booking
          </span>
          {searchQuery && (
            <span className="text-[#9CA3AF]">
              Tìm kiếm: &quot;{searchQuery}&quot;
            </span>
          )}
        </div>
      </div>
      {/* Booking Drawer */}
      <BookingDrawer
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        mode={drawerMode}
        reservation={editingReservation}
        drawerKey={drawerKeyRef.current}
      />
    </div>
  );
}
