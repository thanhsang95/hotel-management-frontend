'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Drawer } from '../../../../components/ui/Drawer';
import { Input, Select, TextArea } from '../../../../components/ui/Input';
import { ConfirmModal } from '../../../../components/ui/Modal';
import { useMockData } from '../../../../lib/context/MockDataContext';
import {
    defaultRoomStatusDefinitionValues,
    RoomStatusDefinitionFormData,
    RoomStatusDefinitionFormInput,
    roomStatusDefinitionSchema,
    STATUS_CATEGORY_OPTIONS,
    STATUS_COLOR_OPTIONS,
} from '../../../../lib/schemas/room-status-definition';
import { RoomStatusDefinition } from '../../../../lib/types';

// ==========================================
// Room Status Definition Page
// ==========================================

export default function RoomStatusDefinitionsPage() {
  const { roomStatusDefinitions, addRoomStatusDefinition, updateRoomStatusDefinition, deleteRoomStatusDefinition, rooms } = useMockData();
  const [selectedStatus, setSelectedStatus] = useState<RoomStatusDefinition | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNewMode, setIsNewMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoomStatusDefinitionFormInput, unknown, RoomStatusDefinitionFormData>({
    resolver: zodResolver(roomStatusDefinitionSchema),
    defaultValues: defaultRoomStatusDefinitionValues,
  });

  // Filter statuses
  const filteredStatuses = roomStatusDefinitions.filter((status) => {
    const matchesSearch =
      status.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      status.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || status.category === categoryFilter;
    const matchesActive =
      activeFilter === 'All' ||
      (activeFilter === 'Active' && status.isActive) ||
      (activeFilter === 'Inactive' && !status.isActive);
    return matchesSearch && matchesCategory && matchesActive;
  });

  // Sort by sortOrder
  const sortedStatuses = [...filteredStatuses].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleCreateNew = () => {
    setSelectedStatus(null);
    setIsNewMode(true);
    setIsDrawerOpen(true);
    reset(defaultRoomStatusDefinitionValues);
  };

  const handleEdit = (status: RoomStatusDefinition) => {
    setSelectedStatus(status);
    setIsNewMode(false);
    setIsDrawerOpen(true);
    reset({
      code: status.code,
      name: status.name,
      description: status.description || '',
      category: status.category as RoomStatusDefinitionFormInput['category'],
      color: status.color as RoomStatusDefinitionFormInput['color'],
      sortOrder: status.sortOrder,
      isActive: status.isActive,
      isSystemDefault: status.isSystemDefault,
    });
  };

  const handleDelete = (status: RoomStatusDefinition) => {
    setSelectedStatus(status);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedStatus) return;

    // Check if system default
    if (selectedStatus.isSystemDefault) {
      toast.error('Không thể xóa trạng thái mặc định của hệ thống');
      setShowDeleteModal(false);
      return;
    }

    // Check if in use by rooms
    const roomsUsingStatus = rooms.filter((room) => room.statusId === selectedStatus.id);
    if (roomsUsingStatus.length > 0) {
      toast.error(`Không thể xóa trạng thái đang được sử dụng bởi ${roomsUsingStatus.length} phòng`);
      setShowDeleteModal(false);
      return;
    }

    deleteRoomStatusDefinition(selectedStatus.id);
    toast.success('Xóa thành công!');
    setShowDeleteModal(false);
    setSelectedStatus(null);
  };

  const onSubmit = (data: RoomStatusDefinitionFormData) => {
    if (isNewMode) {
      // Check for duplicate code
      const exists = roomStatusDefinitions.some((s) => s.code.toUpperCase() === data.code.toUpperCase());
      if (exists) {
        toast.error('Mã trạng thái đã tồn tại!');
        return;
      }
      addRoomStatusDefinition(data);
      toast.success('Thêm mới thành công!');
    } else if (selectedStatus) {
      updateRoomStatusDefinition(selectedStatus.id, data);
      toast.success('Cập nhật thành công!');
    }
    setIsDrawerOpen(false);
    setIsNewMode(false);
    setSelectedStatus(null);
  };

  const handleCancel = () => {
    setIsDrawerOpen(false);
    setIsNewMode(false);
    setSelectedStatus(null);
    reset(defaultRoomStatusDefinitionValues);
  };

  const getColorBadgeClass = (color: string) => {
    const colorMap: Record<string, string> = {
      success: 'bg-green-500',
      info: 'bg-blue-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500',
      secondary: 'bg-gray-500',
      primary: 'bg-blue-600',
    };
    return colorMap[color] || 'bg-gray-500';
  };

  const getCategoryLabel = (category: string) => {
    return STATUS_CATEGORY_OPTIONS.find((opt) => opt.value === category)?.label || category;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A8A] font-heading">Định nghĩa tình trạng phòng</h1>
          <p className="text-sm text-[#6B7280] mt-1">Quản lý các trạng thái phòng trong hệ thống</p>
        </div>
        <Button variant="primary" onClick={handleCreateNew}>
          Thêm mới
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col space-y-4 min-h-0">
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] space-y-4">
          {/* Row 1: Search */}
          <div>
            <Input
              placeholder="Tìm theo mã hoặc tên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Row 2: Filter Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 sm:max-w-xs">
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={[
                  { value: 'All', label: 'Tất cả danh mục' },
                  ...STATUS_CATEGORY_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
                ]}
              />
            </div>
            <div className="flex-1 sm:max-w-xs">
              <Select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                options={[
                  { value: 'All', label: 'Tất cả' },
                  { value: 'Active', label: 'Hoạt động' },
                  { value: 'Inactive', label: 'Không hoạt động' },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 bg-white rounded-lg border border-[#E2E8F0] overflow-hidden flex flex-col min-h-0">
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Mã
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Màu sắc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Thứ tự
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Hệ thống
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {sortedStatuses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-[#6B7280]">
                      Không tìm thấy trạng thái nào
                    </td>
                  </tr>
                ) : (
                  sortedStatuses.map((status) => (
                    <tr 
                      key={status.id} 
                      className={`hover:bg-[#F8FAFC] transition-colors cursor-pointer ${
                        selectedStatus?.id === status.id ? 'bg-[#EFF6FF]' : ''
                      }`}
                      onClick={() => handleEdit(status)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-medium text-[#1E3A8A]">{status.code}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#1F2937]">{status.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#6B7280]">{getCategoryLabel(status.category)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${getColorBadgeClass(status.color)}`} />
                          <span className="text-sm text-[#6B7280] capitalize">{status.color}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#6B7280]">{status.sortOrder}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={status.isActive ? 'success' : 'neutral'} size="small">
                          {status.isActive ? 'Hoạt động' : 'Không hoạt động'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {status.isSystemDefault && (
                          <Badge variant="info" size="small">
                            Mặc định hệ thống
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(status);
                            }}
                          >
                            Sửa
                          </Button>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(status);
                            }}
                            disabled={status.isSystemDefault}
                            title={status.isSystemDefault ? 'Không thể xóa trạng thái mặc định' : ''}
                          >
                            Xóa
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCancel}
        title={isNewMode ? 'Thêm mới trạng thái phòng' : 'Chỉnh sửa trạng thái phòng'}
        subtitle={isNewMode ? 'Điền thông tin để tạo trạng thái mới' : `Đang chỉnh sửa: ${selectedStatus?.code}`}
        size="lg"
      >
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Mã trạng thái"
                placeholder="VACANT_CLEAN"
                {...register('code')}
                error={errors.code?.message}
                required
                disabled={!isNewMode}
              />

              <Input
                label="Tên trạng thái"
                placeholder="Vacant Clean"
                {...register('name')}
                error={errors.name?.message}
                required
              />
            </div>

            <TextArea
              label="Mô tả"
              placeholder="Mô tả chi tiết về trạng thái..."
              {...register('description')}
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Danh mục"
                {...register('category')}
                error={errors.category?.message}
                required
                options={STATUS_CATEGORY_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
                placeholder="Chọn danh mục"
              />

              <Select
                label="Màu sắc"
                {...register('color')}
                error={errors.color?.message}
                required
                options={STATUS_COLOR_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
                placeholder="Chọn màu sắc"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Thứ tự sắp xếp"
                type="number"
                placeholder="0"
                {...register('sortOrder', { valueAsNumber: true })}
                error={errors.sortOrder?.message}
                required
                min={0}
                max={999}
              />

              <div className="flex items-center gap-4 pt-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isActive')}
                    className="w-4 h-4 text-[#1E3A8A] border-[#D1D5DB] rounded focus:ring-[#1E3A8A]"
                  />
                  <span className="text-sm text-[#1F2937]">Hoạt động</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isSystemDefault')}
                    disabled={!isNewMode}
                    className="w-4 h-4 text-[#1E3A8A] border-[#D1D5DB] rounded focus:ring-[#1E3A8A] disabled:opacity-50"
                  />
                  <span className="text-sm text-[#1F2937]">Mặc định hệ thống</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-[#E2E8F0]">
              <Button type="submit" variant="primary">
                Lưu
              </Button>
              <Button type="button" variant="ghost" onClick={handleCancel}>
                Hủy
              </Button>
            </div>
          </form>
        </div>
      </Drawer>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa trạng thái "${selectedStatus?.code}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}
