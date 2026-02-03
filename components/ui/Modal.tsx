'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useRef } from 'react';
import Button from './Button';

// ==========================================
// Modal Component Types
// ==========================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

// ==========================================
// Modal Component
// ==========================================

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnOverlayClick = true,
  showCloseButton = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Size styles
  const sizeStyles: Record<string, string> = {
    small: 'max-w-sm',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    full: 'max-w-4xl',
  };

  // Handle ESC key to close modal
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      // Store current active element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Add event listener for ESC key
      document.addEventListener('keydown', handleKeyDown);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus the modal
      setTimeout(() => {
        modalRef.current?.focus();
      }, 10);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
        
        // Restore focus to previous element
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, handleKeyDown]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`
          relative w-full ${sizeStyles[size]}
          bg-white rounded-2xl shadow-xl
          transform transition-all duration-200
          max-h-[90vh] overflow-hidden
          flex flex-col
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
            {title && (
              <h2 
                id="modal-title" 
                className="text-xl font-semibold text-[#1E3A8A] font-heading"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="
                  p-2 rounded-lg
                  text-[#6B7280] hover:text-[#1E3A8A] hover:bg-[#F3F4F6]
                  transition-colors duration-200
                  cursor-pointer
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF]
                "
                aria-label="Đóng"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        
        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// Confirm Modal Component
// ==========================================

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'danger' : 'primary'} 
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-[#4B5563]">{message}</p>
    </Modal>
  );
}

export default Modal;
