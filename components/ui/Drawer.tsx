'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { ReactNode, useEffect, useRef } from 'react';

// ==========================================
// Drawer Props
// ==========================================

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// ==========================================
// Drawer Component
// – Scoped inside the page content area
//   (respects app header, sidebar, and footer)
// – Reusable across all CRUD pages
// ==========================================

export function Drawer({ isOpen, onClose, title, subtitle, children, size = 'lg' }: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Size mapping
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full',
  };

  // Measure the content area and position the drawer within it
  useEffect(() => {
    if (!drawerRef.current) return;

    // Find the <main> ancestor (scrollable content area)
    const main = drawerRef.current.closest('main');
    if (!main) return;

    const reposition = () => {
      const rect = main.getBoundingClientRect();

      // Position backdrop within content area
      if (backdropRef.current) {
        backdropRef.current.style.top = `${rect.top}px`;
        backdropRef.current.style.left = `${rect.left}px`;
        backdropRef.current.style.width = `${rect.width}px`;
        backdropRef.current.style.height = `${rect.height}px`;
      }

      // Position drawer panel within content area
      if (drawerRef.current) {
        drawerRef.current.style.top = `${rect.top}px`;
        drawerRef.current.style.height = `${rect.height}px`;
      }
    };

    reposition();

    // Re-measure on resize (sidebar collapse, window resize)
    window.addEventListener('resize', reposition);
    // Also listen for transition end in case sidebar animates
    const observer = new ResizeObserver(reposition);
    observer.observe(main);

    return () => {
      window.removeEventListener('resize', reposition);
      observer.disconnect();
    };
  }, [isOpen]);

  // Lock scroll on the <main> content scroller (not body)
  useEffect(() => {
    if (!drawerRef.current) return;
    const main = drawerRef.current.closest('main');
    if (!main) return;

    if (isOpen) {
      main.style.overflow = 'hidden';
    } else {
      main.style.overflow = '';
    }
    return () => {
      main.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop Overlay — scoped to content area */}
      <div
        ref={backdropRef}
        className={`
          fixed z-40
          bg-black/40 backdrop-blur-sm
          transition-opacity duration-300 ease-in-out
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel — slides in from the right, within content area */}
      <div
        ref={drawerRef}
        className={`
          fixed right-0 z-50
          w-full ${sizeClasses[size]}
          bg-white
          shadow-2xl shadow-black/20
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col
        `}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Drawer Header */}
        <div className="
          flex items-center justify-between
          px-6 py-4
          bg-white
          border-b border-[#E2E8F0]
          shrink-0
        ">
          <div>
            <h2 className="text-xl font-semibold text-[#1E3A8A] font-heading">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-[#6B7280] mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="
              p-2 rounded-lg
              text-[#6B7280] hover:text-[#1E3A8A]
              hover:bg-[#F1F5F9]
              transition-all duration-200
              cursor-pointer
            "
            aria-label="Đóng"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content — scrollable */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}
