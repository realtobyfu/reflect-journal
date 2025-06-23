'use client';

import { Search, Feather, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuickEntryButtonProps {
  className?: string;
}

const QuickEntryButton: React.FC<QuickEntryButtonProps> = ({ className }) => {
  const handleQuickEntry = () => {
    // TODO: Open quick entry modal or navigate to entry creation
    console.log('Quick entry triggered');
  };

  return (
    <Button
      onClick={handleQuickEntry}
      size="sm"
      className={cn(
        'bg-primary-neutral hover:bg-primary-intense text-primary-foreground',
        'rounded-full w-10 h-10 p-0 shadow-lg',
        'transition-all duration-normal hover:scale-105',
        className
      )}
      aria-label="Create new entry"
    >
      <Plus className="w-5 h-5" />
    </Button>
  );
};

interface ResponsiveHeaderProps {
  title?: string;
  showSearch?: boolean;
  showQuickEntry?: boolean;
  className?: string;
}

export const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
  title = 'Reflect',
  showSearch = true,
  showQuickEntry = true,
  className
}) => {
  const handleSearch = () => {
    // TODO: Open search modal
    console.log('Search triggered');
  };

  return (
    <header 
      className={cn(
        'sticky top-0 z-40 bg-surface/80 backdrop-blur-lg border-b border-border',
        className
      )}
    >
      <div className="flex items-center justify-between h-14 px-4 max-w-4xl mx-auto">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <Feather className="w-6 h-6 text-primary-neutral" />
          <h1 className="font-semibold text-lg text-foreground">
            {title}
          </h1>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {showSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSearch}
              className="p-2 hover:bg-surface-dark transition-colors duration-normal"
              aria-label="Search entries"
            >
              <Search className="w-5 h-5" />
            </Button>
          )}
          
          {showQuickEntry && <QuickEntryButton />}
        </div>
      </div>
    </header>
  );
};