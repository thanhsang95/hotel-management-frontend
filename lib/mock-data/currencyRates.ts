import { CurrencyRate } from '../types';

export const MOCK_CURRENCY_RATES: CurrencyRate[] = [
  {
    id: '1',
    fromCurrencyId: '2', // USD
    toCurrencyId: '1',   // VND
    rate: 25000,
    effectiveDate: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    fromCurrencyId: '3', // EUR
    toCurrencyId: '1',   // VND
    rate: 27500,
    effectiveDate: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    fromCurrencyId: '4', // JPY
    toCurrencyId: '1',   // VND
    rate: 166,
    effectiveDate: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    fromCurrencyId: '5', // CNY
    toCurrencyId: '1',   // VND
    rate: 3500,
    effectiveDate: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '5',
    fromCurrencyId: '7', // GBP
    toCurrencyId: '1',   // VND
    rate: 32000,
    effectiveDate: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '6',
    fromCurrencyId: '2', // USD
    toCurrencyId: '3',   // EUR
    rate: 0.92,
    effectiveDate: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '7',
    fromCurrencyId: '2', // USD
    toCurrencyId: '4',   // JPY
    rate: 150,
    effectiveDate: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '8',
    fromCurrencyId: '2', // USD (updated rate)
    toCurrencyId: '1',   // VND
    rate: 25200,
    effectiveDate: new Date('2024-06-01'),
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01'),
  },
  {
    id: '9',
    fromCurrencyId: '3', // EUR (updated rate)
    toCurrencyId: '1',   // VND
    rate: 27800,
    effectiveDate: new Date('2024-06-01'),
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01'),
  },
  {
    id: '10',
    fromCurrencyId: '6', // KRW
    toCurrencyId: '1',   // VND
    rate: 18.5,
    effectiveDate: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];
