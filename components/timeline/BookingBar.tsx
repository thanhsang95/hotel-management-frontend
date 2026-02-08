'use client';

import { useState } from 'react';
import { Booking } from '../../lib/types';

// ==========================================
// Booking Bar Component
// ==========================================

// Status color mapping
const STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Confirmed: { bg: 'bg-blue-500', border: 'border-blue-600', text: 'text-white' },
  CheckedIn: { bg: 'bg-emerald-500', border: 'border-emerald-600', text: 'text-white' },
  CheckedOut: { bg: 'bg-gray-400', border: 'border-gray-500', text: 'text-white' },
  Pending: { bg: 'bg-amber-500', border: 'border-amber-600', text: 'text-white' },
  Cancelled: { bg: 'bg-red-400', border: 'border-red-500', text: 'text-white' },
  Maintenance: { bg: 'bg-rose-600', border: 'border-rose-700', text: 'text-white' },
};

const STATUS_LABELS: Record<string, string> = {
  Confirmed: 'Đã xác nhận',
  CheckedIn: 'Đã check-in',
  CheckedOut: 'Đã check-out',
  Pending: 'Chờ xác nhận',
  Cancelled: 'Đã hủy',
  Maintenance: 'Bảo trì',
};

interface BookingBarProps {
  booking: Booking;
  leftPct: number;    // % offset from grid start
  widthPct: number;   // % width
  onClick: (booking: Booking) => void;
  colWidth: number;
}

export function BookingBar({ booking, leftPct, widthPct, onClick, colWidth }: BookingBarProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const colors = STATUS_COLORS[booking.status] || STATUS_COLORS.Confirmed;
  const isMaintenance = booking.status === 'Maintenance';

  // Display text: maintenance shows icon + label, others show guest name
  const displayText = isMaintenance ? '🔧 Bảo trì' : booking.guestName;

  return (
    <div
      className="absolute top-1 bottom-1 group cursor-pointer"
      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
      onClick={() => onClick(booking)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Bar — always shows text, uses truncation for small bars */}
      <div
        className={`
          h-full rounded-md ${colors.bg} ${colors.text}
          border ${colors.border}
          flex items-center px-1.5 overflow-hidden
          opacity-90 group-hover:opacity-100
          transition-all duration-150
          group-hover:shadow-lg group-hover:scale-y-110
          group-hover:z-10
          ${isMaintenance ? 'bg-stripes' : ''}
        `}
      >
        <span className="text-[11px] font-medium truncate whitespace-nowrap leading-tight">
          {displayText}
        </span>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
        >
          <div className="bg-[#1F2937] text-white rounded-lg shadow-xl px-3 py-2 text-xs whitespace-nowrap">
            <p className="font-semibold">{displayText}</p>
            {!isMaintenance && (
              <p className="text-white/70 mt-0.5">
                {formatDateShort(booking.checkIn)} {booking.checkInTime || '14:00'} → {formatDateShort(booking.checkOut)} {booking.checkOutTime || '12:00'}
              </p>
            )}
            <p className="text-white/70">
              {STATUS_LABELS[booking.status]}
            </p>
            {booking.notes && (
              <p className="text-white/50 mt-0.5 max-w-[200px] truncate">
                {booking.notes}
              </p>
            )}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#1F2937]" />
          </div>
        </div>
      )}
    </div>
  );
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
}

export default BookingBar;
