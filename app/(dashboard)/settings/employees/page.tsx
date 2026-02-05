'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { SplitView } from '../../../../components/crud';
import { Badge } from '../../../../components/ui/Badge';
import { ConfirmModal } from '../../../../components/ui/Modal';
import {
    addEmployee,
    deleteEmployee,
    getDepartmentById,
    getEmployeesState,
    isUsernameUnique,
    updateEmployee,
} from '../../../../lib/mock-data';
import { EmployeeFormData } from '../../../../lib/schemas/employee';
import { Employee } from '../../../../lib/types';
import { EmployeeForm } from './EmployeeForm';

// ==========================================
// Employee List Item
// ==========================================

interface EmployeeListItemProps {
  employee: Employee;
  isSelected: boolean;
}

function EmployeeListItem({ employee, isSelected }: EmployeeListItemProps) {
  const department = getDepartmentById(employee.departmentId);
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center text-white font-semibold text-sm">
          {employee.fullName.split(' ').slice(-1)[0].charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-semibold text-[#1E3A8A] font-heading">
            {employee.fullName}
          </div>
          <div className="text-sm text-[#6B7280] flex items-center gap-2">
            <span>{employee.code}</span>
            <span>•</span>
            <span>{employee.position}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Badge
          variant={employee.status === 'Active' ? 'success' : 'neutral'}
          size="small"
          dot
        >
          {employee.status === 'Active' ? 'Đang làm' : 'Nghỉ việc'}
        </Badge>
        <span className="text-xs text-[#6B7280]">{department?.name || '-'}</span>
      </div>
    </div>
  );
}

// ==========================================
// Employees Page
// ==========================================

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isNewMode, setIsNewMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load employees on mount
  useEffect(() => {
    setEmployees(getEmployeesState());
  }, []);

  // Handle select employee
  const handleSelect = (employee: Employee | null) => {
    setSelectedEmployee(employee);
    setIsNewMode(false);
  };

  // Handle create new
  const handleCreateNew = () => {
    setSelectedEmployee(null);
    setIsNewMode(true);
  };

  // Handle save
  const handleSave = (data: EmployeeFormData) => {
    // Validate unique username
    if (!isUsernameUnique(data.username, selectedEmployee?.id)) {
      toast.error('Tên đăng nhập đã tồn tại!');
      return;
    }

    if (isNewMode) {
      // Check for duplicate code
      const codeExists = employees.some(
        (e) => e.code.toUpperCase() === data.code.toUpperCase()
      );
      if (codeExists) {
        toast.error('Mã nhân viên đã tồn tại!');
        return;
      }

      const newEmployee = addEmployee(data);
      setEmployees(getEmployeesState());
      setSelectedEmployee(newEmployee);
      toast.success('Thêm mới nhân viên thành công!');
      setIsNewMode(false);
    } else if (selectedEmployee) {
      updateEmployee(selectedEmployee.id, data);
      setEmployees(getEmployeesState());
      setSelectedEmployee(getEmployeesState().find((e) => e.id === selectedEmployee.id) || null);
      toast.success('Cập nhật thành công!');
    }
  };

  // Handle delete request
  const handleDeleteRequest = () => {
    setShowDeleteModal(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = () => {
    if (selectedEmployee) {
      deleteEmployee(selectedEmployee.id);
      setEmployees(getEmployeesState());
      toast.success('Xóa nhân viên thành công!');
      setSelectedEmployee(null);
      setShowDeleteModal(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setSelectedEmployee(null);
    setIsNewMode(false);
  };

  return (
    <>
      <SplitView<Employee>
        title="Nhân viên"
        items={employees}
        selectedItem={selectedEmployee}
        onSelect={handleSelect}
        onCreateNew={handleCreateNew}
        keyExtractor={(employee) => employee.id}
        searchKeys={['fullName', 'code', 'phone', 'email', 'position']}
        searchPlaceholder="Tìm theo tên, mã, SĐT..."
        emptyMessage="Chưa có nhân viên nào"
        renderListItem={(employee, isSelected) => (
          <EmployeeListItem employee={employee} isSelected={isSelected} />
        )}
        renderForm={() => (
          <EmployeeForm
            employee={selectedEmployee}
            isNewMode={isNewMode}
            onSave={handleSave}
            onDelete={handleDeleteRequest}
            onCancel={handleCancel}
          />
        )}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa nhân viên"
        message={`Bạn có chắc chắn muốn xóa nhân viên "${selectedEmployee?.fullName}"? Tài khoản và quyền truy cập của nhân viên này sẽ bị vô hiệu hóa.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
    </>
  );
}
