'use client';

import { useParams, useRouter } from 'next/navigation';
import { BookingWizard } from '../../../../../components/booking/BookingWizard';
import { useMockData } from '../../../../../lib/context/MockDataContext';

// ==========================================
// Booking Edit Page
// ==========================================

export default function BookingEditPage() {
  const params = useParams();
  const router = useRouter();
  const { reservations } = useMockData();

  const reservationId = params.id as string;
  const reservation = reservations.find((r) => r.id === reservationId);

  const handleCancel = () => {
    router.push('/bookings');
  };

  const handleSave = () => {
    router.push('/bookings');
  };

  if (!reservation) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-[#1E3A8A] mb-2">
            Không tìm thấy Booking
          </h2>
          <p className="text-sm text-[#6B7280] mb-4">
            Booking với ID &ldquo;{reservationId}&rdquo; không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => router.push('/bookings')}
            className="
              px-4 py-2.5 rounded-lg
              bg-[#1E3A8A] text-white
              hover:bg-[#1E40AF]
              transition-colors duration-200
              font-medium text-sm cursor-pointer
            "
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <BookingWizard
        mode="edit"
        reservation={reservation}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </div>
  );
}
