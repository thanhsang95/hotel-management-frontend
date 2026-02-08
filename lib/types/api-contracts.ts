// ==========================================
// Hotel Management System - API Contracts
// Phase 3 Backend Integration Guide
// ==========================================

import type {
    Channel,
    CompanyProfile,
    Currency,
    CurrencyRate,
    DashboardData,
    Hotel,
    MarketSegment,
    PaginatedResponse,
    RateCode,
    Room,
    RoomCategory,
    RoomType,
    SearchParams,
    SourceCode,
} from './index';

// ==========================================
// API Response Wrapper
// ==========================================

/**
 * Standard API response wrapper for all endpoints
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;  // Field-level validation errors
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

// ==========================================
// Entity DTOs (Data Transfer Objects)
// ==========================================

// Currency
export type CreateCurrencyDto = Omit<Currency, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCurrencyDto = Partial<CreateCurrencyDto>;

// Room Type
export type CreateRoomTypeDto = Omit<RoomType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRoomTypeDto = Partial<CreateRoomTypeDto>;

// Room Category
export type CreateRoomCategoryDto = Omit<RoomCategory, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRoomCategoryDto = Partial<CreateRoomCategoryDto>;

// Room
export type CreateRoomDto = Omit<Room, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRoomDto = Partial<CreateRoomDto>;

// Market Segment
export type CreateMarketSegmentDto = Omit<MarketSegment, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMarketSegmentDto = Partial<CreateMarketSegmentDto>;

// Source Code
export type CreateSourceCodeDto = Omit<SourceCode, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSourceCodeDto = Partial<CreateSourceCodeDto>;

// Channel
export type CreateChannelDto = Omit<Channel, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateChannelDto = Partial<CreateChannelDto>;

// Rate Code
export type CreateRateCodeDto = Omit<RateCode, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRateCodeDto = Partial<CreateRateCodeDto>;

// Currency Rate
export type CreateCurrencyRateDto = Omit<CurrencyRate, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCurrencyRateDto = Partial<CreateCurrencyRateDto>;

// Company Profile
export type CreateCompanyProfileDto = Omit<CompanyProfile, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCompanyProfileDto = Partial<CreateCompanyProfileDto>;

// Hotel
export type CreateHotelDto = Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateHotelDto = Partial<CreateHotelDto>;

// ==========================================
// API Endpoint Specifications
// ==========================================

/**
 * Expected REST API Endpoints
 * 
 * All endpoints should:
 * - Accept/return JSON
 * - Use standard HTTP methods (GET, POST, PUT, DELETE)
 * - Return appropriate status codes (200, 201, 400, 404, 500)
 * - Support CORS for frontend domain
 */

export interface ApiEndpoints {
  // ==========================================
  // Currency Endpoints
  // ==========================================
  currencies: {
    /**
     * GET /api/currencies
     * List all currencies with optional pagination
     * Query: ?page=1&pageSize=10&query=VND
     */
    list: (params?: SearchParams) => Promise<ApiResponse<PaginatedResponse<Currency>>>;

    /**
     * GET /api/currencies/:id
     * Get single currency by ID
     */
    get: (id: string) => Promise<ApiResponse<Currency>>;

    /**
     * POST /api/currencies
     * Create new currency
     * Body: CreateCurrencyDto
     */
    create: (data: CreateCurrencyDto) => Promise<ApiResponse<Currency>>;

    /**
     * PUT /api/currencies/:id
     * Update existing currency
     * Body: UpdateCurrencyDto
     */
    update: (id: string, data: UpdateCurrencyDto) => Promise<ApiResponse<Currency>>;

    /**
     * DELETE /api/currencies/:id
     * Delete currency (soft delete recommended)
     */
    delete: (id: string) => Promise<ApiResponse<void>>;
  };

  // ==========================================
  // Room Type Endpoints
  // ==========================================
  roomTypes: {
    list: (params?: SearchParams) => Promise<ApiResponse<PaginatedResponse<RoomType>>>;
    get: (id: string) => Promise<ApiResponse<RoomType>>;
    create: (data: CreateRoomTypeDto) => Promise<ApiResponse<RoomType>>;
    update: (id: string, data: UpdateRoomTypeDto) => Promise<ApiResponse<RoomType>>;
    delete: (id: string) => Promise<ApiResponse<void>>;
  };

