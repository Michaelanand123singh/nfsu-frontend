import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, Calendar, Bed, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FloorTabs } from "@/components/room/FloorTabs";
import { RoomGrid } from "@/components/room/RoomGrid";
import { BookingModal } from "@/components/booking/BookingModal";
import { ChatPanel } from "@/components/ai/ChatPanel";
import { LoginModal } from "@/components/auth/LoginModal";
import { RegisterModal } from "@/components/auth/RegisterModal";
import { apiClient, type Room as ApiRoom } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const RoomsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const roomType = location.pathname.includes('/rooms/double') ? 'double' : 'single';
  
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [floors, setFloors] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  // Add state to preserve booking data during authentication flow
  const [pendingBookingData, setPendingBookingData] = useState<any | null>(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [availabilityStats, setAvailabilityStats] = useState<{ totalAvailable: number; totalRooms: number } | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Clear auth error when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setAuthError(null);
    }
  }, [isAuthenticated]);

  // Load floors and rooms from backend
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    
    const loadRooms = async () => {
      try {
        // Check backend connectivity first
        const isBackendHealthy = await apiClient.checkBackendHealth();
        if (!isBackendHealthy) {
          throw new Error('Backend server is not accessible. Please check if the server is running.');
        }
        
        // Use the new availability endpoint for better filtering
        const availabilityParams: any = { 
          type: roomType as any, 
          limit: 1000 
        };
        
        // Only add date filters if both dates are provided
        if (checkInDate && checkOutDate) {
          availabilityParams.checkIn = checkInDate;
          availabilityParams.checkOut = checkOutDate;
        }
        
        const [floorsRes, availabilityRes] = await Promise.all([
          apiClient.getFloorData(),
          apiClient.getRoomAvailability(availabilityParams)
        ]);
        
        if (!active) return;
        
        const floorsAgg = floorsRes.data?.floors || [];
        const rooms = availabilityRes.data?.rooms || [];
        
        // Update availability statistics
        setAvailabilityStats({
          totalAvailable: availabilityRes.data?.totalAvailable || 0,
          totalRooms: availabilityRes.data?.totalRooms || 0
        });

        // Debug logging for availability
        console.log('Availability Response:', {
          totalAvailable: availabilityRes.data?.totalAvailable,
          totalRooms: availabilityRes.data?.totalRooms,
          searchDates: availabilityRes.data?.searchDates,
          rooms: rooms.map(r => ({
            roomNumber: r.roomNumber,
            status: r.status,
            isAvailable: (r as any).isAvailable,
            availabilityMessage: (r as any).availabilityMessage,
            currentStatus: (r as any).currentStatus
          }))
        });

        // Group rooms by floor
        const grouped: Record<string, any[]> = {};
        (rooms as ApiRoom[]).forEach((r) => {
          if (!grouped[r.floor]) grouped[r.floor] = [];
          
          // Determine the display status based on availability for selected dates
          let displayStatus = r.status;
          let isClickable = false;
          
          if (checkInDate && checkOutDate) {
            // If dates are selected, use the availability logic from backend
            if ((r as any).isAvailable) {
              // Room is available for the selected dates
              if (r.status === 'vacant') {
                displayStatus = 'vacant';
                isClickable = true;
              } else if (r.status === 'booked' || r.status === 'held') {
                // Room is currently booked/held but available for selected dates
                displayStatus = 'vacant'; // Show as available for booking
                isClickable = true;
              }
            } else {
              // Room is not available for the selected dates
              if (r.status === 'vacant') {
                displayStatus = 'booked'; // Show as unavailable
                isClickable = false;
              } else {
                displayStatus = r.status; // Keep original status
                isClickable = false;
              }
            }
          } else {
            // No dates selected, use current status
            isClickable = r.status === 'vacant';
          }
          
          grouped[r.floor].push({
            id: r._id,
            roomNumber: r.roomNumber,
            status: displayStatus, // Use the calculated display status
            type: r.type,
            pricePerNight: r.pricePerNight,
            floor: r.floor,
            block: r.block,
            isAvailable: (r as any).isAvailable || r.status === 'vacant',
            availabilityMessage: (r as any).availabilityMessage || 'Available',
            currentStatus: (r as any).currentStatus || r.status, // Keep original status for reference
            isClickable // Add clickable state
          });
        });

        const normalized = floorsAgg.map((f: any) => {
          const blocks = Array.isArray(f.floors)
            ? Array.from(new Set(f.floors.map((x: any) => x.block))).filter(Boolean)
            : [];
          const facilities = Array.isArray(f.floors)
            ? Array.from(new Set((f.floors || []).flatMap((x: any) => x.facilities || []).flat()))
            : [];
          return {
            id: f._id,
            name: f._id,
            block: blocks.join(', ') || '-',
            facilities,
            rooms: (grouped[f._id] || []).sort((a, b) => a.roomNumber.localeCompare(b.roomNumber))
          };
        });

        setFloors(normalized);
      } catch (e: any) {
        if (active) {
          setError(e?.message || 'Failed to load rooms');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadRooms();
    return () => { active = false; };
  }, [roomType, checkInDate, checkOutDate]);

  const handleRoomSelect = (room: any) => {
    // Only allow selection if room is clickable
    if (!room.isClickable) {
      toast({ 
        title: 'Room Not Available', 
        description: room.availabilityMessage || 'This room is not available for the selected dates.',
        variant: 'destructive',
        duration: 3000
      });
      return;
    }
    
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = async (bookingData: any) => {
    console.log('handleBookingSubmit called with:', { 
      isAuthenticated, 
      hasPendingData: !!pendingBookingData, 
      hasSelectedRoom: !!selectedRoom,
      userEmail: user?.email,
      bookingData
    });
    
    if (!isAuthenticated) {
      // Preserve booking data for after authentication
      setPendingBookingData(bookingData);
      setShowLogin(true);
      toast({ 
        title: 'Authentication Required', 
        description: 'Please log in to complete your booking. Your details have been saved.',
        duration: 4000
      });
      return;
    }
    
    // Check if we have a room (either from current selection or from pending data)
    const roomToBook = selectedRoom || (pendingBookingData && pendingBookingData.roomId ? { id: pendingBookingData.roomId } : null);
    
    if (!roomToBook) {
      console.error('No room selected for booking');
      toast({ 
        title: 'Booking Error', 
        description: 'No room selected. Please select a room and try again.',
        variant: 'destructive',
        duration: 5000
      });
      return;
    }
    
    setIsSubmittingBooking(true);
    try {
      // Test authentication before making the request
      console.log('Testing authentication...');
      const authTest = await apiClient.getCurrentUser();
      console.log('Auth test result:', authTest);
      
      if (authTest.status !== 'success') {
        throw new Error('Authentication test failed. Please log in again.');
      }
      
      const payload = {
        roomId: roomToBook.id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guestName: bookingData.guestName,
        email: bookingData.email,
        phone: bookingData.phone,
        purpose: bookingData.purpose || 'personal',
        purposeDetails: bookingData.purposeDetails,
        numberOfGuests: 1,
        paymentOption: 'pay_later'
      } as any;
      
      console.log('Submitting booking with payload:', payload);
      console.log('Payload details:', {
        roomId: payload.roomId,
        checkIn: payload.checkIn,
        checkOut: payload.checkOut,
        checkInDate: new Date(payload.checkIn),
        checkOutDate: new Date(payload.checkOut),
        checkInValid: !isNaN(new Date(payload.checkIn).getTime()),
        checkOutValid: !isNaN(new Date(payload.checkOut).getTime()),
        daysFromNow: Math.ceil((new Date(payload.checkIn).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      });
      
      const res = await apiClient.createBooking(payload);
      if (res.status === 'success') {
        toast({ title: 'Booking confirmed', description: 'Pay at reception to complete payment.' });
        setIsBookingModalOpen(false);
        setSelectedRoom(null);
        setPendingBookingData(null); // Clear pending data
        setAuthError(null); // Clear any auth errors
        // Refresh rooms to reflect new status
        const availabilityParams: any = { 
          type: roomType as any, 
          limit: 1000 
        };
        
        if (checkInDate && checkOutDate) {
          availabilityParams.checkIn = checkInDate;
          availabilityParams.checkOut = checkOutDate;
        }
        
        const availabilityRes = await apiClient.getRoomAvailability(availabilityParams);
        const rooms = availabilityRes.data?.rooms || [];
        const grouped: Record<string, any[]> = {};
        (rooms as ApiRoom[]).forEach((r) => {
          if (!grouped[r.floor]) grouped[r.floor] = [];
          grouped[r.floor].push({
            id: r._id,
            roomNumber: r.roomNumber,
            status: r.status,
            type: r.type,
            pricePerNight: r.pricePerNight,
            floor: r.floor,
            block: r.block,
            isAvailable: (r as any).isAvailable || r.status === 'vacant',
            availabilityMessage: (r as any).availabilityMessage || 'Available'
          });
        });
        setFloors((prev) => prev.map((f) => ({ ...f, rooms: (grouped[f.id] || []) })));
      } else {
        toast({ title: 'Booking failed', description: res.message || 'Please try again', variant: 'destructive' });
      }
    } catch (e: any) {
      console.error('Booking submission failed:', e);
      toast({ title: 'Booking failed', description: e?.message || 'Please try again', variant: 'destructive' });
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header with enhanced styling */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="hover:bg-muted self-start sm:self-center shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
            
            <div className="flex-1 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <div className="flex items-center gap-3">
                  {roomType === 'single' ? (
                    <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center shrink-0">
                      <Bed className="h-5 w-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center shrink-0">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {roomType === 'single' ? 'Single Bed Rooms' : 'Double Bed Rooms'}
                  </h1>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 self-start sm:self-center">
                  ₹{roomType === 'single' ? '1,500' : '2,200'}/night
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base">
                Select a room from the floor layout below. Green rooms are available for booking.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Enhanced Filters */}
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Filter className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-base sm:text-lg">Filter Available Rooms</h3>
                {isAuthenticated && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          await apiClient.refreshAuth();
                          toast({ title: 'Authentication refreshed', description: 'Your session has been updated.' });
                        } catch (error) {
                          toast({ 
                            title: 'Authentication failed', 
                            description: 'Please log in again.',
                            variant: 'destructive'
                          });
                          setShowLogin(true);
                        }
                      }}
                      className="ml-auto"
                    >
                      Refresh Auth
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log('Current state:', {
                          isAuthenticated,
                          user: user?.email,
                          selectedRoom,
                          pendingBookingData,
                          isBookingModalOpen
                        });
                        toast({ title: 'Debug Info', description: 'Check console for current state' });
                      }}
                    >
                      Debug State
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          console.log('Testing authentication...');
                          const authTest = await apiClient.getCurrentUser();
                          console.log('Auth test result:', authTest);
                          toast({ title: 'Auth Test', description: `Status: ${authTest.status}` });
                        } catch (error) {
                          console.error('Auth test failed:', error);
                          toast({ title: 'Auth Test Failed', description: error.message, variant: 'destructive' });
                        }
                      }}
                    >
                      Test Auth
                    </Button>
                  </>
                )}
              </div>
              
              {/* Availability Statistics */}
              {availabilityStats && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700">
                      <strong>{availabilityStats.totalAvailable}</strong> of <strong>{availabilityStats.totalRooms}</strong> rooms available
                    </span>
                    {checkInDate && checkOutDate && (
                      <span className="text-blue-600">
                        for {new Date(checkInDate).toLocaleDateString()} - {new Date(checkOutDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {checkInDate && checkOutDate && (
                    <div className="mt-2 text-xs text-blue-600">
                      <p>• Green rooms: Available for selected dates</p>
                      <p>• Red rooms: Not available for selected dates</p>
                      <p>• Orange rooms: Temporarily held</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkIn" className="flex items-center gap-2 text-sm sm:text-base">
                    <Calendar className="h-4 w-4" />
                    Check-in Date
                  </Label>
                  <Input
                    id="checkIn"
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOut" className="text-sm sm:text-base">Check-out Date</Label>
                  <Input
                    id="checkOut"
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate || new Date().toISOString().split('T')[0]}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Floor Tabs and Room Grid */}
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-sm">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold mb-2">Select Floor & Room</h3>
                <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-room-vacant"></div>
                    Available
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-room-booked"></div>
                    Booked
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-room-held"></div>
                    Temporarily Held
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gray-300"></div>
                    Not Available for Selected Dates
                  </span>
                </div>
              </div>
              
              {error && (
                <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}
              
              {authError && (
                <div className="text-orange-600 text-sm mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span>{authError}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAuthError(null)}
                      className="text-orange-600 border-orange-200 hover:bg-orange-100"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              )}
              
              {loading && (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  Loading rooms...
                </div>
              )}
              <FloorTabs floors={floors}>
                {(floor) => (
                  <div className="animate-fade-in">
                    <div className="mb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                        <h4 className="font-medium text-foreground text-sm sm:text-base">
                          {floor.name} - Block {floor.block}
                        </h4>
                        {floor.facilities && floor.facilities.length > 0 && (
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs self-start sm:self-center">
                            {floor.facilities.join(', ')}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {checkInDate && checkOutDate 
                          ? `${floor.rooms.filter(r => r.isClickable).length} of ${floor.rooms.length} rooms available for selected dates`
                          : `${floor.rooms.filter(r => r.status === 'vacant').length} of ${floor.rooms.length} rooms currently available`
                        }
                      </p>
                    </div>
                    
                    <RoomGrid 
                      rooms={floor.rooms} 
                      onRoomSelect={handleRoomSelect}
                    />
                    
                    {floor.rooms.length === 0 && (
                      <div className="text-center py-8 sm:py-12 text-muted-foreground">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                          {roomType === 'single' ? 
                            <Bed className="h-6 w-6 sm:h-8 sm:w-8" /> : 
                            <Users className="h-6 w-6 sm:h-8 sm:w-8" />
                          }
                        </div>
                        <p className="text-sm sm:text-base">No {roomType} rooms available on this floor</p>
                      </div>
                    )}
                  </div>
                )}
              </FloorTabs>
            </div>
          </div>

          {/* AI Chat Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ChatPanel className="h-[500px] sm:h-[600px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedRoom(null);
          setPendingBookingData(null); // Clear pending data when modal is closed
        }}
        room={selectedRoom}
        onBookingSubmit={handleBookingSubmit}
        initialData={pendingBookingData} // Pass pending data to restore form
        isSubmitting={isSubmittingBooking}
      />

      {/* Auth modals inline to gate booking flow */}
      {/* Login modal triggers booking flow again on success */}
      <LoginModal 
        isOpen={showLogin}
        onClose={() => {
          setShowLogin(false);
          setPendingBookingData(null); // Clear pending data if user cancels
        }}
        onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
        onSuccess={async () => {
          setShowLogin(false);
          console.log('Login successful, pending data:', pendingBookingData);
          // If there's pending booking data, submit it automatically
          if (pendingBookingData && selectedRoom) {
            toast({ 
              title: 'Welcome back!', 
              description: 'Submitting your booking now...',
              duration: 2000
            });
            
            // Add a small delay to ensure authentication state is fully synchronized
            setTimeout(async () => {
              try {
                console.log('Attempting post-login booking with data:', pendingBookingData);
                await handleBookingSubmit(pendingBookingData);
              } catch (error) {
                console.error('Post-login booking failed:', error);
                toast({ 
                  title: 'Booking failed', 
                  description: 'Please try booking again. You have been logged in successfully.',
                  variant: 'destructive',
                  duration: 5000
                });
                // Reopen booking modal for manual retry
                setIsBookingModalOpen(true);
              }
            }, 500);
          } else if (!isBookingModalOpen && selectedRoom) {
            // Fallback: reopen booking modal if no pending data
            setIsBookingModalOpen(true);
          }
        }}
      />
      <RegisterModal 
        isOpen={showRegister}
        onClose={() => {
          setShowRegister(false);
          setPendingBookingData(null); // Clear pending data if user cancels
        }}
        onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
        onSuccess={async () => {
          setShowRegister(false);
          console.log('Registration successful, pending data:', pendingBookingData);
          // If there's pending booking data, submit it automatically
          if (pendingBookingData && selectedRoom) {
            toast({ 
              title: 'Welcome!', 
              description: 'Submitting your booking now...',
              duration: 2000
            });
            
            // Add a small delay to ensure authentication state is fully synchronized
            setTimeout(async () => {
              try {
                console.log('Attempting post-registration booking with data:', pendingBookingData);
                await handleBookingSubmit(pendingBookingData);
              } catch (error) {
                console.error('Post-registration booking failed:', error);
                toast({ 
                  title: 'Booking failed', 
                  description: 'Please try booking again. Your account has been created successfully.',
                  variant: 'destructive',
                  duration: 5000
                });
                // Reopen booking modal for manual retry
                setIsBookingModalOpen(true);
              }
            }, 500);
          } else if (!isBookingModalOpen && selectedRoom) {
            // Fallback: reopen booking modal if no pending data
            setIsBookingModalOpen(true);
          }
        }}
      />
    </div>
  );
};

export default RoomsPage;