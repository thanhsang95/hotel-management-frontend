'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { SplitView } from '../../../../components/crud';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Input, Select } from '../../../../components/ui/Input';
import { ConfirmModal } from '../../../../components/ui/Modal';
import { useMockData } from '../../../../lib/context/MockDataContext';
import {
    CurrencyRateFormData,
    CurrencyRateFormInput,
    currencyRateSchema,
    defaultCurrencyRateValues,
} from '../../../../lib/schemas/currencyRate';
import { CurrencyRate } from '../../../../lib/types';

// ==========================================
// Currency Rate List Item
// ==========================================

interface CurrencyRateListItemProps {
  rate: CurrencyRate;
  fromCode: string;
  fromSymbol: string;
  toCode: string;
  toSymbol: string;
}

function CurrencyRateListItem({ rate, fromCode, fromSymbol, toCode, toSymbol }: CurrencyRateListItemProps) {
  const formatRate = (value: number) => {
    // Format rate based on magnitude
    if (value >= 1000) {
      return value.toLocaleString('vi-VN');
    }
    return value.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  };

  const isRecent = new Date(rate.effectiveDate) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1E3A8A] font-heading">
            {fromCode} → {toCode}
          </span>
          {isRecent && <Badge variant="info" size="small">Mới</Badge>}
        </div>
        <p className="text-sm text-[#6B7280] mt-1">
          1 {fromSymbol} = {formatRate(rate.rate)} {toSymbol}
        </p>
        <p className="text-xs text-[#9CA3AF] mt-1">
          Hiệu lực: {format(new Date(rate.effectiveDate), 'dd/MM/yyyy')}
        </p>
      </div>
      <div className="text-right">
        <p className="font-mono text-lg font-semibold text-[#1E40AF]">
          {formatRate(rate.rate)}
        </p>
      </div>
    </div>
  );
}

// ==========================================
// Currency Rate Form
// ==========================================

interface CurrencyRateFormProps {
  currencyRate: CurrencyRate | null;
  isNewMode: boolean;
  onSave: (data: CurrencyRateFormData) => void;
  onDelete: () => void;
  onCancel: () => void;
}

