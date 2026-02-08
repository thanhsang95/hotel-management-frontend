import { z } from 'zod';

// ==========================================
// Hotel Schema
// ==========================================

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const hotelSchema = z.object({
  name: z.string().min(1, 'Tên khách sạn là bắt buộc'),
  address: z.string().min(1, 'Địa chỉ là bắt buộc'),
  phone: z.string().optional(),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  taxCode: z.string().optional(),
  taxId: z.string().optional(),
  checkInTime: z.string().regex(timeRegex, 'Giờ check-in không hợp lệ (HH:mm)'),
  checkOutTime: z.string().regex(timeRegex, 'Giờ check-out không hợp lệ (HH:mm)'),
  taxPercent: z.number().min(0, '% Thuế phải >= 0').max(100, '% Thuế phải <= 100'),
  serviceChargePercent: z.number().min(0, '% Phí dịch vụ phải >= 0').max(100, '% Phí dịch vụ phải <= 100'),
});

export type HotelFormInput = z.input<typeof hotelSchema>;
export type HotelFormData = z.output<typeof hotelSchema>;

export const defaultHotelValues: HotelFormInput = {
  name: '',
  address: '',
  phone: '',
  email: '',
  taxCode: '',
  taxId: '',
  checkInTime: '14:00',
  checkOutTime: '12:00',
  taxPercent: 10,
  serviceChargePercent: 5,
};
