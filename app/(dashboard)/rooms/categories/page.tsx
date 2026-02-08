'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { SplitView } from '../../../../components/crud';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Input, Select, TextArea } from '../../../../components/ui/Input';
import { ConfirmModal } from '../../../../components/ui/Modal';
import { useMockData } from '../../../../lib/context/MockDataContext';
import {
    BED_TYPES,
    defaultRoomCategoryValues,
    RoomCategoryFormData,
    RoomCategoryFormInput,
    roomCategorySchema,
} from '../../../../lib/schemas/roomCategory';
import { RoomCategory } from '../../../../lib/types';

// ==========================================
// Room Category List Item
// ==========================================

function RoomCategoryListItem({ roomCategory, roomTypeName }: { roomCategory: RoomCategory; roomTypeName: string }) {
  const getBedTypeLabel = (bedType: string) => {
    return BED_TYPES.find((bt) => bt.value === bedType)?.label || bedType;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1E3A8A] font-heading">
            {roomCategory.code}
          </span>
        </div>
        <p className="text-sm text-[#6B7280] mt-1 truncate">{roomCategory.name}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-[#9CA3AF]">
          <span>{roomTypeName}</span>
          <span>•</span>
          <span>{getBedTypeLabel(roomCategory.bedType)}</span>
          <span>•</span>
          <span>{roomCategory.area}m²</span>
          <span>•</span>
          <span>{roomCategory.bedCount} giường</span>
          <span>•</span>
          <span className="font-medium text-[#1E3A8A]">{formatPrice(roomCategory.basePrice)}</span>
        </div>
      </div>
      <Badge variant="info" size="small">
        Tối đa {roomCategory.maxOccupancy} người
      </Badge>
    </div>
  );
}

// ==========================================
// Room Category Form
// ==========================================

interface RoomCategoryFormProps {
  roomCategory: RoomCategory | null;
  isNewMode: boolean;
  onSave: (data: RoomCategoryFormData) => void;
  onDelete: () => void;
  onCancel: () => void;
}

