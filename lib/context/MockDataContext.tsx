'use client';

import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import {
    MOCK_BOOKINGS,
    MOCK_CHANNELS,
    MOCK_COMPANY_PROFILES,
    MOCK_CURRENCIES,
    MOCK_CURRENCY_RATES,
    MOCK_DASHBOARD_DATA,
    MOCK_HOTELS,
    MOCK_MARKET_SEGMENTS,
    MOCK_RATE_CODES,
    MOCK_RESERVATIONS,
    MOCK_ROOM_CATEGORIES,
    MOCK_ROOM_STATUS_DEFINITIONS,
    MOCK_ROOM_TYPES,
    MOCK_ROOMS,
    MOCK_SOURCE_CODES,
} from '../mock-data';
import {
    Booking,
    Channel,
    CompanyProfile,
    Currency,
    CurrencyRate,
    DashboardData,
    Hotel,
    MarketSegment,
    RateCode,
    Reservation,
    Room,
    RoomCategory,
    RoomStatusDefinition,
    RoomType,
    SourceCode,
} from '../types';

// ==========================================
// Context Type Definitions
// ==========================================

interface MockDataContextType {
  // Data State
  bookings: Booking[];
  reservations: Reservation[];
  currencies: Currency[];
  roomTypes: RoomType[];
  roomCategories: RoomCategory[];
  rooms: Room[];
  marketSegments: MarketSegment[];
  sourceCodes: SourceCode[];
  channels: Channel[];
  rateCodes: RateCode[];
  currencyRates: CurrencyRate[];
  companyProfiles: CompanyProfile[];
  hotels: Hotel[];
  dashboardData: DashboardData;
  roomStatusDefinitions: RoomStatusDefinition[];

