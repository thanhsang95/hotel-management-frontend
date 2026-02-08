import { Currency } from '../types';

export const MOCK_CURRENCIES: Currency[] = [
  {
    id: '1',
    code: 'VND',
    name: 'Việt Nam Đồng',
    symbol: '₫',
    isActive: true,
    isDefault: true,           // VND is default currency
    thousandsSeparator: '.',   // VND uses . for thousands (1.000.000)
    decimalSeparator: ',',     // VND uses , for decimals (rarely used)
    decimalPlaces: 0,          // VND typically has no decimal places
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    isActive: true,
    isDefault: false,
    thousandsSeparator: ',',   // USD uses , for thousands (1,000,000)
    decimalSeparator: '.',     // USD uses . for decimals (1,000.50)
    decimalPlaces: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    isActive: true,
    isDefault: false,
    thousandsSeparator: '.',   // EUR uses . for thousands (1.000.000)
    decimalSeparator: ',',     // EUR uses , for decimals (1.000,50)
    decimalPlaces: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    isActive: true,
    isDefault: false,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    decimalPlaces: 0,          // JPY has no decimal places
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '5',
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    isActive: true,
    isDefault: false,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    decimalPlaces: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '6',
    code: 'KRW',
    name: 'Korean Won',
    symbol: '₩',
    isActive: false,
    isDefault: false,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    decimalPlaces: 0,          // KRW has no decimal places
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '7',
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    isActive: true,
    isDefault: false,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    decimalPlaces: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];