function CurrencyRateForm({ currencyRate, isNewMode, onSave, onDelete, onCancel }: CurrencyRateFormProps) {
  const { currencies } = useMockData();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CurrencyRateFormInput>({
    resolver: zodResolver(currencyRateSchema),
    defaultValues: defaultCurrencyRateValues,
  });

  const fromCurrencyId = watch('fromCurrencyId');
  const toCurrencyId = watch('toCurrencyId');
  const rate = watch('rate');

  useEffect(() => {
    if (currencyRate) {
      reset({
        fromCurrencyId: currencyRate.fromCurrencyId,
        toCurrencyId: currencyRate.toCurrencyId,
        rate: currencyRate.rate,
        effectiveDate: format(new Date(currencyRate.effectiveDate), 'yyyy-MM-dd'),
      });
    } else {
      reset(defaultCurrencyRateValues);
    }
  }, [currencyRate, reset]);

  const onSubmit = (data: CurrencyRateFormData) => {
    onSave(data);
  };

  if (!currencyRate && !isNewMode) {
    return (
      <div className="flex items-center justify-center h-64 text-[#6B7280]">
        <div className="text-center">
          <p className="text-lg mb-2">Chọn một tỷ giá để xem chi tiết</p>
          <p className="text-sm">hoặc nhấn &quot;Thêm mới&quot; để tạo mới</p>
        </div>
      </div>
    );
  }

  // Prepare currency options
  const currencyOptions = currencies.filter((c) => c.isActive).map((c) => ({
    value: c.id,
    label: `${c.code} - ${c.name} (${c.symbol})`,
  }));

  // Calculate exchange preview
  const getExchangePreview = () => {
    const from = currencies.find((c) => c.id === fromCurrencyId);
    const to = currencies.find((c) => c.id === toCurrencyId);
    const rateValue = typeof rate === 'string' ? parseFloat(rate) : rate;
    
    if (from && to && rateValue && rateValue > 0) {
      const formatted = rateValue >= 1000
        ? rateValue.toLocaleString('vi-VN')
        : rateValue.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
      return `1 ${from.symbol} = ${formatted} ${to.symbol}`;
    }
    return null;
  };

  const preview = getExchangePreview();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1E3A8A] font-heading">
          {isNewMode ? 'Thêm mới Tỷ giá' : 'Chỉnh sửa Tỷ giá'}
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          {isNewMode ? 'Điền thông tin để tạo tỷ giá mới' : 'Đang chỉnh sửa tỷ giá'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Từ tiền tệ"
            {...register('fromCurrencyId')}
            error={errors.fromCurrencyId?.message}
            required
            options={currencyOptions}
            placeholder="Chọn tiền tệ nguồn"
          />

          <Select
            label="Sang tiền tệ"
            {...register('toCurrencyId')}
            error={errors.toCurrencyId?.message}
            required
            options={currencyOptions}
            placeholder="Chọn tiền tệ đích"
          />
        </div>

        <Input
          label="Tỷ giá"
          type="number"
          step="any"
          placeholder="25000"
          {...register('rate', { valueAsNumber: true })}
          error={errors.rate?.message}
          required
        />

        {/* Exchange Rate Preview */}
        {preview && (
          <div className="p-4 bg-gradient-to-r from-[#1E40AF]/5 to-[#3B82F6]/5 rounded-lg border border-[#1E40AF]/20">
            <p className="text-sm text-[#6B7280]">Xem trước:</p>
            <p className="text-xl font-semibold text-[#1E40AF] font-heading mt-1">
              {preview}
            </p>
          </div>
        )}

        <Input
          label="Ngày hiệu lực"
          type="date"
          {...register('effectiveDate')}
          error={errors.effectiveDate?.message}
          required
        />

        <div className="flex items-center gap-3 pt-6 border-t border-[#E2E8F0]">
          <Button type="submit" variant="primary">Lưu</Button>
          <Button type="button" variant="ghost" onClick={onCancel}>Hủy</Button>
          {!isNewMode && currencyRate && (
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
        message="Bạn có chắc chắn muốn xóa tỷ giá này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}

// ==========================================
// Currency Rates Page
// ==========================================

export default function CurrencyRatesPage() {
  const { currencyRates, currencies, addCurrencyRate, updateCurrencyRate, deleteCurrencyRate } = useMockData();
  const [selectedRate, setSelectedRate] = useState<CurrencyRate | null>(null);
  const [isNewMode, setIsNewMode] = useState(false);

  const getCurrencyInfo = (currencyId: string) => {
    const currency = currencies.find((c) => c.id === currencyId);
    return {
      code: currency?.code || '???',
      symbol: currency?.symbol || '?',
    };
  };

  const handleSelect = (rate: CurrencyRate | null) => {
    setSelectedRate(rate);
    setIsNewMode(false);
  };

  const handleCreateNew = () => {
    setSelectedRate(null);
    setIsNewMode(true);
  };

  const handleSave = (data: CurrencyRateFormData) => {
    const dataWithDate = {
      ...data,
      effectiveDate: new Date(data.effectiveDate),
    };
    if (isNewMode) {
      addCurrencyRate(dataWithDate);
      toast.success('Thêm mới thành công!');
      setIsNewMode(false);
    } else if (selectedRate) {
      updateCurrencyRate(selectedRate.id, dataWithDate);
      toast.success('Cập nhật thành công!');
    }
  };

  const handleDelete = () => {
    if (selectedRate) {
      deleteCurrencyRate(selectedRate.id);
      toast.success('Xóa thành công!');
      setSelectedRate(null);
    }
  };

  const handleCancel = () => {
    setSelectedRate(null);
    setIsNewMode(false);
  };

  return (
    <SplitView<CurrencyRate>
      title="Tỷ giá hối đoái"
      items={currencyRates}
      selectedItem={selectedRate}
      onSelect={handleSelect}
      onCreateNew={handleCreateNew}
      keyExtractor={(rate) => rate.id}
      searchKeys={['fromCurrencyId', 'toCurrencyId']}
      searchPlaceholder="Tìm theo mã tiền tệ..."
      emptyMessage="Chưa có tỷ giá nào"
      renderListItem={(rate) => {
        const from = getCurrencyInfo(rate.fromCurrencyId);
        const to = getCurrencyInfo(rate.toCurrencyId);
        return (
          <CurrencyRateListItem
            rate={rate}
            fromCode={from.code}
            fromSymbol={from.symbol}
            toCode={to.code}
            toSymbol={to.symbol}
          />
        );
      }}
      renderForm={() => (
        <CurrencyRateForm
          currencyRate={selectedRate}
          isNewMode={isNewMode}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      )}
    />
  );
}
