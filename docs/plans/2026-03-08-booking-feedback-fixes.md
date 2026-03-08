# Booking Feedback Fixes — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix 8 feedback items from stakeholder review covering booking wizard Step 1 fields, Step 2 room allocation, and a new proforma invoice print feature.

**Architecture:** All changes are frontend-only within the existing Next.js + React Context architecture. No new dependencies needed. Changes touch the booking wizard components (GuestInfoForm, BookingWizard, RoomHoldForm, RoomAssignmentStep, RoomAssignmentGroup) plus two new components (CompanySelect, ProformaInvoice). A shared currency format utility is extracted to avoid DRY violations.

**Tech Stack:** Next.js 16, TypeScript (strict), React Context (MockDataContext), Tailwind CSS, Intl.NumberFormat for currency formatting.

**Design Doc:** `docs/plans/2026-03-08-booking-feedback-fixes-design.md`

---

## Task 1: Create shared currency format utility (F5 prep)

**Why:** `formatPrice` is duplicated in `RoomAssignmentGroup.tsx:36-38` and `RoomHoldList.tsx:21-23`. Extract to a shared utility before adding more usages.

**Files:**
- Create: `lib/utils/format.ts`
- Modify: `components/booking/RoomAssignmentGroup.tsx:36-38` (remove local formatPrice)
- Modify: `components/booking/RoomHoldList.tsx:21-23` (remove local formatPrice)

**Step 1: Create the utility file**

Create `lib/utils/format.ts`:

```typescript
/**
 * Format a number as Vietnamese currency with thousands separators.
 * Example: 1000000 → "1.000.000"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

/**
 * Format a number as Vietnamese currency with the đồng symbol.
 * Example: 1000000 → "1.000.000 ₫"
 */
export function formatPrice(amount: number): string {
  return formatCurrency(amount) + ' ₫';
}

/**
 * Parse a formatted currency string back to a number.
 * Removes all non-digit characters except minus sign.
 * Example: "1.000.000" → 1000000
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d-]/g, '');
  return parseInt(cleaned, 10) || 0;
}
```

**Step 2: Update RoomAssignmentGroup.tsx to use shared utility**

In `components/booking/RoomAssignmentGroup.tsx`:
- Remove lines 36-38 (local `formatPrice` function)
- Add import at top: `import { formatPrice } from '../../lib/utils/format';`

**Step 3: Update RoomHoldList.tsx to use shared utility**

In `components/booking/RoomHoldList.tsx`:
- Remove lines 21-23 (local `formatPrice` function)
- Add import at top: `import { formatPrice } from '../../lib/utils/format';`

**Step 4: Build check**

Run: `cd hotel-management-frontend && npm run build`
Expected: Build succeeds with no type errors.

**Step 5: Commit**

```bash
git add lib/utils/format.ts components/booking/RoomAssignmentGroup.tsx components/booking/RoomHoldList.tsx
git commit -m "refactor: extract shared formatPrice/formatCurrency utilities"
```

---

## Task 2: F1 — Make Registration Code field readonly

**Why:** Users should not type a registration code. It auto-generates on save.

**Files:**
- Modify: `components/booking/GuestInfoForm.tsx:125-136`

**Step 1: Update the registration code input**

In `components/booking/GuestInfoForm.tsx`, replace lines 125-136 with:

