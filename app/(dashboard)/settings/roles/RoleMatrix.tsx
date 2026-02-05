'use client';

import { CheckIcon, MinusIcon } from '@heroicons/react/24/outline';
import { Permission } from '../../../../lib/types';

// ==========================================
// Role Matrix Types
// ==========================================

interface RoleMatrixProps {
  permissionsByModule: Record<string, Permission[]>;
  selectedPermissions: string[];
  onToggle: (permissionId: string) => void;
  onModuleSelectAll: (modulePermissionIds: string[], selectAll: boolean) => void;
  disabled?: boolean;
}

// ==========================================
// Permission Checkbox
// ==========================================

interface PermissionCheckboxProps {
  permission: Permission;
  isChecked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

function PermissionCheckbox({ permission, isChecked, onToggle, disabled }: PermissionCheckboxProps) {
  return (
    <label
      className={`
        flex items-center gap-2 p-2 rounded-lg cursor-pointer
        transition-all duration-200
        ${isChecked 
          ? 'bg-[#1E3A8A]/10 border border-[#1E3A8A]/30' 
          : 'bg-[#F8FAFC] border border-transparent hover:bg-[#F1F5F9]'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onToggle}
        disabled={disabled}
        className="sr-only"
      />
      <div
        className={`
          w-4 h-4 rounded flex items-center justify-center flex-shrink-0
          transition-all duration-200
          ${isChecked 
            ? 'bg-[#1E3A8A] text-white' 
            : 'border-2 border-[#D1D5DB]'
          }
        `}
      >
        {isChecked && <CheckIcon className="w-3 h-3" />}
      </div>
      <span className="text-sm text-[#374151]">{permission.label}</span>
    </label>
  );
}

// ==========================================
// Module Card Header
// ==========================================

interface ModuleHeaderProps {
  moduleName: string;
  permissions: Permission[];
  selectedCount: number;
  onSelectAll: (selectAll: boolean) => void;
  disabled?: boolean;
}

function ModuleHeader({ moduleName, permissions, selectedCount, onSelectAll, disabled }: ModuleHeaderProps) {
  const totalCount = permissions.length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;
  const isPartialSelected = selectedCount > 0 && selectedCount < totalCount;

  const handleToggle = () => {
    onSelectAll(!isAllSelected);
  };

  return (
    <div className="flex items-center justify-between mb-3">
      <h4 className="font-medium text-[#1E3A8A] flex items-center gap-2">
        {moduleName}
        <span className="text-xs font-normal text-[#6B7280]">
          ({selectedCount}/{totalCount})
        </span>
      </h4>
      <label 
        className={`
          flex items-center gap-2 text-sm cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={handleToggle}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`
            w-4 h-4 rounded flex items-center justify-center
            transition-all duration-200
            ${isAllSelected 
              ? 'bg-[#1E3A8A] text-white' 
              : isPartialSelected
                ? 'bg-[#1E3A8A]/50 text-white'
                : 'border-2 border-[#D1D5DB]'
            }
          `}
        >
          {isAllSelected ? (
            <CheckIcon className="w-3 h-3" />
          ) : isPartialSelected ? (
            <MinusIcon className="w-3 h-3" />
          ) : null}
        </div>
        <span className="text-[#6B7280]">Chọn tất cả</span>
      </label>
    </div>
  );
}

// ==========================================
// Module Card
// ==========================================

interface ModuleCardProps {
  moduleName: string;
  permissions: Permission[];
  selectedPermissions: string[];
  onToggle: (permissionId: string) => void;
  onModuleSelectAll: (permissionIds: string[], selectAll: boolean) => void;
  disabled?: boolean;
}

function ModuleCard({
  moduleName,
  permissions,
  selectedPermissions,
  onToggle,
  onModuleSelectAll,
  disabled,
}: ModuleCardProps) {
  const modulePermissionIds = permissions.map((p) => p.id);
  const selectedCount = permissions.filter((p) => selectedPermissions.includes(p.id)).length;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
      <ModuleHeader
        moduleName={moduleName}
        permissions={permissions}
        selectedCount={selectedCount}
        onSelectAll={(selectAll) => onModuleSelectAll(modulePermissionIds, selectAll)}
        disabled={disabled}
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {permissions.map((permission) => (
          <PermissionCheckbox
            key={permission.id}
            permission={permission}
            isChecked={selectedPermissions.includes(permission.id)}
            onToggle={() => onToggle(permission.id)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

// ==========================================
// Role Matrix Component
// ==========================================

export function RoleMatrix({
  permissionsByModule,
  selectedPermissions,
  onToggle,
  onModuleSelectAll,
  disabled = false,
}: RoleMatrixProps) {
  const moduleNames = Object.keys(permissionsByModule);

  if (moduleNames.length === 0) {
    return (
      <div className="text-center py-8 text-[#6B7280]">
        Không có quyền nào được định nghĩa
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      {moduleNames.map((moduleName) => (
        <ModuleCard
          key={moduleName}
          moduleName={moduleName}
          permissions={permissionsByModule[moduleName]}
          selectedPermissions={selectedPermissions}
          onToggle={onToggle}
          onModuleSelectAll={onModuleSelectAll}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

export default RoleMatrix;
