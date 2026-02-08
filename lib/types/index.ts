// ==========================================
// Hotel Management System - TypeScript Types
// ==========================================

// Base Types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Currency Entity
// ==========================================
export interface Currency extends BaseEntity {
  code: string;                // 3 char code (VND, USD, EUR)
  name: string;
  symbol: string;              // ₫, $, €
  isActive: boolean;
  isDefault: boolean;          // Only one currency can be default
  thousandsSeparator: string;  // ',' or '.'
  decimalSeparator: string;    // '.' or ','
  decimalPlaces: number;       // Number of decimal places (0-4)
}

// ==========================================
// Room Type Entity
// ==========================================
export interface RoomType extends BaseEntity {
  code: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}

// ==========================================
// Room Category Entity
// ==========================================
export interface RoomCategory extends BaseEntity {
  code: string;
  name: string;
  roomTypeId: string;     // FK to RoomType
  maxOccupancy: number;
  bedType: string;        // Single, Double, Twin, King, Queen
  area: number;           // Square meters
  basePrice: number;      // Giá phòng (VNĐ)
  bedCount: number;       // Số giường
  description?: string;
  amenities?: string[];
}

// ==========================================
// Room Status Category
// ==========================================
export type RoomStatusCategory = 'Available' | 'Occupied' | 'Maintenance' | 'Transition';

// ==========================================
// Room Status Definition Entity
// ==========================================
export interface RoomStatusDefinition extends BaseEntity {
  code: string;              // Unique identifier (e.g., 'VACANT_CLEAN', 'CHECKIN')
  name: string;              // Display name (e.g., 'Vacant Clean', 'Check-in')
  description?: string;      // Optional detailed description
  color: string;             // UI color (success, info, warning, danger, secondary, primary)
  sortOrder: number;         // Display order (lower = first)
  isActive: boolean;         // Enable/disable status
  isSystemDefault: boolean;  // System-required statuses (cannot be deleted)
  category: RoomStatusCategory; // Grouping for organization
}

// ==========================================
// Room Entity
// ==========================================
// @deprecated - Use RoomStatusDefinition entity instead
export type RoomStatus = 'Vacant' | 'Occupied' | 'Dirty' | 'OOO';

export interface Room extends BaseEntity {
  roomNumber: string;
  floor: number;
  building?: string;
  categoryId: string;     // FK to RoomCategory
  statusId: string;       // FK to RoomStatusDefinition
  isClean: boolean;
  roomType?: string;      // Room type (e.g., "Standard", "Deluxe")
  notes?: string;
}

