'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { SplitView } from '../../../../components/crud';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Checkbox, Input, Select } from '../../../../components/ui/Input';
import { ConfirmModal } from '../../../../components/ui/Modal';
import { useMockData } from '../../../../lib/context/MockDataContext';
import {
    defaultRateCodeValues,
    RateCodeFormData,
    RateCodeFormInput,
    rateCodeSchema,
} from '../../../../lib/schemas/rateCode';
import { RateCode, RateCodePrice } from '../../../../lib/types';

// ==========================================
// Rate Code List Item
// ==========================================

interface RateCodeListItemProps {
  rateCode: RateCode;
  segmentName?: string;
  channelName?: string;
}

function RateCodeListItem({ rateCode, segmentName, channelName }: RateCodeListItemProps) {
  const formatDateRange = () => {
    const start = format(new Date(rateCode.startDate), 'dd/MM/yy');
    const end = format(new Date(rateCode.endDate), 'dd/MM/yy');
    return `${start} - ${end}`;
  };

  const isExpired = new Date(rateCode.endDate) < new Date();
  const isUpcoming = new Date(rateCode.startDate) > new Date();

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1E3A8A] font-heading">
            {rateCode.code}
          </span>
          {isExpired && <Badge variant="danger" size="small">Hết hạn</Badge>}
          {isUpcoming && <Badge variant="warning" size="small">Sắp tới</Badge>}
        </div>
        <p className="text-sm text-[#6B7280] mt-1 truncate">{rateCode.name}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-[#9CA3AF]">
          <span>{formatDateRange()}</span>
          {segmentName && (
            <>
              <span>•</span>
              <span>{segmentName}</span>
            </>
          )}
          {channelName && (
            <>
              <span>•</span>
              <span>{channelName}</span>
            </>
          )}
        </div>
      </div>
      <Badge variant={rateCode.isActive ? 'success' : 'neutral'} size="small" dot>
        {rateCode.isActive ? 'Kích hoạt' : 'Tắt'}
      </Badge>
    </div>
  );
}

// ==========================================
// Rate Code Form
// ==========================================

interface RateCodeFormProps {
  rateCode: RateCode | null;
  isNewMode: boolean;
  onSave: (data: RateCodeFormData) => void;
  onDelete: () => void;
  onCancel: () => void;
}

