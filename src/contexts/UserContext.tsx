import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
  activate: boolean;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      // Skip fetching user data if we're on the login page or there's no auth token
      if (location.pathname === '/login' || !localStorage.getItem('authToken')) {
        setLoading(false);
        return;
      }

      try {
        const userData = await apiService.users.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          if (location.pathname !== '/login') {
            navigate('/login', { replace: true });
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, location.pathname]);

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 