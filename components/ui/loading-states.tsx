'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { animationPresets } from '@/lib/micro-interactions';

// Entry Skeleton Component
export const EntrySkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-surface rounded-xl p-4 animate-pulse', className)}>
    <div className="h-4 bg-surface-dark rounded w-24 mb-3" />
    <div className="space-y-2">
      <div className="h-4 bg-surface-dark rounded w-full" />
      <div className="h-4 bg-surface-dark rounded w-4/5" />
      <div className="h-4 bg-surface-dark rounded w-3/4" />
    </div>
  </div>
);

// Insight Skeleton Component
export const InsightSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-surface rounded-xl p-6 animate-pulse', className)}>
    <div className="flex items-start gap-4 mb-4">
      <div className="w-10 h-10 bg-surface-dark rounded-lg" />
      <div className="flex-1">
        <div className="h-5 bg-surface-dark rounded w-3/4 mb-2" />
        <div className="h-3 bg-surface-dark rounded w-1/2" />
      </div>
    </div>
    <div className="h-8 bg-surface-dark rounded w-1/3 mb-4" />
    <div className="h-16 bg-surface-dark rounded w-full" />
  </div>
);

// Smooth Loading Transition Component
interface LoadingTransitionProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export const LoadingTransition: React.FC<LoadingTransitionProps> = ({ 
  isLoading, 
  children, 
  fallback = <EntrySkeleton />,
  className 
}) => {
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {fallback}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Spinner Component
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <motion.div
      className={cn(
        'border-2 border-primary/30 border-t-primary rounded-full',
        sizeClasses[size],
        className
      )}
      variants={animationPresets.loading.spinner}
      animate="animate"
    />
  );
};

// Dots Loading Component
interface DotsLoaderProps {
  className?: string;
  dotClassName?: string;
}

export const DotsLoader: React.FC<DotsLoaderProps> = ({ className, dotClassName }) => {
  return (
    <motion.div 
      className={cn('flex space-x-1', className)}
      variants={animationPresets.loading.dots}
      animate="animate"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(
            'w-2 h-2 bg-primary rounded-full',
            dotClassName
          )}
          variants={{
            animate: {
              y: [0, -8, 0],
              transition: {
                duration: 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.1
              }
            }
          }}
        />
      ))}
    </motion.div>
  );
};

// Progress Bar Component
interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className, 
  showLabel = false 
}) => {
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full bg-surface-dark rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-neutral to-primary-intense rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// Pulse Skeleton Component
interface PulseSkeletonProps {
  lines?: number;
  className?: string;
}

export const PulseSkeleton: React.FC<PulseSkeletonProps> = ({ 
  lines = 3, 
  className 
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className="h-4 bg-surface-dark rounded"
          style={{ width: `${100 - (i * 10)}%` }}
          animate={{
            opacity: [0.5, 1, 0.5],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut'
            }
          }}
        />
      ))}
    </div>
  );
};

// Card Loading Placeholder
export const CardLoadingPlaceholder: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-surface rounded-xl p-6 animate-pulse', className)}>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 bg-surface-dark rounded-lg" />
      <div className="flex-1">
        <div className="h-4 bg-surface-dark rounded w-3/4 mb-2" />
        <div className="h-3 bg-surface-dark rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-surface-dark rounded w-full" />
      <div className="h-3 bg-surface-dark rounded w-5/6" />
      <div className="h-3 bg-surface-dark rounded w-4/6" />
    </div>
    <div className="flex gap-2">
      <div className="h-8 bg-surface-dark rounded w-20" />
      <div className="h-8 bg-surface-dark rounded w-16" />
    </div>
  </div>
);