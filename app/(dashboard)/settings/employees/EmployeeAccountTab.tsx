'use client';

import { CheckIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Input, Select } from '../../../../components/ui/Input';
import { getRolesState } from '../../../../lib/mock-data';
import { EmployeeFormInput } from '../../../../lib/schemas/employee';

// ==========================================
// Employee Account Tab Props
// ==========================================

interface EmployeeAccountTabProps {
  register: UseFormRegister<EmployeeFormInput>;
  errors: FieldErrors<EmployeeFormInput>;
  selectedRoleIds: string[];
  onRoleToggle: (roleId: string) => void;
  isNewMode: boolean;
}

// ==========================================
// Role Card Component
// ==========================================

interface RoleCardProps {
  role: { id: string; name: string; description?: string; permissionIds: string[] };
  isSelected: boolean;
  onToggle: () => void;
}

function RoleCard({ role, isSelected, onToggle }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        w-full p-4 rounded-xl border-2 text-left transition-all duration-200
        ${isSelected
          ? 'border-[#1E3A8A] bg-[#1E3A8A]/5'
          : 'border-[#E2E8F0] hover:border-[#1E3A8A]/30 hover:bg-[#F8FAFC]'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1E3A8A]">{role.name}</span>
            <span className="text-xs text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
              {role.permissionIds.length} quyền
            </span>
          </div>
          {role.description && (
            <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">
              {role.description}
            </p>
          )}
        </div>
        <div
          className={`
            w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ml-3
            transition-all duration-200
            ${isSelected
              ? 'bg-[#1E3A8A] text-white'
              : 'border-2 border-[#D1D5DB]'
            }
          `}
        >
          {isSelected && <CheckIcon className="w-3 h-3" />}
        </div>
      </div>
    </button>
  );
}

// ==========================================
// Employee Account Tab Component
// ==========================================

export function EmployeeAccountTab({
  register,
  errors,
  selectedRoleIds,
  onRoleToggle,
  isNewMode,
}: EmployeeAccountTabProps) {
  const roles = getRolesState();
  const [showPassword, setShowPassword] = useState(false);

  const accountStatusOptions = [
    { value: 'Active', label: 'Kích hoạt' },
    { value: 'Locked', label: 'Khóa' },
  ];

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <div>
        <h3 className="text-sm font-semibold text-[#374151] uppercase tracking-wider mb-4">
          Thông tin tài khoản
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Tên đăng nhập"
            placeholder="nguyen.vana"
            {...register('username')}
            error={errors.username?.message}
            required
            autoComplete="off"
          />
          <Select
            label="Trạng thái tài khoản"
            options={accountStatusOptions}
            {...register('accountStatus')}
            error={errors.accountStatus?.message}
            required
          />
        </div>
        
        {/* Password Field */}
        <div className="mt-4">
          <div className="relative">
            <Input
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              placeholder={isNewMode ? 'Nhập mật khẩu' : 'Để trống nếu không đổi'}
              {...register('password')}
              error={errors.password?.message}
              required={isNewMode}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-[#6B7280] hover:text-[#374151] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isNewMode && (
          <p className="text-sm text-[#6B7280] mt-3 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-[#F59E0B]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Mật khẩu phải có ít nhất 6 ký tự
          </p>
        )}
      </div>

      {/* Role Assignment */}
      <div>
        <h3 className="text-sm font-semibold text-[#374151] uppercase tracking-wider mb-2">
          Phân vai trò
        </h3>
        <p className="text-sm text-[#6B7280] mb-4">
          Chọn một hoặc nhiều vai trò cho nhân viên. Nhân viên sẽ có quyền của tất cả các vai trò được chọn.
        </p>
        
        {errors.roleIds && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.roleIds.message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 max-h-[250px] overflow-y-auto pr-2">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              isSelected={selectedRoleIds.includes(role.id)}
              onToggle={() => onRoleToggle(role.id)}
            />
          ))}
        </div>

        <div className="mt-3 text-sm text-[#6B7280]">
          {selectedRoleIds.length === 0 ? (
            <span className="text-[#EF4444]">Chưa chọn vai trò nào</span>
          ) : (
            <span>
              Đã chọn <span className="font-medium text-[#1E3A8A]">{selectedRoleIds.length}</span> vai trò
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeAccountTab;