  // ==========================================
  // Room Category Endpoints
  // ==========================================
  roomCategories: {
    list: (params?: SearchParams) => Promise<ApiResponse<PaginatedResponse<RoomCategory>>>;
    get: (id: string) => Promise<ApiResponse<RoomCategory>>;
    create: (data: CreateRoomCategoryDto) => Promise<ApiResponse<RoomCategory>>;
    update: (id: string, data: UpdateRoomCategoryDto) => Promise<ApiResponse<RoomCategory>>;
    delete: (id: string) => Promise<ApiResponse<void>>;
  };

  // ==========================================
  // Room Endpoints
  // ==========================================
  rooms: {
    list: (params?: SearchParams) => Promise<ApiResponse<PaginatedResponse<Room>>>;
    get: (id: string) => Promise<ApiResponse<Room>>;
    create: (data: CreateRoomDto) => Promise<ApiResponse<Room>>;
    update: (id: string, data: UpdateRoomDto) => Promise<ApiResponse<Room>>;
    delete: (id: string) => Promise<ApiResponse<void>>;
    
    /**
     * PATCH /api/rooms/:id/status
     * Quick status update (for housekeeping)
     * Body: { statusId: string, isClean?: boolean }
     */
    updateStatus: (id: string, statusId: string, isClean?: boolean) => Promise<ApiResponse<Room>>;
  };

  // ==========================================
  // Market Segment Endpoints
  // ==========================================
  marketSegments: {
    list: (params?: SearchParams) => Promise<ApiResponse<PaginatedResponse<MarketSegment>>>;
    get: (id: string) => Promise<ApiResponse<MarketSegment>>;
    create: (data: CreateMarketSegmentDto) => Promise<ApiResponse<MarketSegment>>;
    update: (id: string, data: UpdateMarketSegmentDto) => Promise<ApiResponse<MarketSegment>>;
    delete: (id: string) => Promise<ApiResponse<void>>;
  };

  // ==========================================
  // Source Code Endpoints
  // ==========================================
  sourceCodes: {
    list: (params?: SearchParams) => Promise<ApiResponse<PaginatedResponse<SourceCode>>>;
    get: (id: string) => Promise<ApiResponse<SourceCode>>;
    create: (data: CreateSourceCodeDto) => Promise<ApiResponse<SourceCode>>;
    update: (id: string, data: UpdateSourceCodeDto) => Promise<ApiResponse<SourceCode>>;
    delete: (id: string) => Promise<ApiResponse<void>>;
  };

  // ==========================================
  // Channel Endpoints
  // ==========================================
  channels: {
    list: (params?: SearchParams) => Promise<ApiResponse<PaginatedResponse<Channel>>>;
    get: (id: string) => Promise<ApiResponse<Channel>>;
    create: (data: CreateChannelDto) => Promise<ApiResponse<Channel>>;
    update: (id: string, data: UpdateChannelDto) => Promise<ApiResponse<Channel>>;
    delete: (id: string) => Promise<ApiResponse<void>>;
  };

  // ==========================================
  // Rate Code Endpoints
  // ==========================================
  rateCodes: {
    list: (params?: SearchParams) => Promise<ApiResponse<PaginatedResponse<RateCode>>>;
    get: (id: string) => Promise<ApiResponse<RateCode>>;
    create: (data: CreateRateCodeDto) => Promise<ApiResponse<RateCode>>;
    update: (id: string, data: UpdateRateCodeDto) => Promise<ApiResponse<RateCode>>;
    delete: (id: string) => Promise<ApiResponse<void>>;
    
    /**
     * GET /api/rate-codes/active
     * Get currently active rate codes (within date range)
     */
    getActive: () => Promise<ApiResponse<RateCode[]>>;
  };

