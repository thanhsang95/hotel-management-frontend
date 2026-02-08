'use client';

import { Booking, Room, RoomCategory } from '../../lib/types';
import { Modal } from '../ui/Modal';

// ==========================================
// Booking Detail Modal Component
// ==========================================

interface BookingDetailModalProps {
  booking: Booking | null;
  room?: Room;
  category?: RoomCategory;
  isOpen: boolean;
  onClose: () => void;
}

// Status display mapping
const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  Confirmed: { label: 'Đã xác nhận', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
  CheckedIn: { label: 'Đã check-in', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
  CheckedOut: { label: 'Đã check-out', color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.1)' },
  Pending: { label: 'Chờ xác nhận', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  Cancelled: { label: 'Đã hủy', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
  Maintenance: { label: 'Bảo trì', color: '#E11D48', bg: 'rgba(225, 29, 72, 0.1)' },
};

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const DEFAULT_CHECKIN_TIME = '14:00';
const DEFAULT_CHECKOUT_TIME = '12:00';

function formatDateTime(dateStr: string, time: string | undefined, defaultTime: string): string {
  return `${formatDate(dateStr)} — ${time || defaultTime}`;
}

export function BookingDetailModal({ booking, room, category, isOpen, onClose }: BookingDetailModalProps) {
  if (!booking) return null;

  const statusInfo = STATUS_MAP[booking.status] || STATUS_MAP.Confirmed;
  const isMaintenance = booking.status === 'Maintenance';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isMaintenance ? 'Chi tiết bảo trì' : 'Chi tiết đặt phòng'} size="medium">
      <div className="space-y-5">
        {/* Header: Booking code + status */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[#1E3A8A] font-heading">
            {booking.bookingCode}
          </span>
          <span
            className="px-3 py-1 rounded-full text-sm font-semibold"
            style={{ color: statusInfo.color, backgroundColor: statusInfo.bg }}
          >
            {statusInfo.label}
          </span>
        </div>

        {/* Guest Info — hidden for maintenance */}
        {!isMaintenance && (
          <div className="bg-[#F8FAFC] rounded-xl p-4 space-y-2">
            <h4 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">Thông tin khách</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DetailRow label="Tên khách" value={booking.guestName} />
              <DetailRow label="Điện thoại" value={booking.guestPhone || '—'} />
              <DetailRow label="Email" value={booking.guestEmail || '—'} />
              <DetailRow label="Nguồn" value={booking.source || '—'} />
            </div>
          </div>
        )}

        {/* Room Info */}
        <div className="bg-[#F8FAFC] rounded-xl p-4 space-y-2">
          <h4 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">Thông tin phòng</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DetailRow label="Phòng" value={room ? `${room.roomNumber} (Tầng ${room.floor})` : booking.roomId} />
            <DetailRow label="Hạng phòng" value={category?.name || '—'} />
          </div>
        </div>

        {/* Stay Details / Maintenance Period */}
        <div className="bg-[#F8FAFC] rounded-xl p-4 space-y-2">
          <h4 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">
            {isMaintenance ? 'Thời gian bảo trì' : 'Chi tiết lưu trú'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DetailRow
              label={isMaintenance ? 'Bắt đầu' : 'Check-in'}
              value={isMaintenance
                ? formatDate(booking.checkIn)
                : formatDateTime(booking.checkIn, booking.checkInTime, DEFAULT_CHECKIN_TIME)
              }
            />
            <DetailRow
              label={isMaintenance ? 'Kết thúc' : 'Check-out'}
              value={isMaintenance
                ? formatDate(booking.checkOut)
                : formatDateTime(booking.checkOut, booking.checkOutTime, DEFAULT_CHECKOUT_TIME)
              }
            />
            {!isMaintenance && (
              <>
                <DetailRow label="Số đêm" value={`${booking.nights} đêm`} />
                <DetailRow label="Tổng tiền" value={formatVND(booking.totalAmount)} highlight />
              </>
            )}
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className={`rounded-xl p-4 border ${
            isMaintenance
              ? 'bg-rose-50 border-rose-200'
              : 'bg-amber-50 border-amber-200'
          }`}>
            <h4 className={`text-sm font-semibold mb-1 ${
              isMaintenance ? 'text-rose-700' : 'text-amber-700'
            }`}>Ghi chú</h4>
            <p className={`text-sm ${
              isMaintenance ? 'text-rose-800' : 'text-amber-800'
            }`}>{booking.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

// Detail row helper
function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-[#9CA3AF] mb-0.5">{label}</p>
      <p className={`text-sm font-medium ${highlight ? 'text-[#1E3A8A] font-semibold' : 'text-[#1F2937]'}`}>
        {value}
      </p>
    </div>
  );
}

export default BookingDetailModal;
