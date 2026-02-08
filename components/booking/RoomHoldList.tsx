'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { RoomHold } from '../../lib/types';

// ==========================================
// Types
// ==========================================

interface RoomHoldListProps {
  roomHolds: RoomHold[];
  getRoomTypeName: (id: string) => string;
  getRoomCategoryName: (id: string) => string;
  onRemove: (index: number) => void;
}

// ==========================================
// Format helper
// ==========================================

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
}

// ==========================================
// RoomHoldList Component
// ==========================================

export function RoomHoldList({
  roomHolds,
  getRoomTypeName,
  getRoomCategoryName,
  onRemove,
}: RoomHoldListProps) {
  if (roomHolds.length === 0) {
    return (
      <div className="text-center py-6 text-[#9CA3AF] border border-dashed border-[#E2E8F0] rounded-xl">
        <p className="text-sm">Chưa có loại phòng nào được giữ.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2" id="room-hold-list">
      {roomHolds.map((hold, index) => (
        <div
          key={index}
          className="
            flex items-center justify-between
            bg-white rounded-lg border border-[#E2E8F0]
            px-4 py-3 hover:shadow-sm
            transition-all duration-200
            group
          "
          id={`room-hold-${index}`}
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Type & Category Badge */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-lg">📦</span>
              <div>
                <p className="text-sm font-semibold text-[#1E3A8A]">
                  {getRoomTypeName(hold.roomTypeId)}
                </p>
                <p className="text-xs text-[#6B7280]">
                  {getRoomCategoryName(hold.roomCategoryId)}
                </p>
              </div>
            </div>

            {/* Details Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#EFF6FF] text-[#1E40AF]">
                {hold.quantity} phòng
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F3F4F6] text-[#374151]">
                {formatPrice(hold.roomPrice)} / đêm
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F3F4F6] text-[#374151]">
                {hold.adults} NL{hold.children > 0 ? ` + ${hold.children} TE` : ''}
              </span>
              {hold.extraBed && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FEF3C7] text-[#92400E]">
                  + Giường phụ
                </span>
              )}
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => onRemove(index)}
            className="
              p-1.5 rounded-lg
              text-[#D1D5DB] hover:text-[#EF4444] hover:bg-[#FEF2F2]
              transition-all duration-200 cursor-pointer
              opacity-0 group-hover:opacity-100
            "
            title="Xóa loại phòng"
            id={`btn-remove-hold-${index}`}
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ))}

      {/* Total Summary */}
      <div className="flex items-center justify-end gap-4 px-4 py-2 text-sm">
        <span className="text-[#6B7280]">
          Tổng: <span className="font-semibold text-[#1E3A8A]">{roomHolds.reduce((s, h) => s + h.quantity, 0)} phòng</span>
        </span>
        <span className="text-[#6B7280]">
          ~{formatPrice(roomHolds.reduce((s, h) => s + h.roomPrice * h.quantity, 0))} / đêm
        </span>
      </div>
    </div>
  );
}
