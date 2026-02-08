'use client';

import { Booking } from '../../lib/types';
import { BookingBar } from './BookingBar';

// ==========================================
// Timeline Row Component
// ==========================================

interface TimelineRowProps {
  roomNumber: string;
  bookings: Booking[];
  startDate: Date;
  totalDays: number;
  colWidth: number;
  onBookingClick: (booking: Booking) => void;
}

/**
 * Calculate bar position as percentage of the total timeline width.
 * Clamps to the visible range if booking extends beyond.
 */
function calculateBarPercent(
  booking: Booking,
  startDate: Date,
  totalDays: number,
): { leftPct: number; widthPct: number } | null {
  const bookStart = new Date(booking.checkIn);
  const bookEnd = new Date(booking.checkOut);
  const rangeEnd = new Date(startDate);
  rangeEnd.setDate(rangeEnd.getDate() + totalDays);

  // Skip if entirely outside visible range
  if (bookEnd <= startDate || bookStart >= rangeEnd) return null;

  // Clamp to visible range
  const visibleStart = bookStart < startDate ? startDate : bookStart;
  const visibleEnd = bookEnd > rangeEnd ? rangeEnd : bookEnd;

  const msPerDay = 1000 * 60 * 60 * 24;
  const startOffset = (visibleStart.getTime() - startDate.getTime()) / msPerDay;
  const endOffset = (visibleEnd.getTime() - startDate.getTime()) / msPerDay;

  const leftPct = (startOffset / totalDays) * 100;
  const widthPct = Math.max(((endOffset - startOffset) / totalDays) * 100, (0.5 / totalDays) * 100);

  return { leftPct, widthPct };
}

export function TimelineRow({
  roomNumber,
  bookings,
  startDate,
  totalDays,
  colWidth,
  onBookingClick,
}: TimelineRowProps) {
  const colPct = 100 / totalDays;

  return (
    <div className="flex border-b border-[#E2E8F0] group/row hover:bg-blue-50/30 transition-colors duration-100">
      {/* Room number - sticky column */}
      <div className="w-[100px] min-w-[100px] shrink-0 flex items-center px-3 py-0 bg-white border-r border-[#E2E8F0] sticky left-0 z-10 group-hover/row:bg-blue-50/30 transition-colors duration-100">
        <span className="text-sm font-semibold text-[#1E3A8A] font-heading">
          {roomNumber}
        </span>
      </div>

      {/* Date cells + booking bars */}
      <div
        className="relative flex-1"
        style={{ minWidth: `${totalDays * colWidth}px`, height: '36px' }}
      >
        {/* Background grid lines — percentage-based */}
        {Array.from({ length: totalDays }, (_, i) => {
          const cellDate = new Date(startDate);
          cellDate.setDate(cellDate.getDate() + i);
          const dayOfWeek = cellDate.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

          return (
            <div
              key={i}
              className={`absolute top-0 bottom-0 border-r border-[#F1F5F9] ${isWeekend ? 'bg-amber-50/40' : ''}`}
              style={{ left: `${i * colPct}%`, width: `${colPct}%` }}
            />
          );
        })}

        {/* Booking bars — percentage-based positioning */}
        {bookings.map((booking) => {
          const pos = calculateBarPercent(booking, startDate, totalDays);
          if (!pos) return null;

          return (
            <BookingBar
              key={booking.id}
              booking={booking}
              leftPct={pos.leftPct}
              widthPct={pos.widthPct}
              onClick={onBookingClick}
              colWidth={colWidth}
            />
          );
        })}
      </div>
    </div>
  );
}

export default TimelineRow;
