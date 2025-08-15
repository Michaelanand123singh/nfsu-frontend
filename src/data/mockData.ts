import { RoomStatus } from "@/components/room/RoomBox";

export interface Room {
  id: string;
  roomNumber: string;
  type: 'single' | 'double';
  status: RoomStatus;
  floor: string;
  block: string;
  pricePerNight: number;
  facilities?: string[];
}

export interface Floor {
  id: string;
  name: string;
  block: string;
  rooms: Room[];
  facilities?: string[];
}

// Mock data based on the provided JSON structure
export const mockRooms: Room[] = [
  // Floor 1 (Block A) - Single rooms + Gym
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `a-${i + 1}`,
    roomNumber: `A-${i + 1}`,
    type: 'single' as const,
    status: (Math.random() > 0.7 ? 'booked' : Math.random() > 0.9 ? 'held' : 'vacant') as RoomStatus,
    floor: '1',
    block: 'A',
    pricePerNight: 1500,
    facilities: ['Gym']
  })),

  // Floor 2 (Block B) - Single + Double rooms
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `b-${i + 1}`,
    roomNumber: `B-${i + 1}`,
    type: 'single' as const,
    status: (Math.random() > 0.7 ? 'booked' : Math.random() > 0.9 ? 'held' : 'vacant') as RoomStatus,
    floor: '2',
    block: 'B',
    pricePerNight: 1500
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `b-${i + 11}`,
    roomNumber: `B-${i + 11}`,
    type: 'double' as const,
    status: (Math.random() > 0.7 ? 'booked' : Math.random() > 0.9 ? 'held' : 'vacant') as RoomStatus,
    floor: '2',
    block: 'B',
    pricePerNight: 2200
  })),

  // Floor 3 (Block C) - Single + Double rooms
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `c-${i + 1}`,
    roomNumber: `C-${i + 1}`,
    type: 'single' as const,
    status: (Math.random() > 0.7 ? 'booked' : Math.random() > 0.9 ? 'held' : 'vacant') as RoomStatus,
    floor: '3',
    block: 'C',
    pricePerNight: 1500
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `c-${i + 11}`,
    roomNumber: `C-${i + 11}`,
    type: 'double' as const,
    status: (Math.random() > 0.7 ? 'booked' : Math.random() > 0.9 ? 'held' : 'vacant') as RoomStatus,
    floor: '3',
    block: 'C',
    pricePerNight: 2200
  })),

  // Floor 4 (Block D) - Single + Double rooms
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `d-${i + 1}`,
    roomNumber: `D-${i + 1}`,
    type: 'single' as const,
    status: (Math.random() > 0.7 ? 'booked' : Math.random() > 0.9 ? 'held' : 'vacant') as RoomStatus,
    floor: '4',
    block: 'D',
    pricePerNight: 1500
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `d-${i + 11}`,
    roomNumber: `D-${i + 11}`,
    type: 'double' as const,
    status: (Math.random() > 0.7 ? 'booked' : Math.random() > 0.9 ? 'held' : 'vacant') as RoomStatus,
    floor: '4',
    block: 'D',
    pricePerNight: 2200
  })),

  // Floor 5 (Block E) - Single rooms only
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `e-${i + 1}`,
    roomNumber: `E-${i + 1}`,
    type: 'single' as const,
    status: (Math.random() > 0.7 ? 'booked' : Math.random() > 0.9 ? 'held' : 'vacant') as RoomStatus,
    floor: '5',
    block: 'E',
    pricePerNight: 1500
  })),

  // Floor 6 (Block F) - Single rooms only
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `f-${i + 1}`,
    roomNumber: `F-${i + 1}`,
    type: 'single' as const,
    status: (Math.random() > 0.7 ? 'booked' : Math.random() > 0.9 ? 'held' : 'vacant') as RoomStatus,
    floor: '6',
    block: 'F',
    pricePerNight: 1500
  }))
];

export const getFloorData = (roomType?: 'single' | 'double'): Floor[] => {
  const floors = [
    { id: '1', name: '1', block: 'A', facilities: ['Gym'] },
    { id: '2', name: '2', block: 'B', facilities: [] },
    { id: '3', name: '3', block: 'C', facilities: [] },
    { id: '4', name: '4', block: 'D', facilities: [] },
    { id: '5', name: '5', block: 'E', facilities: [] },
    { id: '6', name: '6', block: 'F', facilities: [] }
  ];

  return floors.map(floor => ({
    ...floor,
    rooms: mockRooms.filter(room => 
      room.floor === floor.name && 
      (roomType ? room.type === roomType : true)
    )
  })).filter(floor => floor.rooms.length > 0);
};

export const getRoomStats = () => {
  const singleRooms = mockRooms.filter(room => room.type === 'single');
  const doubleRooms = mockRooms.filter(room => room.type === 'double');
  
  return {
    single: {
      total: singleRooms.length,
      vacant: singleRooms.filter(room => room.status === 'vacant').length,
      booked: singleRooms.filter(room => room.status === 'booked').length
    },
    double: {
      total: doubleRooms.length,
      vacant: doubleRooms.filter(room => room.status === 'vacant').length,
      booked: doubleRooms.filter(room => room.status === 'booked').length
    }
  };
};