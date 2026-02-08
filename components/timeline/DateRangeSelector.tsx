'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// ==========================================
// Date Range Selector Component
// ==========================================

interface DateRangeSelectorProps {
  startDate: Date;
  rangeDays: number;
  onPrev: () => void;
  onNext: () => void;
  onSetRange: (days: number) => void;
}

function formatDateShort(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
}

function formatDateFull(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function DateRangeSelector({ startDate, rangeDays, onPrev, onNext, onSetRange }: DateRangeSelectorProps) {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + rangeDays - 1);

  const presets = [7, 14, 30];

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="p-2 rounded-lg bg-white shadow-sm border border-[#E2E8F0] text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#1E3A8A] transition-all duration-200 cursor-pointer"
          aria-label="Trước"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-[#E2E8F0] min-w-[200px] text-center">
          <span className="text-sm font-semibold text-[#1E3A8A]">
            {formatDateShort(startDate)} — {formatDateFull(endDate)}
          </span>
        </div>

        <button
          onClick={onNext}
          className="p-2 rounded-lg bg-white shadow-sm border border-[#E2E8F0] text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#1E3A8A] transition-all duration-200 cursor-pointer"
          aria-label="Sau"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="flex items-center gap-1 bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-1">
        {presets.map((days) => (
          <button
            key={days}
            onClick={() => onSetRange(days)}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer
              ${rangeDays === days
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#1E3A8A]'
              }
            `}
          >
            {days}d
          </button>
        ))}
      </div>
    </div>
  );
}

export default DateRangeSelector;
