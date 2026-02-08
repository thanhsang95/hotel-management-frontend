# Drawer Pattern — Hướng dẫn Refactor

> Tài liệu hướng dẫn chuyển các trang CRUD từ `SplitView` sang **Table + Drawer** pattern.

## Tổng quan

### So sánh 2 pattern

| Tiêu chí | SplitView (cũ) | Table + Drawer (mới) |
|----------|----------------|----------------------|
| Layout | List trái + Form phải (40/60) | Full-width table + Drawer slide-in |
| Hiển thị dữ liệu | List item đơn giản | Table với nhiều columns, sortable |
| Tạo/Sửa | Form luôn hiển thị bên phải | Drawer mở khi cần, đóng khi xong |
| Không gian | Chia đôi → form bị hẹp | Full-width → tận dụng tối đa |
| Filter | Search text đơn giản | Multi-filter: dropdown, date range, number range |
| Mobile | Ẩn/hiện panel | Drawer full-width |

### Khi nào dùng Drawer

- Entity có **nhiều fields** cần hiển thị trong table
- Cần **filter nâng cao** (theo nhiều column)
- Form tạo/sửa **phức tạp** (nhiều step, nhiều section)
- Muốn user **xem data tổng quan** trước khi drill-down

---

## Kiến trúc

```
┌──────────────────────────────────────────────┐
│  Page Component (page.tsx)                   │
│  ┌────────────────────────────────────────┐  │
│  │ Table (danh sách, filters, search)     │  │
│  │ - Summary Cards                        │  │
│  │ - Search + Filter Bar                  │  │
│  │ - Data Table                           │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │ Drawer Component                       │  │
│  │ - Backdrop overlay (content-scoped)    │  │
│  │ - Slide panel (header + scrollable)    │  │
│  │   └─ Form / Wizard (embedded)          │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

---

## Bước 1: Tạo Drawer Component

Tạo file `components/<entity>/<Entity>Drawer.tsx` dựa trên [`BookingDrawer.tsx`](file:///d:/Projects/Hotel%20Management/hotel-management-frontend/components/booking/BookingDrawer.tsx):

```tsx
'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef } from 'react';
import { YourEntity } from '../../lib/types';
import { YourForm } from './YourForm';

interface EntityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  entity?: YourEntity;
  drawerKey?: number;           // ← Bắt buộc: force remount form
}

