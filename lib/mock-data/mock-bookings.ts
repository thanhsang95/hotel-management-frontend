import { Booking, BookingStatus } from '../types';
import { MOCK_ROOMS } from './rooms';

// ==========================================
// Mock Booking Data Generator
// ==========================================

// Vietnamese guest names for realistic mock data
const GUEST_NAMES = [
  'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường', 'Phạm Minh Đức',
  'Hoàng Thị Em', 'Vũ Đình Phúc', 'Đỗ Thanh Giang', 'Bùi Quốc Huy',
  'Ngô Thị Lan', 'Đặng Văn Khoa', 'Lý Minh Long', 'Phan Thị Mai',
  'Trịnh Quang Nam', 'Dương Thị Oanh', 'Hồ Văn Phong', 'Mai Thị Quỳnh',
  'Cao Hữu Rạng', 'Lưu Thị Sen', 'Tạ Đức Thắng', 'Đinh Thị Uyên',
  'Nguyễn Thành Vinh', 'Trần Bảo Ngọc', 'Lê Thị Hồng', 'Phạm Văn Tâm',
  'Hoàng Đức Minh', 'Vũ Thị Hà', 'Đỗ Quốc Bảo', 'Bùi Thị Diễm',
  'Ngô Anh Tuấn', 'Đặng Thị Yến', 'Trương Văn Hải', 'Lê Thị Kim',
  'Phạm Quốc Toàn', 'Nguyễn Thị Mỹ', 'Vương Đình Lâm', 'Huỳnh Thị Ngọc',
  'Đoàn Minh Trí', 'Tô Thị Thanh', 'Châu Quốc Anh', 'Lâm Thị Hương',
  'Trần Đức Hòa', 'Nguyễn Thị Tuyết', 'Võ Văn Thành', 'Đặng Thị Loan',
  'Bùi Văn Đạt', 'Lê Thị Phượng', 'Phùng Quốc Việt', 'Mai Thị Hạnh',
  'Hà Minh Tùng', 'Nguyễn Thị Ánh',
];

const SOURCES = ['Direct', 'Booking.com', 'Agoda', 'Expedia', 'Traveloka', 'Walk-in'];

const NOTES_POOL = [
  'Khách VIP - cần chú ý đặc biệt',
  'Yêu cầu phòng yên tĩnh',
  'Đặt thêm giường phụ',
  'Khách đoàn công ty',
  'Cần hóa đơn VAT',
  'Check-in muộn sau 22h',
  'Khách quen - lần thứ 5',
  'Yêu cầu view biển',
  'Sinh nhật - chuẩn bị hoa + bánh',
  'Dị ứng hải sản - thông báo nhà bếp',
];

const MAINTENANCE_NOTES = [
  'Sửa chữa hệ thống điện',
  'Thay thế thiết bị vệ sinh',
  'Sơn lại phòng',
  'Bảo trì điều hòa',
  'Sửa chữa đường ống nước',
  'Nâng cấp nội thất',
];

// Simple seeded random for deterministic results
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toDateStr(date: Date): string {
  return date.toISOString().split('T')[0];
}

function normalizeEmail(name: string): string {
  return name.toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[đĐ]/g, 'd')
    .replace(/[àáảãạăắằẳẵặâấầẩẫậ]/g, 'a')
    .replace(/[èéẻẽẹêếềểễệ]/g, 'e')
    .replace(/[ìíỉĩị]/g, 'i')
    .replace(/[òóỏõọôốồổỗộơớờởỡợ]/g, 'o')
    .replace(/[ùúủũụưứừửữự]/g, 'u')
    .replace(/[ỳýỷỹỵ]/g, 'y');
}

