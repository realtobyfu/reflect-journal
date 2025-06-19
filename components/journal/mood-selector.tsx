'use client';

// @ts-nocheck

interface MoodSelectorProps {
  value: string | null;
  onChange: (mood: string) => void;
}

const moods = [
  { emoji: '😊', label: 'happy' },
  { emoji: '😔', label: 'sad' },
  { emoji: '😴', label: 'tired' },
  { emoji: '🤔', label: 'thoughtful' },
  { emoji: '😍', label: 'grateful' },
  { emoji: '😤', label: 'frustrated' },
  { emoji: '😌', label: 'peaceful' },
  { emoji: '😎', label: 'confident' },
];

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">How are you feeling?</label>
      <div className="flex gap-2 flex-wrap">
        {moods.map((mood) => (
          <button
            key={mood.label}
            onClick={() => onChange(mood.label)}
            className={`p-3 rounded-lg border-2 transition-all ${
              value === mood.label
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            title={mood.label}
          >
            <span className="text-2xl">{mood.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 