export function EntityDrawer({ isOpen, onClose, mode, entity, drawerKey = 0 }: EntityDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // 1. Đo <main> content area, định vị drawer trong đó
  useEffect(() => {
    if (!drawerRef.current) return;
    const main = drawerRef.current.closest('main');
    if (!main) return;

    const reposition = () => {
      const rect = main.getBoundingClientRect();
      if (backdropRef.current) {
        backdropRef.current.style.top = `${rect.top}px`;
        backdropRef.current.style.left = `${rect.left}px`;
        backdropRef.current.style.width = `${rect.width}px`;
        backdropRef.current.style.height = `${rect.height}px`;
      }
      if (drawerRef.current) {
        drawerRef.current.style.top = `${rect.top}px`;
        drawerRef.current.style.height = `${rect.height}px`;
      }
    };

    reposition();
    const observer = new ResizeObserver(reposition);
    observer.observe(main);
    window.addEventListener('resize', reposition);
    return () => { observer.disconnect(); window.removeEventListener('resize', reposition); };
  }, [isOpen]);

  // 2. Lock scroll trên <main>
  useEffect(() => {
    if (!drawerRef.current) return;
    const main = drawerRef.current.closest('main');
    if (!main) return;
    main.style.overflow = isOpen ? 'hidden' : '';
    return () => { main.style.overflow = ''; };
  }, [isOpen]);

  // 3. Escape key đóng drawer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop — scoped to content area */}
      <div
        ref={backdropRef}
        className={`fixed z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={drawerRef}
        className={`fixed right-0 z-50 w-full max-w-3xl bg-[#F8FAFC] shadow-2xl
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
        role="dialog" aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#E2E8F0] shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-8 rounded-full ${mode === 'create' ? 'bg-[#10B981]' : 'bg-[#3B82F6]'}`} />
            <div>
              <h2 className="text-lg font-bold text-[#1E3A8A] font-heading">
                {mode === 'create' ? 'Thêm mới' : 'Chỉnh sửa'}
              </h2>
              {mode === 'edit' && entity && (
                <p className="text-xs text-[#6B7280]">{/* entity subtitle */}</p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-[#6B7280] hover:bg-[#F1F5F9] cursor-pointer">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <YourForm
            key={`${mode}-${entity?.id ?? 'new'}-${drawerKey}`}  // ← Force remount
            entity={entity}
            mode={mode}
            onSave={onClose}
            onCancel={onClose}
          />
        </div>
      </div>
    </>
  );
}
```

### Chi tiết quan trọng

| Yếu tố | Cách xử lý |
|---------|------------|
| **Vị trí drawer** | `fixed` + đo `<main>` bounds qua `ResizeObserver` → drawer nằm trong content area |
| **Backdrop** | `fixed` + đo bounds → không che header/sidebar/footer |
| **Scroll lock** | Lock `main.style.overflow = 'hidden'`, không lock `body` |
| **`key` prop** | `${mode}-${entity?.id}-${drawerKey}` — counter tăng mỗi lần mở → form luôn fresh |
| **Escape key** | `document.addEventListener('keydown', ...)` |
| **max-width** | `max-w-3xl` cho form đơn giản, `max-w-4xl` cho form phức tạp |

---

## Bước 2: Chuyển đổi Page Component

### Trước (SplitView pattern)

```tsx
export default function EntityPage() {
  const [selectedItem, setSelectedItem] = useState<Entity | null>(null);
  const [isNewMode, setIsNewMode] = useState(false);

  return (
    <SplitView<Entity>
      title="..."
      items={items}
      selectedItem={selectedItem}
      onSelect={handleSelect}
      onCreateNew={handleCreateNew}
      renderListItem={(item) => <ListItem ... />}
      renderForm={() => <Form ... />}
    />
  );
}
```

### Sau (Table + Drawer pattern)

```tsx
export default function EntityPage() {
  // --- Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterField1, setFilterField1] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // --- Drawer State ---
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [editingEntity, setEditingEntity] = useState<Entity | undefined>();
  const drawerKeyRef = useRef(0);   // ← Counter để force remount

  // --- Filtered Data ---
  const filteredItems = useMemo(() => {
    let result = items;
    if (searchQuery.trim()) { /* text search */ }
    if (filterField1 !== 'all') { /* dropdown filter */ }
    return result;
  }, [items, searchQuery, filterField1]);

  // --- Active Filter Count (hiển thị trên nút "Bộ lọc") ---
  const activeFilterCount = (filterField1 !== 'all' ? 1 : 0) + ...;

  // --- Handlers ---
  const handleRowClick = useCallback((entity: Entity) => {
    setEditingEntity(entity);
    setDrawerMode('edit');
    drawerKeyRef.current += 1;     // ← Tăng counter
    setDrawerOpen(true);
  }, []);

  const handleCreateNew = useCallback(() => {
    setEditingEntity(undefined);
    setDrawerMode('create');
    drawerKeyRef.current += 1;     // ← Tăng counter
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    setEditingEntity(undefined);
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Page Header + Nút "Thêm mới" */}
      {/* Summary Cards (optional) */}
      {/* Search + Filter Bar */}
      {/* Data Table */}
      {/* Drawer */}
      <EntityDrawer
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        mode={drawerMode}
        entity={editingEntity}
        drawerKey={drawerKeyRef.current}
      />
    </div>
  );
}
```

---

## Bước 3: Cấu trúc Filter Section

```tsx
{/* Search + Filter Bar */}
<div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
  {/* Search Input + Toggle Filter Button + Clear Button */}
  <div className="p-4 flex flex-wrap items-center gap-3">
    <div className="relative flex-1 min-w-[240px]">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
      <input type="text" ... />
    </div>
    <button onClick={() => setShowFilters(!showFilters)}>
      <FunnelIcon /> Bộ lọc {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
    </button>
    {activeFilterCount > 0 && <button onClick={clearFilters}>Xóa bộ lọc</button>}
  </div>

  {/* Filter Dropdowns — Expandable Panel */}
  {showFilters && (
    <div className="px-4 pb-4 border-t border-[#F3F4F6] pt-3 space-y-3">
      <div className="flex flex-wrap gap-3">
        {/* Dropdown filters cho columns kiểu enum */}
        {/* Date range cho columns kiểu ngày */}
        {/* Number range cho columns kiểu số */}
      </div>
    </div>
  )}

  {/* Data Table header + body */}
</div>
```

### Filter types theo column data type

| Data Type | Filter UI | Example |
|-----------|-----------|---------|
| Enum (status, type) | `<select>` dropdown | Trạng thái: Tất cả / Xác nhận / Chờ xử lý |
| Text (company, name) | `<select>` from unique values | Công ty: Tất cả / FPT / Vietravel |
| Date | 2× `<input type="date">` (from → to) | Check-in: 2026-01-01 → 2026-12-31 |
| Number | 2× `<input type="number">` (min → max) | Phòng: 1 → 5 |
| Boolean | `<select>` hoặc checkbox | Kích hoạt: Tất cả / Có / Không |

---

## Bước 4: Chuyển Form sang Embedded Mode

Nếu form đã tồn tại (ví dụ `SegmentForm`), thêm prop `embedded`:

```tsx
function SegmentForm({ segment, isNewMode, onSave, onCancel, embedded }: SegmentFormProps) {
  return (
    <div className={embedded ? '' : 'space-y-6'}>
      {/* Ẩn header khi embedded — drawer đã có header */}
      {!embedded && (
        <div>
          <h2>...</h2>
          <p>...</p>
        </div>
      )}
      <form>...</form>
    </div>
  );
}
```

---

## Checklist Refactor cho từng page

### Các page cần chuyển (đang dùng SplitView)

| # | Page | Path | Độ phức tạp |
|---|------|------|-------------|
| 1 | Phân khúc thị trường | `marketing/segments` | Thấp |
| 2 | Mã nguồn | `marketing/sources` | Thấp |
| 3 | Kênh phân phối | `marketing/channels` | Thấp |
| 4 | Đối tác / Công ty | `partners/companies` | Trung bình |
| 5 | Mã tiền tệ | `pricing/currencies` | Thấp |
| 6 | Tỷ giá | `pricing/exchange` | Thấp |
| 7 | Mã giá | `pricing/rates` | Trung bình |
| 8 | Loại phòng | `rooms/types` | Thấp |
| 9 | Hạng phòng | `rooms/categories` | Thấp |
| 10 | Nhân viên | `settings/employees` | Cao |
| 11 | Vai trò | `settings/roles` | Cao (detail page riêng) |

### Checklist cho mỗi page

```
[ ] 1. Tạo <Entity>Drawer.tsx component
[ ] 2. Thêm embedded prop vào form component (nếu cần)
[ ] 3. Refactor page.tsx:
    [ ] a. Xóa import SplitView
    [ ] b. Thêm filter state variables
    [ ] c. Thêm drawer state (open, mode, entity, keyRef)
    [ ] d. Thêm useMemo cho filteredItems
    [ ] e. Thêm handlers (handleRowClick, handleCreateNew, handleDrawerClose)
    [ ] f. Xây dựng table JSX (header + body)
    [ ] g. Thêm search bar + filter panel
    [ ] h. Render <EntityDrawer> ở cuối
[ ] 4. Test create mode
[ ] 5. Test edit mode (click row → drawer mở với data)
[ ] 6. Test re-open (đóng rồi mở lại → form fresh)
[ ] 7. Test filters
```

---

## Reference: File gốc mẫu

| Component | File |
|-----------|------|
| Drawer (reference) | [BookingDrawer.tsx](file:///d:/Projects/Hotel%20Management/hotel-management-frontend/components/booking/BookingDrawer.tsx) |
| Page (reference) | [bookings/page.tsx](file:///d:/Projects/Hotel%20Management/hotel-management-frontend/app/(dashboard)/bookings/page.tsx) |
| SplitView (to replace) | [SplitView.tsx](file:///d:/Projects/Hotel%20Management/hotel-management-frontend/components/crud/SplitView.tsx) |
