'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';

// ==========================================
// Button Component Types
// ==========================================

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// ==========================================
// Button Component
// ==========================================

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = `
      inline-flex items-center justify-center
      font-semibold rounded-lg
      transition-all duration-200 ease-in-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      cursor-pointer
    `;

    // Variant styles
    const variantStyles: Record<ButtonVariant, string> = {
      primary: `
        bg-[#F59E0B] text-white
        hover:opacity-90 hover:-translate-y-[1px]
        focus-visible:ring-[#F59E0B]
        active:opacity-80
      `,
      secondary: `
        bg-transparent text-[#1E40AF]
        border-2 border-[#1E40AF]
        hover:bg-[#1E40AF] hover:text-white hover:-translate-y-[1px]
        focus-visible:ring-[#1E40AF]
        active:bg-[#1E3A8A]
      `,
      danger: `
        bg-[#EF4444] text-white
        hover:bg-[#DC2626] hover:-translate-y-[1px]
        focus-visible:ring-[#EF4444]
        active:bg-[#B91C1C]
      `,
      ghost: `
        bg-transparent text-[#1E3A8A]
        hover:bg-[#F8FAFC] hover:-translate-y-[1px]
        focus-visible:ring-[#1E40AF]
        active:bg-[#E2E8F0]
      `,
    };

    // Size styles
    const sizeStyles: Record<ButtonSize, string> = {
      small: 'px-3 py-1.5 text-sm gap-1.5',
      medium: 'px-4 py-2.5 text-base gap-2',
      large: 'px-6 py-3 text-lg gap-2.5',
    };

    // Full width style
    const widthStyle = fullWidth ? 'w-full' : '';

    // Combined classes
    const combinedClasses = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${widthStyle}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClasses}
        {...props}
      >
        {isLoading && (
          <svg 
            className="animate-spin h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
