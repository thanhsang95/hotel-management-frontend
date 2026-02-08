import {
    DepositMethod,
    Reservation,
    ReservationStatus,
    ReservationType,
    RoomAssignment,
    RoomHold,
} from '../types';
import { MOCK_ROOM_CATEGORIES } from './roomCategories';
import { MOCK_ROOMS } from './rooms';

// ==========================================
// Mock Reservation Data Generator
// ==========================================

// Seeded random for deterministic results (same pattern as mock-bookings.ts)
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

// Vietnamese guest/booking names
const BOOKING_NAMES = [
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
];

const COUNTRIES = [
  'Việt Nam', 'Việt Nam', 'Việt Nam', 'Việt Nam', 'Việt Nam', // weighted towards VN
  'Japan', 'South Korea', 'China', 'USA', 'Australia',
  'France', 'Germany', 'Thailand', 'Singapore', 'UK',
];

// Company IDs from MOCK_COMPANY_PROFILES (skip id '9' = blacklisted)
const COMPANY_IDS = ['1', '2', '3', '4', '5', '6', '7', '8', '10', '11', '12'];
const COMPANY_NAMES: Record<string, string> = {
  '1': 'Công ty TNHH ABC Việt Nam',
  '2': 'Samsung Electronics Vietnam',
  '3': 'Vietravel',
  '4': 'Saigontourist',
  '5': 'FPT Software',
  '6': 'Vingroup JSC',
  '7': 'Klook Vietnam',
  '8': 'VNG Corporation',
  '10': 'Vietnam Airlines',
  '11': 'Grab Vietnam',
  '12': 'Fiditour',
};

const MARKET_SEGMENT_IDS = ['1', '2', '3', '4', '5', '6'];
const CHANNEL_IDS = ['1', '2', '3', '4', '5', '7'];
const SOURCE_IDS = ['1', '2', '3', '4', '5', '6', '7'];
const DEPOSIT_METHODS: DepositMethod[] = ['Cash', 'BankTransfer', 'CreditCard'];

const SPECIAL_NOTES = [
  'Khách VIP - cần chú ý đặc biệt',
  'Yêu cầu phòng yên tĩnh, tầng cao',
  'Cần hóa đơn VAT',
  'Khách quen - giảm giá 10%',
  'Sinh nhật khách - chuẩn bị hoa',
  'Dị ứng hải sản - báo nhà bếp',
  'Khách đoàn công ty - cần phòng họp',
  'Yêu cầu xe đưa đón sân bay',
];

const INTERNAL_REQUESTS = [
  'Chuẩn bị welcome drink',
  'Upgrade phòng nếu còn trống',
  'Check-in nhanh cho VIP',
  'Đặt hoa tươi trong phòng',
  'Chuẩn bị trái cây chào mừng',
  'Liên hệ bộ phận F&B đặt bàn',
];

const STAFF_NAMES = [
  'Nguyễn Thị Hoa', 'Trần Văn Bình', 'Lê Minh Tuấn',
  'Phạm Thanh Hà', 'Hoàng Văn Đức', 'Vũ Thị Lan',
];

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

// Build a lookup: categoryId → roomTypeId
const categoryToType: Record<string, string> = {};
MOCK_ROOM_CATEGORIES.forEach((cat) => {
  categoryToType[cat.id] = cat.roomTypeId;
});

// Build available rooms grouped by categoryId
const roomsByCategory: Record<string, typeof MOCK_ROOMS> = {};
MOCK_ROOMS.forEach((room) => {
  if (room.statusId !== '6') { // Exclude OOO rooms (statusId '6' = Out of Order)
    if (!roomsByCategory[room.categoryId]) {
      roomsByCategory[room.categoryId] = [];
    }
    roomsByCategory[room.categoryId].push(room);
  }
});

