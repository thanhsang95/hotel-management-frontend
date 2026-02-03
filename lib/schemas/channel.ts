import { z } from 'zod';

// ==========================================
// Channel Schema
// ==========================================

export const channelSchema = z.object({
  code: z
    .string()
    .min(1, 'Mã kênh là bắt buộc')
    .max(10, 'Mã kênh tối đa 10 ký tự')
    .transform((val) => val.toUpperCase()),
  name: z.string().min(1, 'Tên kênh là bắt buộc'),
  externalMappingId: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type ChannelFormInput = {
  code: string;
  name: string;
  externalMappingId?: string;
  description?: string;
  isActive: boolean;
};

export type ChannelFormData = z.output<typeof channelSchema>;

export const defaultChannelValues: ChannelFormInput = {
  code: '',
  name: '',
  externalMappingId: '',
  description: '',
  isActive: true,
};
