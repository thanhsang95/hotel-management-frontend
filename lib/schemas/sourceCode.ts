import { z } from 'zod';

// ==========================================
// Source Code Schema
// ==========================================

export const sourceCodeSchema = z.object({
  code: z
    .string()
    .min(1, 'Mã nguồn là bắt buộc')
    .max(10, 'Mã nguồn tối đa 10 ký tự')
    .transform((val) => val.toUpperCase()),
  name: z.string().min(1, 'Tên nguồn là bắt buộc'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type SourceCodeFormInput = {
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
};

export type SourceCodeFormData = z.output<typeof sourceCodeSchema>;

export const defaultSourceCodeValues: SourceCodeFormInput = {
  code: '',
  name: '',
  description: '',
  isActive: true,
};
