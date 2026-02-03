'use client';

import React, { HTMLAttributes, forwardRef } from 'react';

// ==========================================
// Card Component Types
// ==========================================

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  clickable?: boolean;
  hoverable?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
  variant?: 'default' | 'elevated' | 'outlined';
}

// ==========================================
// Card Component
// ==========================================

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      clickable = false,
      hoverable = true,
      padding = 'medium',
      variant = 'default',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = `
      bg-white rounded-xl
      transition-all duration-200 ease-in-out
    `;

    // Padding styles
    const paddingStyles: Record<string, string> = {
      none: '',
      small: 'p-4',
      medium: 'p-6',
      large: 'p-8',
    };

    // Variant styles
    const variantStyles: Record<string, string> = {
      default: 'shadow-md',
      elevated: 'shadow-lg',
      outlined: 'border border-[#E2E8F0] shadow-sm',
    };

    // Hover styles
    const hoverStyles = hoverable
      ? 'hover:shadow-lg hover:-translate-y-[2px]'
      : '';

    // Clickable styles
    const clickableStyles = clickable
      ? 'cursor-pointer active:scale-[0.99]'
      : '';

    // Combined classes
    const combinedClasses = `
      ${baseStyles}
      ${paddingStyles[padding]}
      ${variantStyles[variant]}
      ${hoverStyles}
      ${clickableStyles}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <div
        ref={ref}
        className={combinedClasses}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// ==========================================
// Card Header Component
// ==========================================

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-start justify-between mb-4 ${className}`}
        {...props}
      >
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-[#1E3A8A] font-heading">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-[#6B7280]">{subtitle}</p>
          )}
          {children}
        </div>
        {action && <div className="flex-shrink-0 ml-4">{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// ==========================================
// Card Body Component
// ==========================================

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

// ==========================================
// Card Footer Component
// ==========================================

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right' | 'between';
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ align = 'right', className = '', children, ...props }, ref) => {
    const alignStyles: Record<string, string> = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between',
    };

    return (
      <div
        ref={ref}
        className={`flex items-center gap-3 mt-6 pt-4 border-t border-[#E2E8F0] ${alignStyles[align]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export default Card;
