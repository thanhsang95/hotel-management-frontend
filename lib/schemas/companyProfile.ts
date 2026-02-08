import { z } from 'zod';

// ==========================================
// Company Profile Schema
// ==========================================

export const companyProfileSchema = z.object({
  type: z.enum(['Company', 'TravelAgent']),
  name: z.string().min(1, 'Tên công ty/đại lý là bắt buộc'),
  taxCode: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  phone: z.string().optional(),
  contactPerson: z.string().optional(),
  creditLimit: z.number().min(0, 'Hạn mức phải >= 0').optional(),
  source: z.string().optional(),
  segment: z.string().optional(),
  channel: z.string().optional(),
  isBlacklisted: z.boolean().default(false),
  linkedRateCodeId: z.string().optional(),
});

export type CompanyProfileFormInput = z.input<typeof companyProfileSchema>;
export type CompanyProfileFormData = z.output<typeof companyProfileSchema>;

export const defaultCompanyProfileValues: CompanyProfileFormInput = {
  type: 'Company',
  name: '',
  taxCode: '',
  address: '',
  email: '',
  phone: '',
  contactPerson: '',
  creditLimit: 0,
  source: '',
  segment: '',
  channel: '',
  isBlacklisted: false,
  linkedRateCodeId: '',
};

export const COMPANY_TYPES = [
  { value: 'Company', label: 'Công ty' },
  { value: 'TravelAgent', label: 'Đại lý du lịch' },
];
