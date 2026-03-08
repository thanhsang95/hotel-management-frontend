'use client';

import { useState } from 'react';
import { useMockData } from '../../lib/context/MockDataContext';
import { DepositInfo, DepositMethod, ReservationType } from '../../lib/types';
import { formatCurrency, parseCurrency } from '../../lib/utils/format';
import { ValidationErrors } from './BookingWizard';

// ==========================================
// GuestInfoForm Types
// ==========================================

export interface GuestInfoFormData {
  registrationCode: string;
  bookingName: string;
  companyName: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  vip: boolean;
  passport: string;
  checkIn: string;
  checkOut: string;
  checkInTime: string;
  checkOutTime: string;
  adults: number;
  children: number;
  nights: number;
  extraBed: boolean;
  extraBedPrice: number;
  arrivalTime: string;
  departureTime: string;
  userCheckIn: string;
  marketSegmentId: string;
  channelId: string;
  sourceId: string;
  reservationType: ReservationType;
  deposit: DepositInfo;
  specialNotes: string;
  internalRequests: string;
}

interface GuestInfoFormProps {
  formData: GuestInfoFormData;
  reservationType: ReservationType;
  errors: ValidationErrors;
  onChange: (field: keyof GuestInfoFormData, value: unknown) => void;
  onDepositChange: (deposit: Partial<DepositInfo>) => void;
  onNightsChange: (nights: number) => void;
  calculatedNights: number;
}

// ==========================================
// Field Visibility Rules
// ==========================================

function getFieldVisibility(type: ReservationType) {
  return {
    companyName: type !== 'Walk-in',
    website: type !== 'Walk-in',
    vip: type !== 'Walk-in',
    passport: type !== 'Walk-in',
    deposit: type !== 'Walk-in',
    channel: true,
    source: true,
    segment: true,
  };
}

// ==========================================
// Reusable Field Components
// ==========================================

const labelStyle = 'block mb-1.5 text-sm font-medium text-[#1E3A8A]';
const inputStyle = `
  w-full px-3.5 py-2.5 rounded-lg
  border border-[#E2E8F0] bg-white
  text-sm text-[#1F2937]
  placeholder-[#9CA3AF]
  focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]
  transition-all duration-200
  disabled:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-60
`;
const errorInputStyle = 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20';
const errorTextStyle = 'mt-1 text-xs text-[#EF4444]';

function SectionHeader({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#F3F4F6]">
      <span className="text-lg">{icon}</span>
      <h3 className="text-sm font-bold text-[#1E3A8A] uppercase tracking-wide">{title}</h3>
    </div>
  );
}

// ==========================================
// Countries list
// ==========================================

const COUNTRIES = [
  'Việt Nam', 'Japan', 'South Korea', 'China', 'USA', 'Australia',
  'France', 'Germany', 'Thailand', 'Singapore', 'UK', 'India',
  'Malaysia', 'Indonesia', 'Philippines', 'Canada', 'Italy', 'Spain',
];

// ==========================================
// GuestInfoForm Component
// ==========================================

