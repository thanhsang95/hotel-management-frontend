'use client';

import {
    BuildingOfficeIcon,
    UserGroupIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import { ReservationType } from '../../lib/types';

// ==========================================
// Reservation Type Selector
// ==========================================

interface ReservationTypeSelectorProps {
  selectedType: ReservationType;
  onSelect: (type: ReservationType) => void;
  disabled?: boolean;
}

const typeOptions: Array<{
  type: ReservationType;
  label: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  activeColor: string;
  bgColor: string;
}> = [
  {
    type: 'FIT',
    label: 'FIT',
    description: 'Khách lẻ cá nhân',
    icon: UserIcon,
    color: 'text-[#5B21B6]',
    activeColor: 'border-[#7C3AED] bg-[#EDE9FE] ring-[#7C3AED]/20',
    bgColor: 'bg-[#EDE9FE]',
  },
  {
    type: 'GIT',
    label: 'GIT',
    description: 'Khách đoàn / Công ty',
    icon: BuildingOfficeIcon,
    color: 'text-[#9A3412]',
    activeColor: 'border-[#EA580C] bg-[#FFF7ED] ring-[#EA580C]/20',
    bgColor: 'bg-[#FFF7ED]',
  },
  {
    type: 'Walk-in',
    label: 'Walk-in',
    description: 'Khách vãng lai',
    icon: UserGroupIcon,
    color: 'text-[#065F46]',
    activeColor: 'border-[#059669] bg-[#ECFDF5] ring-[#059669]/20',
    bgColor: 'bg-[#ECFDF5]',
  },
];

export function ReservationTypeSelector({
  selectedType,
  onSelect,
  disabled = false,
}: ReservationTypeSelectorProps) {
  return (
    <div className="flex gap-3" id="reservation-type-selector">
      {typeOptions.map((option) => {
        const isSelected = selectedType === option.type;
        const Icon = option.icon;

        return (
          <button
            key={option.type}
            onClick={() => onSelect(option.type)}
            disabled={disabled}
            className={`
              flex-1 flex items-center gap-3 px-4 py-3.5 rounded-xl
              border-2 transition-all duration-300
              cursor-pointer
              ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
              ${isSelected
                ? `${option.activeColor} ring-2 shadow-sm`
                : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:shadow-sm'
              }
            `}
            id={`btn-type-${option.type.toLowerCase().replace('-', '')}`}
          >
            <div
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                transition-colors duration-300
                ${isSelected ? option.bgColor : 'bg-[#F3F4F6]'}
              `}
            >
              <Icon className={`w-5 h-5 ${isSelected ? option.color : 'text-[#9CA3AF]'}`} />
            </div>
            <div className="text-left">
              <p
                className={`
                  text-sm font-bold
                  ${isSelected ? option.color : 'text-[#374151]'}
                `}
              >
                {option.label}
              </p>
              <p className="text-xs text-[#6B7280]">{option.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
