import { RateCode } from '../types';

export const MOCK_RATE_CODES: RateCode[] = [
  {
    id: '1',
    code: 'BAR',
    name: 'Best Available Rate',
    segmentId: '2', // FIT
    channelId: '1', // Direct
    prices: [
      { currencyId: '1', amount: 2500000 }, // VND
      { currencyId: '2', amount: 100 },      // USD
    ],
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    code: 'CORP',
    name: 'Corporate Rate',
    segmentId: '1', // Corporate
    channelId: '1', // Direct
    prices: [
      { currencyId: '1', amount: 2000000 }, // VND
      { currencyId: '2', amount: 80 },       // USD
    ],
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    code: 'PROMO',
    name: 'Promotional Rate',
    segmentId: '2', // FIT
    channelId: '2', // Booking.com
    prices: [
      { currencyId: '1', amount: 1800000 }, // VND
      { currencyId: '2', amount: 72 },       // USD
    ],
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    code: 'GRP',
    name: 'Group Rate',
    segmentId: '3', // Group
    channelId: '1', // Direct
    prices: [
      { currencyId: '1', amount: 1500000 }, // VND
      { currencyId: '2', amount: 60 },       // USD
    ],
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '5',
    code: 'GOV',
    name: 'Government Rate',
    segmentId: '4', // Government
    channelId: '1', // Direct
    prices: [
      { currencyId: '1', amount: 1700000 }, // VND
      { currencyId: '2', amount: 68 },       // USD
    ],
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '6',
    code: 'AIR',
    name: 'Airline Crew Rate',
    segmentId: '6', // Airline Crew
    channelId: '1', // Direct
    prices: [
      { currencyId: '1', amount: 1200000 }, // VND
      { currencyId: '2', amount: 48 },       // USD
    ],
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '7',
    code: 'RACK',
    name: 'Rack Rate',
    segmentId: undefined,
    channelId: undefined,
    prices: [
      { currencyId: '1', amount: 3500000 }, // VND
      { currencyId: '2', amount: 140 },      // USD
    ],
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '8',
    code: 'WEB',
    name: 'Web Direct Rate',
    segmentId: '7', // Web Direct
    channelId: '1', // Direct
    prices: [
      { currencyId: '1', amount: 2200000 }, // VND
      { currencyId: '2', amount: 88 },       // USD
    ],
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '9',
    code: 'OTA-BKG',
    name: 'Booking.com Rate',
    segmentId: '5', // Wholesale
    channelId: '2', // Booking.com
    prices: [
      { currencyId: '1', amount: 2800000 }, // VND
      { currencyId: '2', amount: 112 },      // USD
    ],
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '10',
    code: 'OTA-AGD',
    name: 'Agoda Rate',
    segmentId: '5', // Wholesale
    channelId: '3', // Agoda
    prices: [
      { currencyId: '1', amount: 2750000 }, // VND
      { currencyId: '2', amount: 110 },      // USD
    ],
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];
