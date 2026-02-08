import { z } from 'zod';

export const roomStatusDefinitionSchema = z.object({
  code: z
    .string()
    .min(1, 'Mã trạng thái là bắt buộc')
    .max(50, 'Mã trạng thái tối đa 50 ký tự')
    .regex(/^[A-Z0-9_]+$/, 'Mã chỉ được chứa chữ in hoa, số và dấu gạch dưới'),
  name: z
    .string()
    .min(1, 'Tên trạng thái là bắt buộc')
    .max(100, 'Tên trạng thái tối đa 100 ký tự'),
  description: z
    .string()
    .max(500, 'Mô tả tối đa 500 ký tự')
    .optional(),
  category: z.enum(['Available', 'Occupied', 'Maintenance', 'Transition'], {
    message: 'Danh mục không hợp lệ',
  }),
  color: z.enum(['success', 'info', 'warning', 'danger', 'secondary', 'primary'], {
    message: 'Màu sắc không hợp lệ',
  }),
  sortOrder: z
    .number()
    .min(0, 'Thứ tự phải >= 0')
    .max(999, 'Thứ tự tối đa 999'),
  isActive: z.boolean().default(true),
  isSystemDefault: z.boolean().default(false),
});

export type RoomStatusDefinitionFormInput = z.input<typeof roomStatusDefinitionSchema>;
export type RoomStatusDefinitionFormData = z.output<typeof roomStatusDefinitionSchema>;

export const defaultRoomStatusDefinitionValues: RoomStatusDefinitionFormInput = {
  code: '',
  name: '',
  description: '',
  category: 'Available',
  color: 'success',
  sortOrder: 0,
  isActive: true,
  isSystemDefault: false,
};

// Color options for dropdown
export const STATUS_COLOR_OPTIONS = [
  { value: 'success', label: 'Xanh lá (Success)', preview: 'bg-green-500' },
  { value: 'info', label: 'Xanh dương (Info)', preview: 'bg-blue-500' },
  { value: 'warning', label: 'Vàng (Warning)', preview: 'bg-yellow-500' },
  { value: 'danger', label: 'Đỏ (Danger)', preview: 'bg-red-500' },
  { value: 'secondary', label: 'Xám (Secondary)', preview: 'bg-gray-500' },
  { value: 'primary', label: 'Chính (Primary)', preview: 'bg-blue-600' },
] as const;

// Category options for dropdown
export const STATUS_CATEGORY_OPTIONS = [
  { value: 'Available', label: 'Có sẵn' },
  { value: 'Occupied', label: 'Đang sử dụng' },
  { value: 'Maintenance', label: 'Bảo trì' },
  { value: 'Transition', label: 'Chuyển đổi' },
] as const;
