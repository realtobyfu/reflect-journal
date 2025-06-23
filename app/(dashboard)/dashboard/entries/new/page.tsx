'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { apiClient } from '@/lib/api-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, MapPin, Hash, Paperclip, Save, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { journalPrompts } from '@/lib/prompts';

const moods = [
  { value: 'amazing', label: '😊', name: 'Amazing', color: 'text-green-600', bg: 'bg-green-50' },
  { value: 'good', label: '🙂', name: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' },
  { value: 'okay', label: '😐', name: 'Okay', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { value: 'bad', label: '😕', name: 'Bad', color: 'text-orange-600', bg: 'bg-orange-50' },
  { value: 'terrible', label: '😢', name: 'Terrible', color: 'text-red-600', bg: 'bg-red-50' },
];

const writingPrompts = [
  "What made you smile today?",
  "What challenge did you overcome?",
  "What are you grateful for right now?",
  "What did you learn today?",
  "How did you grow as a person?",
  "What moment do you want to remember?",
];

export default function NewEntryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [selectedPrompt, setSelectedPrompt] = useState<{ id: string; text: string } | null>(null);

  // Handle URL parameters on mount
  useEffect(() => {
    const promptId = searchParams.get('promptId');
    const mood = searchParams.get('mood');
    
    if (promptId) {
      const prompt = journalPrompts.find(p => p.id === promptId);
      if (prompt) {
        setSelectedPrompt({ id: prompt.id, text: prompt.text });
        setShowPrompts(false);
      }
    }
    
    if (mood) {
      setSelectedMood(mood);
    }
  }, [searchParams]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
    if (text.length > 0) setShowPrompts(false);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      const entryData: any = {
        content,
        mood: selectedMood || undefined,
        location: location || undefined,
        tags: tags.length > 0 ? tags : undefined,
      };

      // Store prompt separately in metadata or a dedicated field
      if (selectedPrompt) {
        entryData.prompt_id = selectedPrompt.id;
        entryData.prompt_text = selectedPrompt.text;
      }

      await apiClient.createEntry(entryData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to save entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const usePrompt = (prompt: string) => {
    setContent(prompt + " ");
    setShowPrompts(false);
    // Focus on textarea
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(prompt.length + 1, prompt.length + 1);
    }
  };

  return (
    <DashboardLayout activeSection="entries">
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              
              <button
                onClick={handleSave}
                disabled={isSaving || !content.trim()}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                  "bg-primary-600 text-white hover:bg-primary-700",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                )}
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            {/* Mood Display (Read-only) */}
            {selectedMood && (
              <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {moods.find(m => m.value === selectedMood)?.label}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Current Mood</p>
                    <p className="text-xs text-blue-700 capitalize">{selectedMood}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Prompt Display */}
            {selectedPrompt && (
              <div className="px-6 py-4 bg-purple-50 border-b border-purple-100">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-900 mb-1">Today's Prompt</p>
                    <p className="text-sm text-purple-700">{selectedPrompt.text}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Writing Area */}
            <div className="relative">
              {showPrompts && content.length === 0 && (
                <div className="absolute inset-x-0 top-0 p-6">
                  <p className="text-sm font-medium text-neutral-700 mb-3">
                    Need inspiration? Try one of these prompts:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {writingPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => usePrompt(prompt)}
                        className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm hover:bg-primary-100 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Start writing your thoughts..."
                className="w-full min-h-[400px] px-6 py-6 text-lg leading-relaxed resize-none focus:outline-none"
                autoFocus
              />
              
              {/* Word Count */}
              <div className="absolute bottom-4 right-6 text-sm text-neutral-400">
                {wordCount} {wordCount === 1 ? 'word' : 'words'}
              </div>
            </div>

            {/* Additional Options */}
            <div className="px-6 py-4 border-t border-neutral-100 space-y-4">
              {/* Location */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where are you writing from?"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                  <Hash className="w-4 h-4" />
                  Tags (optional)
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-primary-500 hover:text-primary-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Add a tag and press Enter"
                    className="flex-1 min-w-[200px] px-3 py-1 text-sm border-0 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 bg-primary-50 rounded-xl p-6 border border-primary-200">
            <h3 className="text-sm font-semibold text-primary-900 mb-2">💡 Writing tips</h3>
            <ul className="text-sm text-primary-700 space-y-1">
              <li>• Write freely without worrying about grammar or structure</li>
              <li>• Be honest with yourself - this is your private space</li>
              <li>• Include specific details to make memories more vivid</li>
              <li>• Don't feel pressured to write a lot - even a few sentences count</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}