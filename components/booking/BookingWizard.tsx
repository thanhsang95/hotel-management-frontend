'use client';

import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useCallback, useMemo, useState } from 'react';
import { useMockData } from '../../lib/context/MockDataContext';
import {
    DepositInfo,
    Reservation,
    ReservationType,
    RoomAssignment,
    RoomHold
} from '../../lib/types';
import { GuestInfoForm, GuestInfoFormData } from './GuestInfoForm';
import { ReservationTypeSelector } from './ReservationTypeSelector';
import { RoomAssignmentStep } from './RoomAssignmentStep';

// ==========================================
// Types
// ==========================================

interface BookingWizardProps {
  mode: 'create' | 'edit';
  reservation?: Reservation;
  onCancel: () => void;
  onSave: () => void;
  /** When true, hides the page header (used inside BookingDrawer) */
  embedded?: boolean;
}

export type ValidationErrors = Record<string, string>;

// ==========================================
// Step Indicator
// ==========================================

function StepIndicator({ currentStep }: { currentStep: 1 | 2 }) {
  const steps = [
    { number: 1, label: 'Thông tin khách' },
    { number: 2, label: 'Phân phòng' },
  ];

  return (
    <div className="flex items-center justify-center mb-6">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`
                w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                transition-all duration-300
                ${currentStep > step.number
                  ? 'bg-[#10B981] text-white'
                  : currentStep === step.number
                    ? 'bg-[#1E3A8A] text-white shadow-md shadow-[#1E3A8A]/30'
                    : 'bg-[#E2E8F0] text-[#9CA3AF]'
                }
              `}
            >
              {currentStep > step.number ? (
                <CheckCircleIcon className="w-5 h-5" />
              ) : (
                step.number
              )}
            </div>
            <span
              className={`
                text-sm font-medium
                ${currentStep >= step.number ? 'text-[#1E3A8A]' : 'text-[#9CA3AF]'}
              `}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`
                w-20 h-0.5 mx-4 rounded-full
                transition-all duration-300
                ${currentStep > step.number ? 'bg-[#10B981]' : 'bg-[#E2E8F0]'}
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ==========================================
// Default Form State
// ==========================================

function getDefaultFormData(reservationType: ReservationType): GuestInfoFormData {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return {
    registrationCode: '',
    bookingName: '',
    companyName: '',
    country: 'Việt Nam',
    phone: '',
    email: '',
    website: '',
    vip: false,
    passport: '',
    checkIn: reservationType === 'Walk-in' ? today : '',
    checkOut: reservationType === 'Walk-in' ? tomorrow : '',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    adults: 1,
    children: 0,
    nights: reservationType === 'Walk-in' ? 1 : 0,
    extraBed: false,
    extraBedPrice: 0,
    arrivalTime: '',
    departureTime: '',
    userCheckIn: '',
    marketSegmentId: '',
    channelId: '',
    sourceId: '',
    reservationType,
    deposit: { enabled: false },
    specialNotes: '',
    internalRequests: '',
  };
}

function reservationToFormData(reservation: Reservation): GuestInfoFormData {
  return {
    registrationCode: reservation.registrationCode,
    bookingName: reservation.bookingName,
    companyName: reservation.companyName || '',
    country: reservation.country || 'Việt Nam',
    phone: reservation.phone || '',
    email: reservation.email || '',
    website: reservation.website || '',
    vip: reservation.vip,
    passport: reservation.passport || '',
    checkIn: reservation.checkIn,
    checkOut: reservation.checkOut,
    checkInTime: reservation.checkInTime,
    checkOutTime: reservation.checkOutTime,
    adults: reservation.adults,
    children: reservation.children,
    nights: reservation.nights,
    extraBed: reservation.extraBed,
    extraBedPrice: reservation.extraBedPrice,
    arrivalTime: reservation.arrivalTime || '',
    departureTime: reservation.departureTime || '',
    userCheckIn: reservation.userCheckIn || '',
    marketSegmentId: reservation.marketSegmentId || '',
    channelId: reservation.channelId || '',
    sourceId: reservation.sourceId || '',
    reservationType: reservation.reservationType,
    deposit: reservation.deposit,
    specialNotes: reservation.specialNotes || '',
    internalRequests: reservation.internalRequests || '',
  };
}

// ==========================================
// Validation
// ==========================================

export function validateStep1(
  data: GuestInfoFormData,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.bookingName.trim()) {
    errors.bookingName = 'Tên booking không được để trống';
  }

  if (data.reservationType === 'GIT' && !data.companyName.trim()) {
    errors.companyName = 'Tên công ty là bắt buộc cho booking GIT';
  }

  if (!data.checkIn) {
    errors.checkIn = 'Ngày đến không được để trống';
  }

  if (!data.checkOut) {
    errors.checkOut = 'Ngày đi không được để trống';
  }

  if (data.checkIn && data.checkOut && data.checkIn >= data.checkOut) {
    errors.checkOut = 'Ngày đi phải sau ngày đến';
  }

  if (data.adults < 1) {
    errors.adults = 'Phải có ít nhất 1 người lớn';
  }

  if (data.deposit.enabled) {
    if (!data.deposit.amount || data.deposit.amount <= 0) {
      errors['deposit.amount'] = 'Số tiền đặt cọc phải lớn hơn 0';
    }
    if (!data.deposit.method) {
      errors['deposit.method'] = 'Chọn hình thức đặt cọc';
    }
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email không hợp lệ';
  }

  return errors;
}

// ==========================================
// BookingWizard Component
// ==========================================

export function BookingWizard({ mode, reservation, onCancel, onSave, embedded = false }: BookingWizardProps) {
  const { addReservation, updateReservation } = useMockData();

  // --- Wizard Step ---
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // --- Reservation Type Mode ---
  const [reservationType, setReservationType] = useState<ReservationType>(
    reservation?.reservationType || 'FIT'
  );

  // --- Form Data (Step 1) ---
  const [formData, setFormData] = useState<GuestInfoFormData>(
    reservation
      ? reservationToFormData(reservation)
      : getDefaultFormData(reservationType)
  );

  // --- Room Data (Step 2) ---
  const [roomHolds, setRoomHolds] = useState<RoomHold[]>(
    reservation?.roomHolds || []
  );
  const [roomAssignments, setRoomAssignments] = useState<RoomAssignment[]>(
    reservation?.roomAssignments || []
  );

  // --- Validation Errors ---
  const [errors, setErrors] = useState<ValidationErrors>({});

  // --- Computed: auto-calc nights ---
  const calculatedNights = useMemo(() => {
    if (formData.checkIn && formData.checkOut) {
      const diff = new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime();
      return Math.max(0, Math.ceil(diff / 86400000));
    }
    return 0;
  }, [formData.checkIn, formData.checkOut]);

  // --- Handlers ---
  const handleTypeChange = useCallback((type: ReservationType) => {
    setReservationType(type);
    setFormData((prev) => {
      const defaults = getDefaultFormData(type);
      return {
        ...prev,
        reservationType: type,
        // Auto-fill check-in for Walk-in
        ...(type === 'Walk-in' ? {
          checkIn: defaults.checkIn,
          checkOut: defaults.checkOut,
          nights: defaults.nights,
        } : {}),
      };
    });
    setErrors({});
  }, []);

  const handleFormChange = useCallback((field: keyof GuestInfoFormData, value: unknown) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-calc nights when dates change
      if (field === 'checkIn' || field === 'checkOut') {
        const ci = field === 'checkIn' ? (value as string) : prev.checkIn;
        const co = field === 'checkOut' ? (value as string) : prev.checkOut;
        if (ci && co) {
          const diff = new Date(co).getTime() - new Date(ci).getTime();
          updated.nights = Math.max(0, Math.ceil(diff / 86400000));
        }
      }

      return updated;
    });

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const handleDepositChange = useCallback((depositUpdate: Partial<DepositInfo>) => {
    setFormData((prev) => ({
      ...prev,
      deposit: { ...prev.deposit, ...depositUpdate },
    }));
    // Clear deposit errors
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors['deposit.amount'];
      delete newErrors['deposit.method'];
      return newErrors;
    });
  }, []);

  const handleNext = useCallback(() => {
    const validationErrors = validateStep1(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setCurrentStep(2);
  }, [formData]);

  const handleBack = useCallback(() => {
    setCurrentStep(1);
  }, []);

  const handleSubmit = useCallback(() => {
    // Validate Step 1 before saving
    const validationErrors = validateStep1(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setCurrentStep(1);
      return;
    }

    const reservationData: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'> = {
      registrationCode: formData.registrationCode || `RES-${Date.now().toString(36).toUpperCase()}`,
      bookingName: formData.bookingName,
      companyName: formData.companyName || undefined,
      country: formData.country || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      website: formData.website || undefined,
      vip: formData.vip,
      passport: formData.passport || undefined,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      checkInTime: formData.checkInTime,
      checkOutTime: formData.checkOutTime,
      adults: formData.adults,
      children: formData.children,
      nights: calculatedNights,
      extraBed: formData.extraBed,
      extraBedPrice: formData.extraBedPrice,
      arrivalTime: formData.arrivalTime || undefined,
      departureTime: formData.departureTime || undefined,
      userCheckIn: formData.userCheckIn || undefined,
      marketSegmentId: formData.marketSegmentId || undefined,
      channelId: formData.channelId || undefined,
      sourceId: formData.sourceId || undefined,
      reservationType: formData.reservationType,
      deposit: formData.deposit as DepositInfo,
      specialNotes: formData.specialNotes || undefined,
      internalRequests: formData.internalRequests || undefined,
      roomHolds,
      roomAssignments,
      status: reservation?.status || 'Confirmed',
    };

    if (mode === 'edit' && reservation) {
      updateReservation(reservation.id, reservationData);
    } else {
      addReservation(reservationData);
    }

    onSave();
  }, [formData, roomHolds, roomAssignments, calculatedNights, mode, reservation, addReservation, updateReservation, onSave]);

  const handleNoShow = useCallback(() => {
    if (reservation) {
      updateReservation(reservation.id, {
        status: 'NoShow',
        roomAssignments: reservation.roomAssignments.map((a) => ({
          ...a,
          status: 'released' as const,
        })),
      });
      onSave();
    }
  }, [reservation, updateReservation, onSave]);

  const handleCancelBooking = useCallback(() => {
    if (reservation) {
      updateReservation(reservation.id, {
        status: 'Cancelled',
        roomHolds: [],
        roomAssignments: reservation.roomAssignments.map((a) => ({
          ...a,
          status: 'released' as const,
        })),
      });
      onSave();
    }
  }, [reservation, updateReservation, onSave]);

  return (
    <div className={`space-y-4 ${embedded ? 'p-5' : 'p-6 max-w-5xl mx-auto'}`}>
      {/* Page Header — hidden when embedded in drawer */}
      {!embedded && (
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A8A] font-heading">
              {mode === 'create' ? 'Tạo Booking Mới' : `Chỉnh sửa Booking`}
            </h1>
            {mode === 'edit' && reservation && (
              <p className="text-sm text-[#6B7280] mt-1">
                {reservation.registrationCode} — {reservation.bookingName}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} />

      {/* Reservation Type Selector (only on Step 1) */}
      {currentStep === 1 && (
        <ReservationTypeSelector
          selectedType={reservationType}
          onSelect={handleTypeChange}
          disabled={mode === 'edit'}
        />
      )}

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
        {currentStep === 1 ? (
          <GuestInfoForm
            formData={formData}
            reservationType={reservationType}
            errors={errors}
            onChange={handleFormChange}
            onDepositChange={handleDepositChange}
            calculatedNights={calculatedNights}
          />
        ) : (
          <RoomAssignmentStep
            reservationType={reservationType}
            checkIn={formData.checkIn}
            checkOut={formData.checkOut}
            roomHolds={roomHolds}
            roomAssignments={roomAssignments}
            onRoomHoldsChange={setRoomHolds}
            onRoomAssignmentsChange={setRoomAssignments}
            reservationId={reservation?.id}
          />
        )}
      </div>

      {/* Navigation / CTA Bar */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
        <div>
          {currentStep === 2 && (
            <button
              onClick={handleBack}
              className="
                flex items-center gap-2 px-4 py-2.5 rounded-lg
                text-[#6B7280] hover:text-[#1E3A8A] hover:bg-[#F8FAFC]
                transition-all duration-200
                font-medium text-sm cursor-pointer
              "
              id="btn-wizard-back"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Quay lại
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Edit mode specific buttons */}
          {mode === 'edit' && reservation && (
            <>
              {reservation.status !== 'NoShow' && reservation.status !== 'Cancelled' && reservation.status !== 'CheckedOut' && (
                <button
                  onClick={handleNoShow}
                  className="
                    px-4 py-2.5 rounded-lg
                    text-[#F59E0B] border border-[#F59E0B]
                    hover:bg-[#FEF3C7]
                    transition-all duration-200
                    font-medium text-sm cursor-pointer
                  "
                  id="btn-no-show"
                >
                  No-show
                </button>
              )}
              {reservation.status !== 'Cancelled' && reservation.status !== 'CheckedOut' && (
                <button
                  onClick={handleCancelBooking}
                  className="
                    px-4 py-2.5 rounded-lg
                    text-[#EF4444] border border-[#EF4444]
                    hover:bg-[#FEF2F2]
                    transition-all duration-200
                    font-medium text-sm cursor-pointer
                  "
                  id="btn-cancel-booking"
                >
                  Hủy Booking
                </button>
              )}
            </>
          )}

          {/* Cancel / Close */}
          <button
            onClick={onCancel}
            className="
              px-4 py-2.5 rounded-lg
              text-[#6B7280] border border-[#E2E8F0]
              hover:bg-[#F8FAFC] hover:border-[#CBD5E1]
              transition-all duration-200
              font-medium text-sm cursor-pointer
            "
            id="btn-wizard-cancel"
          >
            {mode === 'edit' ? 'Đóng' : 'Hủy'}
          </button>

          {/* Navigation / Submit */}
          {currentStep === 1 ? (
            <button
              onClick={handleNext}
              className="
                flex items-center gap-2 px-5 py-2.5 rounded-lg
                bg-[#1E3A8A] text-white
                hover:bg-[#1E40AF]
                transition-all duration-200 shadow-sm
                font-medium text-sm cursor-pointer
              "
              id="btn-wizard-next"
            >
              Tiếp theo
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="
                flex items-center gap-2 px-5 py-2.5 rounded-lg
                bg-[#F59E0B] text-white
                hover:bg-[#D97706]
                transition-all duration-200 shadow-sm
                font-semibold text-sm cursor-pointer
              "
              id="btn-wizard-save"
            >
              <CheckCircleIcon className="w-4 h-4" />
              {mode === 'create' ? 'Lưu Booking' : 'Cập nhật'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
