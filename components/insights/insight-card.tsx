'use client';

import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Brain, 
  Heart, 
  Calendar, 
  BarChart3, 
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type InsightType = 'trend' | 'emotion' | 'pattern' | 'achievement' | 'recommendation' | 'theme';

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  timeframe: string;
  keyMetric: string;
  comparison?: string;
  recommendation: string;
  confidence?: number;
  actionable?: boolean;
}

const getInsightIcon = (type: InsightType) => {
  const iconMap = {
    trend: TrendingUp,
    emotion: Heart,
    pattern: BarChart3,
    achievement: Sparkles,
    recommendation: Brain,
    theme: Calendar
  };
  
  const Icon = iconMap[type];
  return <Icon className="w-5 h-5" />;
};

const getInsightColor = (type: InsightType): string => {
  const colorMap = {
    trend: 'blue',
    emotion: 'rose',
    pattern: 'purple',
    achievement: 'amber',
    recommendation: 'emerald',
    theme: 'indigo'
  };
  
  return colorMap[type];
};

interface InsightCardProps {
  insight: Insight;
  onExplore?: (insight: Insight) => void;
  onDismiss?: (insightId: string) => void;
  className?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  onExplore,
  onDismiss,
  className
}) => {
  const color = getInsightColor(insight.type);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'bg-surface rounded-xl p-6 border border-border',
        'hover:border-primary/30 transition-all duration-normal',
        'relative overflow-hidden group cursor-pointer',
        className
      )}
    >
      {/* Confidence Indicator */}
      {insight.confidence && (
        <div 
          className={`absolute top-0 right-0 w-1 h-full bg-${color}-400 opacity-60`}
          style={{ height: `${insight.confidence * 100}%` }}
        />
      )}
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className={cn(
              'p-2 rounded-lg flex-shrink-0',
              `bg-${color}-100 text-${color}-600`
            )}
          >
            {getInsightIcon(insight.type)}
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-lg mb-1 text-foreground">
              {insight.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {insight.timeframe}
            </p>
          </div>
        </div>
        
        {onDismiss && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(insight.id);
            }}
            className={cn(
              'opacity-0 group-hover:opacity-100 transition-opacity duration-normal',
              'p-1 rounded-lg hover:bg-surface-dark text-muted-foreground hover:text-foreground'
            )}
            aria-label="Dismiss insight"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Key Finding */}
      <div className="mb-4">
        <motion.p 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
          className={cn(
            'text-2xl font-semibold mb-1',
            `text-${color}-600`
          )}
        >
          {insight.keyMetric}
        </motion.p>
        {insight.comparison && (
          <p className="text-sm text-muted-foreground">
            {insight.comparison}
          </p>
        )}
      </div>
      
      {/* Actionable Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className={cn(
          'rounded-lg p-4 mb-4',
          `bg-${color}-50 border border-${color}-100`
        )}
      >
        <p className="text-sm leading-relaxed text-foreground">
          {insight.recommendation}
        </p>
      </motion.div>
      
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        {onExplore && (
          <button
            onClick={() => onExplore(insight)}
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-all duration-normal',
              `text-${color}-600 hover:text-${color}-700`,
              'hover:gap-3 group-hover:translate-x-1'
            )}
          >
            <span>Explore</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        
        {insight.actionable && (
          <span className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            `bg-${color}-100 text-${color}-700`
          )}>
            Actionable
          </span>
        )}
      </div>
    </motion.div>
  );
};

interface InsightGridProps {
  insights: Insight[];
  onExplore?: (insight: Insight) => void;
  onDismiss?: (insightId: string) => void;
  className?: string;
}

export const InsightGrid: React.FC<InsightGridProps> = ({
  insights,
  onExplore,
  onDismiss,
  className
}) => {
  if (insights.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'text-center py-12 text-muted-foreground',
          className
        )}
      >
        <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">No insights yet</p>
        <p className="text-sm">Keep writing to unlock personalized insights</p>
      </motion.div>
    );
  }

  return (
    <div className={cn(
      'grid grid-cols-1 md:grid-cols-2 gap-6',
      className
    )}>
      {insights.map((insight, index) => (
        <motion.div
          key={insight.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.1,
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          <InsightCard
            insight={insight}
            onExplore={onExplore}
            onDismiss={onDismiss}
          />
        </motion.div>
      ))}
    </div>
  );
};