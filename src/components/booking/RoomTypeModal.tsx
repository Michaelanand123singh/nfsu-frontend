import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Users, ArrowRight } from "lucide-react";
import { getRoomStats } from "@/data/mockData";

interface RoomTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoomTypeModal = ({ isOpen, onClose }: RoomTypeModalProps) => {
  const navigate = useNavigate();
  const roomStats = getRoomStats();

  const handleRoomTypeSelect = (type: 'single' | 'double') => {
    onClose();
    navigate(`/rooms/${type}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl sm:text-2xl text-center mb-1">Choose Your Room Type</DialogTitle>
          <p className="text-center text-muted-foreground text-sm">
            Select from our comfortable rooms
          </p>
        </DialogHeader>
        
        <div className="grid gap-4 sm:gap-6 mt-4">
          {/* Single Rooms Card */}
          <Card 
            className="group hover:shadow-card transition-all duration-300 cursor-pointer hover:scale-[1.02]" 
            onClick={() => handleRoomTypeSelect('single')}
          >
            <CardHeader className="text-center pb-3">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-hero rounded-full flex items-center justify-center mb-2 sm:mb-4 group-hover:animate-pulse-glow">
                <Bed className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Single Bed Rooms</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-primary">
                {roomStats.single.vacant} Available
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Out of {roomStats.single.total} total rooms
              </p>
              <div className="flex justify-center gap-1 sm:gap-2 text-xs">
                <Badge variant="outline" className="bg-room-vacant/10 text-room-vacant border-room-vacant/20 px-1 sm:px-2">
                  {roomStats.single.vacant} Vacant
                </Badge>
                <Badge variant="outline" className="bg-room-booked/10 text-room-booked border-room-booked/20 px-1 sm:px-2">
                  {roomStats.single.booked} Booked
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-lg sm:text-xl font-semibold text-foreground">₹1,500/night</p>
                <p className="text-xs text-muted-foreground">Perfect for solo travelers</p>
              </div>
              <Button className="w-full group-hover:bg-primary/90 text-sm">
                Select Single Room
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Double Rooms Card */}
          <Card 
            className="group hover:shadow-card transition-all duration-300 cursor-pointer hover:scale-[1.02]" 
            onClick={() => handleRoomTypeSelect('double')}
          >
            <CardHeader className="text-center pb-3">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-hero rounded-full flex items-center justify-center mb-2 sm:mb-4 group-hover:animate-pulse-glow">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Double Bed Rooms</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-primary">
                {roomStats.double.vacant} Available
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Out of {roomStats.double.total} total rooms
              </p>
              <div className="flex justify-center gap-1 sm:gap-2 text-xs">
                <Badge variant="outline" className="bg-room-vacant/10 text-room-vacant border-room-vacant/20 px-1 sm:px-2">
                  {roomStats.double.vacant} Vacant
                </Badge>
                <Badge variant="outline" className="bg-room-booked/10 text-room-booked border-room-booked/20 px-1 sm:px-2">
                  {roomStats.double.booked} Booked
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-lg sm:text-xl font-semibold text-foreground">₹2,200/night</p>
                <p className="text-xs text-muted-foreground">Ideal for couples or sharing</p>
              </div>
              <Button className="w-full group-hover:bg-primary/90 text-sm">
                Select Double Room
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};