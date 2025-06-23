'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Home, BookOpen, BarChart3, Sparkles, Settings, LogOut, PenSquare, Search, Feather } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection?: 'today' | 'entries' | 'insights' | 'themes';
}

export function DashboardLayout({ children, activeSection = 'today' }: DashboardLayoutProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const navigation = [
    { name: 'Today', href: '/dashboard', icon: Home, id: 'today' },
    { name: 'Entries', href: '/dashboard/entries', icon: BookOpen, id: 'entries' },
    { name: 'Insights', href: '/dashboard/insights', icon: BarChart3, id: 'insights' },
    { name: 'Themes', href: '/dashboard/themes', icon: Sparkles, id: 'themes' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-1.5">
            <Feather className="w-5 h-5 text-primary-500" />
            <h1 className="text-lg font-semibold text-neutral-900">Reflect</h1>
          </div>
          <Link
            href="/dashboard/entries/new"
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <PenSquare className="w-5 h-5 text-primary-600" />
          </Link>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-neutral-200 transition-transform duration-300",
          "md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-5 border-b border-neutral-100">
          <div className="flex items-center gap-2 mb-2">
            <Feather className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-slate-900">Reflect</h1>
          </div>
            <p className="text-sm text-slate-600">Your daily mindfulness companion</p>
            {user && (
              <p className="text-xs text-neutral-500 mt-1">
                Welcome back, {user.displayName || user.email?.split('@')[0] || 'User'}
              </p>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  activeSection === item.id
                    ? "bg-primary-50 text-primary-700 shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="px-4 py-4 border-t border-neutral-100">
            <Link
              href="/dashboard/entries/new"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
            >
              <PenSquare className="w-4 h-4" />
              New Entry
            </Link>
          </div>

          {/* User Menu */}
          <div className="px-4 py-4 border-t border-neutral-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {user?.displayName || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-1">
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300",
        "md:ml-64",
        isMobile && isSidebarOpen && "blur-sm"
      )}>
        {children}
      </main>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}