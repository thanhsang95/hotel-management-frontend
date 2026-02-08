'use client';


// ==========================================
// Timeline Summary Cards Component
// ==========================================

interface SummaryItem {
  label: string;
  value: number;
  color: string;
  bgColor: string;
  icon: string;
}

interface TimelineSummaryCardsProps {
  vacant: number;
  booked: number;
  checkedIn: number;
  maintenance: number;
}

export function TimelineSummaryCards({ vacant, booked, checkedIn, maintenance }: TimelineSummaryCardsProps) {
  const items: SummaryItem[] = [
    { label: 'Trống', value: vacant, color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.1)', icon: '⚪' },
    { label: 'Đã đặt', value: booked, color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)', icon: '🔵' },
    { label: 'Đang ở', value: checkedIn, color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)', icon: '🟢' },
    { label: 'Bảo trì', value: maintenance, color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)', icon: '🔴' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-[2px]"
        >
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl text-xl"
            style={{ backgroundColor: item.bgColor }}
          >
            {item.icon}
          </div>
          <div>
            <p className="text-sm text-[#6B7280] font-medium">{item.label}</p>
            <p className="text-2xl font-bold font-heading" style={{ color: item.color }}>
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TimelineSummaryCards;
