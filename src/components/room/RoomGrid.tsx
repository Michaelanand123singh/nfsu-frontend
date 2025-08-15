import { RoomBox, RoomStatus } from "./RoomBox";

interface Room {
  id: string;
  roomNumber: string;
  status: RoomStatus;
  type: 'single' | 'double';
  pricePerNight: number;
  isAvailable?: boolean;
  availabilityMessage?: string;
}

interface RoomGridProps {
  rooms: Room[];
  onRoomSelect: (room: Room) => void;
}

export const RoomGrid = ({ rooms, onRoomSelect }: RoomGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {rooms.map((room) => (
        <RoomBox
          key={room.id}
          roomNumber={room.roomNumber}
          status={room.status}
          isAvailable={room.isAvailable}
          availabilityMessage={room.availabilityMessage}
          isClickable={room.isClickable}
          onClick={() => onRoomSelect(room)}
          className="animate-scale-in"
        />
      ))}
    </div>
  );
};