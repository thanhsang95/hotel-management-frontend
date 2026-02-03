'use client';

import {
  BuildingOfficeIcon,
  ChartBarSquareIcon,
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useMockData } from '../lib/context/MockDataContext';

// ==========================================
// KPI Card Component
// ==========================================

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeLabel?: string;
  color: string;
}

function KPICard({ title, value, icon, change, changeLabel, color }: KPICardProps) {
  const isPositive = change && change > 0;
  
  return (
    <div className="
      bg-white rounded-xl p-6 shadow-md
      hover:shadow-lg hover:-translate-y-[2px]
      transition-all duration-200
    ">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#6B7280] mb-1">{title}</p>
          <p className="text-2xl font-bold text-[#1E3A8A] font-heading">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 ${isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(change)}% {changeLabel}
            </p>
          )}
        </div>
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Room Status Grid Component
// ==========================================

interface StatusBoxProps {
  label: string;
  count: number;
  color: string;
  bgColor: string;
}

function StatusBox({ label, count, color, bgColor }: StatusBoxProps) {
  return (
    <div 
      className="rounded-lg p-4 text-center transition-transform hover:scale-105 cursor-pointer"
      style={{ backgroundColor: bgColor }}
    >
      <p className="text-3xl font-bold font-heading" style={{ color }}>{count}</p>
      <p className="text-sm mt-1" style={{ color }}>{label}</p>
    </div>
  );
}

// ==========================================
// Table Components
// ==========================================

interface TableRowProps {
  columns: React.ReactNode[];
  isHighlighted?: boolean;
  highlightColor?: string;
}

function TableRow({ columns, isHighlighted, highlightColor }: TableRowProps) {
  return (
    <tr className={`border-b border-[#E2E8F0] ${isHighlighted ? highlightColor : ''}`}>
      {columns.map((col, idx) => (
        <td key={idx} className="px-4 py-3 text-sm text-[#1E3A8A]">{col}</td>
      ))}
    </tr>
  );
}

// ==========================================
// Dashboard Page
// ==========================================

export default function DashboardPage() {
  const { dashboardData } = useMockData();
  const { kpi, roomStatus, arrivals, departures, revenueChart } = dashboardData;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(amount / 1000000) + 'M ₫';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E3A8A] font-heading">Dashboard</h1>
        <p className="text-[#6B7280] mt-1">Tổng quan hoạt động khách sạn</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Tổng số phòng"
          value={kpi.totalRooms}
          icon={<BuildingOfficeIcon className="w-6 h-6" />}
          color="#1E40AF"
        />
        <KPICard
          title="Doanh thu hôm nay"
          value={formatCurrency(kpi.todayRevenue)}
          icon={<CurrencyDollarIcon className="w-6 h-6" />}
          change={5.2}
          changeLabel="so với hôm qua"
          color="#10B981"
        />
        <KPICard
          title="Số khách hiện tại"
          value={kpi.currentGuests}
          icon={<UserGroupIcon className="w-6 h-6" />}
          color="#F59E0B"
        />
        <KPICard
          title="Tỷ lệ lấp đầy"
          value={`${kpi.occupancyRate.toFixed(1)}%`}
          icon={<ChartBarSquareIcon className="w-6 h-6" />}
          change={2.3}
          changeLabel="so với tuần trước"
          color="#3B82F6"
        />
      </div>

      {/* Room Status Grid */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-lg font-semibold text-[#1E3A8A] mb-4 font-heading">
          Trạng thái phòng
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusBox
            label="Trống & Sạch"
            count={roomStatus.vacantClean}
            color="#065F46"
            bgColor="#D1FAE5"
          />
          <StatusBox
            label="Trống & Bẩn"
            count={roomStatus.vacantDirty}
            color="#92400E"
            bgColor="#FEF3C7"
          />
          <StatusBox
            label="Có khách"
            count={roomStatus.occupied}
            color="#1E40AF"
            bgColor="#DBEAFE"
          />
          <StatusBox
            label="Hỏng / Bảo trì"
            count={roomStatus.outOfOrder}
            color="#991B1B"
            bgColor="#FEE2E2"
          />
        </div>
      </div>

      {/* Arrivals & Departures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Arrivals */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-[#1E3A8A] mb-4 font-heading">
            Check-in hôm nay ({arrivals.length})
          </h2>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-[#F8FAFC] sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-[#6B7280]">Tên khách</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-[#6B7280]">Phòng</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-[#6B7280]">Giờ đến</th>
                </tr>
              </thead>
              <tbody>
                {arrivals.map((arrival) => (
                  <TableRow
                    key={arrival.id}
                    columns={[
                      arrival.guestName,
                      arrival.roomNumber,
                      arrival.expectedTime,
                    ]}
                    isHighlighted={arrival.isOverdue}
                    highlightColor="bg-[#FEF3C7]"
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Departures */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-[#1E3A8A] mb-4 font-heading">
            Check-out hôm nay ({departures.length})
          </h2>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-[#F8FAFC] sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-[#6B7280]">Tên khách</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-[#6B7280]">Phòng</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-[#6B7280]">Giờ trả</th>
                </tr>
              </thead>
              <tbody>
                {departures.map((departure) => (
                  <TableRow
                    key={departure.id}
                    columns={[
                      departure.guestName,
                      departure.roomNumber,
                      departure.checkoutTime,
                    ]}
                    isHighlighted={departure.isLate}
                    highlightColor="bg-[#FEE2E2]"
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-lg font-semibold text-[#1E3A8A] mb-4 font-heading">
          Doanh thu 7 ngày qua (triệu VND)
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="#6B7280"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ color: '#1E3A8A', fontWeight: 600 }}
                formatter={(value) => [`${value}M ₫`, 'Doanh thu']}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#1E40AF"
                strokeWidth={3}
                dot={{ fill: '#1E40AF', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#F59E0B' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
