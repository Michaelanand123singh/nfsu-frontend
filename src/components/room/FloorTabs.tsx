import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Floor {
  id: string;
  name: string;
  block: string;
  rooms: any[];
  facilities?: string[];
}

interface FloorTabsProps {
  floors: Floor[];
  children: (floor: Floor) => React.ReactNode;
  defaultFloor?: string;
  className?: string;
  showRoomCount?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export const FloorTabs = ({ 
  floors, 
  children, 
  defaultFloor, 
  className,
  showRoomCount = true,
  orientation = 'horizontal'
}: FloorTabsProps) => {
  if (!floors || floors.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No floors available</p>
      </div>
    );
  }

  // Dynamic grid columns based on floor count
  const getGridCols = () => {
    const count = floors.length;
    if (count <= 2) return 'grid-cols-1 sm:grid-cols-2';
    if (count <= 3) return 'grid-cols-2 sm:grid-cols-3';
    if (count <= 4) return 'grid-cols-2 sm:grid-cols-4';
    if (count <= 6) return 'grid-cols-3 sm:grid-cols-6';
    return 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6';
  };

  const getRoomStats = (floor: Floor) => {
    const total = floor.rooms.length;
    const vacant = floor.rooms.filter(room => room.status === 'vacant').length;
    const booked = floor.rooms.filter(room => room.status === 'booked').length;
    const held = floor.rooms.filter(room => room.status === 'held').length;
    
    return { total, vacant, booked, held };
  };

  return (
    <div className={cn("w-full", className)}>
      <Tabs 
        defaultValue={defaultFloor || floors[0]?.id} 
        className="w-full"
        orientation={orientation}
      >
        {/* Tab List with Responsive Design */}
        <div className="w-full">
          {floors.length > 6 ? (
            // Scrollable tabs for many floors
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="inline-flex w-auto bg-muted/50 p-1">
                {floors.map((floor) => {
                  const stats = getRoomStats(floor);
                  return (
                    <TabsTrigger 
                      key={floor.id} 
                      value={floor.id}
                      className="flex flex-col items-center gap-1 py-3 px-4 min-w-[120px] data-[state=active]:bg-background"
                    >
                      <span className="font-medium text-sm">Floor {floor.name}</span>
                      <span className="text-xs text-muted-foreground">Block {floor.block}</span>
                      
                      {showRoomCount && (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-green-600 font-medium">{stats.vacant}</span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-muted-foreground">{stats.total}</span>
                        </div>
                      )}
                      
                      {floor.facilities && floor.facilities.length > 0 && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5 truncate max-w-[80px]">
                          {floor.facilities[0]}
                        </Badge>
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : (
            // Grid layout for fewer floors
            <TabsList className={cn("grid w-full bg-muted/50 h-auto", getGridCols())}>
              {floors.map((floor) => {
                const stats = getRoomStats(floor);
                return (
                  <TabsTrigger 
                    key={floor.id} 
                    value={floor.id}
                    className="flex flex-col items-center gap-1 py-3 px-2 h-auto min-h-[80px] data-[state=active]:bg-background"
                  >
                    <span className="font-medium text-sm text-center">Floor {floor.name}</span>
                    <span className="text-xs text-muted-foreground">Block {floor.block}</span>
                    
                    {showRoomCount && (
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-green-600 font-medium">{stats.vacant}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-muted-foreground">{stats.total}</span>
                      </div>
                    )}
                    
                    {floor.facilities && floor.facilities.length > 0 && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5 truncate max-w-[60px] sm:max-w-[80px]">
                        {floor.facilities[0]}
                      </Badge>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          )}
        </div>
        
        {/* Tab Content */}
        {floors.map((floor) => {
          const stats = getRoomStats(floor);
          return (
            <TabsContent 
              key={floor.id} 
              value={floor.id} 
              className="mt-4 sm:mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
            >
              <div className="space-y-4">
                {/* Floor Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                      Floor {floor.name} - Block {floor.block}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>Total: {stats.total} rooms</span>
                      <span className="text-green-600 font-medium">Available: {stats.vacant}</span>
                      <span className="text-red-600">Booked: {stats.booked}</span>
                      {stats.held > 0 && (
                        <span className="text-yellow-600">Held: {stats.held}</span>
                      )}
                    </div>
                  </div>
                  
                  {floor.facilities && floor.facilities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {floor.facilities.map((facility) => (
                        <Badge key={facility} variant="outline" className="text-xs">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Floor Content */}
                <div className="animate-fade-in">
                  {children(floor)}
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};