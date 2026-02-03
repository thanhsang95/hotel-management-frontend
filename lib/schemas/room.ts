import { z } from 'zod';

// ==========================================
// Room Schema
// ==========================================

export const roomSchema = z.object({
  roomNumber: z
    .string()
    .min(1, 'Số phòng là bắt buộc')
    .max(10, 'Số phòng tối đa 10 ký tự'),
  floor: z.number().min(0, 'Tầng phải >= 0').max(100, 'Tầng tối đa 100'),
  building: z.string().optional(),
  categoryId: z.string().min(1, 'Hạng phòng là bắt buộc'),
  status: z.enum(['Vacant', 'Occupied', 'Dirty', 'OOO']),
  isClean: z.boolean().default(true),
  notes: z.string().optional(),
});

export type RoomFormInput = z.input<typeof roomSchema>;
export type RoomFormData = z.output<typeof roomSchema>;

export const defaultRoomValues: RoomFormInput = {
  roomNumber: '',
  floor: 1,
  building: '',
  categoryId: '',
  status: 'Vacant',
  isClean: true,
  notes: '',
};

export const ROOM_STATUSES = [
  { value: 'Vacant', label: 'Trống', color: 'success' },
  { value: 'Occupied', label: 'Có khách', color: 'info' },
  { value: 'Dirty', label: 'Bẩn', color: 'warning' },
  { value: 'OOO', label: 'Hỏng/Bảo trì', color: 'danger' },
] as const;
