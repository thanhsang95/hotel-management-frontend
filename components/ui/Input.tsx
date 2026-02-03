'use client';

import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

// ==========================================
// Input Component Types
// ==========================================

interface BaseInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseInputProps {}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseInputProps {
  rows?: number;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, BaseInputProps {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

// ==========================================
// Base Input Styles
// ==========================================

const baseInputStyles = `
  w-full px-4 py-3
  bg-white text-[#1E3A8A]
  border border-[#E2E8F0] rounded-lg
  text-base
  transition-all duration-200 ease-in-out
  placeholder:text-[#9CA3AF]
  focus:outline-none focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/20
  disabled:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-60
`;

const errorInputStyles = `
  border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20
`;

const labelStyles = `
  block mb-2 text-sm font-medium text-[#1E3A8A]
`;

const errorTextStyles = `
  mt-1.5 text-sm text-[#EF4444]
`;

const helperTextStyles = `
  mt-1.5 text-sm text-[#6B7280]
`;

// ==========================================
// Input Component
// ==========================================

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className={labelStyles}>
            {label}
            {props.required && <span className="text-[#EF4444] ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${baseInputStyles} ${error ? errorInputStyles : ''} ${className}`.trim()}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className={errorTextStyles} role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className={helperTextStyles}>{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ==========================================
// TextArea Component
// ==========================================

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, rows = 4, className = '', id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className={labelStyles}>
            {label}
            {props.required && <span className="text-[#EF4444] ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`${baseInputStyles} resize-y min-h-[100px] ${error ? errorInputStyles : ''} ${className}`.trim()}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className={errorTextStyles} role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className={helperTextStyles}>{helperText}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

// ==========================================
// Select Component
// ==========================================

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, className = '', id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className={labelStyles}>
            {label}
            {props.required && <span className="text-[#EF4444] ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`${baseInputStyles} appearance-none pr-10 cursor-pointer ${error ? errorInputStyles : ''} ${className}`.trim()}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${selectId}-error` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* Dropdown Arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg 
              className="h-5 w-5 text-[#6B7280]" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>
        {error && (
          <p id={`${selectId}-error`} className={errorTextStyles} role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className={helperTextStyles}>{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// ==========================================
// Checkbox Component
// ==========================================

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={`
              w-5 h-5
              text-[#1E40AF] bg-white border-[#D1D5DB] rounded
              focus:ring-2 focus:ring-[#1E40AF]/20
              cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-[#EF4444]' : ''}
              ${className}
            `.trim()}
            {...props}
          />
        </div>
        {label && (
          <label 
            htmlFor={checkboxId} 
            className="ml-3 text-sm text-[#1E3A8A] cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Input;
