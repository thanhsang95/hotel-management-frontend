import { z } from 'zod';

// ==========================================
// Rate Code Schema
// ==========================================

export const rateCodePriceSchema = z.object({
  currencyId: z.string().min(1, 'Tiền tệ là bắt buộc'),
  amount: z.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
});

export const rateCodeSchema = z.object({
  code: z
    .string()
    .min(1, 'Mã giá là bắt buộc')
    .max(10, 'Mã giá tối đa 10 ký tự')
    .transform((val) => val.toUpperCase()),
  name: z.string().min(1, 'Tên mã giá là bắt buộc'),
  segmentId: z.string().optional(),
  channelId: z.string().optional(),
  prices: z.array(rateCodePriceSchema).default([]),
  startDate: z.string().min(1, 'Ngày bắt đầu là bắt buộc'),
  endDate: z.string().min(1, 'Ngày kết thúc là bắt buộc'),
  isActive: z.boolean().default(true),
});

export type RateCodeFormInput = z.input<typeof rateCodeSchema>;
export type RateCodeFormData = z.output<typeof rateCodeSchema>;

export const defaultRateCodeValues: RateCodeFormInput = {
  code: '',
  name: '',
  segmentId: '',
  channelId: '',
  prices: [],
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  isActive: true,
};
