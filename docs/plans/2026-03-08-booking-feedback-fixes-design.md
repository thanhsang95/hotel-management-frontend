# Booking Feedback Fixes — Design Document

**Date:** 2026-03-08
**Source:** Feedback screenshots from 2026-03-07
**Scope:** 8 items across Booking Wizard (Step 1 & Step 2) and Booking Edit

---

## Summary

Address 8 feedback items from stakeholder review of the booking creation/edit flow. Changes span GuestInfoForm (Step 1), RoomHoldForm / RoomAssignmentStep (Step 2), and a new Proforma Invoice feature.

---

## Feedback Items

### Group A: GuestInfoForm Fixes (F1, F3, F4, F5)

#### F1 — Registration Code Auto-Generate (Readonly)

- **Current:** Text input, user can type; placeholder says "auto-generate if empty"
- **Change:** Make field **readonly**. Display "Tu dong tao khi luu" for new bookings. Show existing code for edits. Auto-generate logic in BookingWizard stays unchanged.
- **Files:** `GuestInfoForm.tsx`

#### F3 — Nights and Checkout Date Bi-Directional

- **Current:** Nights displayed as readonly computed value. Checkout is a date picker.
- **Change:** Make "So dem" an **editable number input**. Two-way sync:
  - User enters nights -> auto-compute checkout = checkin + nights
  - User picks checkout -> auto-compute nights = checkout - checkin
- Add `nightsInput` state in BookingWizard to track user-entered nights value.
- **Files:** `GuestInfoForm.tsx`, `BookingWizard.tsx`

#### F4 — User Check-in Readonly

- **Current:** Text input, user types name manually.
- **Change:** Make **readonly**. Default value = "Admin User" (Phase 2 hardcode). Phase 3 will pull from auth context.
- Set default in `getDefaultFormData()`.
- **Files:** `GuestInfoForm.tsx`, `BookingWizard.tsx`

#### F5 — Deposit Amount Number Formatting

- **Current:** `<input type="number">` shows raw digits (1000000).
- **Change:** Format with thousands separator (1,000,000). Use `Intl.NumberFormat('vi-VN')`. Convert to text input with format-on-blur / parse-on-focus pattern.
- Create utility: `formatCurrency(amount: number): string`
- **Files:** `GuestInfoForm.tsx`, possibly `lib/utils/format.ts`

---

### Group B: Company Dropdown (F2)

#### F2 — Company Name Searchable Dropdown with Add New

- **Current:** Plain text input for company name.
- **Change:** Replace with **searchable dropdown** populated from `companyProfiles` (MockDataContext).
  - Type to filter companies by name
  - Select to set `companyName` (and optionally `companyId`)
  - "+" button beside dropdown opens inline form / modal for quick company creation
  - Quick-create form: only requires company name (other fields editable later in Partners page)
  - After creation, auto-select the new company

- **New component:** `components/booking/company-select.tsx`
- **Files:** `GuestInfoForm.tsx`, `BookingWizard.tsx`

---

### Group C: Step 2 Changes and New Feature (F6, F7, F8)

#### F6 — Room Price Auto-Fill from Room Category

- **Current:** Room price only auto-fills when selecting a RateCode (`rateCodes.prices[0].amount`). No RateCode = price stays 0.
- **Change:** When selecting a RoomCategory, auto-fill price from `roomCategory.basePrice`. If RateCode is then selected, override with RateCode price. If RateCode is cleared, revert to category price. User can still manually edit price.
- **Files:** `RoomHoldForm.tsx`

#### F7 — Room Assignment: Show Details, Remove Room Selection

- **Current:** Each assignment card shows room number (B106), price, adults. RoomSelector lets user pick specific rooms.
- **Change:**
  - **Remove** RoomSelector, "Auto" button, and "+ Them" button during **booking creation**
  - Each assignment card **adds info:** adults, children, room price/night, extra bed (yes/no), extra bed price, number of beds, total (room + extra bed) x nights
  - **No specific room number** shown (blank, to be assigned at check-in)
  - When **editing** a checked-in booking, show assigned room number as readonly
- **Files:** `RoomAssignmentGroup.tsx`, `RoomAssignmentStep.tsx`, `RoomSelector.tsx`

#### F8 — Proforma Invoice Print

- **Current:** No print/export functionality exists.
- **Change:** New printable invoice component based on Mandarin Oriental template from feedback.
  - **Content sections:**
    - Header: Hotel logo + name (from Hotel config)
    - Recipient: Guest/company info
    - Invoice number + deadline
    - Details table: Guest name, check-in, check-out, room type
    - Rates table: Room, nights, total room rate, VAT, city tax, total per room
    - Summary: Total, commission, total to be paid
    - Bank details (from Hotel config)
  - **Trigger:** "In" button on Booking Edit page (alongside existing action buttons)
  - **Implementation:** `window.print()` + CSS `@media print` stylesheet, or render in full-screen modal then print
- **New component:** `components/booking/proforma-invoice.tsx`
- **Files:** Edit page or `BookingDrawer.tsx` (add print button)

---

## Files Affected (Summary)

| Action | File |
|--------|------|
| Modify | `components/booking/GuestInfoForm.tsx` |
| Modify | `components/booking/BookingWizard.tsx` |
| Modify | `components/booking/RoomHoldForm.tsx` |
| Modify | `components/booking/RoomAssignmentStep.tsx` |
| Modify | `components/booking/RoomAssignmentGroup.tsx` |
| Modify | `app/(dashboard)/bookings/[id]/edit/page.tsx` or `BookingDrawer.tsx` |
| Create | `components/booking/company-select.tsx` |
| Create | `components/booking/proforma-invoice.tsx` |
| Possibly create | `lib/utils/format.ts` (currency formatter) |

---

## Out of Scope

- Authentication / real user context (Phase 3)
- Backend API integration
- Sequential registration code counter (requires persistence)
- Full invoice/accounting system (this is a simple print template)