function RoomCategoryForm({ roomCategory, isNewMode, onSave, onDelete, onCancel }: RoomCategoryFormProps) {
  const { roomTypes } = useMockData();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoomCategoryFormInput, unknown, RoomCategoryFormData>({
    resolver: zodResolver(roomCategorySchema),
    defaultValues: defaultRoomCategoryValues,
  });

  useEffect(() => {
    if (roomCategory) {
      reset({
        code: roomCategory.code,
        name: roomCategory.name,
        roomTypeId: roomCategory.roomTypeId,
        maxOccupancy: roomCategory.maxOccupancy,
        bedType: roomCategory.bedType,
        area: roomCategory.area,
        basePrice: roomCategory.basePrice,
        bedCount: roomCategory.bedCount,
        description: roomCategory.description || '',
        amenities: roomCategory.amenities || [],
      });
    } else {
      reset(defaultRoomCategoryValues);
    }
  }, [roomCategory, reset]);

  const onSubmit = (data: RoomCategoryFormData) => {
    onSave(data);
  };

  if (!roomCategory && !isNewMode) {
    return (
      <div className="flex items-center justify-center h-64 text-[#6B7280]">
        <div className="text-center">
          <p className="text-lg mb-2">Chọn một hạng phòng để xem chi tiết</p>
          <p className="text-sm">hoặc nhấn &quot;Thêm mới&quot; để tạo mới</p>
        </div>
      </div>
    );
  }

  // Prepare room type options for Select
  const roomTypeOptions = roomTypes.map((rt) => ({
    value: rt.id,
    label: `${rt.code} - ${rt.name}`,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1E3A8A] font-heading">
          {isNewMode ? 'Thêm mới Hạng phòng' : 'Chỉnh sửa Hạng phòng'}
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          {isNewMode ? 'Điền thông tin để tạo hạng phòng mới' : `Đang chỉnh sửa: ${roomCategory?.code}`}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Mã hạng phòng"
            placeholder="STD-DBL"
            {...register('code')}
            error={errors.code?.message}
            required
            disabled={!isNewMode}
          />

          <Input
            label="Tên hạng phòng"
            placeholder="Standard Double"
            {...register('name')}
            error={errors.name?.message}
            required
          />
        </div>

        <Select
          label="Loại phòng"
          {...register('roomTypeId')}
          error={errors.roomTypeId?.message}
          required
          options={roomTypeOptions}
          placeholder="Chọn loại phòng"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Số người tối đa"
            type="number"
            placeholder="2"
            {...register('maxOccupancy', { valueAsNumber: true })}
            error={errors.maxOccupancy?.message}
            required
            min={1}
            max={10}
          />

          <Select
            label="Loại giường"
            {...register('bedType')}
            error={errors.bedType?.message}
            required
            options={BED_TYPES}
            placeholder="Chọn loại giường"
          />

          <Input
            label="Diện tích (m²)"
            type="number"
            placeholder="25"
            {...register('area', { valueAsNumber: true })}
            error={errors.area?.message}
            required
            min={1}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Giá phòng (VNĐ)"
            type="number"
            placeholder="1000000"
            {...register('basePrice', { valueAsNumber: true })}
            error={errors.basePrice?.message}
            required
            min={0}
          />

          <Input
            label="Số giường"
            type="number"
            placeholder="1"
            {...register('bedCount', { valueAsNumber: true })}
            error={errors.bedCount?.message}
            required
            min={1}
          />
        </div>

        <TextArea
          label="Mô tả"
          placeholder="Mô tả chi tiết về hạng phòng..."
          {...register('description')}
          rows={3}
        />

        <div className="flex items-center gap-3 pt-6 border-t border-[#E2E8F0]">
          <Button type="submit" variant="primary">Lưu</Button>
          <Button type="button" variant="ghost" onClick={onCancel}>Hủy</Button>
          {!isNewMode && roomCategory && (
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

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => { setShowDeleteModal(false); onDelete(); }}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa hạng phòng "${roomCategory?.code}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}

// ==========================================
// Room Categories Page
// ==========================================

export default function RoomCategoriesPage() {
  const { roomCategories, roomTypes, addRoomCategory, updateRoomCategory, deleteRoomCategory } = useMockData();
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory | null>(null);
  const [isNewMode, setIsNewMode] = useState(false);

  // Helper to get room type name
  const getRoomTypeName = (roomTypeId: string) => {
    const rt = roomTypes.find((r) => r.id === roomTypeId);
    return rt ? `${rt.code}` : 'Unknown';
  };

  const handleSelect = (category: RoomCategory | null) => {
    setSelectedCategory(category);
    setIsNewMode(false);
  };

  const handleCreateNew = () => {
    setSelectedCategory(null);
    setIsNewMode(true);
  };

  const handleSave = (data: RoomCategoryFormData) => {
    if (isNewMode) {
      const exists = roomCategories.some((c) => c.code.toUpperCase() === data.code.toUpperCase());
      if (exists) {
        toast.error('Mã hạng phòng đã tồn tại!');
        return;
      }
      addRoomCategory(data);
      toast.success('Thêm mới thành công!');
      setIsNewMode(false);
    } else if (selectedCategory) {
      updateRoomCategory(selectedCategory.id, data);
      toast.success('Cập nhật thành công!');
    }
  };

  const handleDelete = () => {
    if (selectedCategory) {
      deleteRoomCategory(selectedCategory.id);
      toast.success('Xóa thành công!');
      setSelectedCategory(null);
    }
  };

  const handleCancel = () => {
    setSelectedCategory(null);
    setIsNewMode(false);
  };

  return (
    <SplitView<RoomCategory>
      title="Hạng phòng"
      items={roomCategories}
      selectedItem={selectedCategory}
      onSelect={handleSelect}
      onCreateNew={handleCreateNew}
      keyExtractor={(cat) => cat.id}
      searchKeys={['code', 'name', 'bedType']}
      searchPlaceholder="Tìm theo mã, tên hoặc loại giường..."
      emptyMessage="Chưa có hạng phòng nào"
      renderListItem={(cat) => (
        <RoomCategoryListItem roomCategory={cat} roomTypeName={getRoomTypeName(cat.roomTypeId)} />
      )}
      renderForm={() => (
        <RoomCategoryForm
          roomCategory={selectedCategory}
          isNewMode={isNewMode}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      )}
    />
  );
}
