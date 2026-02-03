'use client';

import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ==========================================
// Route to Label Mapping
// ==========================================

const routeLabels: Record<string, string> = {
  '': 'Trang chủ',
  'system': 'Cấu hình hệ thống',
  'hotels': 'Khách sạn',
  'rooms': 'Quản lý phòng',
  'types': 'Loại phòng',
  'categories': 'Hạng phòng',
  'list': 'Phòng',
  'pricing': 'Quản lý giá',
  'currencies': 'Mã tiền tệ',
  'exchange': 'Tỷ giá',
  'rates': 'Mã giá',
  'marketing': 'Marketing & Phân phối',
  'segments': 'Phân khúc',
  'sources': 'Nguồn',
  'channels': 'Kênh',
  'partners': 'Đối tác',
  'companies': 'Hồ sơ công ty',
};

// ==========================================
// Breadcrumbs Component
// ==========================================

export function Breadcrumbs() {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  
  const breadcrumbs = [
    { label: 'Trang chủ', path: '/', isHome: true },
    ...pathSegments.map((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const label = routeLabels[segment] || segment;
      return { label, path, isHome: false };
    }),
  ];

  // Don't render if only home
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {/* Separator */}
              {index > 0 && (
                <ChevronRightIcon className="w-4 h-4 text-[#9CA3AF]" aria-hidden="true" />
              )}

              {/* Breadcrumb Item */}
              {isLast ? (
                // Current page (not clickable)
                <span 
                  className="font-semibold text-[#1E40AF]"
                  aria-current="page"
                >
                  {crumb.isHome && <HomeIcon className="w-4 h-4 inline-block mr-1" />}
                  {crumb.label}
                </span>
              ) : (
                // Clickable link
                <Link
                  href={crumb.path}
                  className="
                    text-[#6B7280] hover:text-[#1E3A8A]
                    transition-colors duration-200
                    flex items-center gap-1
                  "
                >
                  {crumb.isHome && <HomeIcon className="w-4 h-4" />}
                  {!crumb.isHome && crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
