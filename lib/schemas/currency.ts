import { z } from 'zod';

// ==========================================
// Currency Zod Schema
// ==========================================

export const currencySchema = z.object({
  code: z
    .string()
    .min(3, 'Mã tiền tệ phải có 3 ký tự')
    .max(3, 'Mã tiền tệ phải có 3 ký tự')
    .regex(/^[A-Za-z]{3}$/, 'Mã tiền tệ chỉ chứa chữ cái')
    .transform((val) => val.toUpperCase()),
  name: z
    .string()
    .min(1, 'Tên tiền tệ là bắt buộc')
    .max(100, 'Tên tiền tệ tối đa 100 ký tự'),
  symbol: z
    .string()
    .min(1, 'Ký hiệu là bắt buộc')
    .max(5, 'Ký hiệu tối đa 5 ký tự'),
  isActive: z.boolean(),
});

// Input type (what the form expects)
export type CurrencyFormInput = z.input<typeof currencySchema>;

// Output type (what you get after validation)
export type CurrencyFormData = z.output<typeof currencySchema>;

// Default values for new currency
export const defaultCurrencyValues: CurrencyFormInput = {
  code: '',
  name: '',
  symbol: '',
  isActive: true,
};
