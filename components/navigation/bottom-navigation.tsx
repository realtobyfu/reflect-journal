'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Feather, BookOpen, Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  default?: boolean;
}

const NavigationStructure: NavItem[] = [
  { id: 'today', icon: Feather, label: 'Today', path: '/dashboard', default: true },
  { id: 'entries', icon: BookOpen, label: 'Entries', path: '/dashboard/entries' },
  { id: 'insights', icon: Sparkles, label: 'Insights', path: '/dashboard/insights' },
  { id: 'profile', icon: User, label: 'You', path: '/dashboard/settings' }
];

interface NavItemProps extends NavItem {
  active: boolean;
  onClick: () => void;
  emotionalHighlight?: string;
}

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  active,
  onClick,
  emotionalHighlight
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-normal',
        'hover:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-primary/20',
        active ? 'text-primary-intense bg-primary-calm' : 'text-muted-foreground hover:text-primary'
      )}
      aria-label={label}
    >
      <Icon 
        className={cn(
          'w-5 h-5 transition-all duration-normal',
          active ? 'scale-110' : 'scale-100'
        )} 
      />
      <span className={cn(
        'text-xs font-medium transition-all duration-normal',
        active ? 'opacity-100' : 'opacity-75'
      )}>
        {label}
      </span>
    </button>
  );
};

export const BottomNavigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Determine active item based on current path
  const getActiveId = () => {
    const activeItem = NavigationStructure.find(item => 
      pathname === item.path || pathname.startsWith(item.path + '/')
    );
    return activeItem?.id || 'today';
  };

  const [active, setActive] = useState(getActiveId());

  const handleNavigation = (item: NavItem) => {
    setActive(item.id);
    router.push(item.path);
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-lg border-t border-border"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-around items-center h-16 px-4 max-w-md mx-auto">
        {NavigationStructure.map((item) => (
          <NavItem
            key={item.id}
            {...item}
            active={active === item.id}
            onClick={() => handleNavigation(item)}
          />
        ))}
      </div>
    </nav>
  );
};