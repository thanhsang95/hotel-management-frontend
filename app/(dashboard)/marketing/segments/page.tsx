'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { SplitView } from '../../../../components/crud';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Checkbox, Input, TextArea } from '../../../../components/ui/Input';
import { ConfirmModal } from '../../../../components/ui/Modal';
import { useMockData } from '../../../../lib/context/MockDataContext';
import { MarketSegment } from '../../../../lib/types';

// ==========================================
// Market Segment List Item
// ==========================================

function SegmentListItem({ segment }: { segment: MarketSegment; isSelected: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="font-semibold text-[#1E3A8A] font-heading">{segment.code}</span>
        <p className="text-sm text-[#6B7280] mt-1">{segment.name}</p>
      </div>
      <Badge variant={segment.isActive ? 'success' : 'neutral'} size="small" dot>
        {segment.isActive ? 'Kích hoạt' : 'Tắt'}
      </Badge>
    </div>
  );
}

// ==========================================
// Market Segment Form
// ==========================================

interface SegmentFormProps {
  segment: MarketSegment | null;
  isNewMode: boolean;
  onSave: (data: Partial<MarketSegment>) => void;
  onDelete: () => void;
  onCancel: () => void;
}

function SegmentForm({ segment, isNewMode, onSave, onDelete, onCancel }: SegmentFormProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    code: segment?.code || '',
    name: segment?.name || '',
    description: segment?.description || '',
    isActive: segment?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      toast.error('Mã và tên là bắt buộc!');
      return;
    }
    onSave(formData);
  };

  if (!segment && !isNewMode) {
    return (
      <div className="flex items-center justify-center h-64 text-[#6B7280]">
        <div className="text-center">
          <p className="text-lg mb-2">Chọn một phân khúc để xem chi tiết</p>
          <p className="text-sm">hoặc nhấn &quot;Thêm mới&quot; để tạo mới</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1E3A8A] font-heading">
          {isNewMode ? 'Thêm mới Phân khúc' : 'Chỉnh sửa Phân khúc'}
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          {isNewMode ? 'Điền thông tin phân khúc mới' : `Đang chỉnh sửa: ${segment?.code}`}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Mã phân khúc"
          placeholder="CORP"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
          disabled={!isNewMode}
        />

        <Input
          label="Tên phân khúc"
          placeholder="Corporate"
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

        <Checkbox
          label="Kích hoạt"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
        />

        <div className="flex items-center gap-3 pt-6 border-t border-[#E2E8F0]">
          <Button type="submit" variant="primary">Lưu</Button>
          <Button type="button" variant="ghost" onClick={onCancel}>Hủy</Button>
          {!isNewMode && segment && (
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
        message={`Bạn có chắc chắn muốn xóa phân khúc "${segment?.code}"?`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}

// ==========================================
// Market Segments Page
// ==========================================

export default function MarketSegmentsPage() {
  const { marketSegments, addMarketSegment, updateMarketSegment, deleteMarketSegment } = useMockData();
  const [selectedSegment, setSelectedSegment] = useState<MarketSegment | null>(null);
  const [isNewMode, setIsNewMode] = useState(false);

  const handleSelect = (segment: MarketSegment | null) => {
    setSelectedSegment(segment);
    setIsNewMode(false);
  };

  const handleCreateNew = () => {
    setSelectedSegment(null);
    setIsNewMode(true);
  };

  const handleSave = (data: Partial<MarketSegment>) => {
    if (isNewMode) {
      const exists = marketSegments.some((s) => s.code.toUpperCase() === data.code?.toUpperCase());
      if (exists) {
        toast.error('Mã đã tồn tại!');
        return;
      }
      addMarketSegment(data as Omit<MarketSegment, 'id' | 'createdAt' | 'updatedAt'>);
      toast.success('Thêm mới thành công!');
      setIsNewMode(false);
    } else if (selectedSegment) {
      updateMarketSegment(selectedSegment.id, data);
      toast.success('Cập nhật thành công!');
    }
  };

  const handleDelete = () => {
    if (selectedSegment) {
      deleteMarketSegment(selectedSegment.id);
      toast.success('Xóa thành công!');
      setSelectedSegment(null);
    }
  };

  const handleCancel = () => {
    setSelectedSegment(null);
    setIsNewMode(false);
  };

  return (
    <SplitView<MarketSegment>
      title="Phân khúc thị trường"
      items={marketSegments}
      selectedItem={selectedSegment}
      onSelect={handleSelect}
      onCreateNew={handleCreateNew}
      keyExtractor={(s) => s.id}
      searchKeys={['code', 'name']}
      searchPlaceholder="Tìm theo mã hoặc tên..."
      emptyMessage="Chưa có phân khúc nào"
      renderListItem={(s, isSelected) => (
        <SegmentListItem segment={s} isSelected={isSelected} />
      )}
      renderForm={() => (
        <SegmentForm
          segment={selectedSegment}
          isNewMode={isNewMode}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      )}
    />
  );
}