  // Currency CRUD
  addCurrency: (currency: Omit<Currency, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCurrency: (id: string, currency: Partial<Currency>) => void;
  deleteCurrency: (id: string) => void;

  // Room Type CRUD
  addRoomType: (roomType: Omit<RoomType, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRoomType: (id: string, roomType: Partial<RoomType>) => void;
  deleteRoomType: (id: string) => void;

  // Room Category CRUD
  addRoomCategory: (roomCategory: Omit<RoomCategory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRoomCategory: (id: string, roomCategory: Partial<RoomCategory>) => void;
  deleteRoomCategory: (id: string) => void;

  // Room CRUD
  addRoom: (room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => void;

  // Market Segment CRUD
  addMarketSegment: (segment: Omit<MarketSegment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMarketSegment: (id: string, segment: Partial<MarketSegment>) => void;
  deleteMarketSegment: (id: string) => void;

  // Source Code CRUD
  addSourceCode: (source: Omit<SourceCode, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSourceCode: (id: string, source: Partial<SourceCode>) => void;
  deleteSourceCode: (id: string) => void;

  // Channel CRUD
  addChannel: (channel: Omit<Channel, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateChannel: (id: string, channel: Partial<Channel>) => void;
  deleteChannel: (id: string) => void;

  // Rate Code CRUD
  addRateCode: (rateCode: Omit<RateCode, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRateCode: (id: string, rateCode: Partial<RateCode>) => void;
  deleteRateCode: (id: string) => void;

  // Currency Rate CRUD
  addCurrencyRate: (rate: Omit<CurrencyRate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCurrencyRate: (id: string, rate: Partial<CurrencyRate>) => void;
  deleteCurrencyRate: (id: string) => void;

  // Company Profile CRUD
  addCompanyProfile: (company: Omit<CompanyProfile, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCompanyProfile: (id: string, company: Partial<CompanyProfile>) => void;
  deleteCompanyProfile: (id: string) => void;

  // Hotel CRUD
  addHotel: (hotel: Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateHotel: (id: string, hotel: Partial<Hotel>) => void;
  deleteHotel: (id: string) => void;

  // Room Status Definition CRUD
  addRoomStatusDefinition: (status: Omit<RoomStatusDefinition, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRoomStatusDefinition: (id: string, status: Partial<RoomStatusDefinition>) => void;
  deleteRoomStatusDefinition: (id: string) => void;

  // Reservation CRUD
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReservation: (id: string, reservation: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;

  // Room Inventory Helpers
  getAvailableRoomCount: (
    roomTypeId: string,
    roomCategoryId: string,
    checkIn: string,
    checkOut: string,
    excludeReservationId?: string
  ) => number;
  getAvailableRoomsForCategory: (
    categoryId: string,
    checkIn: string,
    checkOut: string,
    excludeReservationId?: string
  ) => Room[];

  // Helper Functions
  searchItems: <T extends { id: string }>(
    items: T[],
    query: string,
    searchKeys: (keyof T)[]
  ) => T[];
  getById: <T extends { id: string }>(items: T[], id: string) => T | undefined;
}

// ==========================================
// Context Creation
// ==========================================

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

// ==========================================
// Helper: Generate unique ID
// ==========================================

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// ==========================================
// Provider Component
// ==========================================

interface MockDataProviderProps {
  children: ReactNode;
}

export function MockDataProvider({ children }: MockDataProviderProps) {
  // State for all entities
  const [currencies, setCurrencies] = useState<Currency[]>(MOCK_CURRENCIES);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(MOCK_ROOM_TYPES);
  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>(MOCK_ROOM_CATEGORIES);
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [marketSegments, setMarketSegments] = useState<MarketSegment[]>(MOCK_MARKET_SEGMENTS);
  const [sourceCodes, setSourceCodes] = useState<SourceCode[]>(MOCK_SOURCE_CODES);
  const [channels, setChannels] = useState<Channel[]>(MOCK_CHANNELS);
  const [rateCodes, setRateCodes] = useState<RateCode[]>(MOCK_RATE_CODES);
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>(MOCK_CURRENCY_RATES);
  const [companyProfiles, setCompanyProfiles] = useState<CompanyProfile[]>(MOCK_COMPANY_PROFILES);
  const [hotels, setHotels] = useState<Hotel[]>(MOCK_HOTELS);
  const [bookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
  const [dashboardData] = useState<DashboardData>(MOCK_DASHBOARD_DATA);
  const [roomStatusDefinitions, setRoomStatusDefinitions] = useState<RoomStatusDefinition[]>(MOCK_ROOM_STATUS_DEFINITIONS);

  // ==========================================
  // Currency CRUD Operations
  // ==========================================

  const addCurrency = useCallback((currency: Omit<Currency, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCurrency: Currency = {
      ...currency,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCurrencies((prev) => [...prev, newCurrency]);
  }, []);

  const updateCurrency = useCallback((id: string, currency: Partial<Currency>) => {
    setCurrencies((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...currency, updatedAt: new Date() } : item
      )
    );
  }, []);

  const deleteCurrency = useCallback((id: string) => {
    setCurrencies((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ==========================================
  // Room Type CRUD Operations
  // ==========================================

  const addRoomType = useCallback((roomType: Omit<RoomType, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRoomType: RoomType = {
      ...roomType,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRoomTypes((prev) => [...prev, newRoomType]);
  }, []);

  const updateRoomType = useCallback((id: string, roomType: Partial<RoomType>) => {
    setRoomTypes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...roomType, updatedAt: new Date() } : item
      )
    );
  }, []);

  const deleteRoomType = useCallback((id: string) => {
    setRoomTypes((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ==========================================
  // Room Category CRUD Operations
  // ==========================================

  const addRoomCategory = useCallback((roomCategory: Omit<RoomCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRoomCategory: RoomCategory = {
      ...roomCategory,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRoomCategories((prev) => [...prev, newRoomCategory]);
  }, []);

  const updateRoomCategory = useCallback((id: string, roomCategory: Partial<RoomCategory>) => {
    setRoomCategories((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...roomCategory, updatedAt: new Date() } : item
      )
    );
  }, []);

  const deleteRoomCategory = useCallback((id: string) => {
    setRoomCategories((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ==========================================
  // Room CRUD Operations
  // ==========================================

  const addRoom = useCallback((room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRoom: Room = {
      ...room,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRooms((prev) => [...prev, newRoom]);
  }, []);

  const updateRoom = useCallback((id: string, room: Partial<Room>) => {
    setRooms((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...room, updatedAt: new Date() } : item
      )
    );
  }, []);

  const deleteRoom = useCallback((id: string) => {
    setRooms((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ==========================================
  // Market Segment CRUD Operations
  // ==========================================

  const addMarketSegment = useCallback((segment: Omit<MarketSegment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSegment: MarketSegment = {
      ...segment,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMarketSegments((prev) => [...prev, newSegment]);
  }, []);

  const updateMarketSegment = useCallback((id: string, segment: Partial<MarketSegment>) => {
    setMarketSegments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...segment, updatedAt: new Date() } : item
      )
    );
  }, []);

  const deleteMarketSegment = useCallback((id: string) => {
    setMarketSegments((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ==========================================
  // Source Code CRUD Operations
  // ==========================================

  const addSourceCode = useCallback((source: Omit<SourceCode, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSource: SourceCode = {
      ...source,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSourceCodes((prev) => [...prev, newSource]);
  }, []);

  const updateSourceCode = useCallback((id: string, source: Partial<SourceCode>) => {
    setSourceCodes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...source, updatedAt: new Date() } : item
      )
    );
  }, []);

  const deleteSourceCode = useCallback((id: string) => {
    setSourceCodes((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ==========================================
  // Channel CRUD Operations
  // ==========================================

  const addChannel = useCallback((channel: Omit<Channel, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newChannel: Channel = {
      ...channel,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setChannels((prev) => [...prev, newChannel]);
  }, []);

  const updateChannel = useCallback((id: string, channel: Partial<Channel>) => {
    setChannels((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...channel, updatedAt: new Date() } : item
      )
    );
  }, []);

  const deleteChannel = useCallback((id: string) => {
    setChannels((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ==========================================
  // Rate Code CRUD Operations
  // ==========================================

  const addRateCode = useCallback((rateCode: Omit<RateCode, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRateCode: RateCode = {
      ...rateCode,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRateCodes((prev) => [...prev, newRateCode]);
  }, []);

  const updateRateCode = useCallback((id: string, rateCode: Partial<RateCode>) => {
    setRateCodes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...rateCode, updatedAt: new Date() } : item
      )
    );
  }, []);

  const deleteRateCode = useCallback((id: string) => {
    setRateCodes((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ==========================================
  // Currency Rate CRUD Operations
  // ==========================================

  const addCurrencyRate = useCallback((rate: Omit<CurrencyRate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRate: CurrencyRate = {
      ...rate,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCurrencyRates((prev) => [...prev, newRate]);
  }, []);

  const updateCurrencyRate = useCallback((id: string, rate: Partial<CurrencyRate>) => {
    setCurrencyRates((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...rate, updatedAt: new Date() } : item
      )
    );
  }, []);

  const deleteCurrencyRate = useCallback((id: string) => {
    setCurrencyRates((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ==========================================
  // Company Profile CRUD Operations
  // ==========================================

  const addCompanyProfile = useCallback((company: Omit<CompanyProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCompany: CompanyProfile = {
      ...company,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCompanyProfiles((prev) => [...prev, newCompany]);
  }, []);

  const updateCompanyProfile = useCallback((id: string, company: Partial<CompanyProfile>) => {
    setCompanyProfiles((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...company, updatedAt: new Date() } : item
      )
    );
  }, []);

  const deleteCompanyProfile = useCallback((id: string) => {
    setCompanyProfiles((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ==========================================
  // Hotel CRUD Operations
  // ==========================================

  const addHotel = useCallback((hotel: Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newHotel: Hotel = {
      ...hotel,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setHotels((prev) => [...prev, newHotel]);
  }, []);

  const updateHotel = useCallback((id: string, hotel: Partial<Hotel>) => {
    setHotels((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...hotel, updatedAt: new Date() } : item
      )
    );
  }, []);

  const deleteHotel = useCallback((id: string) => {
    setHotels((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ==========================================
  // Reservation CRUD Operations
  // ==========================================

  const addReservation = useCallback((reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReservation: Reservation = {
      ...reservation,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setReservations((prev) => [...prev, newReservation]);
  }, []);

  const updateReservation = useCallback((id: string, reservation: Partial<Reservation>) => {
    setReservations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...reservation, updatedAt: new Date() } : item
      )
    );
  }, []);

  const deleteReservation = useCallback((id: string) => {
    setReservations((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ==========================================
  // Room Status Definition CRUD Operations
  // ==========================================

  const addRoomStatusDefinition = useCallback((status: Omit<RoomStatusDefinition, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newStatus: RoomStatusDefinition = {
      ...status,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRoomStatusDefinitions((prev) => [...prev, newStatus]);
  }, []);

  const updateRoomStatusDefinition = useCallback((id: string, status: Partial<RoomStatusDefinition>) => {
    setRoomStatusDefinitions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...status, updatedAt: new Date() } : item
      )
    );
  }, []);

  const deleteRoomStatusDefinition = useCallback((id: string) => {
    setRoomStatusDefinitions((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ==========================================
  // Room Inventory Helpers
  // ==========================================

  const getAvailableRoomCount = useCallback((
    roomTypeId: string,
    roomCategoryId: string,
    checkIn: string,
    checkOut: string,
    excludeReservationId?: string
  ): number => {
    // Count total rooms of this type/category
    const totalRooms = rooms.filter(
      (r) => {
        const cat = roomCategories.find((c) => c.id === r.categoryId);
        return cat && cat.id === roomCategoryId && cat.roomTypeId === roomTypeId && r.statusId !== '6'; // Not OOO
      }
    ).length;

    // Count held + assigned rooms across all reservations for overlapping dates
    let usedCount = 0;
    reservations.forEach((res) => {
      if (excludeReservationId && res.id === excludeReservationId) return;
      if (res.status === 'Cancelled' || res.status === 'NoShow') return;
      // Check date overlap
      if (res.checkIn < checkOut && res.checkOut > checkIn) {
        // Count holds for this type/category
        res.roomHolds.forEach((hold) => {
          if (hold.roomTypeId === roomTypeId && hold.roomCategoryId === roomCategoryId) {
            usedCount += hold.quantity;
          }
        });
      }
    });

    return Math.max(0, totalRooms - usedCount);
  }, [rooms, roomCategories, reservations]);

  const getAvailableRoomsForCategory = useCallback((
    categoryId: string,
    checkIn: string,
    checkOut: string,
    excludeReservationId?: string
  ): Room[] => {
    // Get all rooms of this category that aren't OOO
    const categoryRooms = rooms.filter(
      (r) => r.categoryId === categoryId && r.statusId !== '6' // Not OOO
    );

    // Find rooms that are already assigned in overlapping reservations
    const assignedRoomIds = new Set<string>();
    reservations.forEach((res) => {
      if (excludeReservationId && res.id === excludeReservationId) return;
      if (res.status === 'Cancelled' || res.status === 'NoShow') return;
      if (res.checkIn < checkOut && res.checkOut > checkIn) {
        res.roomAssignments.forEach((assignment) => {
          if (assignment.status === 'assigned') {
            assignedRoomIds.add(assignment.roomId);
          }
        });
      }
    });

    return categoryRooms.filter((r) => !assignedRoomIds.has(r.id));
  }, [rooms, reservations]);

  // ==========================================
  // Helper Functions
  // ==========================================

  const searchItems = useCallback(<T extends { id: string }>(
    items: T[],
    query: string,
    searchKeys: (keyof T)[]
  ): T[] => {
    if (!query.trim()) return items;
    
    const lowerQuery = query.toLowerCase();
    return items.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerQuery);
        }
        return false;
      })
    );
  }, []);

  const getById = useCallback(<T extends { id: string }>(
    items: T[],
    id: string
  ): T | undefined => {
    return items.find((item) => item.id === id);
  }, []);

  // ==========================================
  // Context Value
  // ==========================================

  const value: MockDataContextType = {
    // Data
    bookings,
    reservations,
    currencies,
    roomTypes,
    roomCategories,
    rooms,
    marketSegments,
    sourceCodes,
    channels,
    rateCodes,
    currencyRates,
    companyProfiles,
    hotels,
    dashboardData,
    roomStatusDefinitions,

    // Currency CRUD
    addCurrency,
    updateCurrency,
    deleteCurrency,

    // Room Type CRUD
    addRoomType,
    updateRoomType,
    deleteRoomType,

    // Room Category CRUD
    addRoomCategory,
    updateRoomCategory,
    deleteRoomCategory,

    // Room CRUD
    addRoom,
    updateRoom,
    deleteRoom,

    // Market Segment CRUD
    addMarketSegment,
    updateMarketSegment,
    deleteMarketSegment,

    // Source Code CRUD
    addSourceCode,
    updateSourceCode,
    deleteSourceCode,

    // Channel CRUD
    addChannel,
    updateChannel,
    deleteChannel,

    // Rate Code CRUD
    addRateCode,
    updateRateCode,
    deleteRateCode,

    // Currency Rate CRUD
    addCurrencyRate,
    updateCurrencyRate,
    deleteCurrencyRate,

    // Company Profile CRUD
    addCompanyProfile,
    updateCompanyProfile,
    deleteCompanyProfile,

    // Hotel CRUD
    addHotel,
    updateHotel,
    deleteHotel,

    // Reservation CRUD
    addReservation,
    updateReservation,
    deleteReservation,

    // Room Status Definition CRUD
    addRoomStatusDefinition,
    updateRoomStatusDefinition,
    deleteRoomStatusDefinition,

    // Room Inventory Helpers
    getAvailableRoomCount,
    getAvailableRoomsForCategory,

    // Helpers
    searchItems,
    getById,
  };

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  );
}

// ==========================================
// Custom Hook
// ==========================================

export function useMockData(): MockDataContextType {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
}
