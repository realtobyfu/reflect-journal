'use client';

import { ReactNode } from 'react';
import { ResponsiveHeader } from '@/components/navigation/responsive-header';
import { BottomNavigation } from '@/components/navigation/bottom-navigation';

interface MobileDashboardLayoutProps {
  children: ReactNode;
  title?: string;
  showSearch?: boolean;
  showQuickEntry?: boolean;
}

export const MobileDashboardLayout: React.FC<MobileDashboardLayoutProps> = ({
  children,
  title,
  showSearch = true,
  showQuickEntry = true
}) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Responsive Header */}
      <ResponsiveHeader 
        title={title}
        showSearch={showSearch}
        showQuickEntry={showQuickEntry}
      />
      
      {/* Main Content Area */}
      <main className="pb-20 px-4 pt-4 max-w-4xl mx-auto">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};