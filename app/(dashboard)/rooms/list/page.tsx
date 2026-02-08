'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { SplitView } from '../../../../components/crud';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Input, Select } from '../../../../components/ui/Input';
import { ConfirmModal } from '../../../../components/ui/Modal';
import { useMockData } from '../../../../lib/context/MockDataContext';
import { Room } from '../../../../lib/types';

// ==========================================
// Room List Item
// ==========================================

function RoomListItem({ room, statusName, statusColor }: { room: Room; isSelected: boolean; statusName: string; statusColor: string }) {
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
      <Badge variant={statusColor as any} size="small" dot>
        {statusName}
      </Badge>
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
  roomTypes: { id: string; name: string }[];
  roomCategories: { id: string; name: string; roomTypeId: string }[];
  activeStatuses: { id: string; name: string; sortOrder: number }[];
}

function RoomForm({ room, isNewMode, onSave, onDelete, onCancel, roomTypes, roomCategories, activeStatuses }: RoomFormProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Find the roomTypeId from the selected category
  const initialRoomTypeId = room?.categoryId 
    ? roomCategories.find(cat => cat.id === room.categoryId)?.roomTypeId || ''
    : '';
  
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState(initialRoomTypeId);
  
  const [formData, setFormData] = useState({
    roomNumber: room?.roomNumber || '',
    floor: room?.floor || 1,
    building: room?.building || 'A',
    categoryId: room?.categoryId || '',
    statusId: room?.statusId || (activeStatuses[0]?.id || ''),
    roomType: room?.roomType || '',
    notes: room?.notes || '',
  });

  // Filter categories based on selected room type
  const filteredCategories = selectedRoomTypeId
    ? roomCategories.filter(cat => cat.roomTypeId === selectedRoomTypeId)
    : roomCategories;

  // Handle room type change - reset category if it doesn't match new type
  const handleRoomTypeChange = (newRoomTypeId: string) => {
    setSelectedRoomTypeId(newRoomTypeId);
    
    // Find the room type name to populate the roomType field
    const selectedType = roomTypes.find(type => type.id === newRoomTypeId);
    const roomTypeName = selectedType?.name || '';
    
    // If current category doesn't belong to new room type, reset it
    const currentCategory = roomCategories.find(cat => cat.id === formData.categoryId);
    if (currentCategory && currentCategory.roomTypeId !== newRoomTypeId) {
      setFormData({ ...formData, categoryId: '', roomType: roomTypeName });
    } else {
      setFormData({ ...formData, roomType: roomTypeName });
    }
  };

  // Sync state when room changes
  useEffect(() => {
    if (room) {
      const roomTypeId = roomCategories.find(cat => cat.id === room.categoryId)?.roomTypeId || '';
      setSelectedRoomTypeId(roomTypeId);
      setFormData({
        roomNumber: room.roomNumber,
        floor: room.floor,
        building: room.building || 'A',
        categoryId: room.categoryId,
        statusId: room.statusId,
        roomType: room.roomType || '',
        notes: room.notes || '',
      });
    } else if (isNewMode) {
      setSelectedRoomTypeId('');
      setFormData({
        roomNumber: '',
        floor: 1,
        building: 'A',
        categoryId: '',
        statusId: activeStatuses[0]?.id || '',
        roomType: '',
        notes: '',
      });
    }
  }, [room, isNewMode, roomCategories, activeStatuses]);

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

  // Sort statuses by sortOrder
  const sortedStatuses = [...activeStatuses].sort((a, b) => a.sortOrder - b.sortOrder);

  const statusOptions = [
    { value: '', label: 'Chọn trạng thái...' },
    ...sortedStatuses.map((status) => ({
      value: status.id,
      label: status.name,
    })),
  ];

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
          label="Dạng phòng"
          options={[
            { value: '', label: 'Chọn dạng phòng...' },
            ...roomTypes.map((type) => ({
              value: type.id,
              label: type.name,
            })),
          ]}
          value={selectedRoomTypeId}
          onChange={(e) => handleRoomTypeChange(e.target.value)}
          placeholder="Chọn dạng phòng trước..."
        />

        <Select
          label="Hạng phòng"
          options={[
            { value: '', label: selectedRoomTypeId ? 'Chọn hạng phòng...' : 'Vui lòng chọn dạng phòng trước' },
            ...filteredCategories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            })),
          ]}
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          placeholder="Chọn hạng phòng..."
          disabled={!selectedRoomTypeId}
        />

        <Select
          label="Trạng thái"
          options={statusOptions}
          value={formData.statusId}
          onChange={(e) => setFormData({ ...formData, statusId: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-[#1E3A8A] mb-1.5">
            Ghi chú
          </label>
          <textarea
            className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent resize-none"
            rows={3}
            placeholder="Nhập ghi chú..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

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
  const { rooms, roomTypes, roomCategories, roomStatusDefinitions, addRoom, updateRoom, deleteRoom } = useMockData();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isNewMode, setIsNewMode] = useState(false);

  // Filter active statuses for the form dropdown
  const activeStatuses = roomStatusDefinitions
    .filter(status => status.isActive)
    .map(status => ({ id: status.id, name: status.name, sortOrder: status.sortOrder }));

  // Helper to get status details
  const getStatusDetails = (statusId: string) => {
    const status = roomStatusDefinitions.find(s => s.id === statusId);
    return {
      name: status?.name || 'Unknown',
      color: status?.color || 'neutral',
    };
  };

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
      renderListItem={(room, isSelected) => {
        const statusDetails = getStatusDetails(room.statusId);
        return (
          <RoomListItem 
            room={room} 
            isSelected={isSelected} 
            statusName={statusDetails.name}
            statusColor={statusDetails.color}
          />
        );
      }}
      renderForm={() => (
        <RoomForm
          room={selectedRoom}
          isNewMode={isNewMode}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={handleCancel}
          roomTypes={roomTypes}
          roomCategories={roomCategories}
          activeStatuses={activeStatuses}
        />
      )}
    />
  );
}
