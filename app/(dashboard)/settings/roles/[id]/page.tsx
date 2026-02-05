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
import { Input, TextArea } from '../../../../../components/ui/Input';
import { ConfirmModal } from '../../../../../components/ui/Modal';
import {
    deleteRole,
    getPermissionsGroupedByModule,
    getRolesState,
    updateRole,
} from '../../../../../lib/mock-data';
import { defaultRoleValues, RoleFormData, RoleFormInput, roleSchema } from '../../../../../lib/schemas/role';
import { Role } from '../../../../../lib/types';
import { RoleMatrix } from '../RoleMatrix';

// ==========================================
// Role Detail Page
// ==========================================

export default function RoleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.id as string;

  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const permissionsByModule = getPermissionsGroupedByModule();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<RoleFormInput, unknown, RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: defaultRoleValues,
  });

  const selectedPermissions = watch('permissionIds') || [];

  // Load role on mount
  useEffect(() => {
    const roles = getRolesState();
    const foundRole = roles.find((r) => r.id === roleId);
    
    if (foundRole) {
      setRole(foundRole);
      reset({
        name: foundRole.name,
        description: foundRole.description || '',
        permissionIds: foundRole.permissionIds,
      });
    }
    setIsLoading(false);
  }, [roleId, reset]);

  // Handle permission toggle
  const handlePermissionToggle = (permissionId: string) => {
    const current = selectedPermissions;
    const updated = current.includes(permissionId)
      ? current.filter((id) => id !== permissionId)
      : [...current, permissionId];
    setValue('permissionIds', updated, { shouldDirty: true });
  };

  // Handle module select all
  const handleModuleSelectAll = (modulePermissionIds: string[], selectAll: boolean) => {
    const current = selectedPermissions;
    let updated: string[];
    if (selectAll) {
      updated = [...new Set([...current, ...modulePermissionIds])];
    } else {
      updated = current.filter((id) => !modulePermissionIds.includes(id));
    }
    setValue('permissionIds', updated, { shouldDirty: true });
  };

  // Handle save
  const onSubmit = (data: RoleFormData) => {
    if (role) {
      updateRole(role.id, data);
      toast.success('Cập nhật thành công!');
      // Reload the role
      const updatedRole = getRolesState().find((r) => r.id === roleId);
      if (updatedRole) {
        setRole(updatedRole);
      }
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (role) {
      deleteRole(role.id);
      toast.success('Xóa thành công!');
      router.push('/settings/roles');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E3A8A]" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#374151] mb-2">
            Không tìm thấy vai trò
          </h2>
          <p className="text-[#6B7280] mb-4">
            Vai trò bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link href="/settings/roles">
            <Button variant="primary">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/settings/roles"
            className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-[#6B7280]" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#1E3A8A] font-heading">
                {role.name}
              </h1>
              <Badge variant="info" size="small">
                {role.permissionIds.length} quyền
              </Badge>
            </div>
            <p className="text-sm text-[#6B7280] mt-1">
              Cài đặt / Vai trò / {role.name}
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Tên vai trò"
              placeholder="Admin, Manager, Receptionist..."
              {...register('name')}
              error={errors.name?.message}
              required
            />
            <div className="hidden md:block" /> {/* Spacer */}
          </div>

          <TextArea
            label="Mô tả"
            placeholder="Mô tả vai trò và quyền hạn..."
            {...register('description')}
            error={errors.description?.message}
            rows={3}
          />

          {/* Permission Matrix */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-3">
              Phân quyền
              <span className="text-[#6B7280] font-normal ml-2">
                ({selectedPermissions.length} quyền được chọn)
              </span>
            </label>
            <RoleMatrix
              permissionsByModule={permissionsByModule}
              selectedPermissions={selectedPermissions}
              onToggle={handlePermissionToggle}
              onModuleSelectAll={handleModuleSelectAll}
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-6 border-t border-[#E2E8F0]">
            <Button type="submit" variant="primary" disabled={!isDirty}>
              Lưu thay đổi
            </Button>
            <Link href="/settings/roles">
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
              Xóa vai trò
            </Button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa vai trò "${role.name}"? Nhân viên đang sử dụng vai trò này sẽ mất quyền truy cập.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}
