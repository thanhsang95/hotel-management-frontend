'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { SplitView } from '../../../../components/crud';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Checkbox, Input, TextArea } from '../../../../components/ui/Input';
import { ConfirmModal } from '../../../../components/ui/Modal';
import { useMockData } from '../../../../lib/context/MockDataContext';
import { Channel } from '../../../../lib/types';

// ==========================================
// Channel List Item
// ==========================================

function ChannelListItem({ channel }: { channel: Channel; isSelected: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="font-semibold text-[#1E3A8A] font-heading">{channel.code}</span>
        <p className="text-sm text-[#6B7280] mt-1">{channel.name}</p>
      </div>
      <Badge variant={channel.isActive ? 'success' : 'neutral'} size="small" dot>
        {channel.isActive ? 'Kích hoạt' : 'Tắt'}
      </Badge>
    </div>
  );
}

// ==========================================
// Channel Form
// ==========================================

interface ChannelFormProps {
  channel: Channel | null;
  isNewMode: boolean;
  onSave: (data: Partial<Channel>) => void;
  onDelete: () => void;
  onCancel: () => void;
}

function ChannelForm({ channel, isNewMode, onSave, onDelete, onCancel }: ChannelFormProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    code: channel?.code || '',
    name: channel?.name || '',
    description: channel?.description || '',
    externalMappingId: channel?.externalMappingId || '',
    isActive: channel?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      toast.error('Mã và tên là bắt buộc!');
      return;
    }
    onSave(formData);
  };

  if (!channel && !isNewMode) {
    return (
      <div className="flex items-center justify-center h-64 text-[#6B7280]">
        <div className="text-center">
          <p className="text-lg mb-2">Chọn một kênh để xem chi tiết</p>
          <p className="text-sm">hoặc nhấn &quot;Thêm mới&quot; để tạo mới</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1E3A8A] font-heading">
          {isNewMode ? 'Thêm mới Kênh' : 'Chỉnh sửa Kênh'}
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          {isNewMode ? 'Điền thông tin kênh mới' : `Đang chỉnh sửa: ${channel?.code}`}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Mã kênh"
          placeholder="BDC"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
          disabled={!isNewMode}
        />

        <Input
          label="Tên kênh"
          placeholder="Booking.com"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <TextArea
          label="Mô tả"
          placeholder="Mô tả chi tiết..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />

        <Input
          label="External Mapping ID"
          placeholder="booking_com_123"
          value={formData.externalMappingId}
          onChange={(e) => setFormData({ ...formData, externalMappingId: e.target.value })}
          helperText="ID dùng để tích hợp với hệ thống bên ngoài"
        />

        <Checkbox
          label="Kích hoạt"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
        />

        <div className="flex items-center gap-3 pt-6 border-t border-[#E2E8F0]">
          <Button type="submit" variant="primary">Lưu</Button>
          <Button type="button" variant="ghost" onClick={onCancel}>Hủy</Button>
          {!isNewMode && channel && (
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
        message={`Bạn có chắc chắn muốn xóa kênh "${channel?.code}"?`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}

// ==========================================
// Channels Page
// ==========================================

export default function ChannelsPage() {
  const { channels, addChannel, updateChannel, deleteChannel } = useMockData();
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isNewMode, setIsNewMode] = useState(false);

  const handleSelect = (channel: Channel | null) => {
    setSelectedChannel(channel);
    setIsNewMode(false);
  };

  const handleCreateNew = () => {
    setSelectedChannel(null);
    setIsNewMode(true);
  };

  const handleSave = (data: Partial<Channel>) => {
    if (isNewMode) {
      const exists = channels.some((c) => c.code.toUpperCase() === data.code?.toUpperCase());
      if (exists) {
        toast.error('Mã đã tồn tại!');
        return;
      }
      addChannel(data as Omit<Channel, 'id' | 'createdAt' | 'updatedAt'>);
      toast.success('Thêm mới thành công!');
      setIsNewMode(false);
    } else if (selectedChannel) {
      updateChannel(selectedChannel.id, data);
      toast.success('Cập nhật thành công!');
    }
  };

  const handleDelete = () => {
    if (selectedChannel) {
      deleteChannel(selectedChannel.id);
      toast.success('Xóa thành công!');
      setSelectedChannel(null);
    }
  };

  const handleCancel = () => {
    setSelectedChannel(null);
    setIsNewMode(false);
  };

  return (
    <SplitView<Channel>
      title="Kênh phân phối"
      items={channels}
      selectedItem={selectedChannel}
      onSelect={handleSelect}
      onCreateNew={handleCreateNew}
      keyExtractor={(c) => c.id}
      searchKeys={['code', 'name']}
      searchPlaceholder="Tìm theo mã hoặc tên..."
      emptyMessage="Chưa có kênh nào"
      renderListItem={(c, isSelected) => (
        <ChannelListItem channel={c} isSelected={isSelected} />
      )}
      renderForm={() => (
        <ChannelForm
          channel={selectedChannel}
          isNewMode={isNewMode}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      )}
    />
  );
}
