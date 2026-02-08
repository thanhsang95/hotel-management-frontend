import { z } from 'zod';

// ==========================================
// Employee Zod Schema
// ==========================================

export const employeeInfoSchema = z.object({
  // Personal Info
  code: z
    .string()
    .min(1, 'Mã nhân viên là bắt buộc')
    .max(20, 'Mã nhân viên tối đa 20 ký tự'),
  fullName: z
    .string()
    .min(1, 'Họ tên là bắt buộc')
    .max(100, 'Họ tên tối đa 100 ký tự'),
  gender: z.enum(['Male', 'Female', 'Other'], {
    message: 'Giới tính không hợp lệ',
  }),
  dob: z.string().min(1, 'Ngày sinh là bắt buộc'),
  phone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(15, 'Số điện thoại tối đa 15 số')
    .regex(/^[0-9]+$/, 'Số điện thoại chỉ chứa số'),
  email: z
    .string()
    .email('Email không hợp lệ')
    .min(1, 'Email là bắt buộc'),
  address: z
    .string()
    .min(1, 'Địa chỉ là bắt buộc')
    .max(200, 'Địa chỉ tối đa 200 ký tự'),
  
  // Job Details
  departmentId: z.string().min(1, 'Phòng ban là bắt buộc'),
  position: z
    .string()
    .min(1, 'Chức vụ là bắt buộc')
    .max(100, 'Chức vụ tối đa 100 ký tự'),
  joinDate: z.string().min(1, 'Ngày vào làm là bắt buộc'),
  status: z.enum(['Active', 'Inactive']),
  notes: z.string().max(500, 'Ghi chú tối đa 500 ký tự').optional().or(z.literal('')),
});

export const employeeAccountSchema = z.object({
  username: z
    .string()
    .min(3, 'Tên đăng nhập tối thiểu 3 ký tự')
    .max(50, 'Tên đăng nhập tối đa 50 ký tự')
    .regex(/^[a-zA-Z0-9._]+$/, 'Tên đăng nhập chỉ chứa chữ, số, dấu chấm và gạch dưới'),
  password: z
    .string()
    .min(6, 'Mật khẩu tối thiểu 6 ký tự')
    .optional()
    .or(z.literal('')),
  accountStatus: z.enum(['Active', 'Locked']),
  roleIds: z.array(z.string()).min(1, 'Phải chọn ít nhất một vai trò'),
});

// Combined schema for full employee
export const employeeSchema = employeeInfoSchema.merge(employeeAccountSchema);

// Input types
export type EmployeeInfoFormInput = z.input<typeof employeeInfoSchema>;
export type EmployeeAccountFormInput = z.input<typeof employeeAccountSchema>;
export type EmployeeFormInput = z.input<typeof employeeSchema>;

// Output types  
export type EmployeeInfoFormData = z.output<typeof employeeInfoSchema>;
export type EmployeeAccountFormData = z.output<typeof employeeAccountSchema>;
export type EmployeeFormData = z.output<typeof employeeSchema>;

// Default values
export const defaultEmployeeInfoValues: EmployeeInfoFormInput = {
  code: '',
  fullName: '',
  gender: 'Male',
  dob: '',
  phone: '',
  email: '',
  address: '',
  departmentId: '',
  position: '',
  joinDate: new Date().toISOString().split('T')[0],
  status: 'Active',
  notes: '',
};

export const defaultEmployeeAccountValues: EmployeeAccountFormInput = {
  username: '',
  password: '',
  accountStatus: 'Active',
  roleIds: [],
};

export const defaultEmployeeValues: EmployeeFormInput = {
  ...defaultEmployeeInfoValues,
  ...defaultEmployeeAccountValues,
};
