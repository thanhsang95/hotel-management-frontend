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
  name: z.string().optional(),
  segmentId: z.string().optional(),
  channelId: z.string().optional(),
  prices: z.array(rateCodePriceSchema).default([]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
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
  startDate: '',
  endDate: '',
  isActive: true,
};