// Price mapping per room category (VND per night)
const CATEGORY_PRICES: Record<string, number> = {
  '1': 500000,    // STD-SGL
  '2': 700000,    // STD-DBL
  '3': 700000,    // STD-TWN
  '4': 1000000,   // SUP-DBL
  '5': 1000000,   // SUP-TWN
  '6': 1500000,   // DLX-KNG
  '7': 1800000,   // DLX-FAM
  '8': 2500000,   // STE-JNR
  '9': 3500000,   // STE-STD
  '10': 8000000,  // STE-PRS
  '11': 2000000,  // EXE-KNG
  '12': 2000000,  // EXE-TWN
};

function generateReservations(): Reservation[] {
  const reservations: Reservation[] = [];
  const random = seededRandom(777); // Different seed from bookings
  const today = new Date('2026-02-08T00:00:00');

  // Track which rooms have been assigned to avoid conflicts
  const assignedRoomDates: Map<string, { checkIn: string; checkOut: string }[]> = new Map();

  function isRoomAvailable(roomId: string, checkIn: string, checkOut: string): boolean {
    const bookings = assignedRoomDates.get(roomId) || [];
    return !bookings.some(
      (b) => checkIn < b.checkOut && checkOut > b.checkIn
    );
  }

  function markRoomAssigned(roomId: string, checkIn: string, checkOut: string): void {
    if (!assignedRoomDates.has(roomId)) {
      assignedRoomDates.set(roomId, []);
    }
    assignedRoomDates.get(roomId)!.push({ checkIn, checkOut });
  }

  const TARGET_COUNT = 40;

  for (let i = 0; i < TARGET_COUNT; i++) {
    const id = (i + 1).toString();
    const regCode = `RES-${(i + 1).toString().padStart(3, '0')}`;

    // Determine reservation type: 60% FIT, 25% GIT, 15% Walk-in
    const typeRoll = random();
    let reservationType: ReservationType;
    if (typeRoll < 0.60) reservationType = 'FIT';
    else if (typeRoll < 0.85) reservationType = 'GIT';
    else reservationType = 'Walk-in';

    // Date range: spread across -15 to +20 days from today
    const offsetDays = Math.floor(random() * 35) - 15;
    const checkInDate = addDays(today, offsetDays);
    const nights = reservationType === 'Walk-in'
      ? Math.floor(random() * 2) + 1  // 1-2 nights
      : Math.floor(random() * 5) + 1; // 1-5 nights
    const checkOutDate = addDays(checkInDate, nights);

    const checkIn = toDateStr(checkInDate);
    const checkOut = toDateStr(checkOutDate);

    // Determine status based on dates and random
    let status: ReservationStatus;
    const statusRoll = random();
    if (statusRoll < 0.04) {
      status = 'Cancelled';
    } else if (statusRoll < 0.08) {
      status = 'NoShow';
    } else if (checkOutDate <= today) {
      status = 'CheckedOut';
    } else if (checkInDate <= today && checkOutDate > today) {
      status = 'CheckedIn';
    } else {
      status = random() < 0.30 ? 'Pending' : 'Confirmed';
    }

    const bookingName = BOOKING_NAMES[Math.floor(random() * BOOKING_NAMES.length)];
    const country = COUNTRIES[Math.floor(random() * COUNTRIES.length)];
    const phone = `0${Math.floor(random() * 900000000 + 100000000)}`;
    const email = `${normalizeEmail(bookingName)}@email.com`;

    // Company — always for GIT, sometimes for FIT, never for Walk-in
    let companyName: string | undefined;
    if (reservationType === 'GIT') {
      const cid = COMPANY_IDS[Math.floor(random() * COMPANY_IDS.length)];
      companyName = COMPANY_NAMES[cid];
    } else if (reservationType === 'FIT' && random() < 0.30) {
      const cid = COMPANY_IDS[Math.floor(random() * COMPANY_IDS.length)];
      companyName = COMPANY_NAMES[cid];
    }

    // VIP, passport — not for Walk-in
    const vip = reservationType !== 'Walk-in' && random() < 0.15;
    const passport = reservationType !== 'Walk-in' && random() < 0.40
      ? `P${Math.floor(random() * 900000000 + 100000000)}`
      : undefined;
    const website = reservationType !== 'Walk-in' && companyName && random() < 0.50
      ? `www.${normalizeEmail(companyName).replace(/\./g, '')}.com`
      : undefined;

    // Adults/children
    const adults = reservationType === 'GIT'
      ? Math.floor(random() * 10) + 2
      : Math.floor(random() * 2) + 1;
    const children = random() < 0.25 ? Math.floor(random() * 3) + 1 : 0;

    // Extra bed
    const extraBed = random() < 0.15;
    const extraBedPrice = extraBed ? 200000 : 0;

    // Times
    const checkInTime = '14:00';
    const checkOutTime = '12:00';
    const ARRIVAL_TIMES = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
    const arrivalTime = random() < 0.60
      ? ARRIVAL_TIMES[Math.floor(random() * ARRIVAL_TIMES.length)]
      : undefined;
    const departureTime = random() < 0.30 ? '12:00' : undefined;

    // Classification
    const userCheckIn = status === 'CheckedIn'
      ? STAFF_NAMES[Math.floor(random() * STAFF_NAMES.length)]
      : undefined;
    const marketSegmentId = reservationType !== 'Walk-in'
      ? MARKET_SEGMENT_IDS[Math.floor(random() * MARKET_SEGMENT_IDS.length)]
      : undefined;
    const channelId = reservationType !== 'Walk-in'
      ? CHANNEL_IDS[Math.floor(random() * CHANNEL_IDS.length)]
      : (random() < 0.30 ? '1' : undefined); // Walk-in sometimes has Direct channel
    const sourceId = reservationType !== 'Walk-in'
      ? SOURCE_IDS[Math.floor(random() * SOURCE_IDS.length)]
      : '1'; // Walk-in = Direct

    // Deposit — not for Walk-in
    const depositEnabled = reservationType !== 'Walk-in' && random() < 0.55;
    const deposit = {
      enabled: depositEnabled,
      amount: depositEnabled ? Math.floor(random() * 5 + 1) * 500000 : undefined,
      method: depositEnabled
        ? DEPOSIT_METHODS[Math.floor(random() * DEPOSIT_METHODS.length)]
        : undefined,
    };

    // Notes
    const specialNotes = random() < 0.20
      ? SPECIAL_NOTES[Math.floor(random() * SPECIAL_NOTES.length)]
      : undefined;
    const internalRequests = random() < 0.15
      ? INTERNAL_REQUESTS[Math.floor(random() * INTERNAL_REQUESTS.length)]
      : undefined;

    // Room holds & assignments
    const roomHolds: RoomHold[] = [];
    const roomAssignments: RoomAssignment[] = [];

    // Pick category IDs based on type
    const availableCategoryIds = Object.keys(roomsByCategory);

    if (reservationType === 'GIT') {
      // GIT: Hold multiple room types, 2-5 rooms total
      const holdCount = Math.floor(random() * 2) + 1; // 1-2 types of rooms
      for (let h = 0; h < holdCount; h++) {
        const catId = availableCategoryIds[Math.floor(random() * availableCategoryIds.length)];
        const typeId = categoryToType[catId] || '1';
        const quantity = Math.floor(random() * 3) + 1; // 1-3 rooms per type
        const price = CATEGORY_PRICES[catId] || 1000000;

        roomHolds.push({
          roomTypeId: typeId,
          roomCategoryId: catId,
          quantity,
          roomPrice: price,
          rateCodeId: String(Math.floor(random() * 6) + 1),
          adults: Math.floor(random() * 2) + 1,
          children: random() < 0.20 ? 1 : 0,
          extraBed: random() < 0.10,
          extraBedPrice: random() < 0.10 ? 200000 : 0,
        });

        // Assign some rooms for this hold (50-100% assignment rate)
        const assignCount = Math.max(1, Math.floor(quantity * (0.5 + random() * 0.5)));
        const candidateRooms = (roomsByCategory[catId] || []).filter(
          (r) => isRoomAvailable(r.id, checkIn, checkOut)
        );

        // Prefer same floor if possible
        candidateRooms.sort((a, b) => a.floor - b.floor);

        for (let a = 0; a < Math.min(assignCount, candidateRooms.length); a++) {
          const room = candidateRooms[a];
          markRoomAssigned(room.id, checkIn, checkOut);
          roomAssignments.push({
            roomHoldIndex: h,
            roomId: room.id,
            roomNumber: room.roomNumber,
            roomPrice: price + Math.floor((random() - 0.5) * 100000),
            adults: Math.floor(random() * 2) + 1,
            children: random() < 0.20 ? 1 : 0,
            childrenU7: 0,
            childrenU3: 0,
            extraBed: random() < 0.10,
            extraBedPrice: random() < 0.10 ? 200000 : 0,
            extraPerson: 0,
            status: status === 'Cancelled' ? 'released' : 'assigned',
          });
        }
      }
    } else if (reservationType === 'FIT') {
      // FIT: Single room, direct assign
      const catId = availableCategoryIds[Math.floor(random() * availableCategoryIds.length)];
      const typeId = categoryToType[catId] || '1';
      const price = CATEGORY_PRICES[catId] || 1000000;

      roomHolds.push({
        roomTypeId: typeId,
        roomCategoryId: catId,
        quantity: 1,
        roomPrice: price,
        rateCodeId: String(Math.floor(random() * 6) + 1),
        adults: adults,
        children: children,
        extraBed: extraBed,
        extraBedPrice: extraBedPrice,
      });

      // Find an available room
      const candidateRooms = (roomsByCategory[catId] || []).filter(
        (r) => isRoomAvailable(r.id, checkIn, checkOut)
      );

      if (candidateRooms.length > 0) {
        const room = candidateRooms[Math.floor(random() * candidateRooms.length)];
        markRoomAssigned(room.id, checkIn, checkOut);
        roomAssignments.push({
          roomHoldIndex: 0,
          roomId: room.id,
          roomNumber: room.roomNumber,
          roomPrice: price,
          adults,
          children,
          childrenU7: 0,
          childrenU3: 0,
          extraBed,
          extraBedPrice,
          extraPerson: 0,
          status: status === 'Cancelled' ? 'released' : 'assigned',
        });
      }
    } else {
      // Walk-in: Direct single room, no hold step
      const catId = availableCategoryIds[Math.floor(random() * availableCategoryIds.length)];
      const typeId = categoryToType[catId] || '1';
      const price = CATEGORY_PRICES[catId] || 1000000;

      roomHolds.push({
        roomTypeId: typeId,
        roomCategoryId: catId,
        quantity: 1,
        roomPrice: price,
        adults,
        children,
        extraBed: false,
        extraBedPrice: 0,
      });

      const candidateRooms = (roomsByCategory[catId] || []).filter(
        (r) => isRoomAvailable(r.id, checkIn, checkOut)
      );

      if (candidateRooms.length > 0) {
        const room = candidateRooms[Math.floor(random() * candidateRooms.length)];
        markRoomAssigned(room.id, checkIn, checkOut);
        roomAssignments.push({
          roomHoldIndex: 0,
          roomId: room.id,
          roomNumber: room.roomNumber,
          roomPrice: price,
          adults,
          children,
          childrenU7: 0,
          childrenU3: 0,
          extraBed: false,
          extraBedPrice: 0,
          extraPerson: 0,
          status: status === 'Cancelled' ? 'released' : 'assigned',
        });
      }
    }

    reservations.push({
      id,
      registrationCode: regCode,
      bookingName,
      companyName,
      country,
      phone,
      email,
      website,
      vip,
      passport,
      checkIn,
      checkOut,
      checkInTime,
      checkOutTime,
      adults,
      children,
      nights,
      extraBed,
      extraBedPrice,
      arrivalTime,
      departureTime,
      userCheckIn,
      marketSegmentId,
      channelId,
      sourceId,
      reservationType,
      deposit,
      specialNotes,
      internalRequests,
      roomHolds,
      roomAssignments,
      status,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    });
  }

  return reservations;
}

export const MOCK_RESERVATIONS: Reservation[] = generateReservations();
