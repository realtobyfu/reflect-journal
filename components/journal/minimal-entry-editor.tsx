'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Feather, Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PromptBubbleProps {
  prompt: string;
  onDismiss: () => void;
  className?: string;
}

const PromptBubble: React.FC<PromptBubbleProps> = ({ prompt, onDismiss, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'bg-primary-calm/50 border border-primary/20 rounded-xl p-4 mb-6',
        'backdrop-blur-sm shadow-sm',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary-neutral/10 rounded-lg flex-shrink-0">
          <Feather className="w-4 h-4 text-primary-neutral" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-foreground/80 leading-relaxed">
            {prompt}
          </p>
          <button
            onClick={onDismiss}
            className="text-xs text-muted-foreground hover:text-primary mt-2 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </motion.div>
  );
};

interface FloatingMoodButtonProps {
  selectedMood: string;
  onMoodChange: (mood: string) => void;
  className?: string;
}

const FloatingMoodButton: React.FC<FloatingMoodButtonProps> = ({ 
  selectedMood, 
  onMoodChange, 
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const moods = [
    { emoji: '😊', name: 'Happy' },
    { emoji: '😔', name: 'Sad' },
    { emoji: '😴', name: 'Tired' },
    { emoji: '🤔', name: 'Thoughtful' },
    { emoji: '😍', name: 'Excited' },
    { emoji: '😤', name: 'Frustrated' },
    { emoji: '😌', name: 'Peaceful' },
    { emoji: '😎', name: 'Confident' }
  ];

  return (
    <div className={cn('fixed top-20 right-4 z-30', className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-surface rounded-xl p-2 shadow-lg border border-border mb-2 grid grid-cols-2 gap-1"
          >
            {moods.map((mood) => (
              <button
                key={mood.name}
                onClick={() => {
                  onMoodChange(mood.emoji);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-10 h-10 rounded-lg transition-all duration-fast hover:scale-110',
                  'flex items-center justify-center text-lg',
                  selectedMood === mood.emoji 
                    ? 'bg-primary-calm ring-2 ring-primary-neutral' 
                    : 'hover:bg-surface-dark'
                )}
                title={mood.name}
              >
                {mood.emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-14 h-14 rounded-full bg-surface shadow-lg border border-border',
          'flex items-center justify-center text-2xl',
          'hover:shadow-xl transition-shadow duration-normal',
          selectedMood ? 'ring-2 ring-primary-neutral' : ''
        )}
        aria-label="Select mood"
      >
        {selectedMood || '😊'}
      </motion.button>
    </div>
  );
};

interface AutoSaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
}

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ status }) => {
  return (
    <div className="fixed bottom-24 right-4 z-30">
      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'px-3 py-2 rounded-full text-xs font-medium flex items-center gap-2',
              'backdrop-blur-sm border shadow-sm',
              {
                'bg-primary-calm/90 border-primary/20 text-primary-intense': status === 'saving',
                'bg-green-100/90 border-green-200 text-green-700': status === 'saved',
                'bg-red-100/90 border-red-200 text-red-700': status === 'error'
              }
            )}
          >
            {status === 'saving' && <Loader2 className="w-3 h-3 animate-spin" />}
            {status === 'saved' && <Save className="w-3 h-3" />}
            {status === 'error' && '⚠️'}
            {status === 'saving' && 'Saving...'}
            {status === 'saved' && 'Saved'}
            {status === 'error' && 'Failed to save'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface MinimalEntryEditorProps {
  initialContent?: string;
  prompt?: string;
  onSave?: (content: string, mood: string) => Promise<void>;
  className?: string;
}

export const MinimalEntryEditor: React.FC<MinimalEntryEditorProps> = ({
  initialContent = '',
  prompt,
  onSave,
  className
}) => {
  const [content, setContent] = useState(initialContent);
  const [selectedMood, setSelectedMood] = useState('');
  const [showPrompt, setShowPrompt] = useState(!!prompt);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState(Date.now());

  // Auto-save functionality
  useEffect(() => {
    if (!content.trim() || !onSave) return;

    const timeoutId = setTimeout(async () => {
      if (Date.now() - lastSaved > 2000) { // Debounce for 2 seconds
        setSaveStatus('saving');
        try {
          await onSave(content, selectedMood);
          setSaveStatus('saved');
          setLastSaved(Date.now());
          setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (error) {
          setSaveStatus('error');
          setTimeout(() => setSaveStatus('idle'), 3000);
        }
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [content, selectedMood, onSave, lastSaved]);

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Floating Mood Selector */}
      <FloatingMoodButton
        selectedMood={selectedMood}
        onMoodChange={setSelectedMood}
      />
      
      {/* Main Writing Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-6 py-8 max-w-2xl mx-auto"
      >
        {/* AI Prompt Bubble */}
        <AnimatePresence>
          {showPrompt && prompt && (
            <PromptBubble
              prompt={prompt}
              onDismiss={() => setShowPrompt(false)}
            />
          )}
        </AnimatePresence>
        
        {/* Textarea */}
        <motion.textarea
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className={cn(
            'w-full text-lg leading-relaxed bg-transparent resize-none',
            'placeholder:text-muted-foreground focus:outline-none',
            'transition-all duration-normal',
            'min-h-[60vh]'
          )}
          autoFocus
          rows={20}
        />
      </motion.div>
      
      {/* Auto-save Indicator */}
      <AutoSaveIndicator status={saveStatus} />
    </div>
  );
};