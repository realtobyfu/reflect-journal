'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import { JournalEntry } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';

interface TimelineEntryProps {
  entry: JournalEntry;
  index: number;
  showDateHeader: boolean;
}

const getEmotionColor = (emotions?: any): string => {
  if (!emotions?.primary) return 'hsl(var(--primary-calm))';
  
  const emotionColors: Record<string, string> = {
    joy: 'hsl(var(--emotional-joy))',
    sadness: 'hsl(var(--emotional-sadness))',
    anger: 'hsl(var(--emotional-anger))',
    fear: 'hsl(var(--emotional-fear))',
    surprise: 'hsl(var(--emotional-surprise))',
    disgust: 'hsl(var(--emotional-disgust))',
    trust: 'hsl(var(--emotional-trust))',
    anticipation: 'hsl(var(--emotional-anticipation))'
  };
  
  return emotionColors[emotions.primary] || 'hsl(var(--primary-calm))';
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'h:mm a');
};

const formatDateHeader = (dateString: string): string => {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return 'Today';
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'MMMM d, yyyy');
  }
};

const DateHeader: React.FC<{ date: string }> = ({ date }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className="flex items-center gap-3 mb-4 mt-6 first:mt-0"
  >
    <Calendar className="w-4 h-4 text-muted-foreground" />
    <h3 className="text-sm font-medium text-foreground">
      {formatDateHeader(date)}
    </h3>
    <div className="flex-1 h-px bg-border" />
  </motion.div>
);

const TimelineEntryCard: React.FC<TimelineEntryProps> = ({ 
  entry, 
  index, 
  showDateHeader 
}) => {
  // Mock emotions data - in real app this would come from AI analysis
  const emotions = {
    primary: entry.mood?.toLowerCase() || 'neutral',
    secondary: 'neutral'
  };

  return (
    <div>
      {showDateHeader && <DateHeader date={entry.created_at} />}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5,
          delay: index * 0.1,
          ease: [0.4, 0, 0.2, 1]
        }}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        className="bg-surface rounded-xl p-4 relative overflow-hidden cursor-pointer group"
      >
        {/* Emotional Gradient Background */}
        <div 
          className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-normal"
          style={{
            background: `linear-gradient(135deg, 
              ${getEmotionColor(emotions)} 0%, 
              ${getEmotionColor({ primary: emotions.secondary })} 100%)`
          }}
        />
        
        {/* Content */}
        <div className="relative">
          {/* Time and Mood */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">
              {formatTime(entry.created_at)}
            </p>
            {entry.mood && (
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                'bg-primary-calm/50 text-primary-intense'
              )}>
                {entry.mood}
              </span>
            )}
          </div>
          
          {/* Entry Content Preview */}
          <p className={cn(
            'leading-relaxed text-foreground mb-3',
            'line-clamp-3 group-hover:line-clamp-none transition-all duration-normal'
          )}>
            {entry.content}
          </p>
          
          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {entry.word_count && (
              <span>{entry.word_count} words</span>
            )}
            {entry.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {entry.location.place_name}
              </span>
            )}
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex gap-1">
                {entry.tags.slice(0, 2).map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-surface-dark rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {entry.tags.length > 2 && (
                  <span className="text-muted-foreground">
                    +{entry.tags.length - 2} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface VisualTimelineProps {
  entries: JournalEntry[];
  className?: string;
}

export const VisualTimeline: React.FC<VisualTimelineProps> = ({ 
  entries, 
  className 
}) => {
  const shouldShowDateHeader = (entry: JournalEntry, prevEntry?: JournalEntry): boolean => {
    if (!prevEntry) return true;
    
    const entryDate = new Date(entry.created_at);
    const prevDate = new Date(prevEntry.created_at);
    
    return !isSameDay(entryDate, prevDate);
  };

  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'text-center py-12 text-muted-foreground',
          className
        )}
      >
        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">No entries yet</p>
        <p className="text-sm">Start writing to see your timeline</p>
      </motion.div>
    );
  }

  return (
    <div className={cn('space-y-3 px-4', className)}>
      {entries.map((entry, index) => (
        <TimelineEntryCard
          key={entry.id}
          entry={entry}
          index={index}
          showDateHeader={shouldShowDateHeader(entry, entries[index - 1])}
        />
      ))}
    </div>
  );
};