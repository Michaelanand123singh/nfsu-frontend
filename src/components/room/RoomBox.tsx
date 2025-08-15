import { Lock, Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type RoomStatus = 'vacant' | 'booked' | 'held';

interface RoomBoxProps {
  roomNumber: string;
  status: RoomStatus;
  isAvailable?: boolean;
  availabilityMessage?: string;
  isClickable?: boolean; // New prop for clickable state
  onClick?: () => void;
  className?: string;
}

export const RoomBox = ({ 
  roomNumber, 
  status, 
  isAvailable = status === 'vacant',
  availabilityMessage,
  isClickable, // Use the new prop
  onClick, 
  className 
}: RoomBoxProps) => {
  // Determine if room is clickable based on props
  const canClick = isClickable !== undefined ? isClickable : (isAvailable && status === 'vacant');

  const statusConfig = {
    vacant: {
      bgColor: canClick ? 'bg-room-vacant' : 'bg-gray-300',
      textColor: canClick ? 'text-room-vacant-foreground' : 'text-gray-600',
      borderColor: canClick ? 'border-room-vacant' : 'border-gray-400',
      icon: canClick ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />,
      clickable: canClick
    },
    booked: {
      bgColor: 'bg-room-booked',
      textColor: 'text-room-booked-foreground',
      borderColor: 'border-room-booked',
      icon: <Lock className="h-3 w-3" />,
      clickable: false
    },
    held: {
      bgColor: 'bg-room-held',
      textColor: 'text-room-held-foreground',
      borderColor: 'border-room-held',
      icon: <Clock className="h-3 w-3 animate-pulse" />,
      clickable: false
    }
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "relative w-full aspect-square border-2 rounded-lg flex flex-col items-center justify-center gap-1 text-sm font-medium transition-all duration-200",
        config.bgColor,
        config.textColor,
        config.borderColor,
        config.clickable && "cursor-pointer hover:scale-105 hover:shadow-room",
        !config.clickable && "cursor-not-allowed opacity-90",
        config.clickable && "hover:shadow-glow",
        className
      )}
      onClick={config.clickable ? onClick : undefined}
      title={availabilityMessage || (config.clickable ? 'Available' : 'Not Available')}
    >
      <span className="text-xs font-bold">{roomNumber}</span>
      {config.icon && (
        <div className="absolute top-1 right-1">
          {config.icon}
        </div>
      )}
      
      {/* Hover effect for available rooms */}
      {config.clickable && (
        <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200" />
      )}
    </div>
  );
};