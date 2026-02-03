import { z } from 'zod';

// ==========================================
// Room Type Zod Schema
// ==========================================

export const roomTypeSchema = z.object({
  code: z
    .string()
    .min(1, 'Mã loại phòng là bắt buộc')
    .max(10, 'Mã tối đa 10 ký tự'),
  name: z
    .string()
    .min(1, 'Tên loại phòng là bắt buộc')
    .max(100, 'Tên tối đa 100 ký tự'),
  description: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean(),
});

export type RoomTypeFormInput = z.input<typeof roomTypeSchema>;
export type RoomTypeFormData = z.output<typeof roomTypeSchema>;

export const defaultRoomTypeValues: RoomTypeFormInput = {
  code: '',
  name: '',
  description: '',
  sortOrder: 0,
  isActive: true,
};
