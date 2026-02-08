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
  statusId: z.string().min(1, 'Trạng thái phòng là bắt buộc'),
  isClean: z.boolean().default(true),
  roomType: z.string().optional(),
  notes: z.string().optional(),
});

export type RoomFormInput = z.input<typeof roomSchema>;
export type RoomFormData = z.output<typeof roomSchema>;

export const defaultRoomValues: RoomFormInput = {
  roomNumber: '',
  floor: 1,
  building: '',
  categoryId: '',
  statusId: '',
  isClean: true,
  roomType: '',
  notes: '',
};