function RateCodeForm({ rateCode, isNewMode, onSave, onDelete, onCancel }: RateCodeFormProps) {
  const { marketSegments, channels, currencies } = useMockData();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [prices, setPrices] = useState<RateCodePrice[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RateCodeFormInput>({
    resolver: zodResolver(rateCodeSchema),
    defaultValues: defaultRateCodeValues,
  });

  useEffect(() => {
    if (rateCode) {
      reset({
        code: rateCode.code,
        name: rateCode.name,
        segmentId: rateCode.segmentId || '',
        channelId: rateCode.channelId || '',
        startDate: format(new Date(rateCode.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(rateCode.endDate), 'yyyy-MM-dd'),
        isActive: rateCode.isActive,
      });
      setPrices(rateCode.prices || []);
    } else {
      reset(defaultRateCodeValues);
      setPrices([]);
    }
  }, [rateCode, reset]);

  const onSubmit = (data: RateCodeFormInput) => {
    // Add prices to the form data
    const formDataWithPrices = {
      ...data,
      prices: prices.map((p) => ({
        currencyId: p.currencyId,
        amount: p.amount,
      })),
      isActive: data.isActive ?? true,
    };
    onSave(formDataWithPrices as RateCodeFormData);
  };

  const handleAddPrice = () => {
    const availableCurrency = currencies.find(
      (c) => c.isActive && !prices.some((p) => p.currencyId === c.id)
    );
    if (availableCurrency) {
      setPrices([...prices, { currencyId: availableCurrency.id, amount: 0 }]);
    } else {
      toast.error('Đã thêm tất cả các tiền tệ có sẵn');
    }
  };

  const handleRemovePrice = (index: number) => {
    setPrices(prices.filter((_, i) => i !== index));
  };

  const handlePriceChange = (index: number, field: 'currencyId' | 'amount', value: string | number) => {
    const newPrices = [...prices];
    if (field === 'amount') {
      newPrices[index].amount = typeof value === 'string' ? parseFloat(value) || 0 : value;
    } else {
      newPrices[index].currencyId = value as string;
    }
    setPrices(newPrices);
  };

  if (!rateCode && !isNewMode) {
    return (
      <div className="flex items-center justify-center h-64 text-[#6B7280]">
        <div className="text-center">
          <p className="text-lg mb-2">Chọn một mã giá để xem chi tiết</p>
          <p className="text-sm">hoặc nhấn &quot;Thêm mới&quot; để tạo mới</p>
        </div>
      </div>
    );
  }

  // Prepare options for dropdowns
  const segmentOptions = [
    { value: '', label: '-- Không chọn --' },
    ...marketSegments.filter((s) => s.isActive).map((s) => ({
      value: s.id,
      label: `${s.code} - ${s.name}`,
    })),
  ];

  const channelOptions = [
    { value: '', label: '-- Không chọn --' },
    ...channels.filter((c) => c.isActive).map((c) => ({
      value: c.id,
      label: `${c.code} - ${c.name}`,
    })),
  ];

  const getCurrencySymbol = (currencyId: string) => {
    const currency = currencies.find((c) => c.id === currencyId);
    return currency ? `${currency.code} (${currency.symbol})` : '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1E3A8A] font-heading">
          {isNewMode ? 'Thêm mới Mã giá' : 'Chỉnh sửa Mã giá'}
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          {isNewMode ? 'Điền thông tin để tạo mã giá mới' : `Đang chỉnh sửa: ${rateCode?.code}`}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Mã giá"
            placeholder="BAR"
            {...register('code')}
            error={errors.code?.message}
            required
            disabled={!isNewMode}
          />

          <Input
            label="Tên mã giá"
            placeholder="Best Available Rate"
            {...register('name')}
            error={errors.name?.message}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Phân khúc thị trường"
            {...register('segmentId')}
            options={segmentOptions}
          />

          <Select
            label="Kênh phân phối"
            {...register('channelId')}
            options={channelOptions}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Ngày bắt đầu"
            type="date"
            {...register('startDate')}
            error={errors.startDate?.message}
            required
          />

          <Input
            label="Ngày kết thúc"
            type="date"
            {...register('endDate')}
            error={errors.endDate?.message}
            required
          />
        </div>

        {/* Multi-currency Pricing */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-[#374151]">
              Giá theo tiền tệ
            </label>
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={handleAddPrice}
            >
              + Thêm giá
            </Button>
          </div>

          {prices.length === 0 && (
            <p className="text-sm text-[#9CA3AF] italic">
              Chưa có giá nào. Nhấn &quot;Thêm giá&quot; để bắt đầu.
            </p>
          )}

          {prices.map((price, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg">
              <Select
                value={price.currencyId}
                onChange={(e) => handlePriceChange(index, 'currencyId', e.target.value)}
                options={currencies.filter((c) => c.isActive).map((c) => ({
                  value: c.id,
                  label: `${c.code} (${c.symbol})`,
                }))}
                className="w-40"
              />
              <Input
                type="number"
                value={price.amount}
                onChange={(e) => handlePriceChange(index, 'amount', e.target.value)}
                placeholder="0"
                min={0}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="small"
                onClick={() => handleRemovePrice(index)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </Button>
            </div>
          ))}
        </div>

        <Checkbox label="Kích hoạt" {...register('isActive')} />

        <div className="flex items-center gap-3 pt-6 border-t border-[#E2E8F0]">
          <Button type="submit" variant="primary">Lưu</Button>
          <Button type="button" variant="ghost" onClick={onCancel}>Hủy</Button>
          {!isNewMode && rateCode && (
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
        message={`Bạn có chắc chắn muốn xóa mã giá "${rateCode?.code}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}

// ==========================================
// Rate Codes Page
// ==========================================

export default function RateCodesPage() {
  const { rateCodes, marketSegments, channels, addRateCode, updateRateCode, deleteRateCode } = useMockData();
  const [selectedRateCode, setSelectedRateCode] = useState<RateCode | null>(null);
  const [isNewMode, setIsNewMode] = useState(false);

  const getSegmentName = (segmentId?: string) => {
    if (!segmentId) return undefined;
    const segment = marketSegments.find((s) => s.id === segmentId);
    return segment?.code;
  };

  const getChannelName = (channelId?: string) => {
    if (!channelId) return undefined;
    const channel = channels.find((c) => c.id === channelId);
    return channel?.code;
  };

  const handleSelect = (rateCode: RateCode | null) => {
    setSelectedRateCode(rateCode);
    setIsNewMode(false);
  };

  const handleCreateNew = () => {
    setSelectedRateCode(null);
    setIsNewMode(true);
  };

  const handleSave = (data: RateCodeFormData) => {
    // Convert date strings to Date objects for MockDataContext
    const dataWithDates = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    };
    if (isNewMode) {
      const exists = rateCodes.some((r) => r.code.toUpperCase() === data.code.toUpperCase());
      if (exists) {
        toast.error('Mã giá đã tồn tại!');
        return;
      }
      addRateCode(dataWithDates);
      toast.success('Thêm mới thành công!');
      setIsNewMode(false);
    } else if (selectedRateCode) {
      updateRateCode(selectedRateCode.id, dataWithDates);
      toast.success('Cập nhật thành công!');
    }
  };

  const handleDelete = () => {
    if (selectedRateCode) {
      deleteRateCode(selectedRateCode.id);
      toast.success('Xóa thành công!');
      setSelectedRateCode(null);
    }
  };

  const handleCancel = () => {
    setSelectedRateCode(null);
    setIsNewMode(false);
  };

  return (
    <SplitView<RateCode>
      title="Mã giá"
      items={rateCodes}
      selectedItem={selectedRateCode}
      onSelect={handleSelect}
      onCreateNew={handleCreateNew}
      keyExtractor={(rc) => rc.id}
      searchKeys={['code', 'name']}
      searchPlaceholder="Tìm theo mã hoặc tên..."
      emptyMessage="Chưa có mã giá nào"
      renderListItem={(rc) => (
        <RateCodeListItem
          rateCode={rc}
          segmentName={getSegmentName(rc.segmentId)}
          channelName={getChannelName(rc.channelId)}
        />
      )}
      renderForm={() => (
        <RateCodeForm
          rateCode={selectedRateCode}
          isNewMode={isNewMode}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      )}
    />
  );
}