  // ==========================================
  // Currency Rate Endpoints
  // ==========================================
  currencyRates: {
    list: (params?: SearchParams) => Promise<ApiResponse<PaginatedResponse<CurrencyRate>>>;
    get: (id: string) => Promise<ApiResponse<CurrencyRate>>;
    create: (data: CreateCurrencyRateDto) => Promise<ApiResponse<CurrencyRate>>;
    update: (id: string, data: UpdateCurrencyRateDto) => Promise<ApiResponse<CurrencyRate>>;
    delete: (id: string) => Promise<ApiResponse<void>>;
    
    /**
     * GET /api/currency-rates/convert
     * Convert amount between currencies
     * Query: ?from=USD&to=VND&amount=100
     */
    convert: (fromCurrencyId: string, toCurrencyId: string, amount: number) => Promise<ApiResponse<{
      fromAmount: number;
      toAmount: number;
      rate: number;
      effectiveDate: string;
    }>>;
  };

  // ==========================================
  // Company Profile Endpoints
  // ==========================================
  companyProfiles: {
    list: (params?: SearchParams) => Promise<ApiResponse<PaginatedResponse<CompanyProfile>>>;
    get: (id: string) => Promise<ApiResponse<CompanyProfile>>;
    create: (data: CreateCompanyProfileDto) => Promise<ApiResponse<CompanyProfile>>;
    update: (id: string, data: UpdateCompanyProfileDto) => Promise<ApiResponse<CompanyProfile>>;
    delete: (id: string) => Promise<ApiResponse<void>>;
    
    /**
     * GET /api/company-profiles/search
     * Search by name or tax code
     * Query: ?q=company_name
     */
    search: (query: string) => Promise<ApiResponse<CompanyProfile[]>>;
  };

  // ==========================================
  // Hotel Endpoints
  // ==========================================
  hotels: {
    list: (params?: SearchParams) => Promise<ApiResponse<PaginatedResponse<Hotel>>>;
    get: (id: string) => Promise<ApiResponse<Hotel>>;
    create: (data: CreateHotelDto) => Promise<ApiResponse<Hotel>>;
    update: (id: string, data: UpdateHotelDto) => Promise<ApiResponse<Hotel>>;
    delete: (id: string) => Promise<ApiResponse<void>>;
    
    /**
     * GET /api/hotels/current
     * Get current hotel context (for single-property setup)
     */
    getCurrent: () => Promise<ApiResponse<Hotel>>;
  };

  // ==========================================
  // Dashboard Endpoints
  // ==========================================
  dashboard: {
    /**
     * GET /api/dashboard
     * Get complete dashboard data
     * Includes: KPIs, room status, arrivals, departures, revenue chart
     */
    getData: () => Promise<ApiResponse<DashboardData>>;
    
    /**
     * GET /api/dashboard/kpi
     * Get KPIs only (for real-time updates)
     */
    getKpi: () => Promise<ApiResponse<DashboardData['kpi']>>;
    
    /**
     * GET /api/dashboard/arrivals
     * Get today's arrivals
     */
    getArrivals: () => Promise<ApiResponse<DashboardData['arrivals']>>;
    
    /**
     * GET /api/dashboard/departures
     * Get today's departures
     */
    getDepartures: () => Promise<ApiResponse<DashboardData['departures']>>;
    
    /**
     * GET /api/dashboard/revenue
     * Get revenue chart data
     * Query: ?days=7 (default 7 days)
     */
    getRevenue: (days?: number) => Promise<ApiResponse<DashboardData['revenueChart']>>;
  };
}

// ==========================================
// Error Codes
// ==========================================

export const ApiErrorCodes = {
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  DUPLICATE_CODE: 'DUPLICATE_CODE',
  
  // Not Found
  NOT_FOUND: 'NOT_FOUND',
  ENTITY_NOT_FOUND: 'ENTITY_NOT_FOUND',
  
  // Business Logic
  CANNOT_DELETE_REFERENCED: 'CANNOT_DELETE_REFERENCED',
  INVALID_DATE_RANGE: 'INVALID_DATE_RANGE',
  CURRENCY_NOT_ACTIVE: 'CURRENCY_NOT_ACTIVE',
  
  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const;

// ==========================================
// HTTP Status Mapping
// ==========================================

/**
 * Expected HTTP status codes per operation:
 * 
 * GET (list/single): 200 OK
 * POST (create):     201 Created
 * PUT (update):      200 OK
 * DELETE:            204 No Content (or 200 with confirmation)
 * 
 * Errors:
 * 400 Bad Request:   Validation failed
 * 404 Not Found:     Entity not found
 * 409 Conflict:      Duplicate code/constraint violation
 * 500 Internal:      Server error
 */
