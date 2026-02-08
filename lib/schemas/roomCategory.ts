import { z } from 'zod';

// ==========================================
// Room Category Schema
// ==========================================

export const roomCategorySchema = z.object({
  code: z
    .string()
    .min(1, 'Mã hạng phòng là bắt buộc')
    .max(10, 'Mã hạng phòng tối đa 10 ký tự')
    .transform((val) => val.toUpperCase()),
  name: z.string().min(1, 'Tên hạng phòng là bắt buộc'),
  roomTypeId: z.string().min(1, 'Loại phòng là bắt buộc'),
  maxOccupancy: z.number().min(1, 'Số người tối đa phải ít nhất là 1').max(10, 'Số người tối đa không quá 10'),
  bedType: z.string().min(1, 'Loại giường là bắt buộc'),
  area: z.number().min(1, 'Diện tích phải lớn hơn 0'),
  basePrice: z.number().min(0, 'Giá phòng phải lớn hơn hoặc bằng 0'),
  bedCount: z.number().min(1, 'Số giường phải ít nhất là 1'),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
});

export type RoomCategoryFormInput = z.input<typeof roomCategorySchema>;
export type RoomCategoryFormData = z.output<typeof roomCategorySchema>;

export const defaultRoomCategoryValues: RoomCategoryFormInput = {
  code: '',
  name: '',
  roomTypeId: '',
  maxOccupancy: 2,
  bedType: '',
  area: 25,
  basePrice: 0,
  bedCount: 1,
  description: '',
  amenities: [],
};

export const BED_TYPES = [
  { value: 'Single', label: 'Giường đơn' },
  { value: 'Double', label: 'Giường đôi' },
  { value: 'Twin', label: '2 giường đơn' },
  { value: 'King', label: 'Giường King' },
  { value: 'Queen', label: 'Giường Queen' },
];