export function GuestInfoForm({
  formData,
  reservationType,
  errors,
  onChange,
  onDepositChange,
  onNightsChange,
  calculatedNights,
}: GuestInfoFormProps) {
  const { marketSegments, channels, sourceCodes } = useMockData();
  const visibility = getFieldVisibility(reservationType);

  const [depositDisplay, setDepositDisplay] = useState(
    formData.deposit.amount ? formatCurrency(formData.deposit.amount) : ''
  );

  const handleDepositFocus = () => {
    setDepositDisplay(formData.deposit.amount ? String(formData.deposit.amount) : '');
  };

  const handleDepositBlur = () => {
    const parsed = parseCurrency(depositDisplay);
    setDepositDisplay(parsed ? formatCurrency(parsed) : '');
    onDepositChange({ amount: parsed });
  };

  const handleDepositInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepositDisplay(e.target.value);
  };

  return (
    <div className="p-6 space-y-8" id="guest-info-form">
      {/* ========== Section A: Thông tin cơ bản ========== */}
      <section>
        <SectionHeader title="Thông tin cơ bản" icon="📋" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Registration Code */}
          <div>
            <label className={labelStyle}>Mã đăng ký</label>
            <input
              type="text"
              value={formData.registrationCode || ''}
              readOnly
              placeholder="Tự động tạo khi lưu"
              className={`${inputStyle} bg-[#F8FAFC] cursor-not-allowed`}
              id="input-reg-code"
            />
          </div>

          {/* Booking Name */}
          <div>
            <label className={labelStyle}>
              Tên Booking <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              value={formData.bookingName}
              onChange={(e) => onChange('bookingName', e.target.value)}
              placeholder="Nhập tên booking"
              className={`${inputStyle} ${errors.bookingName ? errorInputStyle : ''}`}
              id="input-booking-name"
            />
            {errors.bookingName && (
              <p className={errorTextStyle}>{errors.bookingName}</p>
            )}
          </div>

          {/* Company Name */}
          {visibility.companyName && (
            <div>
              <label className={labelStyle}>
                Tên Công Ty
                {reservationType === 'GIT' && (
                  <span className="text-[#EF4444] ml-1">*</span>
                )}
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => onChange('companyName', e.target.value)}
                placeholder="Nhập tên công ty"
                className={`${inputStyle} ${errors.companyName ? errorInputStyle : ''}`}
                id="input-company-name"
              />
              {errors.companyName && (
                <p className={errorTextStyle}>{errors.companyName}</p>
              )}
            </div>
          )}

          {/* Country */}
          <div>
            <label className={labelStyle}>Quốc gia</label>
            <div className="relative">
              <select
                value={formData.country}
                onChange={(e) => onChange('country', e.target.value)}
                className={`${inputStyle} appearance-none pr-10 cursor-pointer`}
                id="select-country"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-4 w-4 text-[#6B7280]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Section B: Liên hệ ========== */}
      <section>
        <SectionHeader title="Liên hệ" icon="📞" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Phone */}
          <div>
            <label className={labelStyle}>Số điện thoại</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="0123 456 789"
              className={inputStyle}
              id="input-phone"
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelStyle}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="email@example.com"
              className={`${inputStyle} ${errors.email ? errorInputStyle : ''}`}
              id="input-email"
            />
            {errors.email && (
              <p className={errorTextStyle}>{errors.email}</p>
            )}
          </div>

          {/* Website */}
          {visibility.website && (
            <div>
              <label className={labelStyle}>Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => onChange('website', e.target.value)}
                placeholder="www.example.com"
                className={inputStyle}
                id="input-website"
              />
            </div>
          )}

          {/* VIP */}
          {visibility.vip && (
            <div className="flex items-center h-full pt-6">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.vip}
                  onChange={(e) => onChange('vip', e.target.checked)}
                  className="w-5 h-5 rounded border-[#D1D5DB] text-[#F59E0B] focus:ring-[#F59E0B]/20 cursor-pointer"
                  id="checkbox-vip"
                />
                <span className="text-sm font-medium text-[#1E3A8A]">
                  Khách VIP
                </span>
                {formData.vip && (
                  <span className="text-xs bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-full font-semibold animate-pulse">
                    ⭐ VIP
                  </span>
                )}
              </label>
            </div>
          )}

          {/* Passport */}
          {visibility.passport && (
            <div>
              <label className={labelStyle}>Passport / CMND</label>
              <input
                type="text"
                value={formData.passport}
                onChange={(e) => onChange('passport', e.target.value)}
                placeholder="Số hộ chiếu / CMND"
                className={inputStyle}
                id="input-passport"
              />
            </div>
          )}
        </div>
      </section>

      {/* ========== Section C: Thời gian lưu trú ========== */}
      <section>
        <SectionHeader title="Thời gian lưu trú" icon="🗓️" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Check-in Date */}
          <div>
            <label className={labelStyle}>
              Ngày đến <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="date"
              value={formData.checkIn}
              onChange={(e) => onChange('checkIn', e.target.value)}
              className={`${inputStyle} ${errors.checkIn ? errorInputStyle : ''}`}
              disabled={reservationType === 'Walk-in'}
              id="input-checkin"
            />
            {errors.checkIn && (
              <p className={errorTextStyle}>{errors.checkIn}</p>
            )}
          </div>

          {/* Check-out Date */}
          <div>
            <label className={labelStyle}>
              Ngày đi <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="date"
              value={formData.checkOut}
              onChange={(e) => onChange('checkOut', e.target.value)}
              className={`${inputStyle} ${errors.checkOut ? errorInputStyle : ''}`}
              id="input-checkout"
            />
            {errors.checkOut && (
              <p className={errorTextStyle}>{errors.checkOut}</p>
            )}
          </div>

          {/* Nights */}
          <div>
            <label className={labelStyle}>Số đêm</label>
            <input
              type="number"
              min={1}
              value={calculatedNights || ''}
              onChange={(e) => {
                const nights = parseInt(e.target.value) || 0;
                if (nights > 0) {
                  onNightsChange(nights);
                }
              }}
              className={`${inputStyle} font-semibold text-[#1E3A8A]`}
              id="input-nights"
            />
          </div>

          {/* Check-in Time */}
          <div>
            <label className={labelStyle}>Giờ nhận phòng</label>
            <input
              type="time"
              value={formData.checkInTime}
              onChange={(e) => onChange('checkInTime', e.target.value)}
              className={inputStyle}
              id="input-checkin-time"
            />
          </div>

          {/* Check-out Time */}
          <div>
            <label className={labelStyle}>Giờ trả phòng</label>
            <input
              type="time"
              value={formData.checkOutTime}
              onChange={(e) => onChange('checkOutTime', e.target.value)}
              className={inputStyle}
              id="input-checkout-time"
            />
          </div>

          {/* Arrival Time */}
          <div>
            <label className={labelStyle}>Giờ đến dự kiến</label>
            <input
              type="time"
              value={formData.arrivalTime}
              onChange={(e) => onChange('arrivalTime', e.target.value)}
              className={inputStyle}
              id="input-arrival-time"
            />
          </div>

          {/* Departure Time */}
          <div>
            <label className={labelStyle}>Giờ đi dự kiến</label>
            <input
              type="time"
              value={formData.departureTime}
              onChange={(e) => onChange('departureTime', e.target.value)}
              className={inputStyle}
              id="input-departure-time"
            />
          </div>
        </div>

        {/* Guest counts row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {/* Adults */}
          <div>
            <label className={labelStyle}>
              Số người lớn <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={formData.adults}
              onChange={(e) => onChange('adults', parseInt(e.target.value) || 1)}
              className={`${inputStyle} ${errors.adults ? errorInputStyle : ''}`}
              id="input-adults"
            />
            {errors.adults && (
              <p className={errorTextStyle}>{errors.adults}</p>
            )}
          </div>

          {/* Children */}
          <div>
            <label className={labelStyle}>Số trẻ em</label>
            <input
              type="number"
              min={0}
              max={10}
              value={formData.children}
              onChange={(e) => onChange('children', parseInt(e.target.value) || 0)}
              className={inputStyle}
              id="input-children"
            />
          </div>

          {/* Extra Bed */}
          <div className="flex items-center h-full pt-6">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.extraBed}
                onChange={(e) => onChange('extraBed', e.target.checked)}
                className="w-5 h-5 rounded border-[#D1D5DB] text-[#1E40AF] focus:ring-[#1E40AF]/20 cursor-pointer"
                id="checkbox-extra-bed"
              />
              <span className="text-sm font-medium text-[#1E3A8A]">Thêm giường</span>
            </label>
          </div>

          {/* Extra Bed Price */}
          {formData.extraBed && (
            <div>
              <label className={labelStyle}>Giá thêm giường (VND)</label>
              <input
                type="number"
                min={0}
                step={50000}
                value={formData.extraBedPrice}
                onChange={(e) => onChange('extraBedPrice', parseInt(e.target.value) || 0)}
                className={inputStyle}
                id="input-extra-bed-price"
              />
            </div>
          )}
        </div>
      </section>

      {/* ========== Section D: Phân loại ========== */}
      <section>
        <SectionHeader title="Phân loại" icon="📊" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* User Check-in */}
          <div>
            <label className={labelStyle}>User check-in</label>
            <input
              type="text"
              value={formData.userCheckIn}
              readOnly
              placeholder="Nhân viên nhận phòng"
              className={`${inputStyle} bg-[#F8FAFC] cursor-not-allowed`}
              id="input-user-checkin"
            />
          </div>

          {/* Market Segment */}
          {visibility.segment && (
            <div>
              <label className={labelStyle}>Phân khúc thị trường</label>
              <div className="relative">
                <select
                  value={formData.marketSegmentId}
                  onChange={(e) => onChange('marketSegmentId', e.target.value)}
                  className={`${inputStyle} appearance-none pr-10 cursor-pointer`}
                  id="select-segment"
                >
                  <option value="">— Chọn —</option>
                  {marketSegments.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-4 w-4 text-[#6B7280]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Channel */}
          {visibility.channel && (
            <div>
              <label className={labelStyle}>Kênh phân phối</label>
              <div className="relative">
                <select
                  value={formData.channelId}
                  onChange={(e) => onChange('channelId', e.target.value)}
                  className={`${inputStyle} appearance-none pr-10 cursor-pointer`}
                  id="select-channel"
                >
                  <option value="">— Chọn —</option>
                  {channels.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-4 w-4 text-[#6B7280]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Source */}
          {visibility.source && (
            <div>
              <label className={labelStyle}>Nguồn booking</label>
              <div className="relative">
                <select
                  value={formData.sourceId}
                  onChange={(e) => onChange('sourceId', e.target.value)}
                  className={`${inputStyle} appearance-none pr-10 cursor-pointer`}
                  id="select-source"
                >
                  <option value="">— Chọn —</option>
                  {sourceCodes.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-4 w-4 text-[#6B7280]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========== Section E: Thanh toán & Ghi chú ========== */}
      <section>
        <SectionHeader title="Thanh toán & Ghi chú" icon="💰" />

        {/* Deposit */}
        {visibility.deposit && (
          <div className="mb-5">
            <label className="flex items-center gap-3 cursor-pointer select-none mb-3">
              <input
                type="checkbox"
                checked={formData.deposit.enabled}
                onChange={(e) => onDepositChange({ enabled: e.target.checked })}
                className="w-5 h-5 rounded border-[#D1D5DB] text-[#1E40AF] focus:ring-[#1E40AF]/20 cursor-pointer"
                id="checkbox-deposit"
              />
              <span className="text-sm font-medium text-[#1E3A8A]">Đặt cọc</span>
            </label>

            {formData.deposit.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8 p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                {/* Amount */}
                <div>
                  <label className={labelStyle}>
                    Số tiền đặt cọc (VND) <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={depositDisplay}
                    onChange={handleDepositInput}
                    onFocus={handleDepositFocus}
                    onBlur={handleDepositBlur}
                    placeholder="0"
                    className={`${inputStyle} ${errors['deposit.amount'] ? errorInputStyle : ''}`}
                    id="input-deposit-amount"
                  />
                  {errors['deposit.amount'] && (
                    <p className={errorTextStyle}>{errors['deposit.amount']}</p>
                  )}
                </div>

                {/* Method */}
                <div>
                  <label className={labelStyle}>
                    Hình thức đặt cọc <span className="text-[#EF4444]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.deposit.method || ''}
                      onChange={(e) => onDepositChange({ method: e.target.value as DepositMethod })}
                      className={`${inputStyle} appearance-none pr-10 cursor-pointer ${errors['deposit.method'] ? errorInputStyle : ''}`}
                      id="select-deposit-method"
                    >
                      <option value="">— Chọn —</option>
                      <option value="Cash">Tiền mặt</option>
                      <option value="BankTransfer">Chuyển khoản</option>
                      <option value="CreditCard">Thẻ tín dụng</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="h-4 w-4 text-[#6B7280]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  {errors['deposit.method'] && (
                    <p className={errorTextStyle}>{errors['deposit.method']}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Special Notes */}
          <div>
            <label className={labelStyle}>Ghi chú đặc biệt</label>
            <textarea
              value={formData.specialNotes}
              onChange={(e) => onChange('specialNotes', e.target.value)}
              placeholder="Ghi chú cho khách..."
              rows={3}
              className={`${inputStyle} resize-y min-h-[80px]`}
              id="textarea-special-notes"
            />
          </div>

          {/* Internal Requests */}
          <div>
            <label className={labelStyle}>Yêu cầu nội bộ</label>
            <textarea
              value={formData.internalRequests}
              onChange={(e) => onChange('internalRequests', e.target.value)}
              placeholder="Yêu cầu nội bộ cho nhân viên..."
              rows={3}
              className={`${inputStyle} resize-y min-h-[80px]`}
              id="textarea-internal-requests"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
