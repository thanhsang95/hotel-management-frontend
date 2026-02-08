'use client';

import { useRouter } from 'next/navigation';
import { BookingWizard } from '../../../../components/booking/BookingWizard';

// ==========================================
// New Booking Page
// ==========================================

export default function NewBookingPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/bookings');
  };

  const handleSave = () => {
    router.push('/bookings');
  };

  return (
    <div className="h-full">
      <BookingWizard
        mode="create"
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </div>
  );
}
