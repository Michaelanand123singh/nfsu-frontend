import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Bed, Users, Calendar, Shield, Star, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoomTypeModal } from "@/components/booking/RoomTypeModal";
import { getRoomStats } from "@/data/mockData";
import campusHero from "@/assets/campus-hero.jpg";

const Index = () => {
  const [isRoomTypeModalOpen, setIsRoomTypeModalOpen] = useState(false);
  const navigate = useNavigate();
  const roomStats = getRoomStats();

  return (
    <div className="min-h-screen bg-background">      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${campusHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/50" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
          <div className="max-w-4xl">
            <Badge className="mb-4 sm:mb-6 bg-primary/10 text-primary border-primary/20 text-sm inline-flex items-center gap-1">
              <Star className="h-3 w-3" />
              National Forensic Sciences University
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 animate-fade-in leading-tight">
              NFSU Guest House
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 animate-fade-in leading-relaxed max-w-3xl" style={{ animationDelay: '0.2s' }}>
              Experience comfortable accommodation in our modern guest house. 
              Perfect for academic visits, conferences, and research stays at Gujarat's premier forensic sciences university.
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 sm:gap-6 mb-6 sm:mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/50 rounded-full px-3 py-2">
                <Bed className="h-4 w-4" />
                <span>{roomStats.single.total + roomStats.double.total} Total Rooms</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/50 rounded-full px-3 py-2">
                <Users className="h-4 w-4" />
                <span>{roomStats.single.vacant + roomStats.double.vacant} Available</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/50 rounded-full px-3 py-2">
                <MapPin className="h-4 w-4" />
                <span>Gandhinagar, Gujarat</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button 
                size="lg" 
                className="bg-gradient-hero hover:opacity-90 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setIsRoomTypeModalOpen(true)}
              >
                Book Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300"
              >
                View Facilities
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Room Type Cards */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">Choose Your Room</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Select from our comfortable single or double occupancy rooms, 
              all equipped with modern amenities for your stay.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Single Rooms Card */}
            <Card className="group hover:shadow-card transition-all duration-300 cursor-pointer animate-scale-in border-2 hover:border-primary/20 overflow-hidden">
              <CardHeader className="text-center pb-4 sm:pb-6">
                <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-gradient-hero rounded-full flex items-center justify-center mb-4 group-hover:animate-pulse-glow transition-transform group-hover:scale-105">
                  <Bed className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">Single Bed Rooms</CardTitle>
                <p className="text-sm text-muted-foreground">Perfect for solo travelers</p>
              </CardHeader>
              <CardContent className="text-center space-y-4 pt-0">
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  {roomStats.single.vacant} Available
                </div>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Out of {roomStats.single.total} total rooms
                </p>
                
                {/* Availability Indicator */}
                <div className="w-full bg-muted rounded-full h-2 mb-4">
                  <div 
                    className="bg-room-vacant h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(roomStats.single.vacant / roomStats.single.total) * 100}%` }}
                  />
                </div>
                
                <div className="flex justify-center gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
                  <Badge variant="outline" className="bg-room-vacant/10 text-room-vacant border-room-vacant/20">
                    {roomStats.single.vacant} Vacant
                  </Badge>
                  <Badge variant="outline" className="bg-room-booked/10 text-room-booked border-room-booked/20">
                    {roomStats.single.booked} Booked
                  </Badge>
                  {roomStats.single.held > 0 && (
                    <Badge variant="outline" className="bg-room-held/10 text-room-held border-room-held/20">
                      {roomStats.single.held} Held
                    </Badge>
                  )}
                </div>
                
                <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                  <p>Includes: Free WiFi, AC, Attached Bathroom</p>
                </div>
                
                <p className="text-xl sm:text-2xl font-semibold text-foreground">₹1,500<span className="text-sm font-normal text-muted-foreground">/night</span></p>
                <Button 
                  className="w-full mt-4 sm:mt-6 py-2 sm:py-3 text-sm sm:text-base group-hover:scale-105 transition-transform" 
                  onClick={() => navigate('/rooms/single')}
                >
                  View Single Rooms
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Double Rooms Card */}
            <Card className="group hover:shadow-card transition-all duration-300 cursor-pointer animate-scale-in border-2 hover:border-primary/20 overflow-hidden" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="text-center pb-4 sm:pb-6">
                <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-gradient-hero rounded-full flex items-center justify-center mb-4 group-hover:animate-pulse-glow transition-transform group-hover:scale-105">
                  <Users className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">Double Bed Rooms</CardTitle>
                <p className="text-sm text-muted-foreground">Ideal for sharing or couples</p>
              </CardHeader>
              <CardContent className="text-center space-y-4 pt-0">
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  {roomStats.double.vacant} Available
                </div>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Out of {roomStats.double.total} total rooms
                </p>
                
                {/* Availability Indicator */}
                <div className="w-full bg-muted rounded-full h-2 mb-4">
                  <div 
                    className="bg-room-vacant h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(roomStats.double.vacant / roomStats.double.total) * 100}%` }}
                  />
                </div>
                
                <div className="flex justify-center gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
                  <Badge variant="outline" className="bg-room-vacant/10 text-room-vacant border-room-vacant/20">
                    {roomStats.double.vacant} Vacant
                  </Badge>
                  <Badge variant="outline" className="bg-room-booked/10 text-room-booked border-room-booked/20">
                    {roomStats.double.booked} Booked
                  </Badge>
                  {roomStats.double.held > 0 && (
                    <Badge variant="outline" className="bg-room-held/10 text-room-held border-room-held/20">
                      {roomStats.double.held} Held
                    </Badge>
                  )}
                </div>
                
                <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                  <p>Includes: Free WiFi, AC, Attached Bathroom, Mini Fridge</p>
                </div>
                
                <p className="text-xl sm:text-2xl font-semibold text-foreground">₹2,200<span className="text-sm font-normal text-muted-foreground">/night</span></p>
                <Button 
                  className="w-full mt-4 sm:mt-6 py-2 sm:py-3 text-sm sm:text-base group-hover:scale-105 transition-transform" 
                  onClick={() => navigate('/rooms/double')}
                >
                  View Double Rooms
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-foreground mb-8 sm:mb-12">Why Choose NFSU Guest House?</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="text-center animate-fade-in p-4 sm:p-6 bg-background/50 rounded-xl hover:bg-background/80 transition-all duration-300">
              <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-105">
                <Calendar className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Easy Booking</h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Simple online booking system with real-time availability and instant confirmation.
              </p>
            </div>
            
            <div className="text-center animate-fade-in p-4 sm:p-6 bg-background/50 rounded-xl hover:bg-background/80 transition-all duration-300" style={{ animationDelay: '0.2s' }}>
              <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-105">
                <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Secure Payments</h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Safe and secure payment processing with multiple payment options available.
              </p>
            </div>
            
            <div className="text-center animate-fade-in p-4 sm:p-6 bg-background/50 rounded-xl hover:bg-background/80 transition-all duration-300 sm:col-span-2 lg:col-span-1" style={{ animationDelay: '0.4s' }}>
              <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-105">
                <Users className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">24/7 Support</h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Round-the-clock assistance to help you with your stay and any questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Need assistance or have questions? Our team is here to help you 24/7.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-4">
              <div className="mx-auto w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center mb-3">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-1">Phone</h3>
              <p className="text-primary-foreground/80 text-sm">+91 79 2397 5000</p>
            </div>
            
            <div className="text-center p-4">
              <div className="mx-auto w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center mb-3">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-primary-foreground/80 text-sm">guesthouse@nfsu.ac.in</p>
            </div>
            
            <div className="text-center p-4 sm:col-span-2 lg:col-span-1">
              <div className="mx-auto w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center mb-3">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-1">Address</h3>
              <p className="text-primary-foreground/80 text-sm">Sector 9, Gandhinagar<br/>Gujarat 382007</p>
            </div>
          </div>
        </div>
      </section>

      {/* Room Type Selection Modal */}
      <RoomTypeModal 
        isOpen={isRoomTypeModalOpen} 
        onClose={() => setIsRoomTypeModalOpen(false)} 
      />
    </div>
  );
};

export default Index;