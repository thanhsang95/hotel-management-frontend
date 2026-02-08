'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookingDetailModal } from '../../../../components/timeline/BookingDetailModal';
import { DateRangeSelector } from '../../../../components/timeline/DateRangeSelector';
import { TimelineGrid } from '../../../../components/timeline/TimelineGrid';
import { TimelineSummaryCards } from '../../../../components/timeline/TimelineSummaryCards';
import { useMockData } from '../../../../lib/context/MockDataContext';
import { Booking } from '../../../../lib/types';

// ==========================================
// Room Status Timeline Page
// ==========================================

export default function RoomTimelinePage() {
  const { rooms, bookings, roomCategories, roomStatusDefinitions } = useMockData();

  // --- State ---
  const [rangeDays, setRangeDays] = useState(14);
  // Use a fixed date for SSR hydration safety, then update on mount
  const [startDate, setStartDate] = useState(() => new Date('2026-02-08T00:00:00'));

  useEffect(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setStartDate(d);
  }, []);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterFloor, setFilterFloor] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // --- Navigation ---
  const handlePrev = useCallback(() => {
    setStartDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - rangeDays);
      return d;
    });
  }, [rangeDays]);

  const handleNext = useCallback(() => {
    setStartDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + rangeDays);
      return d;
    });
  }, [rangeDays]);

  const handleSetRange = useCallback((days: number) => {
    setRangeDays(days);
  }, []);

  // --- Booking click ---
  const handleBookingClick = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  }, []);

  // --- Filters ---
  const filteredRooms = useMemo(() => {
    let result = rooms;
    if (filterFloor !== 'all') {
      result = result.filter((r) => r.floor === parseInt(filterFloor));
    }
    if (filterCategory !== 'all') {
      result = result.filter((r) => r.categoryId === filterCategory);
    }
    return result;
  }, [rooms, filterFloor, filterCategory]);

  // --- Summary card calculations ---
  const summary = useMemo(() => {
    // Use startDate as reference for consistent SSR
    const todayStr = startDate.toISOString().split('T')[0];

    const roomsWithActiveBooking = new Set<string>();
    const roomsWithCheckedIn = new Set<string>();
    const roomsWithOOO = new Set<string>();

    // Check rooms with OOO/Maintenance status (category = 'Maintenance')
    rooms.forEach((room) => {
      const status = roomStatusDefinitions.find(s => s.id === room.statusId);
      if (status && status.category === 'Maintenance') {
        roomsWithOOO.add(room.id);
      }
    });

    // Check bookings active today
    bookings.forEach((b) => {
      if (b.status === 'Cancelled') return;
      if (b.checkIn <= todayStr && b.checkOut > todayStr) {
        roomsWithActiveBooking.add(b.roomId);
        if (b.status === 'CheckedIn') {
          roomsWithCheckedIn.add(b.roomId);
        }
      }
    });

    const bookedCount = roomsWithActiveBooking.size;
    const checkedInCount = roomsWithCheckedIn.size;
    const maintenanceCount = roomsWithOOO.size;
    const vacantCount = rooms.length - bookedCount - maintenanceCount;

    return {
      vacant: Math.max(0, vacantCount),
      booked: bookedCount,
      checkedIn: checkedInCount,
      maintenance: maintenanceCount,
    };
  }, [rooms, bookings, startDate, roomStatusDefinitions]);

  // --- Floor & category options ---
  const floorOptions = useMemo(() => {
    const floors = [...new Set(rooms.map((r) => r.floor))].sort((a, b) => a - b);
    return floors;
  }, [rooms]);

  const categoryOptions = useMemo(() => {
    return roomCategories.map((c) => ({ id: c.id, name: c.name }));
  }, [roomCategories]);

  // --- Lookup for modal ---
  const selectedRoom = useMemo(() => {
    if (!selectedBooking) return undefined;
    return rooms.find((r) => r.id === selectedBooking.roomId);
  }, [selectedBooking, rooms]);

  const selectedCategory = useMemo(() => {
    if (!selectedBooking) return undefined;
    return roomCategories.find((c) => c.id === selectedBooking.roomCategoryId);
  }, [selectedBooking, roomCategories]);

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E3A8A] font-heading">
          Quản lý trạng thái phòng
        </h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Tổng quan timeline đặt phòng theo ngày
        </p>
      </div>

      {/* Summary Cards */}
      <TimelineSummaryCards
        vacant={summary.vacant}
        booked={summary.booked}
        checkedIn={summary.checkedIn}
        maintenance={summary.maintenance}
      />

      {/* Controls: Date range + Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <DateRangeSelector
          startDate={startDate}
          rangeDays={rangeDays}
          onPrev={handlePrev}
          onNext={handleNext}
          onSetRange={handleSetRange}
        />

        {/* Floor Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-[#4B5563]">Tầng:</label>
          <select
            value={filterFloor}
            onChange={(e) => setFilterFloor(e.target.value)}
            className="px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] shadow-sm text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-[#1E40AF] cursor-pointer"
          >
            <option value="all">Tất cả</option>
            {floorOptions.map((f) => (
              <option key={f} value={f}>Tầng {f}</option>
            ))}
          </select>
        </div>

        {/* Room Category Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-[#4B5563]">Loại phòng:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] shadow-sm text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-[#1E40AF] cursor-pointer"
          >
            <option value="all">Tất cả</option>
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline Grid */}
      <TimelineGrid
        rooms={filteredRooms}
        bookings={bookings}
        startDate={startDate}
        rangeDays={rangeDays}
        onBookingClick={handleBookingClick}
      />

      {/* Booking Detail Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        room={selectedRoom}
        category={selectedCategory}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
