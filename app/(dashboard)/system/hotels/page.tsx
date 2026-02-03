'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { SplitView } from '../../../../components/crud';
import { Button } from '../../../../components/ui/Button';
import { Input, TextArea } from '../../../../components/ui/Input';
import { ConfirmModal } from '../../../../components/ui/Modal';
import { useMockData } from '../../../../lib/context/MockDataContext';
import { Hotel } from '../../../../lib/types';

// ==========================================
// Hotel List Item
// ==========================================

function HotelListItem({ hotel }: { hotel: Hotel; isSelected: boolean }) {
  return (
    <div>
      <span className="font-semibold text-[#1E3A8A] font-heading">{hotel.name}</span>
      <p className="text-sm text-[#6B7280] mt-1 truncate">{hotel.address}</p>
    </div>
  );
}

// ==========================================
// Hotel Form
// ==========================================

interface HotelFormProps {
  hotel: Hotel | null;
  isNewMode: boolean;
  onSave: (data: Partial<Hotel>) => void;
  onDelete: () => void;
  onCancel: () => void;
}

function HotelForm({ hotel, isNewMode, onSave, onDelete, onCancel }: HotelFormProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: hotel?.name || '',
    address: hotel?.address || '',
    phone: hotel?.phone || '',
    email: hotel?.email || '',
    checkInTime: hotel?.checkInTime || '14:00',
    checkOutTime: hotel?.checkOutTime || '12:00',
    taxPercent: hotel?.taxPercent || 10,
    serviceChargePercent: hotel?.serviceChargePercent || 5,
    defaultCurrencyId: hotel?.defaultCurrencyId || 'VND',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      toast.error('Tên và địa chỉ là bắt buộc!');
      return;
    }
    onSave(formData);
  };

  if (!hotel && !isNewMode) {
    return (
      <div className="flex items-center justify-center h-64 text-[#6B7280]">
        <div className="text-center">
          <p className="text-lg mb-2">Chọn một khách sạn để xem chi tiết</p>
          <p className="text-sm">hoặc nhấn &quot;Thêm mới&quot; để tạo mới</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1E3A8A] font-heading">
          {isNewMode ? 'Thêm mới Khách sạn' : 'Chỉnh sửa Khách sạn'}
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          {isNewMode ? 'Điền thông tin khách sạn mới' : `Đang chỉnh sửa: ${hotel?.name}`}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tên khách sạn"
          placeholder="Grand Hotel Saigon"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <TextArea
          label="Địa chỉ"
          placeholder="Địa chỉ đầy đủ..."
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={2}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Điện thoại"
            placeholder="+84 28 1234 5678"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <Input
            label="Email"
            type="email"
            placeholder="info@hotel.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Giờ check-in"
            type="time"
            value={formData.checkInTime}
            onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
          />

          <Input
            label="Giờ check-out"
            type="time"
            value={formData.checkOutTime}
            onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Thuế (%)"
            type="number"
            min={0}
            max={100}
            value={formData.taxPercent}
            onChange={(e) => setFormData({ ...formData, taxPercent: parseFloat(e.target.value) || 0 })}
          />

          <Input
            label="Phí dịch vụ (%)"
            type="number"
            min={0}
            max={100}
            value={formData.serviceChargePercent}
            onChange={(e) => setFormData({ ...formData, serviceChargePercent: parseFloat(e.target.value) || 0 })}
          />

          <Input
            label="Mã tiền tệ mặc định"
            placeholder="VND"
            value={formData.defaultCurrencyId}
            onChange={(e) => setFormData({ ...formData, defaultCurrencyId: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-3 pt-6 border-t border-[#E2E8F0]">
          <Button type="submit" variant="primary">Lưu</Button>
          <Button type="button" variant="ghost" onClick={onCancel}>Hủy</Button>
          {!isNewMode && hotel && (
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
        message={`Bạn có chắc chắn muốn xóa khách sạn "${hotel?.name}"?`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}

// ==========================================
// Hotels Page
// ==========================================

export default function HotelsPage() {
  const { hotels, addHotel, updateHotel, deleteHotel } = useMockData();
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isNewMode, setIsNewMode] = useState(false);

  const handleSelect = (hotel: Hotel | null) => {
    setSelectedHotel(hotel);
    setIsNewMode(false);
  };

  const handleCreateNew = () => {
    setSelectedHotel(null);
    setIsNewMode(true);
  };

  const handleSave = (data: Partial<Hotel>) => {
    if (isNewMode) {
      addHotel(data as Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>);
      toast.success('Thêm mới thành công!');
      setIsNewMode(false);
    } else if (selectedHotel) {
      updateHotel(selectedHotel.id, data);
      toast.success('Cập nhật thành công!');
    }
  };

  const handleDelete = () => {
    if (selectedHotel) {
      deleteHotel(selectedHotel.id);
      toast.success('Xóa thành công!');
      setSelectedHotel(null);
    }
  };

  const handleCancel = () => {
    setSelectedHotel(null);
    setIsNewMode(false);
  };

  return (
    <SplitView<Hotel>
      title="Khách sạn"
      items={hotels}
      selectedItem={selectedHotel}
      onSelect={handleSelect}
      onCreateNew={handleCreateNew}
      keyExtractor={(h) => h.id}
      searchKeys={['name', 'address']}
      searchPlaceholder="Tìm theo tên hoặc địa chỉ..."
      emptyMessage="Chưa có khách sạn nào"
      renderListItem={(h, isSelected) => (
        <HotelListItem hotel={h} isSelected={isSelected} />
      )}
      renderForm={() => (
        <HotelForm
          hotel={selectedHotel}
          isNewMode={isNewMode}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      )}
    />
  );
}
