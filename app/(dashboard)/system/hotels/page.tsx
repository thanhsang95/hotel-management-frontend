'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../../../../components/ui/Button';
import { Input, TextArea } from '../../../../components/ui/Input';
import { useMockData } from '../../../../lib/context/MockDataContext';
import { Hotel } from '../../../../lib/types';

// ==========================================
// Hotels Page - Single Hotel Mode
// ==========================================

export default function HotelsPage() {
  const { hotels, updateHotel } = useMockData();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    taxId: '',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    taxPercent: 10,
    serviceChargePercent: 5,
  });

  // Load the first hotel
  useEffect(() => {
    if (hotels.length > 0) {
      const firstHotel = hotels[0];
      setHotel(firstHotel);
      setFormData({
        name: firstHotel.name,
        address: firstHotel.address,
        phone: firstHotel.phone || '',
        email: firstHotel.email || '',
        taxId: firstHotel.taxId || '',
        checkInTime: firstHotel.checkInTime,
        checkOutTime: firstHotel.checkOutTime,
        taxPercent: firstHotel.taxPercent,
        serviceChargePercent: firstHotel.serviceChargePercent,
      });
    }
  }, [hotels]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      toast.error('Tên và địa chỉ là bắt buộc!');
      return;
    }
    if (hotel) {
      updateHotel(hotel.id, formData);
      toast.success('Cập nhật thành công!');
    }
  };

  if (!hotel) {
    return (
      <div className="flex items-center justify-center h-64 text-[#6B7280]">
        <div className="text-center">
          <p className="text-lg">Không tìm thấy thông tin khách sạn</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E3A8A] font-heading">Thông tin Khách sạn</h1>
        <p className="text-sm text-[#6B7280] mt-1">Quản lý thông tin khách sạn của bạn</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-white p-6 rounded-lg border border-[#E2E8F0]">
            <h2 className="text-lg font-semibold text-[#1E3A8A] font-heading mb-4">
              Thông tin cơ bản
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <Input
                  label="Tên khách sạn"
                  placeholder="Grand Hotel Saigon"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <TextArea
                  label="Địa chỉ"
                  placeholder="Địa chỉ đầy đủ..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  required
                />
              </div>

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

              <Input
                label="Mã số thuế"
                placeholder="0123456789"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              />
            </div>
          </div>

          {/* Operational Settings Section */}
          <div className="bg-white p-6 rounded-lg border border-[#E2E8F0]">
            <h2 className="text-lg font-semibold text-[#1E3A8A] font-heading mb-4">
              Cài đặt vận hành
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          </div>

          {/* Financial Settings Section */}
          <div className="bg-white p-6 rounded-lg border border-[#E2E8F0]">
            <h2 className="text-lg font-semibold text-[#1E3A8A] font-heading mb-4">
              Cài đặt tài chính
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                label="Thuế (%)"
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={formData.taxPercent}
                onChange={(e) => setFormData({ ...formData, taxPercent: parseFloat(e.target.value) || 0 })}
              />

              <Input
                label="Phí dịch vụ (%)"
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={formData.serviceChargePercent}
                onChange={(e) => setFormData({ ...formData, serviceChargePercent: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="submit" variant="primary" size="large">
              Lưu thay đổi
            </Button>
          </div>
        </form>
    </div>
  );
}
