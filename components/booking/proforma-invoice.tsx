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
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #1E3A8A; color: white; padding: 8px 12px; text-align: left; font-size: 12px; }
          td { padding: 8px 12px; border-bottom: 1px solid #eee; font-size: 13px; }
          .text-right { text-align: right; }
          .total-row { font-weight: bold; border-top: 2px solid #1E3A8A; }
          @media print { body { padding: 0; } }
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
        <div className="sticky top-0 bg-white border-b px-6 py-3 flex justify-between items-center">
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
            <h3 style={{ color: '#1E3A8A', fontSize: '14px', borderBottom: '1px solid #ddd', paddingBottom: '4px', marginTop: '20px' }}>Rates &amp; Taxes</h3>
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
                {reservation.deposit.enabled && reservation.deposit.amount && reservation.deposit.amount > 0 && (
                  <tr>
                    <td style={{ padding: '4px 12px', fontSize: '13px' }}>Deposit</td>
                    <td style={{ padding: '4px 12px', fontSize: '13px', textAlign: 'right', color: '#16a34a' }}>-{formatPrice(reservation.deposit.amount)}</td>
                  </tr>
                )}
                <tr style={{ fontWeight: 'bold', fontSize: '15px', borderTop: '2px solid #1E3A8A' }}>
                  <td style={{ padding: '8px 12px' }}>Total to be paid</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#1E3A8A' }}>
                    {formatPrice(grandTotal - (reservation.deposit.enabled ? (reservation.deposit.amount || 0) : 0))}
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
