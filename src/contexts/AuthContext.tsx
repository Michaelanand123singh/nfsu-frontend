import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          const response = await apiClient.getCurrentUser();
          if (response.status === 'success' && response.data?.user) {
            setUser(response.data.user);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid token
        apiClient.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password });
      if (response.status === 'success' && response.data?.user) {
        // Ensure token is set in API client before updating user state
        if (response.data?.token) {
          apiClient.setToken(response.data.token);
        }
        // Refresh authentication state to ensure proper synchronization
        await apiClient.refreshAuth();
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await apiClient.register(userData);
      if (response.status === 'success' && response.data?.user) {
        // Ensure token is set in API client before updating user state
        if (response.data?.token) {
          apiClient.setToken(response.data.token);
        }
        // Refresh authentication state to ensure proper synchronization
        await apiClient.refreshAuth();
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      const response = await apiClient.updateProfile(updates);
      if (response.status === 'success' && response.data?.user) {
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
