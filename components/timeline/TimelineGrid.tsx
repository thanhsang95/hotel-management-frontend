'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Booking, Room } from '../../lib/types';
import { TimelineRow } from './TimelineRow';

// ==========================================
// Timeline Grid Component
// ==========================================

interface TimelineGridProps {
  rooms: Room[];
  bookings: Booking[];
  startDate: Date;
  rangeDays: number;
  onBookingClick: (booking: Booking) => void;
}

const ROOM_COL_WIDTH = 100;

// Minimum column widths per range (fallback / scroll threshold)
function getMinColWidth(rangeDays: number): number {
  if (rangeDays <= 7) return 50;
  if (rangeDays <= 14) return 36;
  return 24;
}

const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export function TimelineGrid({ rooms, bookings, startDate, rangeDays, onBookingClick }: TimelineGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Measure container width with ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    // Initial measurement
    setContainerWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  // Calculate responsive column width
  const colWidth = useMemo(() => {
    const minCol = getMinColWidth(rangeDays);
    const availableWidth = containerWidth - ROOM_COL_WIDTH;
    if (availableWidth <= 0) return minCol;

    // Distribute available width equally among all days
    const calculated = Math.floor(availableWidth / rangeDays);
    // Use calculated width, but never below the minimum
    return Math.max(calculated, minCol);
  }, [containerWidth, rangeDays]);

  // Whether the content overflows (needs horizontal scroll)
  const totalGridWidth = rangeDays * colWidth;
  const needsScroll = totalGridWidth > (containerWidth - ROOM_COL_WIDTH);

  // Build date columns
  const dateColumns = useMemo(() => {
    const cols: { date: Date; dayNum: string; weekday: string; isWeekend: boolean; isToday: boolean }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < rangeDays; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dayOfWeek = d.getDay();
      cols.push({
        date: d,
        dayNum: d.getDate().toString().padStart(2, '0'),
        weekday: WEEKDAY_LABELS[dayOfWeek],
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        isToday: d.getTime() === today.getTime(),
      });
    }
    return cols;
  }, [startDate, rangeDays]);

  // Group rooms by floor
  const floorGroups = useMemo(() => {
    const groups = new Map<number, Room[]>();
    rooms.forEach((room) => {
      if (!groups.has(room.floor)) {
        groups.set(room.floor, []);
      }
      groups.get(room.floor)!.push(room);
    });

    const sortedFloors = Array.from(groups.entries()).sort((a, b) => a[0] - b[0]);
    sortedFloors.forEach(([, roomList]) => {
      roomList.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));
    });

    return sortedFloors;
  }, [rooms]);

  // Index bookings by roomId
  const bookingsByRoom = useMemo(() => {
    const map = new Map<string, Booking[]>();
    bookings.forEach((b) => {
      if (!map.has(b.roomId)) {
        map.set(b.roomId, []);
      }
      map.get(b.roomId)!.push(b);
    });
    return map;
  }, [bookings]);

  return (
    <div ref={containerRef} className="bg-white rounded-xl shadow-md border border-[#E2E8F0] overflow-hidden">
      <div className="overflow-auto max-h-[calc(100vh-340px)]">
        <div style={{ minWidth: needsScroll ? `${ROOM_COL_WIDTH + totalGridWidth}px` : undefined }}>
          {/* Header Row */}
          <div className="flex border-b-2 border-[#CBD5E1] bg-[#F8FAFC] sticky top-0 z-20">
            {/* Room column header */}
            <div
              className="flex items-center justify-center px-3 py-2 bg-[#F8FAFC] border-r border-[#CBD5E1] sticky left-0 z-30 shrink-0"
              style={{ width: `${ROOM_COL_WIDTH}px`, minWidth: `${ROOM_COL_WIDTH}px` }}
            >
              <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Phòng</span>
            </div>

            {/* Date column headers — flex to fill remaining space */}
            <div className="flex flex-1">
              {dateColumns.map((col, i) => (
                <div
                  key={i}
                  className={`
                    flex flex-col items-center justify-center py-2
                    border-r border-[#F1F5F9]
                    ${col.isWeekend ? 'bg-amber-50/60' : ''}
                    ${col.isToday ? 'bg-blue-100/80' : ''}
                  `}
                  style={{
                    width: needsScroll ? `${colWidth}px` : undefined,
                    minWidth: `${colWidth}px`,
                    flex: needsScroll ? undefined : 1,
                  }}
                >
                  <span className={`text-[10px] font-medium ${col.isWeekend ? 'text-amber-600' : 'text-[#9CA3AF]'}`}>
                    {col.weekday}
                  </span>
                  <span className={`text-xs font-bold ${col.isToday ? 'text-blue-600' : col.isWeekend ? 'text-amber-700' : 'text-[#4B5563]'}`}>
                    {col.dayNum}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Floor Groups + Rooms */}
          {floorGroups.map(([floor, roomList]) => (
            <div key={floor}>
              {/* Floor header */}
              <div className="flex border-b border-[#CBD5E1] bg-[#EEF2FF] sticky left-0">
                <div className="w-full px-4 py-1.5">
                  <span className="text-xs font-bold text-[#4338CA] uppercase tracking-wide">
                    Tầng {floor}
                  </span>
                </div>
              </div>

              {/* Room rows */}
              {roomList.map((room) => (
                <TimelineRow
                  key={room.id}
                  roomNumber={room.roomNumber}
                  bookings={bookingsByRoom.get(room.id) || []}
                  startDate={startDate}
                  totalDays={rangeDays}
                  colWidth={colWidth}
                  onBookingClick={onBookingClick}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TimelineGrid;
