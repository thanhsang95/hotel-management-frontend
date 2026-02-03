'use client';

import React from 'react';

// ==========================================
// Badge Component Types
// ==========================================

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type BadgeSize = 'small' | 'medium';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

// ==========================================
// Badge Component
// ==========================================

export function Badge({ 
  variant = 'neutral', 
  size = 'medium', 
  children, 
  className = '',
  dot = false,
}: BadgeProps) {
  // Base styles - ensure AA contrast ratio (4.5:1)
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-full
    whitespace-nowrap
  `;

  // Variant styles with high contrast colors
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-[#D1FAE5] text-[#065F46]',      // Green - Vacant Clean
    warning: 'bg-[#FEF3C7] text-[#92400E]',      // Amber - Dirty/Warning
    danger: 'bg-[#FEE2E2] text-[#991B1B]',       // Red - OOO/Danger
    info: 'bg-[#DBEAFE] text-[#1E40AF]',         // Blue - Occupied/Info
    neutral: 'bg-[#F3F4F6] text-[#374151]',      // Gray - Neutral
  };

  // Size styles
  const sizeStyles: Record<BadgeSize, string> = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-1 text-sm',
  };

  // Dot indicator colors
  const dotColors: Record<BadgeVariant, string> = {
    success: 'bg-[#10B981]',
    warning: 'bg-[#F59E0B]',
    danger: 'bg-[#EF4444]',
    info: 'bg-[#3B82F6]',
    neutral: 'bg-[#6B7280]',
  };

  // Combined classes
  const combinedClasses = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <span className={combinedClasses}>
      {dot && (
        <span 
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColors[variant]}`} 
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

// ==========================================
// Room Status Badge Helper
// ==========================================

type RoomStatusType = 'Vacant' | 'Occupied' | 'Dirty' | 'OOO';

const roomStatusConfig: Record<RoomStatusType, { variant: BadgeVariant; label: string }> = {
  Vacant: { variant: 'success', label: 'Trống' },
  Occupied: { variant: 'info', label: 'Có khách' },
  Dirty: { variant: 'warning', label: 'Bẩn' },
  OOO: { variant: 'danger', label: 'Hỏng' },
};

interface RoomStatusBadgeProps {
  status: RoomStatusType;
  size?: BadgeSize;
  showDot?: boolean;
}

export function RoomStatusBadge({ status, size = 'medium', showDot = true }: RoomStatusBadgeProps) {
  const config = roomStatusConfig[status];
  
  return (
    <Badge variant={config.variant} size={size} dot={showDot}>
      {config.label}
    </Badge>
  );
}

// ==========================================
// Active/Inactive Badge Helper
// ==========================================

interface ActiveBadgeProps {
  isActive: boolean;
  size?: BadgeSize;
}

export function ActiveBadge({ isActive, size = 'medium' }: ActiveBadgeProps) {
  return (
    <Badge variant={isActive ? 'success' : 'neutral'} size={size} dot>
      {isActive ? 'Kích hoạt' : 'Tắt'}
    </Badge>
  );
}

export default Badge;
