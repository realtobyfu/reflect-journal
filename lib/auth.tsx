// @ts-nocheck
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, User } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const token = apiClient.getToken();
      if (token) {
        try {
          const userData = await apiClient.getMe();
          setUser(userData);
        } catch (error) {
          apiClient.setToken(null);
        }
      }
      setLoading(false);
    };
    
    loadUser();
  }, []);

  const login = async (username: string, password: string) => {
    const { access_token } = await apiClient.login(username, password);
    apiClient.setToken(access_token);
    const userData = await apiClient.getMe();
    setUser(userData);
    router.push('/dashboard');
  };

  const register = async (email: string, username: string, password: string) => {
    await apiClient.register({ email, username, password });
    await login(username, password);
  };

  const logout = () => {
    apiClient.setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 