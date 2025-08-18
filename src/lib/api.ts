const API_BASE_URL = 'https://nfsu-college-frontend.onrender.com/api';

// Types for API responses
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: any[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin' | 'staff';
  isActive: boolean;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences?: {
    roomType: 'single' | 'double' | 'any';
    floor: '1' | '2' | '3' | '4' | '5' | '6' | 'any';
    block: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'any';
  };
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  _id: string;
  roomNumber: string;
  type: 'single' | 'double';
  status: 'vacant' | 'booked' | 'held' | 'maintenance';
  floor: string;
  block: string;
  pricePerNight: number;
  facilities?: string[];
  description?: string;
  images?: string[];
  amenities?: Array<{
    name: string;
    available: boolean;
  }>;
  isActive: boolean;
  lastCleaned?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  user: string | User;
  room: string | Room;
  checkIn: string;
  checkOut: string;
  guestName: string;
  email: string;
  phone: string;
  purpose: 'academic' | 'business' | 'personal' | 'other';
  numberOfGuests: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer';
  specialRequests?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledBy?: string | User;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export interface BookingData {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  email: string;
  phone: string;
  purpose: 'academic' | 'business' | 'personal' | 'other';
  purposeDetails?: string;
  numberOfGuests: number;
  specialRequests?: string;
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null;
  private isLoggingOut: boolean;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
    this.isLoggingOut = false;
  }

  private clearAuth() {
    this.token = null;
    try { localStorage.removeItem('authToken'); } catch {}
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    console.log('API Request:', {
      url,
      method: options.method || 'GET',
      headers,
      hasToken: !!this.token,
      tokenLength: this.token?.length || 0
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        data
      });

      if (!response.ok) {
        // Handle authentication errors without recursive logout loops
        if (response.status === 401) {
          console.error('Authentication error:', data.message || 'Unauthorized');
          this.clearAuth();
          throw new Error('Authentication failed. Please log in again.');
        }
        
        if (response.status === 403) {
          throw new Error('Access denied. You do not have permission to perform this action.');
        }
        
        if (response.status === 400) {
          // Show specific validation errors if available
          if (data.errors && Array.isArray(data.errors)) {
            const errorMessages = data.errors.map((err: any) => `${err.path}: ${err.msg}`).join(', ');
            throw new Error(`Validation failed: ${errorMessages}`);
          }
          throw new Error(data.message || 'Invalid request. Please check your input.');
        }
        
        if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('authToken', this.token);
      // Ensure immediate synchronization
      this.setToken(response.data.token);
    }

    return response;
  }

  async register(userData: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('authToken', this.token);
      // Ensure immediate synchronization
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    if (this.isLoggingOut) return;
    this.isLoggingOut = true;
    try {
      // Use native fetch to avoid 401 recursion; ignore errors
      await fetch(`${this.baseURL}/auth/logout`, {
        method: 'POST',
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : undefined,
      }).catch(() => undefined);
    } finally {
      this.clearAuth();
      this.isLoggingOut = false;
    }
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/me');
  }

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Room methods
  async getRooms(params?: {
    type?: 'single' | 'double';
    status?: 'vacant' | 'booked' | 'held' | 'maintenance';
    floor?: string;
    block?: string;
    minPrice?: number;
    maxPrice?: number;
    facilities?: string;
    checkIn?: string;
    checkOut?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ rooms: Room[]; pagination: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/rooms${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ rooms: Room[]; pagination: any }>(endpoint);
  }

  async getRoomStats(): Promise<ApiResponse<{ stats: any[]; summary: any }>> {
    return this.request<{ stats: any[]; summary: any }>('/rooms/stats');
  }

  async getFloorData(): Promise<ApiResponse<{ floors: any[] }>> {
    return this.request<{ floors: any[] }>('/rooms/floors');
  }

  async getRoom(id: string): Promise<ApiResponse<{ room: Room }>> {
    return this.request<{ room: Room }>(`/rooms/${id}`);
  }

  async getRoomAvailability(params?: {
    type?: 'single' | 'double';
    floor?: string;
    block?: string;
    checkIn?: string;
    checkOut?: string;
    limit?: number;
  }): Promise<ApiResponse<{ rooms: Room[]; totalAvailable: number; totalRooms: number; searchDates?: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/rooms/availability${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ rooms: Room[]; totalAvailable: number; totalRooms: number; searchDates?: any }>(endpoint);
  }

  // Booking methods
  async createBooking(bookingData: BookingData): Promise<ApiResponse<{ booking: Booking }>> {
    // Ensure token is valid before making authenticated request
    await this.ensureValidToken();
    
    return this.request<{ booking: Booking }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getBookings(params?: {
    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ bookings: Booking[]; pagination: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/bookings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ bookings: Booking[]; pagination: any }>(endpoint);
  }

  async getBooking(id: string): Promise<ApiResponse<{ booking: Booking }>> {
    return this.request<{ booking: Booking }>(`/bookings/${id}`);
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<ApiResponse<{ booking: Booking }>> {
    return this.request<{ booking: Booking }>(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async cancelBooking(id: string, reason?: string): Promise<ApiResponse> {
    return this.request(`/bookings/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason }),
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Verify token is valid and set
  async verifyToken(): Promise<boolean> {
    if (!this.token) return false;
    
    try {
      const response = await this.request('/auth/me');
      return response.status === 'success';
    } catch (error) {
      console.error('Token verification failed:', error);
      this.clearAuth();
      return false;
    }
  }

  // Ensure token is valid before making authenticated requests
  private async ensureValidToken(): Promise<void> {
    if (!this.token) {
      throw new Error('No authentication token available');
    }
    
    // Simple token existence check - don't make an API call here
    // The actual API call will handle authentication errors
  }

  // Refresh authentication state
  async refreshAuth(): Promise<void> {
    if (!this.token) return;
    
    try {
      const response = await this.request('/auth/me');
      if (response.status !== 'success') {
        throw new Error('Failed to refresh authentication');
      }
    } catch (error) {
      console.error('Failed to refresh authentication:', error);
      this.clearAuth();
      throw error;
    }
  }

  // Check if backend is accessible
  async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
