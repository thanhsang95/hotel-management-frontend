import { Room } from '../types';

// Simple seeded random for deterministic results (avoids hydration mismatch)
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Generate rooms for each floor and building
function generateRooms(): Room[] {
  const rooms: Room[] = [];
  const buildings = ['A', 'B'];
  const random = seededRandom(123);
  
  let id = 1;
  
  buildings.forEach((building) => {
    // Each building has floors 1-10
    for (let floor = 1; floor <= 10; floor++) {
      // 6 rooms per floor
      for (let roomNum = 1; roomNum <= 6; roomNum++) {
        const roomNumber = `${building}${floor}${roomNum.toString().padStart(2, '0')}`;
        
        // Assign random category (weighted towards lower categories)
        const categoryWeights = ['1', '1', '2', '2', '3', '4', '4', '5', '6', '7', '8', '9'];
        const categoryId = categoryWeights[Math.floor(random() * categoryWeights.length)];
        
        // Assign status (weighted: 40% Vacant Clean, 30% Occupied, 20% Vacant Dirty, 10% OOO)
        const statusRandom = random();
        let statusId: string;
        if (statusRandom < 0.40) statusId = '1'; // VACANT_CLEAN
        else if (statusRandom < 0.70) statusId = '3'; // OCCUPIED
        else if (statusRandom < 0.90) statusId = '2'; // VACANT_DIRTY
        else statusId = '6'; // OOO
        
        // Assign room type based on category (lower categories = Standard, higher = Deluxe/Suite)
        let roomType: string | undefined;
        const catNum = parseInt(categoryId);
        if (catNum <= 3) roomType = 'Standard';
        else if (catNum <= 6) roomType = 'Deluxe';
        else roomType = 'Suite';
        
        rooms.push({
          id: id.toString(),
          roomNumber,
          floor,
          building,
          categoryId,
          statusId,
          isClean: ['1', '8'].includes(statusId), // VACANT_CLEAN or INSPECTED
          roomType,
          notes: statusId === '6' ? 'Đang bảo trì' : undefined,
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

