'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { SplitView } from '../../../../components/crud';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Checkbox, Input } from '../../../../components/ui/Input';
import { ConfirmModal } from '../../../../components/ui/Modal';
import { useMockData } from '../../../../lib/context/MockDataContext';
import { CurrencyFormData, CurrencyFormInput, currencySchema, defaultCurrencyValues } from '../../../../lib/schemas/currency';
import { Currency } from '../../../../lib/types';

// ==========================================
// Currency List Item
// ==========================================

interface CurrencyListItemProps {
  currency: Currency;
  isSelected: boolean;
}

function CurrencyListItem({ currency, isSelected }: CurrencyListItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1E3A8A] font-heading">
            {currency.code}
          </span>
          <span className="text-lg">{currency.symbol}</span>
        </div>
        <p className="text-sm text-[#6B7280] mt-1">{currency.name}</p>
      </div>
      <Badge variant={currency.isActive ? 'success' : 'neutral'} size="small" dot>
        {currency.isActive ? 'Kích hoạt' : 'Tắt'}
      </Badge>
    </div>
  );
}

// ==========================================
// Currency Form
// ==========================================

interface CurrencyFormProps {
  currency: Currency | null;
  isNewMode: boolean;
  onSave: (data: CurrencyFormData) => void;
  onDelete: () => void;
  onCancel: () => void;
}

function CurrencyForm({ currency, isNewMode, onSave, onDelete, onCancel }: CurrencyFormProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CurrencyFormInput, unknown, CurrencyFormData>({
    resolver: zodResolver(currencySchema),
    defaultValues: defaultCurrencyValues,
  });

  // Reset form when currency changes
  useEffect(() => {
    if (currency) {
      reset({
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
        isActive: currency.isActive,
      });
    } else {
      reset(defaultCurrencyValues);
    }
  }, [currency, reset]);

  // Handle form submit
  const onSubmit = (data: CurrencyFormData) => {
    onSave(data);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    onDelete();
  };

  if (!currency && !isNewMode) {
    return (
      <div className="flex items-center justify-center h-64 text-[#6B7280]">
        <div className="text-center">
          <p className="text-lg mb-2">Chọn một mã tiền tệ để xem chi tiết</p>
          <p className="text-sm">hoặc nhấn &quot;Thêm mới&quot; để tạo mới</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div>
        <h2 className="text-xl font-semibold text-[#1E3A8A] font-heading">
          {isNewMode ? 'Thêm mới Mã tiền tệ' : 'Chỉnh sửa Mã tiền tệ'}
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          {isNewMode ? 'Điền thông tin để tạo mã tiền tệ mới' : `Đang chỉnh sửa: ${currency?.code}`}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Mã tiền tệ"
          placeholder="VND"
          {...register('code')}
          error={errors.code?.message}
          required
          maxLength={3}
          disabled={!isNewMode} // Code cannot be changed on edit
        />

        <Input
          label="Tên tiền tệ"
          placeholder="Vietnam Dong"
          {...register('name')}
          error={errors.name?.message}
          required
        />

        <Input
          label="Ký hiệu"
          placeholder="₫"
          {...register('symbol')}
          error={errors.symbol?.message}
          required
        />

        <Checkbox
          label="Kích hoạt"
          {...register('isActive')}
        />

        {/* Form Actions */}
        <div className="flex items-center gap-3 pt-6 border-t border-[#E2E8F0]">
          <Button type="submit" variant="primary">
            Lưu
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Hủy
          </Button>
          {!isNewMode && currency && (
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa mã tiền tệ "${currency?.code}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}

// ==========================================
// Currencies Page
// ==========================================

export default function CurrenciesPage() {
  const { currencies, addCurrency, updateCurrency, deleteCurrency } = useMockData();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [isNewMode, setIsNewMode] = useState(false);

  // Handle select currency
  const handleSelect = (currency: Currency | null) => {
    setSelectedCurrency(currency);
    setIsNewMode(false);
  };

  // Handle create new
  const handleCreateNew = () => {
    setSelectedCurrency(null);
    setIsNewMode(true);
  };

  // Handle save
  const handleSave = (data: CurrencyFormData) => {
    if (isNewMode) {
      // Check for duplicate code
      const exists = currencies.some(
        (c) => c.code.toUpperCase() === data.code.toUpperCase()
      );
      if (exists) {
        toast.error('Mã tiền tệ đã tồn tại!');
        return;
      }
      addCurrency(data);
      toast.success('Thêm mới thành công!');
      setIsNewMode(false);
    } else if (selectedCurrency) {
      updateCurrency(selectedCurrency.id, data);
      toast.success('Cập nhật thành công!');
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (selectedCurrency) {
      deleteCurrency(selectedCurrency.id);
      toast.success('Xóa thành công!');
      setSelectedCurrency(null);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setSelectedCurrency(null);
    setIsNewMode(false);
  };

  return (
    <SplitView<Currency>
      title="Mã tiền tệ"
      items={currencies}
      selectedItem={selectedCurrency}
      onSelect={handleSelect}
      onCreateNew={handleCreateNew}
      keyExtractor={(currency) => currency.id}
      searchKeys={['code', 'name']}
      searchPlaceholder="Tìm theo mã hoặc tên..."
      emptyMessage="Chưa có mã tiền tệ nào"
      renderListItem={(currency, isSelected) => (
        <CurrencyListItem currency={currency} isSelected={isSelected} />
      )}
      renderForm={() => (
        <CurrencyForm
          currency={selectedCurrency}
          isNewMode={isNewMode}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      )}
    />
  );
}
