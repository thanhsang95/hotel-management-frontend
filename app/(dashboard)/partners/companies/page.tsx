'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { SplitView } from '../../../../components/crud';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Checkbox, Input, Select, TextArea } from '../../../../components/ui/Input';
import { ConfirmModal } from '../../../../components/ui/Modal';
import { useMockData } from '../../../../lib/context/MockDataContext';
import { CompanyProfile, CompanyType } from '../../../../lib/types';

// ==========================================
// Company List Item
// ==========================================

function CompanyListItem({ company }: { company: CompanyProfile; isSelected: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="font-semibold text-[#1E3A8A] font-heading">{company.name}</span>
        <p className="text-sm text-[#6B7280] mt-1">
          {company.type === 'Company' ? 'Công ty' : 'Đại lý du lịch'}
        </p>
      </div>
      <div className="flex flex-col gap-1 items-end">
        {company.isBlacklisted ? (
          <Badge variant="danger" size="small" dot>Blacklist</Badge>
        ) : (
          <Badge variant="success" size="small" dot>Hoạt động</Badge>
        )}
      </div>
    </div>
  );
}

// ==========================================
// Company Form
// ==========================================

interface CompanyFormProps {
  company: CompanyProfile | null;
  isNewMode: boolean;
  onSave: (data: Partial<CompanyProfile>) => void;
  onDelete: () => void;
  onCancel: () => void;
}

function CompanyForm({ company, isNewMode, onSave, onDelete, onCancel }: CompanyFormProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: company?.name || '',
    type: company?.type || 'Company',
    taxCode: company?.taxCode || '',
    address: company?.address || '',
    phone: company?.phone || '',
    email: company?.email || '',
    contactPerson: company?.contactPerson || '',
    source: company?.source || '',
    segment: company?.segment || '',
    channel: company?.channel || '',
    isBlacklisted: company?.isBlacklisted ?? false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Tên công ty là bắt buộc!');
      return;
    }
    onSave(formData);
  };

  if (!company && !isNewMode) {
    return (
      <div className="flex items-center justify-center h-64 text-[#6B7280]">
        <div className="text-center">
          <p className="text-lg mb-2">Chọn một hồ sơ để xem chi tiết</p>
          <p className="text-sm">hoặc nhấn &quot;Thêm mới&quot; để tạo mới</p>
        </div>
      </div>
    );
  }

  const typeOptions = [
    { value: 'Company', label: 'Công ty' },
    { value: 'TravelAgent', label: 'Đại lý du lịch' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1E3A8A] font-heading">
          {isNewMode ? 'Thêm mới Hồ sơ công ty' : 'Chỉnh sửa Hồ sơ công ty'}
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          {isNewMode ? 'Điền thông tin công ty mới' : `Đang chỉnh sửa: ${company?.name}`}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tên công ty"
          placeholder="Công ty TNHH ABC"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Loại"
            options={typeOptions}
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as CompanyType })}
          />

          <Input
            label="Mã số thuế"
            placeholder="0123456789"
            value={formData.taxCode}
            onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
          />
        </div>

        <TextArea
          label="Địa chỉ"
          placeholder="Địa chỉ công ty..."
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={2}
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
            placeholder="contact@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <Input
          label="Người liên hệ"
          placeholder="Nguyễn Văn A"
          value={formData.contactPerson}
          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
        />

        <div className="grid grid-cols-3 gap-4">
          <Select
            label="Nguồn"
            options={[
              { value: '', label: 'Chọn nguồn...' },
              { value: '1', label: 'Direct' },
              { value: '2', label: 'Website' },
              { value: '3', label: 'Phone' },
              { value: '4', label: 'Email' },
              { value: '5', label: 'OTA' },
              { value: '6', label: 'Travel Agent' },
              { value: '7', label: 'Referral' },
            ]}
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          />

          <Select
            label="Phân Khúc"
            options={[
              { value: '', label: 'Chọn phân khúc...' },
              { value: '1', label: 'Corporate' },
              { value: '2', label: 'FIT' },
              { value: '3', label: 'Group' },
              { value: '4', label: 'Government' },
              { value: '5', label: 'Wholesale' },
              { value: '6', label: 'Airline Crew' },
            ]}
            value={formData.segment}
            onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
          />

          <Select
            label="Kênh"
            options={[
              { value: '', label: 'Chọn kênh...' },
              { value: '1', label: 'Direct' },
              { value: '2', label: 'Booking.com' },
              { value: '3', label: 'Agoda' },
              { value: '4', label: 'Expedia' },
              { value: '5', label: 'Traveloka' },
              { value: '7', label: 'GDS' },
            ]}
            value={formData.channel}
            onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
          />
        </div>

        <div className="p-4 bg-[#FEF2F2] rounded-lg border border-[#FCA5A5]">
          <Checkbox
            label="Đánh dấu Blacklist (Danh sách đen)"
            checked={formData.isBlacklisted}
            onChange={(e) => setFormData({ ...formData, isBlacklisted: e.target.checked })}
          />
          <p className="text-sm text-[#991B1B] mt-2 ml-8">
            Công ty trong blacklist sẽ không thể tạo đặt phòng mới.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-6 border-t border-[#E2E8F0]">
          <Button type="submit" variant="primary">Lưu</Button>
          <Button type="button" variant="ghost" onClick={onCancel}>Hủy</Button>
          {!isNewMode && company && (
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
        message={`Bạn có chắc chắn muốn xóa hồ sơ "${company?.name}"?`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}

// ==========================================
// Company Profiles Page
// ==========================================

export default function CompanyProfilesPage() {
  const { companyProfiles, addCompanyProfile, updateCompanyProfile, deleteCompanyProfile } = useMockData();
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(null);
  const [isNewMode, setIsNewMode] = useState(false);

  const handleSelect = (company: CompanyProfile | null) => {
    setSelectedCompany(company);
    setIsNewMode(false);
  };

  const handleCreateNew = () => {
    setSelectedCompany(null);
    setIsNewMode(true);
  };

  const handleSave = (data: Partial<CompanyProfile>) => {
    if (isNewMode) {
      addCompanyProfile(data as Omit<CompanyProfile, 'id' | 'createdAt' | 'updatedAt'>);
      toast.success('Thêm mới thành công!');
      setIsNewMode(false);
    } else if (selectedCompany) {
      updateCompanyProfile(selectedCompany.id, data);
      toast.success('Cập nhật thành công!');
    }
  };

  const handleDelete = () => {
    if (selectedCompany) {
      deleteCompanyProfile(selectedCompany.id);
      toast.success('Xóa thành công!');
      setSelectedCompany(null);
    }
  };

  const handleCancel = () => {
    setSelectedCompany(null);
    setIsNewMode(false);
  };

  return (
    <SplitView<CompanyProfile>
      title="Hồ sơ công ty"
      items={companyProfiles}
      selectedItem={selectedCompany}
      onSelect={handleSelect}
      onCreateNew={handleCreateNew}
      keyExtractor={(c) => c.id}
      searchKeys={['name', 'taxCode']}
      searchPlaceholder="Tìm theo tên hoặc mã số thuế..."
      emptyMessage="Chưa có hồ sơ công ty nào"
      renderListItem={(c, isSelected) => (
        <CompanyListItem company={c} isSelected={isSelected} />
      )}
      renderForm={() => (
        <CompanyForm
          company={selectedCompany}
          isNewMode={isNewMode}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      )}
    />
  );
}