```tsx
{/* Registration Code */}
<div>
  <label className={labelStyle}>Mã đăng ký</label>
  <input
    type="text"
    value={formData.registrationCode || ''}
    readOnly
    placeholder="Tự động tạo khi lưu"
    className={`${inputStyle} bg-[#F8FAFC] cursor-not-allowed`}
    id="input-reg-code"
  />
</div>
```

Key changes:
- Add `readOnly` attribute
- Remove `onChange` handler
- Change placeholder to "Tự động tạo khi lưu"
- Add `bg-[#F8FAFC] cursor-not-allowed` classes for visual readonly indication

**Step 2: Build check**

Run: `cd hotel-management-frontend && npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add components/booking/GuestInfoForm.tsx
git commit -m "feat(F1): make registration code field readonly with auto-generate"
```

---

## Task 3: F4 — Make User Check-in field readonly with default value

**Why:** User check-in should be auto-filled with the currently logged-in user. Phase 2 hardcodes "Admin User".

**Files:**
- Modify: `components/booking/BookingWizard.tsx:97-131` (getDefaultFormData)
- Modify: `components/booking/GuestInfoForm.tsx:458-469`

**Step 1: Set default userCheckIn in getDefaultFormData**

In `components/booking/BookingWizard.tsx`, in the `getDefaultFormData` function (around line 97-131), find the line that sets `userCheckIn` (it should be `userCheckIn: ''`) and change it to:

```typescript
userCheckIn: 'Admin User',
```

**Step 2: Make User Check-in input readonly in GuestInfoForm**

In `components/booking/GuestInfoForm.tsx`, replace the user check-in input block (lines 458-469) with:

```tsx
<div>
  <label className={labelStyle}>User check-in</label>
  <input
    type="text"
    value={formData.userCheckIn}
    readOnly
    placeholder="Nhân viên nhận phòng"
    className={`${inputStyle} bg-[#F8FAFC] cursor-not-allowed`}
    id="input-user-checkin"
  />
</div>
```

Key changes:
- Add `readOnly` attribute
- Remove `onChange` handler
- Add readonly visual styling

**Step 3: Build check**

Run: `cd hotel-management-frontend && npm run build`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add components/booking/BookingWizard.tsx components/booking/GuestInfoForm.tsx
git commit -m "feat(F4): make user check-in readonly, default to Admin User"
```

---

## Task 4: F5 — Format deposit amount with thousands separator

**Why:** Deposit amount 1000000 should display as 1,000,000 (or 1.000.000 in vi-VN locale).

**Files:**
- Modify: `components/booking/GuestInfoForm.tsx:568-586`

**Step 1: Add import for format utilities**

In `components/booking/GuestInfoForm.tsx`, add import at top (after existing imports):

```typescript
import { formatCurrency, parseCurrency } from '../../lib/utils/format';
```

**Step 2: Add local state for formatted display**

Inside the `GuestInfoForm` component function (after line 116), add a state and handlers for formatted input:

```typescript
const [depositDisplay, setDepositDisplay] = useState(
  formData.deposit.amount ? formatCurrency(formData.deposit.amount) : ''
);

const handleDepositFocus = () => {
  // On focus, show raw number for easy editing
  setDepositDisplay(formData.deposit.amount ? String(formData.deposit.amount) : '');
};

const handleDepositBlur = () => {
  // On blur, format with separators
  const parsed = parseCurrency(depositDisplay);
  setDepositDisplay(parsed ? formatCurrency(parsed) : '');
  onDepositChange({ amount: parsed });
};

const handleDepositInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  setDepositDisplay(e.target.value);
};
```

Also add `useState` to the React import if not already there.

**Step 3: Replace deposit amount input**

Replace the deposit amount input block (lines 568-586) with:

```tsx
{/* Amount */}
<div>
  <label className={labelStyle}>
    Số tiền đặt cọc (VND) <span className="text-[#EF4444]">*</span>
  </label>
  <input
    type="text"
    inputMode="numeric"
    value={depositDisplay}
    onChange={handleDepositInput}
    onFocus={handleDepositFocus}
    onBlur={handleDepositBlur}
    placeholder="0"
    className={`${inputStyle} ${errors['deposit.amount'] ? errorInputStyle : ''}`}
    id="input-deposit-amount"
  />
  {errors['deposit.amount'] && (
    <p className={errorTextStyle}>{errors['deposit.amount']}</p>
  )}
</div>
```

Key changes:
- `type="text"` with `inputMode="numeric"` (shows numeric keyboard on mobile)
- On focus: shows raw number
- On blur: formats with separators and updates parent state
- On change: updates local display state

**Step 4: Build check**

Run: `cd hotel-management-frontend && npm run build`
Expected: Build succeeds.

**Step 5: Commit**

```bash
git add components/booking/GuestInfoForm.tsx
git commit -m "feat(F5): format deposit amount with thousands separator"
```

---

## Task 5: F3 — Bi-directional nights and checkout date

**Why:** Users want to type number of nights and have checkout auto-calculated, or pick checkout and have nights auto-calculated.

**Files:**
- Modify: `components/booking/GuestInfoForm.tsx:42-49` (props), `330-336` (nights display)
- Modify: `components/booking/BookingWizard.tsx:249-256` (calculatedNights), `276-299` (handleFormChange)

**Step 1: Add onNightsChange callback to GuestInfoFormProps**

In `components/booking/GuestInfoForm.tsx`, update the props interface (lines 42-49):

```typescript
interface GuestInfoFormProps {
  formData: GuestInfoFormData;
  reservationType: ReservationType;
  errors: ValidationErrors;
  onChange: (field: keyof GuestInfoFormData, value: unknown) => void;
  onDepositChange: (deposit: Partial<DepositInfo>) => void;
  onNightsChange: (nights: number) => void;
  calculatedNights: number;
}
```

Update the destructuring in the component function to include `onNightsChange`.

**Step 2: Replace the nights display with an editable input**

In `components/booking/GuestInfoForm.tsx`, replace the nights section (lines 330-336) with:

```tsx
{/* Nights */}
<div>
  <label className={labelStyle}>Số đêm</label>
  <input
    type="number"
    min={1}
    value={calculatedNights || ''}
    onChange={(e) => {
      const nights = parseInt(e.target.value) || 0;
      if (nights > 0) {
        onNightsChange(nights);
      }
    }}
    className={`${inputStyle} font-semibold text-[#1E3A8A]`}
    id="input-nights"
  />
</div>
```

**Step 3: Add onNightsChange handler in BookingWizard**

In `components/booking/BookingWizard.tsx`, add a handler after `handleFormChange` (around line 299):

```typescript
const handleNightsChange = (nights: number) => {
  if (formData.checkIn && nights > 0) {
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + nights);
    const checkOut = checkOutDate.toISOString().split('T')[0];
    setFormData((prev) => ({
      ...prev,
      checkOut,
      nights,
    }));
  }
};
```

**Step 4: Pass onNightsChange to GuestInfoForm**

In `components/booking/BookingWizard.tsx`, in the JSX where GuestInfoForm is rendered (around lines 440-448), add the new prop:

```tsx
<GuestInfoForm
  formData={formData}
  reservationType={reservationType}
  errors={errors}
  onChange={handleFormChange}
  onDepositChange={handleDepositChange}
  onNightsChange={handleNightsChange}
  calculatedNights={calculatedNights}
/>
```

**Step 5: Build check**

Run: `cd hotel-management-frontend && npm run build`
Expected: Build succeeds.

**Step 6: Commit**

```bash
git add components/booking/GuestInfoForm.tsx components/booking/BookingWizard.tsx
git commit -m "feat(F3): bi-directional nights and checkout date calculation"
```

---

## Task 6: F2 — Company name searchable dropdown with add-new

**Why:** Company name should select from existing CompanyProfiles, with ability to add new ones inline.

**Files:**
- Create: `components/booking/company-select.tsx`
- Modify: `components/booking/GuestInfoForm.tsx:156-177` (replace company input)
- Modify: `components/booking/BookingWizard.tsx` (pass companyProfiles and addCompanyProfile)

**Step 1: Create the CompanySelect component**

Create `components/booking/company-select.tsx`:

```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { CompanyProfile } from '../../lib/types';

export interface CompanySelectProps {
  value: string;
  companyProfiles: CompanyProfile[];
  onSelect: (companyName: string) => void;
  onAddNew: (name: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
}

export function CompanySelect({
  value,
  companyProfiles,
  onSelect,
  onAddNew,
  error,
  required,
  className = '',
}: CompanySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync search with external value
  useEffect(() => {
    setSearch(value);
  }, [value]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = companyProfiles.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setIsOpen(true);
    // Also update parent in case they type freely
    onSelect(e.target.value);
  };

  const handleSelect = (company: CompanyProfile) => {
    setSearch(company.name);
    onSelect(company.name);
    setIsOpen(false);
  };

  const handleAddNew = () => {
    if (newCompanyName.trim()) {
      onAddNew(newCompanyName.trim());
      setSearch(newCompanyName.trim());
      onSelect(newCompanyName.trim());
      setNewCompanyName('');
      setShowAddForm(false);
      setIsOpen(false);
    }
  };

  const inputStyle = 'w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent';
  const errorInputStyle = 'border-[#EF4444] focus:ring-[#EF4444]';

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder="Tìm hoặc chọn công ty..."
            className={`${inputStyle} ${error ? errorInputStyle : ''} ${className}`}
            id="input-company-name"
          />
          {/* Dropdown arrow */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Add new button */}
        <button
          type="button"
          onClick={() => {
            setShowAddForm(true);
            setNewCompanyName(search);
          }}
          className="px-3 py-2.5 rounded-lg border border-[#3B82F6] text-[#3B82F6] hover:bg-[#EFF6FF] text-sm font-medium flex-shrink-0"
          title="Thêm công ty mới"
        >
          +
        </button>
      </div>

      {/* Dropdown list */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              Không tìm thấy công ty
            </div>
          ) : (
            filtered.map((company) => (
              <button
                key={company.id}
                type="button"
                onClick={() => handleSelect(company)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-[#EFF6FF] ${
                  company.name === value ? 'bg-[#EFF6FF] font-medium text-[#1E3A8A]' : ''
                }`}
              >
                <div>{company.name}</div>
                {company.taxCode && (
                  <div className="text-xs text-gray-400">MST: {company.taxCode}</div>
                )}
              </button>
            ))
          )}
        </div>
      )}

      {/* Add new company inline form */}
      {showAddForm && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg p-3">
          <div className="text-sm font-medium mb-2">Thêm công ty mới</div>
          <input
            type="text"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
            placeholder="Tên công ty"
            className={`${inputStyle} mb-2`}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddNew();
              }
            }}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleAddNew}
              disabled={!newCompanyName.trim()}
              className="px-3 py-1.5 text-sm bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] disabled:opacity-50"
            >
              Thêm
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-[#EF4444] mt-1">{error}</p>}
    </div>
  );
}
```

**Step 2: Update GuestInfoForm to use CompanySelect**

In `components/booking/GuestInfoForm.tsx`:

Add import at top:
```typescript
import { CompanySelect } from './company-select';
```

Update the props interface to accept company data:
```typescript
interface GuestInfoFormProps {
  formData: GuestInfoFormData;
  reservationType: ReservationType;
  errors: ValidationErrors;
  onChange: (field: keyof GuestInfoFormData, value: unknown) => void;
  onDepositChange: (deposit: Partial<DepositInfo>) => void;
  onNightsChange: (nights: number) => void;
  calculatedNights: number;
  companyProfiles: CompanyProfile[];
  onAddCompany: (name: string) => void;
}
```

Add `CompanyProfile` to the imports from types.

Update the component destructuring to include `companyProfiles` and `onAddCompany`.

Replace the company name field block (lines 156-177) with:

```tsx
{/* Company Name */}
{visibility.companyName && (
  <div>
    <label className={labelStyle}>
      Tên Công Ty
      {reservationType === 'GIT' && (
        <span className="text-[#EF4444] ml-1">*</span>
      )}
    </label>
    <CompanySelect
      value={formData.companyName}
      companyProfiles={companyProfiles}
      onSelect={(name) => onChange('companyName', name)}
      onAddNew={onAddCompany}
      error={errors.companyName}
      required={reservationType === 'GIT'}
    />
  </div>
)}
```

**Step 3: Update BookingWizard to pass company data**

In `components/booking/BookingWizard.tsx`:

Update the `useMockData` destructuring (line 220) to include:
```typescript
const { addReservation, updateReservation, companyProfiles, addCompanyProfile } = useMockData();
```

Add a handler for adding a company:
```typescript
const handleAddCompany = (name: string) => {
  addCompanyProfile({
    type: 'Company',
    name,
    isBlacklisted: false,
  });
};
```

Update the GuestInfoForm JSX to pass new props:
```tsx
<GuestInfoForm
  formData={formData}
  reservationType={reservationType}
  errors={errors}
  onChange={handleFormChange}
  onDepositChange={handleDepositChange}
  onNightsChange={handleNightsChange}
  calculatedNights={calculatedNights}
  companyProfiles={companyProfiles}
  onAddCompany={handleAddCompany}
/>
```

**Step 4: Build check**

Run: `cd hotel-management-frontend && npm run build`
Expected: Build succeeds.

**Step 5: Commit**

```bash
git add components/booking/company-select.tsx components/booking/GuestInfoForm.tsx components/booking/BookingWizard.tsx
git commit -m "feat(F2): company name searchable dropdown with add-new functionality"
```

---

## Task 7: F6 — Room price auto-fill from room category basePrice

**Why:** When selecting a room category, price should auto-fill from the category's basePrice. RateCode overrides it if selected.

**Files:**
- Modify: `components/booking/RoomHoldForm.tsx:86-104` (handleCategoryChange, handleRateCodeChange)

**Step 1: Update handleCategoryChange to set price from category basePrice**

In `components/booking/RoomHoldForm.tsx`, replace `handleCategoryChange` (lines 86-96) with:

```typescript
const handleCategoryChange = (catId: string) => {
  setRoomCategoryId(catId);

  // Auto-fill price from category basePrice
  const category = roomCategories.find((c) => c.id === catId);
  if (category) {
    setRoomPrice(category.basePrice);
  }

  // If rate code is selected, override with rate code price
  if (rateCodeId) {
    const rc = rateCodes.find((r) => r.id === rateCodeId);
    if (rc && rc.prices.length > 0) {
      setRoomPrice(rc.prices[0].amount);
    }
  }
};
```

**Step 2: Update handleRateCodeChange to fall back to category price when cleared**

Replace `handleRateCodeChange` (lines 98-104) with:

```typescript
const handleRateCodeChange = (rcId: string) => {
  setRateCodeId(rcId);
  if (rcId) {
    const rc = rateCodes.find((r) => r.id === rcId);
    if (rc && rc.prices.length > 0) {
      setRoomPrice(rc.prices[0].amount);
    }
  } else {
    // Cleared rate code — revert to category basePrice
    const category = roomCategories.find((c) => c.id === roomCategoryId);
    if (category) {
      setRoomPrice(category.basePrice);
    }
  }
};
```

**Step 3: Also update handleTypeChange to reset price when type changes**

Find `handleTypeChange` (lines 80-84). Currently it resets the category. Also reset the price:

```typescript
const handleTypeChange = (typeId: string) => {
  setRoomTypeId(typeId);
  setRoomCategoryId('');
  setRoomPrice(0);
  setRateCodeId('');
};
```

**Step 4: Build check**

Run: `cd hotel-management-frontend && npm run build`
Expected: Build succeeds.

**Step 5: Commit**

```bash
git add components/booking/RoomHoldForm.tsx
git commit -m "feat(F6): auto-fill room price from category basePrice, rate code overrides"
```

---

## Task 8: F7 — Room Assignment display with details, no room selection

**Why:** During booking creation, users should not select specific rooms (that happens at check-in). Assignment cards should show more details (adults, children, bed info, prices).

**Files:**
- Modify: `components/booking/RoomAssignmentStep.tsx` (pass mode prop, adjust auto-create logic)
- Modify: `components/booking/RoomAssignmentGroup.tsx:44-115` (RoomAssignmentRow), `121-247` (RoomAssignmentGroup)
- Modify: `components/booking/BookingWizard.tsx` (pass mode to RoomAssignmentStep)

**Step 1: Add mode prop to RoomAssignmentStep**

In `components/booking/RoomAssignmentStep.tsx`, update the props interface (lines 15-24) to include `mode`:

```typescript
interface RoomAssignmentStepProps {
  // ... existing props
  mode: 'create' | 'edit';
}
```

Update the component destructuring to include `mode`.

**Step 2: Auto-create assignment entries from holds (without room selection)**

When in `create` mode, after a hold is added, automatically create assignment entries (one per room quantity) WITHOUT a specific roomId/roomNumber. These are "placeholder" assignments that carry the hold's pricing/guest info.

In `RoomAssignmentStep.tsx`, modify `handleAddHold` to auto-create placeholder assignments:

```typescript
const handleAddHold = (hold: RoomHold) => {
  const newHolds = [...roomHolds, hold];
  onRoomHoldsChange(newHolds);

  // Auto-create placeholder assignments (no specific room)
  const holdIndex = newHolds.length - 1;
  const newAssignments: RoomAssignment[] = [];
  for (let i = 0; i < hold.quantity; i++) {
    newAssignments.push({
      roomHoldIndex: holdIndex,
      roomId: '',
      roomNumber: '',
      roomPrice: hold.roomPrice,
      adults: hold.adults,
      children: hold.children,
      childrenU7: 0,
      childrenU3: 0,
      extraBed: hold.extraBed,
      extraBedPrice: hold.extraBedPrice,
      extraPerson: 0,
      status: 'pending',
    });
  }
  onRoomAssignmentsChange([...roomAssignments, ...newAssignments]);

  setShowAddHold(false);
};
```

**Step 3: Hide room selection UI in create mode**

In `RoomAssignmentGroup.tsx`, update props to accept `mode`:

```typescript
interface RoomAssignmentGroupProps {
  // ... existing props
  mode: 'create' | 'edit';
}
```

In the RoomAssignmentGroup component, conditionally hide the Auto/Add buttons and RoomSelector when `mode === 'create'`:

Find the buttons section (around lines 179-214) and wrap with:
```tsx
{mode === 'edit' && (
  <>
    {/* existing Auto and Add buttons */}
  </>
)}
```

Also hide the RoomSelector section (lines 218-226) with the same condition.

**Step 4: Enhance RoomAssignmentRow to show more details**

In `RoomAssignmentGroup.tsx`, update `RoomAssignmentRow` (lines 44-115) to show additional info. Import `formatPrice` from the shared utility:

```typescript
import { formatPrice } from '../../lib/utils/format';
```

Update the row render. Replace the room number and details section with:

```tsx
{/* Room number — only show if assigned */}
{assignment.roomNumber ? (
  <span className="font-bold text-[#1E3A8A]">{assignment.roomNumber}</span>
) : (
  <span className="text-gray-400 italic text-xs">Chưa phân phòng</span>
)}

{/* Details tags */}
<div className="flex flex-wrap items-center gap-1.5">
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F3F4F6] text-xs">
    💰 {formatPrice(assignment.roomPrice)}
  </span>
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F3F4F6] text-xs">
    👤 {assignment.adults} NL
  </span>
  {assignment.children > 0 && (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F3F4F6] text-xs">
      👶 {assignment.children} TE
    </span>
  )}
  {assignment.extraBed && (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEF3C7] text-xs">
      🛏️ Giường phụ {formatPrice(assignment.extraBedPrice)}
    </span>
  )}
</div>
```

**Step 5: Pass mode from BookingWizard to RoomAssignmentStep**

In `components/booking/BookingWizard.tsx`, update the RoomAssignmentStep JSX (around lines 450-459) to pass `mode`:

```tsx
<RoomAssignmentStep
  // ... existing props
  mode={mode}
/>
```

And in RoomAssignmentStep, pass `mode` to each RoomAssignmentGroup:

```tsx
<RoomAssignmentGroup
  // ... existing props
  mode={mode}
/>
```

**Step 6: Build check**

Run: `cd hotel-management-frontend && npm run build`
Expected: Build succeeds.

**Step 7: Commit**

```bash
git add components/booking/RoomAssignmentStep.tsx components/booking/RoomAssignmentGroup.tsx components/booking/BookingWizard.tsx
git commit -m "feat(F7): show assignment details, hide room selection in create mode"
```

---

## Task 9: F8 — Proforma Invoice print component

**Why:** Users need to print a proforma invoice from the booking edit page, styled like the Mandarin Oriental example in feedback.

**Files:**
- Create: `components/booking/proforma-invoice.tsx`
- Modify: `components/booking/BookingWizard.tsx` (add print button in edit mode)

**Step 1: Create ProformaInvoice component**

Create `components/booking/proforma-invoice.tsx`:

```tsx
'use client';

import { useRef } from 'react';
import { Reservation, Hotel, RoomCategory, RoomType } from '../../lib/types';
import { formatPrice } from '../../lib/utils/format';

export interface ProformaInvoiceProps {
  reservation: Reservation;
  hotel: Hotel;
  roomCategories: RoomCategory[];
  roomTypes: RoomType[];
  onClose: () => void;
}

export function ProformaInvoice({
  reservation,
  hotel,
  roomCategories,
  roomTypes,
  onClose,
}: ProformaInvoiceProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Proforma Invoice - ${reservation.registrationCode}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          .invoice-container { max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 3px solid #1E3A8A; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { color: #1E3A8A; font-size: 24px; margin: 0; }
          .header p { color: #666; margin: 4px 0; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .info-block { }
          .info-block h3 { color: #1E3A8A; font-size: 14px; margin: 0 0 8px 0; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
          .info-block p { margin: 2px 0; font-size: 13px; }
          .invoice-meta { text-align: right; }
          .invoice-meta .label { font-size: 12px; color: #666; }
          .invoice-meta .value { font-size: 16px; font-weight: bold; color: #1E3A8A; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #1E3A8A; color: white; padding: 8px 12px; text-align: left; font-size: 12px; }
          td { padding: 8px 12px; border-bottom: 1px solid #eee; font-size: 13px; }
          .text-right { text-align: right; }
          .summary-table { margin-top: 20px; }
          .summary-table td { border: none; padding: 4px 12px; }
          .summary-table .total-row { font-weight: bold; font-size: 15px; border-top: 2px solid #1E3A8A; }
          .bank-details { margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
          .bank-details h3 { color: #1E3A8A; margin: 0 0 10px 0; }
          .bank-details p { margin: 2px 0; font-size: 13px; }
          .footer { text-align: center; margin-top: 40px; padding-top: 15px; border-top: 2px solid #1E3A8A; font-size: 12px; color: #666; }
          @media print { body { padding: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const nights = reservation.nights || 1;
  const invoiceDate = new Date().toLocaleDateString('vi-VN');
  const deadlineDate = new Date(reservation.checkIn).toLocaleDateString('vi-VN');

  // Build line items from room holds
  const lineItems = reservation.roomHolds.map((hold) => {
    const category = roomCategories.find((c) => c.id === hold.roomCategoryId);
    const roomType = roomTypes.find((t) => t.id === hold.roomTypeId);
    const totalRoom = hold.roomPrice * hold.quantity * nights;
    const vat = Math.round(totalRoom * (hotel.taxPercent / 100));
    const serviceCharge = Math.round(totalRoom * (hotel.serviceChargePercent / 100));
    return {
      roomTypeName: roomType?.name || '—',
      categoryName: category?.name || '—',
      quantity: hold.quantity,
      nights,
      pricePerNight: hold.roomPrice,
      totalRoom,
      vat,
      serviceCharge,
      total: totalRoom + vat + serviceCharge,
    };
  });

  const grandTotal = lineItems.reduce((s, item) => s + item.total, 0);
  const subtotal = lineItems.reduce((s, item) => s + item.totalRoom, 0);
  const totalVat = lineItems.reduce((s, item) => s + item.vat, 0);
  const totalService = lineItems.reduce((s, item) => s + item.serviceCharge, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Toolbar */}
        <div className="sticky top-0 bg-white border-b px-6 py-3 flex justify-between items-center no-print">
          <h2 className="text-lg font-semibold text-[#1E3A8A]">Proforma Invoice</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] text-sm font-medium"
            >
              🖨️ In
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              Đóng
            </button>
          </div>
        </div>

        {/* Invoice content */}
        <div ref={printRef} className="p-8">
          <div className="invoice-container">
            {/* Header */}
            <div style={{ textAlign: 'center', borderBottom: '3px solid #1E3A8A', paddingBottom: '20px', marginBottom: '20px' }}>
              <h1 style={{ color: '#1E3A8A', fontSize: '24px', margin: 0 }}>{hotel.name}</h1>
              <p style={{ color: '#666', margin: '4px 0' }}>{hotel.address}</p>
              {hotel.phone && <p style={{ color: '#666', margin: '4px 0' }}>Tel: {hotel.phone}</p>}
              {hotel.email && <p style={{ color: '#666', margin: '4px 0' }}>Email: {hotel.email}</p>}
            </div>

            {/* Info row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ color: '#1E3A8A', fontSize: '14px', margin: '0 0 8px 0' }}>To:</h3>
                <p style={{ margin: '2px 0', fontWeight: 'bold' }}>{reservation.companyName || reservation.bookingName}</p>
                {reservation.phone && <p style={{ margin: '2px 0', fontSize: '13px' }}>Phone: {reservation.phone}</p>}
                {reservation.email && <p style={{ margin: '2px 0', fontSize: '13px' }}>Email: {reservation.email}</p>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div><span style={{ fontSize: '12px', color: '#666' }}>Proforma Invoice:</span></div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1E3A8A' }}>{reservation.registrationCode}</div>
                <div style={{ marginTop: '8px' }}><span style={{ fontSize: '12px', color: '#666' }}>Ngày:</span></div>
                <div style={{ fontWeight: 'bold' }}>{invoiceDate}</div>
                <div style={{ marginTop: '8px' }}><span style={{ fontSize: '12px', color: '#666' }}>Deadline:</span></div>
                <div style={{ fontWeight: 'bold' }}>{deadlineDate}</div>
              </div>
            </div>

            {/* Guest Details */}
            <h3 style={{ color: '#1E3A8A', fontSize: '14px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>Details</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0' }}>
              <thead>
                <tr>
                  <th style={{ background: '#1E3A8A', color: 'white', padding: '8px 12px', textAlign: 'left', fontSize: '12px' }}>Guest Name</th>
                  <th style={{ background: '#1E3A8A', color: 'white', padding: '8px 12px', textAlign: 'left', fontSize: '12px' }}>Check In</th>
                  <th style={{ background: '#1E3A8A', color: 'white', padding: '8px 12px', textAlign: 'left', fontSize: '12px' }}>Check Out</th>
                  <th style={{ background: '#1E3A8A', color: 'white', padding: '8px 12px', textAlign: 'left', fontSize: '12px' }}>Room Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid #eee', fontSize: '13px' }}>{reservation.bookingName}</td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid #eee', fontSize: '13px' }}>{new Date(reservation.checkIn).toLocaleDateString('vi-VN')}</td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid #eee', fontSize: '13px' }}>{new Date(reservation.checkOut).toLocaleDateString('vi-VN')}</td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid #eee', fontSize: '13px' }}>
                    {lineItems.map((li) => `${li.categoryName}`).join(', ')}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Rates Table */}
            <h3 style={{ color: '#1E3A8A', fontSize: '14px', borderBottom: '1px solid #ddd', paddingBottom: '4px', marginTop: '20px' }}>Rates & Taxes</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0' }}>
              <thead>
                <tr>
                  <th style={{ background: '#1E3A8A', color: 'white', padding: '8px 12px', textAlign: 'left', fontSize: '12px' }}>Room</th>
                  <th style={{ background: '#1E3A8A', color: 'white', padding: '8px 12px', textAlign: 'right', fontSize: '12px' }}>Qty</th>
                  <th style={{ background: '#1E3A8A', color: 'white', padding: '8px 12px', textAlign: 'right', fontSize: '12px' }}>Nights</th>
                  <th style={{ background: '#1E3A8A', color: 'white', padding: '8px 12px', textAlign: 'right', fontSize: '12px' }}>Room Rate</th>
                  <th style={{ background: '#1E3A8A', color: 'white', padding: '8px 12px', textAlign: 'right', fontSize: '12px' }}>VAT ({hotel.taxPercent}%)</th>
                  <th style={{ background: '#1E3A8A', color: 'white', padding: '8px 12px', textAlign: 'right', fontSize: '12px' }}>Service ({hotel.serviceChargePercent}%)</th>
                  <th style={{ background: '#1E3A8A', color: 'white', padding: '8px 12px', textAlign: 'right', fontSize: '12px' }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid #eee', fontSize: '13px' }}>{item.categoryName}</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid #eee', fontSize: '13px', textAlign: 'right' }}>{item.quantity}</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid #eee', fontSize: '13px', textAlign: 'right' }}>{item.nights}</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid #eee', fontSize: '13px', textAlign: 'right' }}>{formatPrice(item.totalRoom)}</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid #eee', fontSize: '13px', textAlign: 'right' }}>{formatPrice(item.vat)}</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid #eee', fontSize: '13px', textAlign: 'right' }}>{formatPrice(item.serviceCharge)}</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid #eee', fontSize: '13px', textAlign: 'right', fontWeight: 'bold' }}>{formatPrice(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <table style={{ width: '50%', marginLeft: 'auto', marginTop: '20px' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '4px 12px', fontSize: '13px' }}>Subtotal</td>
                  <td style={{ padding: '4px 12px', fontSize: '13px', textAlign: 'right' }}>{formatPrice(subtotal)}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 12px', fontSize: '13px' }}>VAT ({hotel.taxPercent}%)</td>
                  <td style={{ padding: '4px 12px', fontSize: '13px', textAlign: 'right' }}>{formatPrice(totalVat)}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 12px', fontSize: '13px' }}>Service Charge ({hotel.serviceChargePercent}%)</td>
                  <td style={{ padding: '4px 12px', fontSize: '13px', textAlign: 'right' }}>{formatPrice(totalService)}</td>
                </tr>
                {reservation.deposit.enabled && reservation.deposit.amount > 0 && (
                  <tr>
                    <td style={{ padding: '4px 12px', fontSize: '13px' }}>Deposit</td>
                    <td style={{ padding: '4px 12px', fontSize: '13px', textAlign: 'right', color: '#16a34a' }}>-{formatPrice(reservation.deposit.amount)}</td>
                  </tr>
                )}
                <tr style={{ fontWeight: 'bold', fontSize: '15px', borderTop: '2px solid #1E3A8A' }}>
                  <td style={{ padding: '8px 12px' }}>Total to be paid</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#1E3A8A' }}>
                    {formatPrice(grandTotal - (reservation.deposit.enabled ? reservation.deposit.amount : 0))}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '15px', borderTop: '2px solid #1E3A8A', fontSize: '12px', color: '#666' }}>
              © {new Date().getFullYear()} {hotel.name}
              {hotel.taxCode && <span> | MST: {hotel.taxCode}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Add print button and invoice state to BookingWizard**

In `components/booking/BookingWizard.tsx`:

Add import:
```typescript
import { ProformaInvoice } from './proforma-invoice';
```

Add state and handler (after other state declarations):
```typescript
const [showInvoice, setShowInvoice] = useState(false);
```

Update useMockData to include hotel data:
```typescript
const { addReservation, updateReservation, companyProfiles, addCompanyProfile, hotels, roomCategories, roomTypes } = useMockData();
```

In the action buttons section (around lines 463-569), when `mode === 'edit'`, add a print button before existing buttons:

```tsx
{mode === 'edit' && (
  <button
    type="button"
    onClick={() => setShowInvoice(true)}
    className="px-4 py-2.5 border border-[#3B82F6] text-[#3B82F6] rounded-lg hover:bg-[#EFF6FF] text-sm font-medium flex items-center gap-2"
  >
    🖨️ In hóa đơn
  </button>
)}
```

Add the invoice modal render at the end of the component (before the closing fragment/div):
```tsx
{showInvoice && reservation && (
  <ProformaInvoice
    reservation={{
      ...reservation,
      ...reservationData,
    }}
    hotel={hotels[0]}
    roomCategories={roomCategories}
    roomTypes={roomTypes}
    onClose={() => setShowInvoice(false)}
  />
)}
```

Note: `reservationData` should be constructed from current form state so the invoice reflects any unsaved edits. You may need to compute it inline or extract the reservation construction from handleSubmit into a helper function.

**Step 3: Build check**

Run: `cd hotel-management-frontend && npm run build`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add components/booking/proforma-invoice.tsx components/booking/BookingWizard.tsx
git commit -m "feat(F8): add proforma invoice print component with hotel branding"
```

---

## Task 10: Final integration check and format consistency

**Why:** Ensure all 8 feedback items work together without regressions.

**Files:**
- Modify: `components/booking/RoomHoldForm.tsx` (apply formatPrice to room price display)

**Step 1: Apply currency formatting to room price input in RoomHoldForm**

In `components/booking/RoomHoldForm.tsx`, import the format utility and apply the same format-on-blur pattern as the deposit field for the room price input (lines 197-208). This ensures consistency across all currency fields.

Add import:
```typescript
import { formatCurrency, parseCurrency } from '../../lib/utils/format';
```

Add local state for formatted display (in the component function):
```typescript
const [priceDisplay, setPriceDisplay] = useState(roomPrice ? formatCurrency(roomPrice) : '');
```

Keep priceDisplay in sync when roomPrice changes programmatically (from category/rate code selection):
```typescript
useEffect(() => {
  setPriceDisplay(roomPrice ? formatCurrency(roomPrice) : '');
}, [roomPrice]);
```

Replace the room price input (lines 197-208):
```tsx
<div>
  <label className={labelStyle}>Giá phòng (VND)</label>
  <input
    type="text"
    inputMode="numeric"
    value={priceDisplay}
    onChange={(e) => setPriceDisplay(e.target.value)}
    onFocus={() => setPriceDisplay(roomPrice ? String(roomPrice) : '')}
    onBlur={() => {
      const parsed = parseCurrency(priceDisplay);
      setRoomPrice(parsed);
      setPriceDisplay(parsed ? formatCurrency(parsed) : '');
    }}
    className={inputStyle}
    id="input-hold-price"
  />
</div>
```

**Step 2: Full build check**

Run: `cd hotel-management-frontend && npm run build`
Expected: Build succeeds with zero errors.

**Step 3: Run lint**

Run: `cd hotel-management-frontend && npm run lint`
Expected: No lint errors (or only pre-existing ones).

**Step 4: Manual smoke test checklist**

Run: `cd hotel-management-frontend && npm run dev`

Test each feedback item:
- [ ] F1: Registration Code is readonly, shows placeholder "Tự động tạo khi lưu"
- [ ] F2: Company Name is a searchable dropdown, "+" button opens add form
- [ ] F3: Số đêm is editable, typing nights updates checkout date, and vice versa
- [ ] F4: User check-in shows "Admin User" and is readonly
- [ ] F5: Deposit amount formats with separators on blur (1.000.000)
- [ ] F6: Selecting a room category auto-fills its basePrice
- [ ] F7: Room assignments show details (adults, children, beds, prices), no room selector in create mode
- [ ] F8: "In hóa đơn" button appears in edit mode, opens printable invoice

**Step 5: Final commit**

```bash
git add components/booking/RoomHoldForm.tsx
git commit -m "feat: apply currency formatting to room price input for consistency"
```

---

## Summary of All Tasks

| Task | Feedback | Description | Files |
|------|----------|-------------|-------|
| 1 | Prep | Extract shared formatPrice/formatCurrency utility | `lib/utils/format.ts`, 2 existing files |
| 2 | F1 | Registration code readonly | `GuestInfoForm.tsx` |
| 3 | F4 | User check-in readonly + default | `BookingWizard.tsx`, `GuestInfoForm.tsx` |
| 4 | F5 | Deposit amount formatting | `GuestInfoForm.tsx` |
| 5 | F3 | Bi-directional nights/checkout | `GuestInfoForm.tsx`, `BookingWizard.tsx` |
| 6 | F2 | Company dropdown + add new | New `company-select.tsx`, `GuestInfoForm.tsx`, `BookingWizard.tsx` |
| 7 | F6 | Room price from category basePrice | `RoomHoldForm.tsx` |
| 8 | F7 | Assignment details, no room selection | `RoomAssignmentStep.tsx`, `RoomAssignmentGroup.tsx`, `BookingWizard.tsx` |
| 9 | F8 | Proforma invoice print | New `proforma-invoice.tsx`, `BookingWizard.tsx` |
| 10 | All | Integration check + formatting consistency | `RoomHoldForm.tsx` |
