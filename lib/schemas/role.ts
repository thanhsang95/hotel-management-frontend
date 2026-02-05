import { z } from 'zod';

// ==========================================
// Role Zod Schema
// ==========================================

export const roleSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên vai trò là bắt buộc')
    .max(50, 'Tên vai trò tối đa 50 ký tự'),
  description: z
    .string()
    .max(200, 'Mô tả tối đa 200 ký tự')
    .optional()
    .or(z.literal('')),
  permissionIds: z
    .array(z.string())
    .min(0, 'Chưa chọn quyền nào'),
});

// Input type (what the form expects)
export type RoleFormInput = z.input<typeof roleSchema>;

// Output type (what you get after validation)
export type RoleFormData = z.output<typeof roleSchema>;

// Default values for new role
export const defaultRoleValues: RoleFormInput = {
  name: '',
  description: '',
  permissionIds: [],
};
