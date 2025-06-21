// @ts-nocheck
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { apiClient, User } from '@/lib/api-client';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { first_name?: string; last_name?: string; email?: string; username?: string; password?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/login', '/register'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log('🔥 Setting up Firebase auth listener...');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔥 Firebase auth state changed:', { firebaseUser: !!firebaseUser, email: firebaseUser?.email });
      if (firebaseUser) {
        try {
          console.log('👤 Getting ID token...');
          const idToken = await firebaseUser.getIdToken(true);
          apiClient.setToken(idToken);

          console.log('🌐 Fetching user data from backend...');
          const userData = await apiClient.getMe();
          console.log('✅ Backend user data received:', userData);

          setUser(userData);
        } catch (error) {
          console.error('❌ Failed to authenticate with backend:', error);
          await firebaseSignOut(auth);
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('👤 No Firebase user, clearing state...');
        setUser(null);
        apiClient.setToken(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('🧭 Routing check triggered.', { loading, user: !!user, pathname, isRedirecting });

    if (loading || isRedirecting) {
      console.log('⏳ Auth state is loading or redirecting. No action needed.');
      return;
    }

    const userIsAuthenticated = !!user;
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.includes(pathname);
    console.log('🧭 Routing conditions:', { userIsAuthenticated, isProtectedRoute, isAuthRoute });

    if (!userIsAuthenticated && isProtectedRoute) {
      console.log(`🔒 Redirecting unauthenticated user from protected route '${pathname}' to '/login'.`);
      setIsRedirecting(true);
      router.push('/login');
      setTimeout(() => setIsRedirecting(false), 1000);
      return;
    }

    if (userIsAuthenticated && isAuthRoute) {
      console.log(`✅ Redirecting authenticated user from auth route '${pathname}' to '/dashboard'.`);
      setIsRedirecting(true);
      router.push('/dashboard');
      setTimeout(() => setIsRedirecting(false), 1000);
      return;
    }

    console.log('🧭 No redirect needed.');
  }, [user, loading, pathname, router, isRedirecting]);

  const login = async (email: string, password: string) => {
    console.log('🔐 Starting login process...');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase login successful:', userCredential.user.email);
      // onAuthStateChanged and routing effect handle the redirect
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, firstName?: string, lastName?: string) => {
    console.log('📝 Starting registration process...');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase registration successful:', userCredential.user.email);
      // Persist user details to backend
      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken(true);
      apiClient.setToken(idToken);
      await apiClient.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email,
          username: email.split('@')[0],
          password,
          first_name: firstName,
          last_name: lastName,
          firebase_uid: firebaseUser.uid
        })
      });
      console.log('✅ Backend registration successful');
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('👋 Starting logout process...');
    try {
      await firebaseSignOut(auth);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      throw error;
    }
  };

  const updateProfile = async (data: { first_name?: string; last_name?: string; email?: string; username?: string; password?: string }) => {
    if (!user) {
      throw new Error('Not authenticated');
    }
    try {
      const updatedUser = await apiClient.updateMe(data);
      setUser(updatedUser);
    } catch (error) {
      console.error('❌ Update profile failed:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
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