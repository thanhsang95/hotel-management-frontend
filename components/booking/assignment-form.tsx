'use client';

import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { RoomAssignment, RoomHold } from '../../lib/types';
import { formatCurrency, parseCurrency } from '../../lib/utils/format';

// ==========================================
// Types
// ==========================================

interface AssignmentFormProps {
  hold: RoomHold;
  holdIndex: number;
  onAdd: (assignment: RoomAssignment) => void;
  onCancel: () => void;
}

// ==========================================
// Styles
// ==========================================

const labelStyle = 'block mb-1.5 text-xs font-medium text-[#1E3A8A]';
const inputStyle = `
  w-full px-3 py-2 rounded-lg
  border border-[#E2E8F0] bg-white
  text-sm text-[#1F2937]
  placeholder-[#9CA3AF]
  focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]
  transition-all duration-200
`;

// ==========================================
// AssignmentForm Component
// Pre-fills from RoomHold, allows user to customize per-room values
// ==========================================

export function AssignmentForm({
  hold,
  holdIndex,
  onAdd,
  onCancel,
}: AssignmentFormProps) {
  const [roomPrice, setRoomPrice] = useState(hold.roomPrice);
  const [adults, setAdults] = useState(hold.adults);
  const [children, setChildren] = useState(hold.children);
  const [extraBed, setExtraBed] = useState(hold.extraBed);
  const [extraBedPrice, setExtraBedPrice] = useState(hold.extraBedPrice);
  const [priceDisplay, setPriceDisplay] = useState(
    hold.roomPrice ? formatCurrency(hold.roomPrice) : ''
  );

  useEffect(() => {
    setPriceDisplay(roomPrice ? formatCurrency(roomPrice) : '');
  }, [roomPrice]);

  const handleSubmit = () => {
    const assignment: RoomAssignment = {
      roomHoldIndex: holdIndex,
      roomId: '',
      roomNumber: '',
      roomPrice,
      adults,
      children,
      childrenU7: 0,
      childrenU3: 0,
      extraBed,
      extraBedPrice: extraBed ? extraBedPrice : 0,
      extraPerson: 0,
      status: 'pending',
    };
    onAdd(assignment);
  };

  return (
    <div
      className="bg-[#FFFBEB] rounded-xl border border-[#FDE68A] p-4 mb-2 animate-in fade-in slide-in-from-top-2"
      id="assignment-form"
    >
      <div className="text-xs font-medium text-[#92400E] mb-3">
        Thêm phân phòng — tùy chỉnh từ Giữ phòng
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Room Price */}
        <div>
          <label className={labelStyle}>Giá phòng (VND)</label>
          <input
            type="text"
            inputMode="numeric"
            value={priceDisplay}
            onChange={(e) => setPriceDisplay(e.target.value)}
            onFocus={() => setPriceDisplay(roomPrice ? String(roomPrice) : '')}
            onBlur={() => {
              const parsed = parseCurrency(priceDisplay);
              setRoomPrice(parsed);
              setPriceDisplay(parsed ? formatCurrency(parsed) : '');
            }}
            className={inputStyle}
            id="input-assignment-price"
          />
        </div>

        {/* Adults */}
        <div>
          <label className={labelStyle}>Người lớn</label>
          <input
            type="number"
            min={1}
            max={10}
            value={adults}
            onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
            className={inputStyle}
            id="input-assignment-adults"
          />
        </div>

        {/* Children */}
        <div>
          <label className={labelStyle}>Trẻ em</label>
          <input
            type="number"
            min={0}
            max={10}
            value={children}
            onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
            className={inputStyle}
            id="input-assignment-children"
          />
        </div>

        {/* Extra Bed */}
        <div className="flex items-end gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none pb-2">
            <input
              type="checkbox"
              checked={extraBed}
              onChange={(e) => setExtraBed(e.target.checked)}
              className="w-4 h-4 rounded border-[#D1D5DB] text-[#1E40AF] focus:ring-[#1E40AF]/20 cursor-pointer"
              id="checkbox-assignment-extra-bed"
            />
            <span className="text-xs font-medium text-[#1E3A8A]">Giường phụ</span>
          </label>
          {extraBed && (
            <input
              type="number"
              min={0}
              step={50000}
              value={extraBedPrice}
              onChange={(e) => setExtraBedPrice(parseInt(e.target.value) || 0)}
              placeholder="Giá"
              className={`${inputStyle} w-28`}
              id="input-assignment-extra-bed-price"
            />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-[#FDE68A]">
        <button
          onClick={onCancel}
          className="
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            text-[#6B7280] hover:bg-[#FEF3C7]
            text-sm font-medium
            transition-all duration-200 cursor-pointer
          "
          id="btn-assignment-cancel"
        >
          <XMarkIcon className="w-4 h-4" />
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          className="
            flex items-center gap-1.5 px-4 py-1.5 rounded-lg
            bg-[#1E3A8A] text-white hover:bg-[#1E40AF]
            text-sm font-medium
            transition-all duration-200 cursor-pointer
          "
          id="btn-assignment-add"
        >
          <CheckIcon className="w-4 h-4" />
          Thêm
        </button>
      </div>
    </div>
  );
}
