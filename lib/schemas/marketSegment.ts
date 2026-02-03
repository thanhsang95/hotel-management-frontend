import { z } from 'zod';

// ==========================================
// Market Segment Schema
// ==========================================

export const marketSegmentSchema = z.object({
  code: z
    .string()
    .min(1, 'Mã phân khúc là bắt buộc')
    .max(10, 'Mã phân khúc tối đa 10 ký tự')
    .transform((val) => val.toUpperCase()),
  name: z.string().min(1, 'Tên phân khúc là bắt buộc'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type MarketSegmentFormInput = {
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
};

export type MarketSegmentFormData = z.output<typeof marketSegmentSchema>;

export const defaultMarketSegmentValues: MarketSegmentFormInput = {
  code: '',
  name: '',
  description: '',
  isActive: true,
};
