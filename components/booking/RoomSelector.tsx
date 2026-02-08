'use client';

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';
import { Room } from '../../lib/types';

// ==========================================
// Types
// ==========================================

interface RoomSelectorProps {
  availableRooms: Room[];
  onSelect: (roomId: string) => void;
  onCancel: () => void;
}

// ==========================================
// RoomSelector Component
// ==========================================

export function RoomSelector({ availableRooms, onSelect, onCancel }: RoomSelectorProps) {
  const [search, setSearch] = useState('');

  // Filter & group by floor
  const filteredRooms = useMemo(() => {
    if (!search.trim()) return availableRooms;
    return availableRooms.filter((r) =>
      r.roomNumber.toLowerCase().includes(search.toLowerCase())
    );
  }, [availableRooms, search]);

  // Group by floor
  const roomsByFloor = useMemo(() => {
    const groups: Record<number, Room[]> = {};
    filteredRooms.forEach((room) => {
      if (!groups[room.floor]) groups[room.floor] = [];
      groups[room.floor].push(room);
    });
    return Object.entries(groups)
      .map(([floor, rooms]) => ({
        floor: parseInt(floor),
        rooms: rooms.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber)),
      }))
      .sort((a, b) => a.floor - b.floor);
  }, [filteredRooms]);

  if (availableRooms.length === 0) {
    return (
      <div className="text-center py-3">
        <p className="text-sm text-[#EF4444] font-medium">
          Không còn phòng trống cho hạng phòng này trong thời gian đã chọn.
        </p>
        <button
          onClick={onCancel}
          className="mt-2 text-sm text-[#6B7280] hover:text-[#374151] cursor-pointer"
        >
          Đóng
        </button>
      </div>
    );
  }

  return (
    <div id="room-selector">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-[#92400E] uppercase tracking-wide">
          Chọn phòng ({availableRooms.length} phòng trống)
        </p>
        <button
          onClick={onCancel}
          className="p-1 rounded hover:bg-[#FEF3C7] text-[#92400E] cursor-pointer transition-colors"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      {availableRooms.length > 6 && (
        <div className="relative mb-3">
          <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm số phòng..."
            className="
              w-full pl-8 pr-3 py-1.5 rounded-lg
              border border-[#E2E8F0] bg-white
              text-sm text-[#1F2937]
              placeholder-[#9CA3AF]
              focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]
              transition-all duration-200
            "
            id="input-search-room"
          />
        </div>
      )}

      {/* Room Grid grouped by floor */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {roomsByFloor.map(({ floor, rooms }) => (
          <div key={floor}>
            <p className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wider mb-1">
              Tầng {floor}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => onSelect(room.id)}
                  className="
                    px-3 py-1.5 rounded-lg
                    bg-white border border-[#E2E8F0]
                    text-xs font-semibold text-[#1E3A8A]
                    hover:bg-[#EFF6FF] hover:border-[#3B82F6] hover:shadow-sm
                    transition-all duration-200 cursor-pointer
                    group/room
                  "
                  title={`Phòng ${room.roomNumber} - Tầng ${room.floor}`}
                  id={`btn-select-room-${room.roomNumber}`}
                >
                  <span className="group-hover/room:scale-105 inline-block transition-transform">
                    {room.roomNumber}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {filteredRooms.length === 0 && (
          <p className="text-xs text-[#9CA3AF] text-center py-2">
            Không tìm thấy phòng &quot;{search}&quot;
          </p>
        )}
      </div>
    </div>
  );
}
