import { Arrival, DashboardData, Departure, RevenueDataPoint } from '../types';

// Generate today's arrivals
const generateArrivals = (): Arrival[] => {
  const arrivals: Arrival[] = [
    {
      id: '1',
      guestName: 'Nguyễn Văn An',
      roomNumber: 'A301',
      expectedTime: '14:00',
      isOverdue: false,
    },
    {
      id: '2',
      guestName: 'Trần Thị Bình',
      roomNumber: 'A502',
      expectedTime: '15:30',
      isOverdue: false,
    },
    {
      id: '3',
      guestName: 'John Smith',
      roomNumber: 'B801',
      expectedTime: '13:00',
      isOverdue: true, // Arrived late
    },
    {
      id: '4',
      guestName: 'Lê Minh Tuấn',
      roomNumber: 'A205',
      expectedTime: '16:00',
      isOverdue: false,
    },
    {
      id: '5',
      guestName: 'Phạm Hồng Nhung',
      roomNumber: 'B403',
      expectedTime: '14:30',
      isOverdue: false,
    },
    {
      id: '6',
      guestName: 'Lee Chen',
      roomNumber: 'A702',
      expectedTime: '17:00',
      isOverdue: false,
    },
    {
      id: '7',
      guestName: 'Hoàng Đức Trọng',
      roomNumber: 'B606',
      expectedTime: '12:00',
      isOverdue: true,
    },
  ];
  return arrivals;
};

// Generate today's departures
const generateDepartures = (): Departure[] => {
  const departures: Departure[] = [
    {
      id: '1',
      guestName: 'Vũ Thị Lan',
      roomNumber: 'A102',
      checkoutTime: '10:30',
      isLate: false,
    },
    {
      id: '2',
      guestName: 'David Wilson',
      roomNumber: 'B501',
      checkoutTime: '11:00',
      isLate: false,
    },
    {
      id: '3',
      guestName: 'Đỗ Thanh Hải',
      roomNumber: 'A404',
      checkoutTime: '13:30',
      isLate: true, // Late checkout
    },
    {
      id: '4',
      guestName: 'Ngô Quang Vinh',
      roomNumber: 'B203',
      checkoutTime: '09:00',
      isLate: false,
    },
    {
      id: '5',
      guestName: 'Maria Garcia',
      roomNumber: 'A903',
      checkoutTime: '12:00',
      isLate: false,
    },
    {
      id: '6',
      guestName: 'Bùi Văn Khánh',
      roomNumber: 'B105',
      checkoutTime: '14:00',
      isLate: true,
    },
  ];
  return departures;
};

// Generate last 7 days revenue data
const generateRevenueData = (): RevenueDataPoint[] => {
  const today = new Date();
  const data: RevenueDataPoint[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate random revenue between 150-350 million VND
    const revenue = Math.floor(Math.random() * 200 + 150);
    
    data.push({
      date: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`,
      revenue,
    });
  }
  
  return data;
};

export const MOCK_DASHBOARD_DATA: DashboardData = {
  kpi: {
    totalRooms: 120,
    todayRevenue: 285000000, // 285 million VND
    currentGuests: 98,
    occupancyRate: 81.7, // 98/120 = 81.7%
  },
  roomStatus: {
    vacantClean: 18,
    vacantDirty: 4,
    occupied: 92,
    outOfOrder: 6,
  },
  arrivals: generateArrivals(),
  departures: generateDepartures(),
  revenueChart: generateRevenueData(),
};
