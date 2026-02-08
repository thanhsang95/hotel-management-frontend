'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { SplitView } from '../../../../components/crud';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Checkbox, Input, Select } from '../../../../components/ui/Input';
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
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1E3A8A] font-heading">
            {currency.code}
          </span>
          <span className="text-lg">{currency.symbol}</span>
          {currency.isDefault && (
            <Badge variant="info" size="small">
              Mặc định
            </Badge>
          )}
        </div>
        <p className="text-sm text-[#6B7280] mt-1">{currency.name}</p>
        <p className="text-xs text-[#9CA3AF] mt-0.5">
          {currency.decimalPlaces} chữ số • {currency.thousandsSeparator || 'Không'} / {currency.decimalSeparator}
        </p>
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
    control,
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
        isDefault: currency.isDefault,
        thousandsSeparator: currency.thousandsSeparator as ',' | '.' | ' ' | '',
        decimalSeparator: currency.decimalSeparator as '.' | ',',
        decimalPlaces: currency.decimalPlaces,
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
        <div>
          <Input
            label="Mã tiền tệ"
            placeholder="VND"
            {...register('code')}
            error={errors.code?.message}
            required
            maxLength={3}
            disabled={!isNewMode} // Code cannot be changed on edit
          />
          <p className="text-sm text-muted-foreground mt-1.5">
            Định dạng: 3 ký tự viết hoa (VD: VND, USD, EUR)
          </p>
        </div>

        <Input
          label="Tên tiền tệ"
          placeholder="Vietnam Dong"
          {...register('name')}
          error={errors.name?.message}
          required
        />

        <div>
          <Input
            label="Ký hiệu"
            placeholder="₫"
            {...register('symbol')}
            error={errors.symbol?.message}
            required
          />
          <p className="text-sm text-muted-foreground mt-1.5">
            Ký hiệu hiển thị: ₫ (VND), $ (USD), € (EUR), ¥ (JPY)
          </p>
        </div>

        <div className="border-t border-[#E2E8F0] pt-4 mt-4">
          <h3 className="text-sm font-semibold text-[#1E3A8A] mb-3">Định dạng số</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="thousandsSeparator"
              control={control}
              render={({ field }) => (
                <Select
                  label="Dấu phân cách ngàn"
                  options={[
                    { value: ',', label: 'Dấu phẩy (,)' },
                    { value: '.', label: 'Dấu chấm (.)' },
                    { value: ' ', label: 'Khoảng trắng ( )' },
                    { value: '', label: 'Không có' },
                  ]}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />

            <Controller
              name="decimalSeparator"
              control={control}
              render={({ field }) => (
                <Select
                  label="Dấu thập phân"
                  options={[
                    { value: '.', label: 'Dấu chấm (.)' },
                    { value: ',', label: 'Dấu phẩy (,)' },
                  ]}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>

          <div className="mt-4">
            <Controller
              name="decimalPlaces"
              control={control}
              render={({ field }) => (
                <div>
                  <Select
                    label="Số chữ số thập phân"
                    options={[
                      { value: '0', label: '0 (VD: 1.000)' },
                      { value: '1', label: '1 (VD: 1.000,0)' },
                      { value: '2', label: '2 (VD: 1.000,00)' },
                      { value: '3', label: '3 (VD: 1.000,000)' },
                      { value: '4', label: '4 (VD: 1.000,0000)' },
                    ]}
                    value={field.value?.toString() || '2'}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground mt-1.5">
                    VND thường dùng 0, USD/EUR thường dùng 2
                  </p>
                </div>
              )}
            />
          </div>
        </div>

        <Checkbox
          label="Tiền tệ mặc định"
          {...register('isDefault')}
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
      
      // If this currency is set as default, unset all other defaults
      if (data.isDefault) {
        currencies.forEach((c) => {
          if (c.isDefault) {
            updateCurrency(c.id, { ...c, isDefault: false });
          }
        });
      }
      
      addCurrency(data);
      toast.success('Thêm mới thành công!');
      setIsNewMode(false);
    } else if (selectedCurrency) {
      // If this currency is set as default, unset all other defaults
      if (data.isDefault) {
        currencies.forEach((c) => {
          if (c.id !== selectedCurrency.id && c.isDefault) {
            updateCurrency(c.id, { ...c, isDefault: false });
          }
        });
      }
      
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
