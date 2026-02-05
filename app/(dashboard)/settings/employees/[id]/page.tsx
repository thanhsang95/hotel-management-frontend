'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Badge } from '../../../../../components/ui/Badge';
import { Button } from '../../../../../components/ui/Button';
import { ConfirmModal } from '../../../../../components/ui/Modal';
import {
    deleteEmployee,
    getDepartmentById,
    getEmployeesState,
    isUsernameUnique,
    updateEmployee,
} from '../../../../../lib/mock-data';
import {
    defaultEmployeeValues,
    EmployeeFormData,
    EmployeeFormInput,
    employeeSchema,
} from '../../../../../lib/schemas/employee';
import { Employee } from '../../../../../lib/types';
import { EmployeeAccountTab } from '../EmployeeAccountTab';
import { EmployeeInfoTab } from '../EmployeeInfoTab';

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
// Employee Detail Page
// ==========================================

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('info');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const selectedRoleIds = watch('roleIds') || [];

  // Load employee on mount
  useEffect(() => {
    const employees = getEmployeesState();
    const foundEmployee = employees.find((e) => e.id === employeeId);

    if (foundEmployee) {
      setEmployee(foundEmployee);
      reset({
        code: foundEmployee.code,
        fullName: foundEmployee.fullName,
        gender: foundEmployee.gender,
        dob: foundEmployee.dob,
        phone: foundEmployee.phone,
        email: foundEmployee.email,
        address: foundEmployee.address,
        departmentId: foundEmployee.departmentId,
        position: foundEmployee.position,
        joinDate: foundEmployee.joinDate,
        status: foundEmployee.status,
        notes: foundEmployee.notes || '',
        username: foundEmployee.username,
        accountStatus: foundEmployee.accountStatus,
        roleIds: foundEmployee.roleIds,
      });
    }
    setIsLoading(false);
  }, [employeeId, reset]);

  // Handle role toggle
  const handleRoleToggle = (roleId: string) => {
    const current = selectedRoleIds;
    const updated = current.includes(roleId)
      ? current.filter((id) => id !== roleId)
      : [...current, roleId];
    setValue('roleIds', updated, { shouldDirty: true, shouldValidate: true });
  };

  // Handle save
  const onSubmit = (data: EmployeeFormData) => {
    if (!employee) return;

    // Validate unique username
    if (!isUsernameUnique(data.username, employee.id)) {
      toast.error('Tên đăng nhập đã tồn tại!');
      return;
    }

    updateEmployee(employee.id, data);
    toast.success('Cập nhật thành công!');

    // Reload the employee
    const updatedEmployee = getEmployeesState().find((e) => e.id === employeeId);
    if (updatedEmployee) {
      setEmployee(updatedEmployee);
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (employee) {
      deleteEmployee(employee.id);
      toast.success('Xóa nhân viên thành công!');
      router.push('/settings/employees');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E3A8A]" />
      </div>
    );
  }

  // Not found state
  if (!employee) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#374151] mb-2">
            Không tìm thấy nhân viên
          </h2>
          <p className="text-[#6B7280] mb-4">
            Nhân viên bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link href="/settings/employees">
            <Button variant="primary">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const department = getDepartmentById(employee.departmentId);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/settings/employees"
            className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-[#6B7280]" />
          </Link>
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center text-white font-semibold text-lg">
              {employee.fullName.split(' ').slice(-1)[0].charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#1E3A8A] font-heading">
                  {employee.fullName}
                </h1>
                <Badge
                  variant={employee.status === 'Active' ? 'success' : 'neutral'}
                  size="small"
                  dot
                >
                  {employee.status === 'Active' ? 'Đang làm' : 'Nghỉ việc'}
                </Badge>
              </div>
              <p className="text-sm text-[#6B7280] mt-1">
                {employee.code} • {employee.position} • {department?.name || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Form Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
        {/* Tabs */}
        <div className="border-b border-[#E2E8F0] px-6">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 text-sm font-medium transition-colors
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'info' && (
              <EmployeeInfoTab
                register={register}
                errors={errors}
                isNewMode={false}
              />
            )}
            {activeTab === 'account' && (
              <EmployeeAccountTab
                register={register}
                errors={errors}
                selectedRoleIds={selectedRoleIds}
                onRoleToggle={handleRoleToggle}
                isNewMode={false}
              />
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-6 border-t border-[#E2E8F0] mt-6">
            <Button type="submit" variant="primary" disabled={!isDirty}>
              Lưu thay đổi
            </Button>
            <Link href="/settings/employees">
              <Button type="button" variant="ghost">
                Hủy
              </Button>
            </Link>
            <Button
              type="button"
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
              className="ml-auto"
            >
              Xóa nhân viên
            </Button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa nhân viên"
        message={`Bạn có chắc chắn muốn xóa nhân viên "${employee.fullName}"? Tài khoản và quyền truy cập của nhân viên này sẽ bị vô hiệu hóa.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}
