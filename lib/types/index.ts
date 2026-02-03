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
  code: string;           // 3 char code (VND, USD, EUR)
  name: string;
  symbol: string;         // ₫, $, €
  isActive: boolean;
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
  description?: string;
  amenities?: string[];
}

// ==========================================
// Room Entity
// ==========================================
export type RoomStatus = 'Vacant' | 'Occupied' | 'Dirty' | 'OOO';

export interface Room extends BaseEntity {
  roomNumber: string;
  floor: number;
  building?: string;
  categoryId: string;     // FK to RoomCategory
  status: RoomStatus;
  isClean: boolean;
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
  name: string;
  segmentId?: string;     // FK to MarketSegment
  channelId?: string;     // FK to Channel
  prices: RateCodePrice[];
  startDate: Date;
  endDate: Date;
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
  checkInTime: string;     // HH:mm format
  checkOutTime: string;    // HH:mm format
  defaultCurrencyId: string;  // FK to Currency
  taxPercent: number;      // VAT percentage
  serviceChargePercent: number;
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
