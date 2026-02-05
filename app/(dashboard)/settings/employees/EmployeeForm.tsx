'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../../components/ui/Button';
import {
    defaultEmployeeValues,
    EmployeeFormData,
    EmployeeFormInput,
    employeeSchema,
} from '../../../../lib/schemas/employee';
import { Employee } from '../../../../lib/types';
import { EmployeeAccountTab } from './EmployeeAccountTab';
import { EmployeeInfoTab } from './EmployeeInfoTab';

// ==========================================
// Tab Types
// ==========================================

type TabId = 'info' | 'account';

interface Tab {
  id: TabId;
  label: string;
}

const tabs: Tab[] = [
  { id: 'info', label: 'Thông tin' },
  { id: 'account', label: 'Tài khoản & Vai trò' },
];

// ==========================================
// Employee Form Props
// ==========================================

interface EmployeeFormProps {
  employee: Employee | null;
  isNewMode: boolean;
  onSave: (data: EmployeeFormData) => void;
  onDelete: () => void;
  onCancel: () => void;
}

// ==========================================
// Employee Form Component
// ==========================================

export function EmployeeForm({
  employee,
  isNewMode,
  onSave,
  onDelete,
  onCancel,
}: EmployeeFormProps) {
  const [activeTab, setActiveTab] = useState<TabId>('info');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
    trigger,
  } = useForm<EmployeeFormInput, unknown, EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: defaultEmployeeValues,
    mode: 'onChange',
  });

  // Watch for role IDs
  const selectedRoleIds = watch('roleIds') || [];

  // Reset form when employee changes
  useEffect(() => {
    if (employee) {
      reset({
        code: employee.code,
        fullName: employee.fullName,
        gender: employee.gender,
        dob: employee.dob,
        phone: employee.phone,
        email: employee.email,
        address: employee.address,
        departmentId: employee.departmentId,
        position: employee.position,
        joinDate: employee.joinDate,
        status: employee.status,
        notes: employee.notes || '',
        username: employee.username,
        accountStatus: employee.accountStatus,
        roleIds: employee.roleIds,
      });
    } else {
      reset(defaultEmployeeValues);
    }
    setActiveTab('info');
  }, [employee, reset]);

  // Handle form submit
  const onSubmit = (data: EmployeeFormData) => {
    onSave(data);
  };

  // Handle role toggle
  const handleRoleToggle = (roleId: string) => {
    const current = selectedRoleIds;
    const updated = current.includes(roleId)
      ? current.filter((id) => id !== roleId)
      : [...current, roleId];
    setValue('roleIds', updated, { shouldDirty: true, shouldValidate: true });
  };

  // Handle tab change with validation
  const handleTabChange = async (tabId: TabId) => {
    // Validate current tab before switching
    if (activeTab === 'info') {
      const isValid = await trigger([
        'code', 'fullName', 'gender', 'dob', 'phone', 'email', 'address',
        'departmentId', 'position', 'joinDate', 'status',
      ]);
      // Allow switching even if invalid (show errors on save)
    }
    setActiveTab(tabId);
  };

  // Empty state
  if (!employee && !isNewMode) {
    return (
      <div className="flex items-center justify-center h-64 text-[#6B7280]">
        <div className="text-center">
          <p className="text-lg mb-2">Chọn một nhân viên để xem chi tiết</p>
          <p className="text-sm">hoặc nhấn &quot;Thêm mới&quot; để tạo mới</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div>
        <h2 className="text-xl font-semibold text-[#1E3A8A] font-heading">
          {isNewMode ? 'Thêm mới Nhân viên' : 'Chỉnh sửa Nhân viên'}
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          {isNewMode
            ? 'Điền thông tin để tạo nhân viên mới'
            : `Đang chỉnh sửa: ${employee?.fullName}`}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E2E8F0]">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`
                pb-3 px-1 text-sm font-medium transition-colors
                border-b-2 -mb-px
                ${activeTab === tab.id
                  ? 'text-[#1E3A8A] border-[#1E3A8A]'
                  : 'text-[#6B7280] border-transparent hover:text-[#374151]'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Tab Content */}
        <div className="min-h-[350px]">
          {activeTab === 'info' && (
            <EmployeeInfoTab
              register={register}
              errors={errors}
              isNewMode={isNewMode}
            />
          )}
          {activeTab === 'account' && (
            <EmployeeAccountTab
              register={register}
              errors={errors}
              selectedRoleIds={selectedRoleIds}
              onRoleToggle={handleRoleToggle}
              isNewMode={isNewMode}
            />
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-3 pt-6 border-t border-[#E2E8F0] mt-6">
          <Button type="submit" variant="primary">
            Lưu
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Hủy
          </Button>
          {!isNewMode && employee && (
            <Button
              type="button"
              variant="danger"
              onClick={onDelete}
              className="ml-auto"
            >
              Xóa
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;
