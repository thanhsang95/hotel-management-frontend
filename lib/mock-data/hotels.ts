import { Hotel } from '../types';

export const MOCK_HOTELS: Hotel[] = [
  {
    id: '1',
    name: 'Grand Sài Gòn Hotel',
    address: '8 Đồng Khởi, Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    taxCode: '0301234567',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    defaultCurrencyId: '1', // VND
    taxPercent: 10,
    serviceChargePercent: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Hương Giang Resort & Spa',
    address: '51 Lê Lợi, Phú Hội, TP. Huế, Thừa Thiên Huế',
    taxCode: '3301234567',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    defaultCurrencyId: '1', // VND
    taxPercent: 10,
    serviceChargePercent: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Metropole Hà Nội',
    address: '15 Ngô Quyền, Hoàn Kiếm, Hà Nội',
    taxCode: '0101234567',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    defaultCurrencyId: '2', // USD (international hotel)
    taxPercent: 10,
    serviceChargePercent: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];
