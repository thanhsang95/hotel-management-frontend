'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { SplitView } from '../../../../components/crud';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Checkbox, Input, TextArea } from '../../../../components/ui/Input';
import { ConfirmModal } from '../../../../components/ui/Modal';
import { useMockData } from '../../../../lib/context/MockDataContext';
import { defaultRoomTypeValues, RoomTypeFormData, RoomTypeFormInput, roomTypeSchema } from '../../../../lib/schemas/roomType';
import { RoomType } from '../../../../lib/types';

// ==========================================
// Room Type List Item
// ==========================================

function RoomTypeListItem({ roomType }: { roomType: RoomType; isSelected: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1E3A8A] font-heading">
            {roomType.code}
          </span>
        </div>
        <p className="text-sm text-[#6B7280] mt-1">{roomType.name}</p>
      </div>
      <Badge variant={roomType.isActive ? 'success' : 'neutral'} size="small" dot>
        {roomType.isActive ? 'Kích hoạt' : 'Tắt'}
      </Badge>
    </div>
  );
}

// ==========================================
// Room Type Form
// ==========================================

interface RoomTypeFormProps {
  roomType: RoomType | null;
  isNewMode: boolean;
  onSave: (data: RoomTypeFormData) => void;
  onDelete: () => void;
  onCancel: () => void;
}

function RoomTypeForm({ roomType, isNewMode, onSave, onDelete, onCancel }: RoomTypeFormProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoomTypeFormInput, unknown, RoomTypeFormData>({
    resolver: zodResolver(roomTypeSchema),
    defaultValues: defaultRoomTypeValues,
  });

  useEffect(() => {
    if (roomType) {
      reset({
        code: roomType.code,
        name: roomType.name,
        description: roomType.description || '',
        sortOrder: roomType.sortOrder,
        isActive: roomType.isActive,
      });
    } else {
      reset(defaultRoomTypeValues);
    }
  }, [roomType, reset]);

  const onSubmit = (data: RoomTypeFormData) => {
    onSave(data);
  };

  if (!roomType && !isNewMode) {
    return (
      <div className="flex items-center justify-center h-64 text-[#6B7280]">
        <div className="text-center">
          <p className="text-lg mb-2">Chọn một loại phòng để xem chi tiết</p>
          <p className="text-sm">hoặc nhấn &quot;Thêm mới&quot; để tạo mới</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1E3A8A] font-heading">
          {isNewMode ? 'Thêm mới Loại phòng' : 'Chỉnh sửa Loại phòng'}
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          {isNewMode ? 'Điền thông tin để tạo loại phòng mới' : `Đang chỉnh sửa: ${roomType?.code}`}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Mã loại phòng"
          placeholder="STD"
          {...register('code')}
          error={errors.code?.message}
          required
          disabled={!isNewMode}
        />

        <Input
          label="Tên loại phòng"
          placeholder="Standard"
          {...register('name')}
          error={errors.name?.message}
          required
        />

        <TextArea
          label="Mô tả"
          placeholder="Mô tả chi tiết về loại phòng..."
          {...register('description')}
          rows={3}
        />

        <Checkbox label="Kích hoạt" {...register('isActive')} />

        <div className="flex items-center gap-3 pt-6 border-t border-[#E2E8F0]">
          <Button type="submit" variant="primary">Lưu</Button>
          <Button type="button" variant="ghost" onClick={onCancel}>Hủy</Button>
          {!isNewMode && roomType && (
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
        message={`Bạn có chắc chắn muốn xóa loại phòng "${roomType?.code}"?`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}

// ==========================================
// Room Types Page
// ==========================================

export default function RoomTypesPage() {
  const { roomTypes, addRoomType, updateRoomType, deleteRoomType } = useMockData();
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
  const [isNewMode, setIsNewMode] = useState(false);

  const handleSelect = (roomType: RoomType | null) => {
    setSelectedRoomType(roomType);
    setIsNewMode(false);
  };

  const handleCreateNew = () => {
    setSelectedRoomType(null);
    setIsNewMode(true);
  };

  const handleSave = (data: RoomTypeFormData) => {
    if (isNewMode) {
      const exists = roomTypes.some((r) => r.code.toUpperCase() === data.code.toUpperCase());
      if (exists) {
        toast.error('Mã loại phòng đã tồn tại!');
        return;
      }
      addRoomType(data);
      toast.success('Thêm mới thành công!');
      setIsNewMode(false);
    } else if (selectedRoomType) {
      updateRoomType(selectedRoomType.id, data);
      toast.success('Cập nhật thành công!');
    }
  };

  const handleDelete = () => {
    if (selectedRoomType) {
      deleteRoomType(selectedRoomType.id);
      toast.success('Xóa thành công!');
      setSelectedRoomType(null);
    }
  };

  const handleCancel = () => {
    setSelectedRoomType(null);
    setIsNewMode(false);
  };

  return (
    <SplitView<RoomType>
      title="Loại phòng"
      items={roomTypes}
      selectedItem={selectedRoomType}
      onSelect={handleSelect}
      onCreateNew={handleCreateNew}
      keyExtractor={(rt) => rt.id}
      searchKeys={['code', 'name']}
      searchPlaceholder="Tìm theo mã hoặc tên..."
      emptyMessage="Chưa có loại phòng nào"
      renderListItem={(rt, isSelected) => (
        <RoomTypeListItem roomType={rt} isSelected={isSelected} />
      )}
      renderForm={() => (
        <RoomTypeForm
          roomType={selectedRoomType}
          isNewMode={isNewMode}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      )}
    />
  );
}
