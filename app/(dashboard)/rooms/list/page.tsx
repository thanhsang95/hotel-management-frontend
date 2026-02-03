'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { SplitView } from '../../../../components/crud';
import { RoomStatusBadge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Input, Select } from '../../../../components/ui/Input';
import { ConfirmModal } from '../../../../components/ui/Modal';
import { useMockData } from '../../../../lib/context/MockDataContext';
import { Room, RoomStatus } from '../../../../lib/types';

// ==========================================
// Room List Item
// ==========================================

function RoomListItem({ room }: { room: Room; isSelected: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="font-semibold text-[#1E3A8A] font-heading">
          {room.roomNumber}
        </span>
        <p className="text-sm text-[#6B7280] mt-1">
          Tầng {room.floor} • Tòa {room.building}
        </p>
      </div>
      <RoomStatusBadge status={room.status as RoomStatus} size="small" />
    </div>
  );
}

// ==========================================
// Room Form
// ==========================================

interface RoomFormProps {
  room: Room | null;
  isNewMode: boolean;
  onSave: (data: Partial<Room>) => void;
  onDelete: () => void;
  onCancel: () => void;
  roomCategories: { id: string; name: string }[];
}

function RoomForm({ room, isNewMode, onSave, onDelete, onCancel, roomCategories }: RoomFormProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: room?.roomNumber || '',
    floor: room?.floor || 1,
    building: room?.building || 'A',
    categoryId: room?.categoryId || '',
    status: room?.status || 'Vacant',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roomNumber) {
      toast.error('Số phòng là bắt buộc!');
      return;
    }
    onSave(formData);
  };

  if (!room && !isNewMode) {
    return (
      <div className="flex items-center justify-center h-64 text-[#6B7280]">
        <div className="text-center">
          <p className="text-lg mb-2">Chọn một phòng để xem chi tiết</p>
          <p className="text-sm">hoặc nhấn &quot;Thêm mới&quot; để tạo mới</p>
        </div>
      </div>
    );
  }

  const statusOptions = [
    { value: 'Vacant', label: 'Trống' },
    { value: 'Occupied', label: 'Có khách' },
    { value: 'Dirty', label: 'Bẩn' },
    { value: 'OOO', label: 'Hỏng / Bảo trì' },
  ];

  const categoryOptions = roomCategories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1E3A8A] font-heading">
          {isNewMode ? 'Thêm mới Phòng' : 'Chỉnh sửa Phòng'}
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          {isNewMode ? 'Điền thông tin phòng mới' : `Đang chỉnh sửa: ${room?.roomNumber}`}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Số phòng"
          placeholder="A101"
          value={formData.roomNumber}
          onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
          required
          disabled={!isNewMode}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Tầng"
            type="number"
            min={1}
            value={formData.floor}
            onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || 1 })}
            required
          />

          <Input
            label="Tòa nhà"
            placeholder="A"
            value={formData.building}
            onChange={(e) => setFormData({ ...formData, building: e.target.value })}
            required
          />
        </div>

        <Select
          label="Hạng phòng"
          options={categoryOptions}
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          placeholder="Chọn hạng phòng..."
        />

        <Select
          label="Trạng thái"
          options={statusOptions}
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as RoomStatus })}
        />

        <div className="flex items-center gap-3 pt-6 border-t border-[#E2E8F0]">
          <Button type="submit" variant="primary">Lưu</Button>
          <Button type="button" variant="ghost" onClick={onCancel}>Hủy</Button>
          {!isNewMode && room && (
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
        message={`Bạn có chắc chắn muốn xóa phòng "${room?.roomNumber}"?`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}

// ==========================================
// Rooms Page
// ==========================================

export default function RoomsPage() {
  const { rooms, roomCategories, addRoom, updateRoom, deleteRoom } = useMockData();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isNewMode, setIsNewMode] = useState(false);

  const handleSelect = (room: Room | null) => {
    setSelectedRoom(room);
    setIsNewMode(false);
  };

  const handleCreateNew = () => {
    setSelectedRoom(null);
    setIsNewMode(true);
  };

  const handleSave = (data: Partial<Room>) => {
    if (isNewMode) {
      const exists = rooms.some((r) => r.roomNumber.toUpperCase() === data.roomNumber?.toUpperCase());
      if (exists) {
        toast.error('Số phòng đã tồn tại!');
        return;
      }
      addRoom(data as Omit<Room, 'id' | 'createdAt' | 'updatedAt'>);
      toast.success('Thêm mới thành công!');
      setIsNewMode(false);
    } else if (selectedRoom) {
      updateRoom(selectedRoom.id, data);
      toast.success('Cập nhật thành công!');
    }
  };

  const handleDelete = () => {
    if (selectedRoom) {
      deleteRoom(selectedRoom.id);
      toast.success('Xóa thành công!');
      setSelectedRoom(null);
    }
  };

  const handleCancel = () => {
    setSelectedRoom(null);
    setIsNewMode(false);
  };

  return (
    <SplitView<Room>
      title="Phòng"
      items={rooms}
      selectedItem={selectedRoom}
      onSelect={handleSelect}
      onCreateNew={handleCreateNew}
      keyExtractor={(room) => room.id}
      searchKeys={['roomNumber', 'building']}
      searchPlaceholder="Tìm theo số phòng..."
      emptyMessage="Chưa có phòng nào"
      renderListItem={(room, isSelected) => (
        <RoomListItem room={room} isSelected={isSelected} />
      )}
      renderForm={() => (
        <RoomForm
          room={selectedRoom}
          isNewMode={isNewMode}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={handleCancel}
          roomCategories={roomCategories}
        />
      )}
    />
  );
}