// ==========================================
// Market Segment Entity
// ==========================================
export interface MarketSegment extends BaseEntity {
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

// ==========================================
// Source Code Entity
// ==========================================
export interface SourceCode extends BaseEntity {
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

// ==========================================
// Channel Entity
// ==========================================
export interface Channel extends BaseEntity {
  code: string;
  name: string;
  externalMappingId?: string;
  description?: string;
  isActive: boolean;
}

// ==========================================
// Rate Code Entity
// ==========================================
export interface RateCodePrice {
  currencyId: string;
  amount: number;
}

export interface RateCode extends BaseEntity {
  code: string;
  name?: string;
  segmentId?: string;     // FK to MarketSegment
  channelId?: string;     // FK to Channel
  prices: RateCodePrice[];
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
}

// ==========================================
// Currency Rate (Exchange Rate) Entity
// ==========================================
export interface CurrencyRate extends BaseEntity {
  fromCurrencyId: string;  // FK to Currency
  toCurrencyId: string;    // FK to Currency
  rate: number;            // Exchange rate
  effectiveDate: Date;
}

// ==========================================
// Company Profile Entity
// ==========================================
export type CompanyType = 'Company' | 'TravelAgent';

export interface CompanyProfile extends BaseEntity {
  type: CompanyType;
  name: string;
  taxCode?: string;
  address?: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
  creditLimit?: number;
  source?: string;          // FK to SourceCode
  segment?: string;         // FK to MarketSegment
  channel?: string;         // FK to Channel
  isBlacklisted: boolean;
  linkedRateCodeId?: string;  // FK to RateCode
}

// ==========================================
// Hotel Entity
// ==========================================
export interface Hotel extends BaseEntity {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  taxCode?: string;
  taxId?: string;          // Mã số thuế
  checkInTime: string;     // HH:mm format
  checkOutTime: string;    // HH:mm format
  taxPercent: number;      // VAT percentage
  serviceChargePercent: number;
}

// ==========================================
// Booking Entity
// ==========================================
export type BookingStatus = 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled' | 'Pending' | 'Maintenance';

export interface Booking extends BaseEntity {
  bookingCode: string;         // e.g., '#BK-8321'
  guestName: string;
  guestPhone?: string;
  guestEmail?: string;
  roomId: string;              // FK to Room
  roomCategoryId: string;      // FK to RoomCategory
  checkIn: string;             // ISO date string (YYYY-MM-DD)
  checkOut: string;            // ISO date string (YYYY-MM-DD)
  checkInTime?: string;        // HH:mm format, defaults to '14:00' if absent
  checkOutTime?: string;       // HH:mm format, defaults to '12:00' if absent
  nights: number;
  totalAmount: number;         // VND
  status: BookingStatus;
  source?: string;             // 'Direct', 'Booking.com', 'Agoda', etc.
  notes?: string;
}

// ==========================================
// Reservation Types (Booking Management)
// ==========================================
export type ReservationType = 'FIT' | 'GIT' | 'Walk-in';
export type ReservationStatus = 'Confirmed' | 'Pending' | 'CheckedIn' | 'CheckedOut' | 'NoShow' | 'Cancelled';
export type DepositMethod = 'Cash' | 'BankTransfer' | 'CreditCard';
export type RoomAssignmentStatus = 'assigned' | 'released';

export interface DepositInfo {
  enabled: boolean;
  amount?: number;
  method?: DepositMethod;
}

export interface RoomHold {
  roomTypeId: string;
  roomCategoryId: string;
  quantity: number;
  roomPrice: number;
  rateCodeId?: string;
  adults: number;
  children: number;
  extraBed: boolean;
  extraBedPrice: number;
}

export interface RoomAssignment {
  roomHoldIndex: number;        // Index of the RoomHold this assignment belongs to
  roomId: string;               // FK to Room
  roomNumber: string;
  roomPrice: number;
  adults: number;
  children: number;
  childrenU7: number;           // Children under 7
  childrenU3: number;           // Children under 3
  extraBed: boolean;
  extraBedPrice: number;
  extraPerson: number;
  status: RoomAssignmentStatus;
}

export interface Reservation extends BaseEntity {
  registrationCode: string;      // e.g., 'RES-001'
  bookingName: string;
  companyName?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  vip: boolean;
  passport?: string;
  checkIn: string;               // ISO date string (YYYY-MM-DD)
  checkOut: string;              // ISO date string (YYYY-MM-DD)
  checkInTime: string;           // HH:mm format
  checkOutTime: string;          // HH:mm format
  adults: number;
  children: number;
  nights: number;
  extraBed: boolean;
  extraBedPrice: number;
  arrivalTime?: string;          // HH:mm format
  departureTime?: string;        // HH:mm format
  userCheckIn?: string;          // Staff who checked in
  marketSegmentId?: string;      // FK to MarketSegment
  channelId?: string;            // FK to Channel
  sourceId?: string;             // FK to SourceCode
  reservationType: ReservationType;
  deposit: DepositInfo;
  specialNotes?: string;
  internalRequests?: string;
  roomHolds: RoomHold[];
  roomAssignments: RoomAssignment[];
  status: ReservationStatus;
}

// ==========================================
// Dashboard Types
// ==========================================
export interface DashboardKPI {
  totalRooms: number;
  todayRevenue: number;
  currentGuests: number;
  occupancyRate: number;
}

export interface RoomStatusSummary {
  vacantClean: number;
  vacantDirty: number;
  occupied: number;
  outOfOrder: number;
}

export interface Arrival {
  id: string;
  guestName: string;
  roomNumber: string;
  expectedTime: string;    // HH:mm format
  isOverdue: boolean;
}

export interface Departure {
  id: string;
  guestName: string;
  roomNumber: string;
  checkoutTime: string;    // HH:mm format
  isLate: boolean;
}

export interface RevenueDataPoint {
  date: string;            // DD/MM format
  revenue: number;         // In base currency (VND millions)
}

export interface DashboardData {
  kpi: DashboardKPI;
  roomStatus: RoomStatusSummary;
  arrivals: Arrival[];
  departures: Departure[];
  revenueChart: RevenueDataPoint[];
}

// ==========================================
// Permission Entity (RBAC)
// ==========================================
export interface Permission {
  id: string;
  code: string;           // e.g., 'RES_VIEW', 'RES_CREATE'
  label: string;
  module: string;         // 'Reservation', 'Reception', etc.
  description?: string;
}

// ==========================================
// Role Entity (RBAC)
// ==========================================
export interface Role extends BaseEntity {
  name: string;
  description?: string;
  permissionIds: string[];
}

// ==========================================
// Employee Entity (RBAC)
// ==========================================
export type Gender = 'Male' | 'Female' | 'Other';
export type EmployeeStatus = 'Active' | 'Inactive';
export type AccountStatus = 'Active' | 'Locked';

export interface Employee extends BaseEntity {
  // Personal Info
  code: string;
  fullName: string;
  gender: Gender;
  dob: string;            // Date of birth (ISO string)
  phone: string;
  email: string;
  address: string;
  
  // Job Details
  departmentId: string;
  position: string;
  joinDate: string;       // ISO string
  status: EmployeeStatus;
  notes?: string;
  
  // Account & Access
  username: string;
  accountStatus: AccountStatus;
  roleIds: string[];
}

// ==========================================
// CRUD Operation Types
// ==========================================
export type CRUDAction = 'create' | 'read' | 'update' | 'delete';

export interface CRUDResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ==========================================
// API Response Types (for Phase 3)
// ==========================================
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchParams {
  query?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
