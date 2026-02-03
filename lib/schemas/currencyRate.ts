import { z } from 'zod';

// ==========================================
// Currency Rate (Exchange Rate) Schema
// ==========================================

export const currencyRateSchema = z.object({
  fromCurrencyId: z.string().min(1, 'Từ tiền tệ là bắt buộc'),
  toCurrencyId: z.string().min(1, 'Sang tiền tệ là bắt buộc'),
  rate: z.number().positive('Tỷ giá phải lớn hơn 0'),
  effectiveDate: z.string().min(1, 'Ngày hiệu lực là bắt buộc'),
}).refine((data) => data.fromCurrencyId !== data.toCurrencyId, {
  message: 'Tiền tệ nguồn và đích phải khác nhau',
  path: ['toCurrencyId'],
});

export type CurrencyRateFormInput = z.input<typeof currencyRateSchema>;
export type CurrencyRateFormData = z.output<typeof currencyRateSchema>;

export const defaultCurrencyRateValues: CurrencyRateFormInput = {
  fromCurrencyId: '',
  toCurrencyId: '',
  rate: 0,
  effectiveDate: new Date().toISOString().split('T')[0],
};
