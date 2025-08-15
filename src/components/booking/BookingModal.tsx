import { useState, useEffect } from "react";
import { Calendar, CreditCard, MapPin, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface Room {
  id: string;
  roomNumber: string;
  type: 'single' | 'double';
  pricePerNight: number;
  floor: string;
  block: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onBookingSubmit: (bookingData: any) => void;
  initialData?: any; // Add prop for restoring form data
  isSubmitting?: boolean; // Add prop for loading state
}

export const BookingModal = ({ isOpen, onClose, room, onBookingSubmit, initialData, isSubmitting }: BookingModalProps) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState<'academic' | 'business' | 'personal' | 'other' | ''>('');
  const [purposeDetails, setPurposeDetails] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  // Restore form data when initialData is provided (after authentication)
  useEffect(() => {
    if (initialData && isOpen) {
      setCheckIn(initialData.checkIn || "");
      setCheckOut(initialData.checkOut || "");
      setGuestName(initialData.guestName || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setPurpose(initialData.purpose || '');
      setPurposeDetails(initialData.purposeDetails || "");
    }
  }, [initialData, isOpen]);

  // Reset form when modal opens without initial data
  useEffect(() => {
    if (isOpen && !initialData) {
      setCheckIn("");
      setCheckOut("");
      setGuestName("");
      setEmail(user?.email || ""); // Pre-fill with authenticated user's email
      setPhone("");
      setPurpose('');
      setPurposeDetails("");
    }
  }, [isOpen, initialData, user?.email]);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const totalAmount = room ? nights * room.pricePerNight : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('BookingModal handleSubmit called');
    console.log('Room:', room);
    console.log('Form data:', { checkIn, checkOut, guestName, email, phone, purpose, purposeDetails });
    
    if (!room) {
      console.error('No room available for booking');
      return;
    }

    // Validate required fields
    if (!checkIn || !checkOut || !guestName || !email || !phone) {
      console.error('Missing required fields:', { checkIn, checkOut, guestName, email, phone });
      toast({ 
        title: 'Validation Error', 
        description: 'Please fill in all required fields.',
        variant: 'destructive',
        duration: 3000
      });
      return;
    }

    // Validate dates
    if (new Date(checkIn) >= new Date(checkOut)) {
      console.error('Invalid dates: check-in must be before check-out');
      toast({ 
        title: 'Invalid Dates', 
        description: 'Check-out date must be after check-in date.',
        variant: 'destructive',
        duration: 3000
      });
      return;
    }

    // Validate check-in is at least 1 day in the future
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    if (new Date(checkIn) < tomorrow) {
      console.error('Invalid check-in date: must be at least 1 day in the future');
      toast({ 
        title: 'Invalid Check-in Date', 
        description: 'Check-in date must be at least 1 day in the future.',
        variant: 'destructive',
        duration: 3000
      });
      return;
    }

    // Validate phone number is exactly 10 digits
    if (!/^[0-9]{10}$/.test(phone)) {
      console.error('Invalid phone number: must be exactly 10 digits');
      toast({ 
        title: 'Invalid Phone Number', 
        description: 'Phone number must be exactly 10 digits (e.g., 9876543210).',
        variant: 'destructive',
        duration: 3000
      });
      return;
    }

    // Validate purpose is selected
    if (!purpose) {
      console.error('No purpose selected');
      toast({ 
        title: 'Purpose Required', 
        description: 'Please select a purpose for your stay.',
        variant: 'destructive',
        duration: 3000
      });
      return;
    }

    const bookingData = {
      roomId: room.id,
      checkIn,
      checkOut,
      guestName,
      email,
      phone,
      purpose: (purpose || 'personal') as any,
      purposeDetails: purposeDetails || undefined,
      nights,
      amount: totalAmount
    };
    
    console.log('Calling onBookingSubmit with:', bookingData);
    onBookingSubmit(bookingData);
  };

  if (!room) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Book Room {room.roomNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Room Details */}
          <div className="bg-gradient-card p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">Room Details</h3>
              <Badge variant="secondary">
                {room.type === 'single' ? 'Single Bed' : 'Double Bed'}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Room: {room.roomNumber} | Floor {room.floor} | Block {room.block}</p>
              <p className="font-medium text-foreground">₹{room.pricePerNight}/night</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Authentication Status */}
            {user && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Logged in as {user.email}</span>
                </div>
              </div>
            )}
            
            {/* Debug Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-xs text-blue-700">
                <div>Form State: {checkIn && checkOut && guestName && email && phone && purpose ? '✅ Complete' : '❌ Incomplete'}</div>
                <div>Button Enabled: {(!isSubmitting && checkIn && checkOut && guestName && email && phone && purpose && new Date(checkIn) >= new Date(Date.now() + 24 * 60 * 60 * 1000) && new Date(checkIn) < new Date(checkOut) && /^[0-9]{10}$/.test(phone)) ? '✅ Yes' : '❌ No'}</div>
                <div>Nights: {nights}</div>
                <div>Total: ₹{totalAmount}</div>
                <div>Check-in: {checkIn} ({(checkIn && new Date(checkIn) >= new Date(Date.now() + 24 * 60 * 60 * 1000)) ? '✅ Valid' : '❌ Invalid'})</div>
                <div>Phone: {phone} {(/^[0-9]{10}$/.test(phone)) ? '✅ Valid' : '❌ Invalid'}</div>
                <div>Purpose: {purpose || 'Not selected'}</div>
              </div>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkIn" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Check-in Date
                </Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <Label htmlFor="checkOut">Check-out Date</Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            {/* Guest Information */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Guest Information
              </Label>
              
              <div>
                <Label htmlFor="guestName">Full Name</Label>
                <Input
                  id="guestName"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="grid gap-3">
                <div>
                  <Label htmlFor="purpose">Purpose</Label>
                  <select
                    id="purpose"
                    className="w-full border rounded-md h-9 px-3 bg-background"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as any)}
                  >
                    <option value="">Select purpose</option>
                    <option value="academic">Academic</option>
                    <option value="business">Business</option>
                    <option value="personal">Personal</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="purposeDetails">Purpose Details (Optional)</Label>
                  <Textarea
                    id="purposeDetails"
                    value={purposeDetails}
                    onChange={(e) => setPurposeDetails(e.target.value)}
                    placeholder="E.g., attending conference, research, family visit..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            {nights > 0 && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Booking Summary
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Room {room.roomNumber} × {nights} nights</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-hero hover:opacity-90"
                disabled={isSubmitting || !checkIn || !checkOut || !guestName || !email || !phone || !purpose || new Date(checkIn) < new Date(Date.now() + 24 * 60 * 60 * 1000) || new Date(checkIn) >= new Date(checkOut) || !/^[0-9]{10}$/.test(phone)}
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking (Pay at Reception)'}
              </Button>
            </div>
            
            {/* Validation feedback */}
            {(!checkIn || !checkOut || !guestName || !email || !phone) && (
              <div className="text-sm text-orange-600 text-center">
                Please fill in all required fields to enable booking
              </div>
            )}
            
            {checkIn && checkOut && new Date(checkIn) >= new Date(checkOut) && (
              <div className="text-sm text-red-600 text-center">
                Check-out date must be after check-in date
              </div>
            )}
            
            {checkIn && new Date(checkIn) < new Date(Date.now() + 24 * 60 * 60 * 1000) && (
              <div className="text-sm text-red-600 text-center">
                Check-in date must be at least 1 day in the future
              </div>
            )}
            
            {phone && !/^[0-9]{10}$/.test(phone) && (
              <div className="text-sm text-red-600 text-center">
                Phone number must be exactly 10 digits
              </div>
            )}
            
            {!purpose && (
              <div className="text-sm text-red-600 text-center">
                Please select a purpose for your stay
              </div>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};