import { Room, RoomStatus } from '../types';

// Generate rooms for each floor and building
function generateRooms(): Room[] {
  const rooms: Room[] = [];
  const statuses: RoomStatus[] = ['Vacant', 'Occupied', 'Dirty', 'OOO'];
  const buildings = ['A', 'B'];
  
  let id = 1;
  
  buildings.forEach((building) => {
    // Each building has floors 1-10
    for (let floor = 1; floor <= 10; floor++) {
      // 6 rooms per floor
      for (let roomNum = 1; roomNum <= 6; roomNum++) {
        const roomNumber = `${building}${floor}${roomNum.toString().padStart(2, '0')}`;
        
        // Assign random category (weighted towards lower categories)
        const categoryWeights = ['1', '1', '2', '2', '3', '4', '4', '5', '6', '7', '8', '9'];
        const categoryId = categoryWeights[Math.floor(Math.random() * categoryWeights.length)];
        
        // Assign status (weighted: 40% Vacant, 45% Occupied, 10% Dirty, 5% OOO)
        const statusRandom = Math.random();
        let status: RoomStatus;
        if (statusRandom < 0.40) status = 'Vacant';
        else if (statusRandom < 0.85) status = 'Occupied';
        else if (statusRandom < 0.95) status = 'Dirty';
        else status = 'OOO';
        
        rooms.push({
          id: id.toString(),
          roomNumber,
          floor,
          building,
          categoryId,
          status,
          isClean: status === 'Vacant',
          notes: status === 'OOO' ? 'Đang bảo trì' : undefined,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        });
        
        id++;
      }
    }
  });
  
  return rooms;
}

export const MOCK_ROOMS: Room[] = generateRooms();
