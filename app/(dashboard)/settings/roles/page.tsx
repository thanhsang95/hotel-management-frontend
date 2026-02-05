'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { SplitView } from '../../../../components/crud';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Input, TextArea } from '../../../../components/ui/Input';
import { ConfirmModal } from '../../../../components/ui/Modal';
import {
    addRole,
    deleteRole,
    getPermissionsGroupedByModule,
    getRolesState,
    updateRole,
} from '../../../../lib/mock-data';
import { defaultRoleValues, RoleFormData, RoleFormInput, roleSchema } from '../../../../lib/schemas/role';
import { Role } from '../../../../lib/types';
import { RoleMatrix } from './RoleMatrix';

// ==========================================
// Role List Item
// ==========================================

interface RoleListItemProps {
  role: Role;
  isSelected: boolean;
}

function RoleListItem({ role, isSelected }: RoleListItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-semibold text-[#1E3A8A] font-heading">
          {role.name}
        </div>
        {role.description && (
          <p className="text-sm text-[#6B7280] mt-1 line-clamp-1">{role.description}</p>
        )}
      </div>
      <Badge variant="info" size="small">
        {role.permissionIds.length} quyền
      </Badge>
    </div>
  );
}

// ==========================================
// Role Form
// ==========================================

interface RoleFormProps {
  role: Role | null;
  isNewMode: boolean;
  onSave: (data: RoleFormData) => void;
  onDelete: () => void;
  onCancel: () => void;
}

function RoleForm({ role, isNewMode, onSave, onDelete, onCancel }: RoleFormProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const permissionsByModule = getPermissionsGroupedByModule();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RoleFormInput, unknown, RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: defaultRoleValues,
  });

  const selectedPermissions = watch('permissionIds') || [];

  // Reset form when role changes
  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        description: role.description || '',
        permissionIds: role.permissionIds,
      });
    } else {
      reset(defaultRoleValues);
    }
  }, [role, reset]);

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
      // Add all module permissions
      updated = [...new Set([...current, ...modulePermissionIds])];
    } else {
      // Remove all module permissions
      updated = current.filter((id) => !modulePermissionIds.includes(id));
    }
    setValue('permissionIds', updated, { shouldDirty: true });
  };

  // Handle form submit
  const onSubmit = (data: RoleFormData) => {
    onSave(data);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    onDelete();
  };

  if (!role && !isNewMode) {
    return (
      <div className="flex items-center justify-center h-64 text-[#6B7280]">
        <div className="text-center">
          <p className="text-lg mb-2">Chọn một vai trò để xem chi tiết</p>
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
          {isNewMode ? 'Thêm mới Vai trò' : 'Chỉnh sửa Vai trò'}
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          {isNewMode ? 'Điền thông tin để tạo vai trò mới' : `Đang chỉnh sửa: ${role?.name}`}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Tên vai trò"
          placeholder="Admin, Manager, Receptionist..."
          {...register('name')}
          error={errors.name?.message}
          required
        />

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
          <Button type="submit" variant="primary">
            Lưu
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Hủy
          </Button>
          {!isNewMode && role && (
            <Button
              type="button"
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
              className="ml-auto"
            >
              Xóa
            </Button>
          )}
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa vai trò "${role?.name}"? Nhân viên đang sử dụng vai trò này sẽ mất quyền truy cập.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}

// ==========================================
// Roles Page
// ==========================================

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isNewMode, setIsNewMode] = useState(false);

  // Load roles on mount
  useEffect(() => {
    setRoles(getRolesState());
  }, []);

  // Handle select role
  const handleSelect = (role: Role | null) => {
    setSelectedRole(role);
    setIsNewMode(false);
  };

  // Handle create new
  const handleCreateNew = () => {
    setSelectedRole(null);
    setIsNewMode(true);
  };

  // Handle save
  const handleSave = (data: RoleFormData) => {
    if (isNewMode) {
      // Check for duplicate name
      const exists = roles.some(
        (r) => r.name.toLowerCase() === data.name.toLowerCase()
      );
      if (exists) {
        toast.error('Tên vai trò đã tồn tại!');
        return;
      }
      const newRole = addRole(data);
      setRoles(getRolesState());
      setSelectedRole(newRole);
      toast.success('Thêm mới thành công!');
      setIsNewMode(false);
    } else if (selectedRole) {
      updateRole(selectedRole.id, data);
      setRoles(getRolesState());
      setSelectedRole(getRolesState().find((r) => r.id === selectedRole.id) || null);
      toast.success('Cập nhật thành công!');
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (selectedRole) {
      deleteRole(selectedRole.id);
      setRoles(getRolesState());
      toast.success('Xóa thành công!');
      setSelectedRole(null);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setSelectedRole(null);
    setIsNewMode(false);
  };

  return (
    <SplitView<Role>
      title="Vai trò"
      items={roles}
      selectedItem={selectedRole}
      onSelect={handleSelect}
      onCreateNew={handleCreateNew}
      keyExtractor={(role) => role.id}
      searchKeys={['name', 'description']}
      searchPlaceholder="Tìm theo tên vai trò..."
      emptyMessage="Chưa có vai trò nào"
      renderListItem={(role, isSelected) => (
        <RoleListItem role={role} isSelected={isSelected} />
      )}
      renderForm={() => (
        <RoleForm
          role={selectedRole}
          isNewMode={isNewMode}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      )}
    />
  );
}
