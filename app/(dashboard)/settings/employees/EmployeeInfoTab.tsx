'use client';

import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Input, Select, TextArea } from '../../../../components/ui/Input';
import { getAllDepartments } from '../../../../lib/mock-data';
import { EmployeeFormInput } from '../../../../lib/schemas/employee';

// ==========================================
// Employee Info Tab Props
// ==========================================

interface EmployeeInfoTabProps {
  register: UseFormRegister<EmployeeFormInput>;
  errors: FieldErrors<EmployeeFormInput>;
  isNewMode: boolean;
}

// ==========================================
// Employee Info Tab Component
// ==========================================

export function EmployeeInfoTab({ register, errors, isNewMode }: EmployeeInfoTabProps) {
  const departments = getAllDepartments();

  const genderOptions = [
    { value: 'Male', label: 'Nam' },
    { value: 'Female', label: 'Nữ' },
    { value: 'Other', label: 'Khác' },
  ];

  const statusOptions = [
    { value: 'Active', label: 'Đang làm' },
    { value: 'Inactive', label: 'Nghỉ việc' },
  ];

  const departmentOptions = [
    { value: '', label: 'Chọn phòng ban' },
    ...departments.map((dept) => ({ value: dept.id, label: dept.name })),
  ];

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div>
        <h3 className="text-sm font-semibold text-[#374151] uppercase tracking-wider mb-4">
          Thông tin cá nhân
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Mã nhân viên"
            placeholder="NV0001"
            {...register('code')}
            error={errors.code?.message}
            required
            disabled={!isNewMode}
          />
          <Input
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            {...register('fullName')}
            error={errors.fullName?.message}
            required
          />
          <Select
            label="Giới tính"
            options={genderOptions}
            {...register('gender')}
            error={errors.gender?.message}
            required
          />
          <Input
            label="Ngày sinh"
            type="date"
            {...register('dob')}
            error={errors.dob?.message}
            required
          />
          <Input
            label="Số điện thoại"
            placeholder="0901234567"
            {...register('phone')}
            error={errors.phone?.message}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="email@hotel.vn"
            {...register('email')}
            error={errors.email?.message}
            required
          />
          <div className="md:col-span-2">
            <Input
              label="Địa chỉ"
              placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
              {...register('address')}
              error={errors.address?.message}
              required
            />
          </div>
        </div>
      </div>

      {/* Job Information */}
      <div>
        <h3 className="text-sm font-semibold text-[#374151] uppercase tracking-wider mb-4">
          Thông tin công việc
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Phòng ban"
            options={departmentOptions}
            {...register('departmentId')}
            error={errors.departmentId?.message}
            required
          />
          <Input
            label="Chức vụ"
            placeholder="Nhân viên lễ tân"
            {...register('position')}
            error={errors.position?.message}
            required
          />
          <Input
            label="Ngày vào làm"
            type="date"
            {...register('joinDate')}
            error={errors.joinDate?.message}
            required
          />
          <Select
            label="Trạng thái"
            options={statusOptions}
            {...register('status')}
            error={errors.status?.message}
            required
          />
          <div className="md:col-span-2">
            <TextArea
              label="Ghi chú"
              placeholder="Ghi chú thêm về nhân viên..."
              {...register('notes')}
              error={errors.notes?.message}
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeInfoTab;
