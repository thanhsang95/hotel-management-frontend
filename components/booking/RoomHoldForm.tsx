'use client';

import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';
import { RateCode, RoomCategory, RoomHold, RoomType } from '../../lib/types';

// ==========================================
// Types
// ==========================================

interface RoomHoldFormProps {
  roomTypes: RoomType[];
  roomCategories: RoomCategory[];
  rateCodes: RateCode[];
  checkIn: string;
  checkOut: string;
  getAvailableRoomCount: (
    roomTypeId: string,
    roomCategoryId: string,
    checkIn: string,
    checkOut: string,
    excludeReservationId?: string
  ) => number;
  reservationId?: string;
  onAdd: (hold: RoomHold) => void;
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
// RoomHoldForm Component
// ==========================================

export function RoomHoldForm({
  roomTypes,
  roomCategories,
  rateCodes,
  checkIn,
  checkOut,
  getAvailableRoomCount,
  reservationId,
  onAdd,
  onCancel,
}: RoomHoldFormProps) {
  const [roomTypeId, setRoomTypeId] = useState('');
  const [roomCategoryId, setRoomCategoryId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [roomPrice, setRoomPrice] = useState(0);
  const [rateCodeId, setRateCodeId] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [extraBed, setExtraBed] = useState(false);
  const [extraBedPrice, setExtraBedPrice] = useState(0);

  // Filtered categories based on selected room type
  const filteredCategories = useMemo(() => {
    if (!roomTypeId) return [];
    return roomCategories.filter((c) => c.roomTypeId === roomTypeId);
  }, [roomTypeId, roomCategories]);

  // Available room count
  const availableCount = useMemo(() => {
    if (!roomTypeId || !roomCategoryId || !checkIn || !checkOut) return 0;
    return getAvailableRoomCount(roomTypeId, roomCategoryId, checkIn, checkOut, reservationId);
  }, [roomTypeId, roomCategoryId, checkIn, checkOut, reservationId, getAvailableRoomCount]);

  // Handle type change → reset category
  const handleTypeChange = (typeId: string) => {
    setRoomTypeId(typeId);
    setRoomCategoryId('');
  };

  // Handle category change → auto-fill price from rate code
  const handleCategoryChange = (catId: string) => {
    setRoomCategoryId(catId);
    // Try to get price from first active rate code
    if (rateCodeId) {
      const rc = rateCodes.find((r) => r.id === rateCodeId);
      if (rc && rc.prices.length > 0) {
        setRoomPrice(rc.prices[0].amount);
      }
    }
  };

  const handleRateCodeChange = (rcId: string) => {
    setRateCodeId(rcId);
    const rc = rateCodes.find((r) => r.id === rcId);
    if (rc && rc.prices.length > 0) {
      setRoomPrice(rc.prices[0].amount);
    }
  };

  const handleSubmit = () => {
    if (!roomTypeId || !roomCategoryId || quantity < 1) return;

    const hold: RoomHold = {
      roomTypeId,
      roomCategoryId,
      quantity,
      roomPrice,
      rateCodeId: rateCodeId || undefined,
      adults,
      children,
      extraBed,
      extraBedPrice: extraBed ? extraBedPrice : 0,
    };

    onAdd(hold);
  };

  const isValid = roomTypeId && roomCategoryId && quantity > 0 && quantity <= availableCount;

  return (
    <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 mb-4 animate-in fade-in slide-in-from-top-2" id="room-hold-form">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Room Type */}
        <div>
          <label className={labelStyle}>Loại phòng *</label>
          <div className="relative">
            <select
              value={roomTypeId}
              onChange={(e) => handleTypeChange(e.target.value)}
              className={`${inputStyle} appearance-none pr-8 cursor-pointer`}
              id="select-hold-room-type"
            >
              <option value="">— Chọn —</option>
              {roomTypes.filter((rt) => rt.isActive).map((rt) => (
                <option key={rt.id} value={rt.id}>{rt.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg className="h-4 w-4 text-[#6B7280]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Room Category */}
        <div>
          <label className={labelStyle}>Hạng phòng *</label>
          <div className="relative">
            <select
              value={roomCategoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={`${inputStyle} appearance-none pr-8 cursor-pointer`}
              disabled={!roomTypeId}
              id="select-hold-room-category"
            >
              <option value="">— Chọn —</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg className="h-4 w-4 text-[#6B7280]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className={labelStyle}>
            Số lượng *
            {roomCategoryId && (
              <span className="ml-1 text-[#10B981] font-normal">
                (còn {availableCount})
              </span>
            )}
          </label>
          <input
            type="number"
            min={1}
            max={availableCount || 99}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className={inputStyle}
            id="input-hold-quantity"
          />
        </div>

        {/* Room Price */}
        <div>
          <label className={labelStyle}>Giá phòng (VND)</label>
          <input
            type="number"
            min={0}
            step={50000}
            value={roomPrice}
            onChange={(e) => setRoomPrice(parseInt(e.target.value) || 0)}
            className={inputStyle}
            id="input-hold-price"
          />
        </div>

        {/* Rate Code */}
        <div>
          <label className={labelStyle}>Mã giá</label>
          <div className="relative">
            <select
              value={rateCodeId}
              onChange={(e) => handleRateCodeChange(e.target.value)}
              className={`${inputStyle} appearance-none pr-8 cursor-pointer`}
              id="select-hold-rate-code"
            >
              <option value="">— Không chọn —</option>
              {rateCodes.filter((rc) => rc.isActive).map((rc) => (
                <option key={rc.id} value={rc.id}>{rc.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg className="h-4 w-4 text-[#6B7280]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
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
            id="input-hold-adults"
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
            id="input-hold-children"
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
              id="checkbox-hold-extra-bed"
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
              id="input-hold-extra-bed-price"
            />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-[#E2E8F0]">
        <button
          onClick={onCancel}
          className="
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            text-[#6B7280] hover:bg-[#F3F4F6]
            text-sm font-medium
            transition-all duration-200 cursor-pointer
          "
          id="btn-hold-cancel"
        >
          <XMarkIcon className="w-4 h-4" />
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`
            flex items-center gap-1.5 px-4 py-1.5 rounded-lg
            text-sm font-medium
            transition-all duration-200 cursor-pointer
            ${isValid
              ? 'bg-[#1E3A8A] text-white hover:bg-[#1E40AF]'
              : 'bg-[#E2E8F0] text-[#9CA3AF] cursor-not-allowed'
            }
          `}
          id="btn-hold-add"
        >
          <CheckIcon className="w-4 h-4" />
          Thêm
        </button>
      </div>
    </div>
  );
}