function generateBookings(): Booking[] {
  const bookings: Booking[] = [];
  const random = seededRandom(42);
  // Use a fixed reference date for deterministic, hydration-safe mock data
  const today = new Date('2026-02-08T00:00:00');

  // 2-month window: 30 days before → 30 days after today
  const windowStart = addDays(today, -30);
  const windowEnd = addDays(today, 30);

  let bookingId = 1;

  MOCK_ROOMS.forEach((room) => {
    // === OOO rooms: create a single Maintenance entry spanning the window ===
    if (room.status === 'OOO') {
      const maintNote = MAINTENANCE_NOTES[Math.floor(random() * MAINTENANCE_NOTES.length)];
      bookings.push({
        id: bookingId.toString(),
        bookingCode: `#MT-${(1000 + bookingId).toString()}`,
        guestName: 'Bảo trì',
        guestPhone: undefined,
        guestEmail: undefined,
        roomId: room.id,
        roomCategoryId: room.categoryId,
        checkIn: toDateStr(windowStart),
        checkOut: toDateStr(windowEnd),
        nights: 60,
        totalAmount: 0,
        status: 'Maintenance' as BookingStatus,
        source: undefined,
        notes: maintNote,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      });
      bookingId++;
      return;
    }

    // Skip ~10% of rooms to leave some empty
    if (random() < 0.10) return;

    // === Regular rooms: fill with sequential, non-overlapping bookings ===
    // cursor tracks the earliest available date for next booking
    let cursor = new Date(windowStart);
    // Stagger start so not all rooms begin on the same day
    cursor = addDays(cursor, Math.floor(random() * 5));

    while (cursor < windowEnd) {
      // Random stay length: 2-5 nights (weighted towards 2-3)
      const nightsRoll = random();
      let nights: number;
      if (nightsRoll < 0.30) nights = 2;
      else if (nightsRoll < 0.55) nights = 3;
      else if (nightsRoll < 0.75) nights = 4;
      else if (nightsRoll < 0.90) nights = 5;
      else nights = Math.floor(random() * 3) + 6; // 6-8 nights (long stay)

      const checkIn = new Date(cursor);
      const checkOut = addDays(checkIn, nights);

      // Determine status based on dates relative to today
      let status: BookingStatus;
      const cancelRoll = random();
      if (cancelRoll < 0.04) {
        status = 'Cancelled';
      } else if (checkOut <= today) {
        status = 'CheckedOut';
      } else if (checkIn <= today && checkOut > today) {
        status = 'CheckedIn';
      } else if (checkIn > today) {
        status = random() < 0.25 ? 'Pending' : 'Confirmed';
      } else {
        status = 'Confirmed';
      }

      const guestName = GUEST_NAMES[Math.floor(random() * GUEST_NAMES.length)];
      const source = SOURCES[Math.floor(random() * SOURCES.length)];
      const phoneBase = Math.floor(random() * 900000000) + 100000000;

      // Price per night based on room category
      const catNum = parseInt(room.categoryId) || 1;
      const basePrice = (catNum * 200000) + 300000;
      const priceVariation = Math.floor(random() * 200000) - 100000;
      const totalAmount = (basePrice + priceVariation) * nights;

      const bkCode = `#BK-${(8000 + bookingId).toString()}`;

      // Notes — 15% chance
      const hasNotes = random() < 0.15;
      const notes = hasNotes ? NOTES_POOL[Math.floor(random() * NOTES_POOL.length)] : undefined;
      // Check-in/out times — ~30% have custom times, rest use defaults (14:00/12:00)
      const CHECKIN_TIMES = ['12:00', '13:00', '14:00', '15:00', '16:00'];
      const CHECKOUT_TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00'];
      const hasCustomTime = random() < 0.30;
      const checkInTime = hasCustomTime ? CHECKIN_TIMES[Math.floor(random() * CHECKIN_TIMES.length)] : undefined;
      const checkOutTime = hasCustomTime ? CHECKOUT_TIMES[Math.floor(random() * CHECKOUT_TIMES.length)] : undefined;

      bookings.push({
        id: bookingId.toString(),
        bookingCode: bkCode,
        guestName,
        guestPhone: `0${phoneBase}`,
        guestEmail: `${normalizeEmail(guestName)}@email.com`,
        roomId: room.id,
        roomCategoryId: room.categoryId,
        checkIn: toDateStr(checkIn),
        checkOut: toDateStr(checkOut),
        checkInTime,
        checkOutTime,
        nights,
        totalAmount,
        status,
        source,
        notes,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      });

      bookingId++;

      // Gap between bookings: always >= 1 day to prevent any overlap perception
      const gapRoll = random();
      let gap: number;
      if (gapRoll < 0.40) gap = 1;       // 1-day turnaround
      else if (gapRoll < 0.65) gap = 2;
      else if (gapRoll < 0.85) gap = 3;
      else gap = Math.floor(random() * 3) + 4; // 4-6 day gap

      // Next booking starts strictly after checkout + gap
      cursor = addDays(checkOut, gap);
    }
  });

  return bookings;
}

export const MOCK_BOOKINGS: Booking[] = generateBookings();
