'use client';

import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCallback, useMemo, useState } from 'react';
import { useMockData } from '../../lib/context/MockDataContext';
import { ReservationType, RoomAssignment, RoomHold } from '../../lib/types';
import { RoomAssignmentGroup } from './RoomAssignmentGroup';
import { RoomHoldForm } from './RoomHoldForm';
import { RoomHoldList } from './RoomHoldList';

// ==========================================
// Types
// ==========================================

interface RoomAssignmentStepProps {
  reservationType: ReservationType;
  checkIn: string;
  checkOut: string;
  roomHolds: RoomHold[];
  roomAssignments: RoomAssignment[];
  onRoomHoldsChange: (holds: RoomHold[]) => void;
  onRoomAssignmentsChange: (assignments: RoomAssignment[]) => void;
  reservationId?: string;
}

// ==========================================
// RoomAssignmentStep Component
// ==========================================

export function RoomAssignmentStep({
  reservationType,
  checkIn,
  checkOut,
  roomHolds,
  roomAssignments,
  onRoomHoldsChange,
  onRoomAssignmentsChange,
  reservationId,
}: RoomAssignmentStepProps) {
  const {
    roomTypes,
    roomCategories,
    rateCodes,
    rooms,
    getAvailableRoomCount,
    getAvailableRoomsForCategory,
  } = useMockData();

  const [showAddHold, setShowAddHold] = useState(false);

  // ---- Hold Management ----
  const handleAddHold = useCallback((hold: RoomHold) => {
    onRoomHoldsChange([...roomHolds, hold]);
    setShowAddHold(false);
  }, [roomHolds, onRoomHoldsChange]);

  const handleRemoveHold = useCallback((index: number) => {
    // Also remove associated assignments
    const updatedHolds = roomHolds.filter((_, i) => i !== index);
    const updatedAssignments = roomAssignments
      .filter((a) => a.roomHoldIndex !== index)
      .map((a) => ({
        ...a,
        roomHoldIndex: a.roomHoldIndex > index ? a.roomHoldIndex - 1 : a.roomHoldIndex,
      }));

    onRoomHoldsChange(updatedHolds);
    onRoomAssignmentsChange(updatedAssignments);
  }, [roomHolds, roomAssignments, onRoomHoldsChange, onRoomAssignmentsChange]);

  // ---- Assignment Management ----
  const handleAssignRoom = useCallback((holdIndex: number, roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    const hold = roomHolds[holdIndex];
    if (!hold) return;

    const newAssignment: RoomAssignment = {
      roomHoldIndex: holdIndex,
      roomId: room.id,
      roomNumber: room.roomNumber,
      roomPrice: hold.roomPrice,
      adults: hold.adults,
      children: hold.children,
      childrenU7: 0,
      childrenU3: 0,
      extraBed: hold.extraBed,
      extraBedPrice: hold.extraBedPrice,
      extraPerson: 0,
      status: 'assigned',
    };

    onRoomAssignmentsChange([...roomAssignments, newAssignment]);
  }, [rooms, roomHolds, roomAssignments, onRoomAssignmentsChange]);

  const handleRemoveAssignment = useCallback((assignmentIndex: number) => {
    onRoomAssignmentsChange(
      roomAssignments.filter((_, i) => i !== assignmentIndex)
    );
  }, [roomAssignments, onRoomAssignmentsChange]);

  const handleCancelAll = useCallback(() => {
    onRoomAssignmentsChange([]);
  }, [onRoomAssignmentsChange]);

  const handleAutoAssign = useCallback((holdIndex: number) => {
    const hold = roomHolds[holdIndex];
    if (!hold) return;

    const existingCount = roomAssignments.filter(
      (a) => a.roomHoldIndex === holdIndex && a.status === 'assigned'
    ).length;
    const remaining = hold.quantity - existingCount;
    if (remaining <= 0) return;

    const availableRooms = getAvailableRoomsForCategory(
      hold.roomCategoryId,
      checkIn,
      checkOut,
      reservationId
    );

    // Filter out rooms already assigned in this reservation
    const alreadyAssignedIds = new Set(
      roomAssignments
        .filter((a) => a.status === 'assigned')
        .map((a) => a.roomId)
    );
    const candidates = availableRooms.filter((r) => !alreadyAssignedIds.has(r.id));

    // Sort by floor to prefer same floor
    candidates.sort((a, b) => a.floor - b.floor);

    const newAssignments: RoomAssignment[] = [];
    for (let i = 0; i < Math.min(remaining, candidates.length); i++) {
      const room = candidates[i];
      newAssignments.push({
        roomHoldIndex: holdIndex,
        roomId: room.id,
        roomNumber: room.roomNumber,
        roomPrice: hold.roomPrice,
        adults: hold.adults,
        children: hold.children,
        childrenU7: 0,
        childrenU3: 0,
        extraBed: hold.extraBed,
        extraBedPrice: hold.extraBedPrice,
        extraPerson: 0,
        status: 'assigned',
      });
    }

    onRoomAssignmentsChange([...roomAssignments, ...newAssignments]);
  }, [roomHolds, roomAssignments, checkIn, checkOut, reservationId, getAvailableRoomsForCategory, onRoomAssignmentsChange]);

  // ---- Summary Stats ----
  const totalHeldRooms = useMemo(() =>
    roomHolds.reduce((sum, h) => sum + h.quantity, 0),
    [roomHolds]
  );

  const totalAssignedRooms = useMemo(() =>
    roomAssignments.filter((a) => a.status === 'assigned').length,
    [roomAssignments]
  );

  // ---- Available rooms for selectors ----
  const getAvailableRoomsForHold = useCallback((holdIndex: number) => {
    const hold = roomHolds[holdIndex];
    if (!hold) return [];

    const availableRooms = getAvailableRoomsForCategory(
      hold.roomCategoryId,
      checkIn,
      checkOut,
      reservationId
    );

    // Filter out rooms already assigned in this reservation
    const alreadyAssignedIds = new Set(
      roomAssignments
        .filter((a) => a.status === 'assigned')
        .map((a) => a.roomId)
    );

    return availableRooms.filter((r) => !alreadyAssignedIds.has(r.id));
  }, [roomHolds, roomAssignments, checkIn, checkOut, reservationId, getAvailableRoomsForCategory]);

  // Helper to look up names
  const getRoomTypeName = useCallback((id: string) => {
    return roomTypes.find((rt) => rt.id === id)?.name || id;
  }, [roomTypes]);

  const getRoomCategoryName = useCallback((id: string) => {
    return roomCategories.find((rc) => rc.id === id)?.name || id;
  }, [roomCategories]);

  const isWalkIn = reservationType === 'Walk-in';

  return (
    <div className="p-6 space-y-6" id="room-assignment-step">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4">
          <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Loại phòng giữ</p>
          <p className="text-2xl font-bold text-[#1E3A8A] mt-1">{roomHolds.length}</p>
        </div>
        <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4">
          <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Tổng phòng giữ</p>
          <p className="text-2xl font-bold text-[#3B82F6] mt-1">{totalHeldRooms}</p>
        </div>
        <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4">
          <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Đã phân phòng</p>
          <p className="text-2xl font-bold text-[#10B981] mt-1">
            {totalAssignedRooms} / {totalHeldRooms}
          </p>
        </div>
      </div>

      {/* ========== Hold Section ========== */}
      {!isWalkIn && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#1E3A8A] uppercase tracking-wide flex items-center gap-2">
              <span className="text-lg">📦</span>
              Giữ phòng (Room Hold)
            </h3>
            <button
              onClick={() => setShowAddHold(true)}
              className="
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                text-[#1E40AF] bg-[#EFF6FF] hover:bg-[#DBEAFE]
                text-sm font-medium
                transition-all duration-200 cursor-pointer
              "
              id="btn-add-hold"
            >
              <PlusCircleIcon className="w-4 h-4" />
              Thêm loại phòng
            </button>
          </div>

          {/* Add Hold Form */}
          {showAddHold && (
            <RoomHoldForm
              roomTypes={roomTypes}
              roomCategories={roomCategories}
              rateCodes={rateCodes}
              checkIn={checkIn}
              checkOut={checkOut}
              getAvailableRoomCount={getAvailableRoomCount}
              reservationId={reservationId}
              onAdd={handleAddHold}
              onCancel={() => setShowAddHold(false)}
            />
          )}

          {/* Hold List */}
          <RoomHoldList
            roomHolds={roomHolds}
            getRoomTypeName={getRoomTypeName}
            getRoomCategoryName={getRoomCategoryName}
            onRemove={handleRemoveHold}
          />
        </section>
      )}

      {/* ========== Assignment Section ========== */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#1E3A8A] uppercase tracking-wide flex items-center gap-2">
            <span className="text-lg">🏨</span>
            Phân phòng (Room Assignment)
          </h3>
          {totalAssignedRooms > 0 && (
            <button
              onClick={handleCancelAll}
              className="
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                text-[#EF4444] bg-[#FEF2F2] hover:bg-[#FEE2E2]
                text-sm font-medium
                transition-all duration-200 cursor-pointer
              "
              id="btn-cancel-all-assignments"
            >
              <TrashIcon className="w-4 h-4" />
              Hủy tất cả dòng
            </button>
          )}
        </div>

        {/* Room Groups */}
        {roomHolds.length === 0 ? (
          <div className="text-center py-8 text-[#9CA3AF] border border-dashed border-[#E2E8F0] rounded-xl">
            <p className="text-sm">
              {isWalkIn
                ? 'Thêm phòng cho khách walk-in bên dưới.'
                : 'Chưa có phòng nào được giữ. Thêm loại phòng ở trên.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {roomHolds.map((hold, holdIndex) => {
              const assignmentsForHold = roomAssignments
                .map((a, globalIdx) => ({ ...a, globalIndex: globalIdx }))
                .filter((a) => a.roomHoldIndex === holdIndex && a.status === 'assigned');

              const availableRooms = getAvailableRoomsForHold(holdIndex);

              return (
                <RoomAssignmentGroup
                  key={holdIndex}
                  holdIndex={holdIndex}
                  hold={hold}
                  assignments={assignmentsForHold}
                  roomTypeName={getRoomTypeName(hold.roomTypeId)}
                  roomCategoryName={getRoomCategoryName(hold.roomCategoryId)}
                  availableRooms={availableRooms}
                  onAssignRoom={handleAssignRoom}
                  onRemoveAssignment={handleRemoveAssignment}
                  onAutoAssign={handleAutoAssign}
                />
              );
            })}
          </div>
        )}

        {/* Walk-in: direct add hold + assign */}
        {isWalkIn && roomHolds.length === 0 && (
          <div className="mt-3">
            <button
              onClick={() => setShowAddHold(true)}
              className="
                flex items-center gap-1.5 px-4 py-2.5 rounded-lg
                bg-[#1E3A8A] text-white hover:bg-[#1E40AF]
                text-sm font-medium
                transition-all duration-200 cursor-pointer shadow-sm
              "
              id="btn-walkin-add-room"
            >
              <PlusCircleIcon className="w-4 h-4" />
              Chọn phòng
            </button>
            {showAddHold && (
              <div className="mt-3">
                <RoomHoldForm
                  roomTypes={roomTypes}
                  roomCategories={roomCategories}
                  rateCodes={rateCodes}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  getAvailableRoomCount={getAvailableRoomCount}
                  reservationId={reservationId}
                  onAdd={handleAddHold}
                  onCancel={() => setShowAddHold(false)}
                />
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
