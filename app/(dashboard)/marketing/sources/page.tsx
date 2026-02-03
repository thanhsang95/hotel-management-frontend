'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { SplitView } from '../../../../components/crud';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Checkbox, Input, TextArea } from '../../../../components/ui/Input';
import { ConfirmModal } from '../../../../components/ui/Modal';
import { useMockData } from '../../../../lib/context/MockDataContext';
import { SourceCode } from '../../../../lib/types';

// ==========================================
// Source Code List Item
// ==========================================

function SourceListItem({ source }: { source: SourceCode; isSelected: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="font-semibold text-[#1E3A8A] font-heading">{source.code}</span>
        <p className="text-sm text-[#6B7280] mt-1">{source.name}</p>
      </div>
      <Badge variant={source.isActive ? 'success' : 'neutral'} size="small" dot>
        {source.isActive ? 'Kích hoạt' : 'Tắt'}
      </Badge>
    </div>
  );
}

// ==========================================
// Source Code Form
// ==========================================

interface SourceFormProps {
  source: SourceCode | null;
  isNewMode: boolean;
  onSave: (data: Partial<SourceCode>) => void;
  onDelete: () => void;
  onCancel: () => void;
}

function SourceForm({ source, isNewMode, onSave, onDelete, onCancel }: SourceFormProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    code: source?.code || '',
    name: source?.name || '',
    description: source?.description || '',
    isActive: source?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      toast.error('Mã và tên là bắt buộc!');
      return;
    }
    onSave(formData);
  };

  if (!source && !isNewMode) {
    return (
      <div className="flex items-center justify-center h-64 text-[#6B7280]">
        <div className="text-center">
          <p className="text-lg mb-2">Chọn một nguồn để xem chi tiết</p>
          <p className="text-sm">hoặc nhấn &quot;Thêm mới&quot; để tạo mới</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1E3A8A] font-heading">
          {isNewMode ? 'Thêm mới Nguồn' : 'Chỉnh sửa Nguồn'}
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          {isNewMode ? 'Điền thông tin nguồn mới' : `Đang chỉnh sửa: ${source?.code}`}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Mã nguồn"
          placeholder="DIR"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
          disabled={!isNewMode}
        />

        <Input
          label="Tên nguồn"
          placeholder="Direct"
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
          {!isNewMode && source && (
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
        message={`Bạn có chắc chắn muốn xóa nguồn "${source?.code}"?`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}

// ==========================================
// Source Codes Page
// ==========================================

export default function SourceCodesPage() {
  const { sourceCodes, addSourceCode, updateSourceCode, deleteSourceCode } = useMockData();
  const [selectedSource, setSelectedSource] = useState<SourceCode | null>(null);
  const [isNewMode, setIsNewMode] = useState(false);

  const handleSelect = (source: SourceCode | null) => {
    setSelectedSource(source);
    setIsNewMode(false);
  };

  const handleCreateNew = () => {
    setSelectedSource(null);
    setIsNewMode(true);
  };

  const handleSave = (data: Partial<SourceCode>) => {
    if (isNewMode) {
      const exists = sourceCodes.some((s) => s.code.toUpperCase() === data.code?.toUpperCase());
      if (exists) {
        toast.error('Mã đã tồn tại!');
        return;
      }
      addSourceCode(data as Omit<SourceCode, 'id' | 'createdAt' | 'updatedAt'>);
      toast.success('Thêm mới thành công!');
      setIsNewMode(false);
    } else if (selectedSource) {
      updateSourceCode(selectedSource.id, data);
      toast.success('Cập nhật thành công!');
    }
  };

  const handleDelete = () => {
    if (selectedSource) {
      deleteSourceCode(selectedSource.id);
      toast.success('Xóa thành công!');
      setSelectedSource(null);
    }
  };

  const handleCancel = () => {
    setSelectedSource(null);
    setIsNewMode(false);
  };

  return (
    <SplitView<SourceCode>
      title="Nguồn đặt phòng"
      items={sourceCodes}
      selectedItem={selectedSource}
      onSelect={handleSelect}
      onCreateNew={handleCreateNew}
      keyExtractor={(s) => s.id}
      searchKeys={['code', 'name']}
      searchPlaceholder="Tìm theo mã hoặc tên..."
      emptyMessage="Chưa có nguồn nào"
      renderListItem={(s, isSelected) => (
        <SourceListItem source={s} isSelected={isSelected} />
      )}
      renderForm={() => (
        <SourceForm
          source={selectedSource}
          isNewMode={isNewMode}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      )}
    />
  );
}
