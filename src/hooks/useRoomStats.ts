import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface RoomStats {
  single: {
    total: number;
    vacant: number;
    booked: number;
    held: number;
    maintenance: number;
  };
  double: {
    total: number;
    vacant: number;
    booked: number;
    held: number;
    maintenance: number;
  };
  summary: {
    totalRooms: number;
    availableRooms: number;
    occupancyRate: string;
  };
}

interface UseRoomStatsReturn {
  roomStats: RoomStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useRoomStats = (): UseRoomStatsReturn => {
  const [roomStats, setRoomStats] = useState<RoomStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoomStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getRoomStats();
      
      if (response.status === 'success' && response.data) {
        const { stats, summary } = response.data;
        
        // Process the stats array into the expected format
        const singleStats = stats.find((stat: any) => stat._id === 'single') || {
          total: 0, vacant: 0, booked: 0, held: 0, maintenance: 0
        };
        
        const doubleStats = stats.find((stat: any) => stat._id === 'double') || {
          total: 0, vacant: 0, booked: 0, held: 0, maintenance: 0
        };

        const formattedStats: RoomStats = {
          single: {
            total: singleStats.total || 0,
            vacant: singleStats.vacant || 0,
            booked: singleStats.booked || 0,
            held: singleStats.held || 0,
            maintenance: singleStats.maintenance || 0,
          },
          double: {
            total: doubleStats.total || 0,
            vacant: doubleStats.vacant || 0,
            booked: doubleStats.booked || 0,
            held: doubleStats.held || 0,
            maintenance: doubleStats.maintenance || 0,
          },
          summary: {
            totalRooms: summary.totalRooms || 0,
            availableRooms: summary.availableRooms || 0,
            occupancyRate: summary.occupancyRate || '0',
          }
        };

        setRoomStats(formattedStats);
      } else {
        throw new Error('Failed to fetch room stats');
      }
    } catch (err) {
      console.error('Error fetching room stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch room statistics');
      
      // Fallback to default stats if API fails
      setRoomStats({
        single: { total: 0, vacant: 0, booked: 0, held: 0, maintenance: 0 },
        double: { total: 0, vacant: 0, booked: 0, held: 0, maintenance: 0 },
        summary: { totalRooms: 0, availableRooms: 0, occupancyRate: '0' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomStats();
  }, []);

  return {
    roomStats,
    loading,
    error,
    refetch: fetchRoomStats,
  };
};
