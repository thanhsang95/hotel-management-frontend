'use client';

import {
    BoltIcon,
    PlusIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Room, RoomAssignment, RoomHold } from '../../lib/types';
import { RoomSelector } from './RoomSelector';

// ==========================================
// Types
// ==========================================

interface RoomAssignmentWithIndex extends RoomAssignment {
  globalIndex: number;
}

interface RoomAssignmentGroupProps {
  holdIndex: number;
  hold: RoomHold;
  assignments: RoomAssignmentWithIndex[];
  roomTypeName: string;
  roomCategoryName: string;
  availableRooms: Room[];
  onAssignRoom: (holdIndex: number, roomId: string) => void;
  onRemoveAssignment: (globalIndex: number) => void;
  onAutoAssign: (holdIndex: number) => void;
}

// ==========================================
// Format helper
// ==========================================

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
}

// ==========================================
// RoomAssignmentRow Component
// ==========================================

function RoomAssignmentRow({
  assignment,
  onRemove,
}: {
  assignment: RoomAssignmentWithIndex;
  onRemove: () => void;
}) {
  return (
    <div
      className="
        flex items-center justify-between
        bg-white rounded-lg border border-[#E2E8F0]
        px-4 py-2.5
        hover:border-[#CBD5E1]
        transition-all duration-200
        group/row
      "
      id={`room-assignment-row-${assignment.globalIndex}`}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Room Number */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
            <span className="text-xs font-bold text-[#1E40AF]">
              {assignment.roomNumber}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center gap-3 flex-wrap text-xs text-[#6B7280]">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F3F4F6]">
            💰 {formatPrice(assignment.roomPrice)}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F3F4F6]">
            👤 {assignment.adults} NL
          </span>
          {assignment.children > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F3F4F6]">
              👶 {assignment.children} TE
            </span>
          )}
          {assignment.extraBed && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E]">
              🛏️ +Giường ({formatPrice(assignment.extraBedPrice)})
            </span>
          )}
          {assignment.extraPerson > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E]">
              +{assignment.extraPerson} NP
            </span>
          )}
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="
          p-1 rounded-lg
          text-[#D1D5DB] hover:text-[#EF4444] hover:bg-[#FEF2F2]
          transition-all duration-200 cursor-pointer
          opacity-0 group-hover/row:opacity-100
        "
        title="Hủy phòng này"
        id={`btn-remove-assignment-${assignment.globalIndex}`}
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

// ==========================================
// RoomAssignmentGroup Component
// ==========================================

export function RoomAssignmentGroup({
  holdIndex,
  hold,
  assignments,
  roomTypeName,
  roomCategoryName,
  availableRooms,
  onAssignRoom,
  onRemoveAssignment,
  onAutoAssign,
}: RoomAssignmentGroupProps) {
  const [showSelector, setShowSelector] = useState(false);

  const assignedCount = assignments.length;
  const totalCount = hold.quantity;
  const isFull = assignedCount >= totalCount;
  const progressPercent = totalCount > 0 ? Math.round((assignedCount / totalCount) * 100) : 0;

  const handleSelectRoom = (roomId: string) => {
    onAssignRoom(holdIndex, roomId);
    setShowSelector(false);
  };

  return (
    <div
      className="rounded-xl border border-[#E2E8F0] overflow-hidden"
      id={`assignment-group-${holdIndex}`}
    >
      {/* Group Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <span className="text-lg">📦</span>
          <div>
            <span className="text-sm font-semibold text-[#1E3A8A]">
              {roomTypeName}
            </span>
            <span className="text-xs text-[#6B7280] ml-2">{roomCategoryName}</span>
          </div>
          <span className="text-xs font-medium text-[#6B7280]">— tổng {totalCount}</span>

          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isFull ? 'bg-[#10B981]' : 'bg-[#3B82F6]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className={`text-xs font-medium ${isFull ? 'text-[#10B981]' : 'text-[#3B82F6]'}`}>
              {assignedCount}/{totalCount}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto Assign */}
          {!isFull && (
            <button
              onClick={() => onAutoAssign(holdIndex)}
              className="
                flex items-center gap-1 px-2.5 py-1 rounded-lg
                text-xs font-medium
                text-[#F59E0B] bg-[#FFFBEB] hover:bg-[#FEF3C7]
                transition-all duration-200 cursor-pointer
              "
              title="Tự động phân phòng"
              id={`btn-auto-assign-${holdIndex}`}
            >
              <BoltIcon className="w-3.5 h-3.5" />
              Auto
            </button>
          )}

          {/* Add Room (+) */}
          <button
            onClick={() => setShowSelector(true)}
            disabled={isFull}
            className={`
              flex items-center gap-1 px-2.5 py-1 rounded-lg
              text-xs font-medium
              transition-all duration-200 cursor-pointer
              ${isFull
                ? 'text-[#9CA3AF] bg-[#F3F4F6] cursor-not-allowed'
                : 'text-[#1E40AF] bg-[#EFF6FF] hover:bg-[#DBEAFE]'
              }
            `}
            title={isFull ? `Đã đủ ${totalCount} phòng` : 'Thêm phòng'}
            id={`btn-add-room-${holdIndex}`}
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Thêm
          </button>
        </div>
      </div>

      {/* Room Selector Modal */}
      {showSelector && (
        <div className="px-4 py-3 bg-[#FEFCE8] border-b border-[#E2E8F0]">
          <RoomSelector
            availableRooms={availableRooms}
            onSelect={handleSelectRoom}
            onCancel={() => setShowSelector(false)}
          />
        </div>
      )}

      {/* Assigned Room Rows */}
      <div className="p-2 space-y-1.5">
        {assignments.length === 0 ? (
          <div className="text-center py-4 text-xs text-[#9CA3AF]">
            Chưa có phòng nào được phân. Nhấn (+) để thêm.
          </div>
        ) : (
          assignments.map((assignment) => (
            <RoomAssignmentRow
              key={assignment.globalIndex}
              assignment={assignment}
              onRemove={() => onRemoveAssignment(assignment.globalIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
}
