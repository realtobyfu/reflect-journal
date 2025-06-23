'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { apiClient } from '@/lib/api-client';
import { Calendar, TrendingUp, Brain, Sparkles, ChevronRight, Sun, Cloud, Moon, Plus, Feather, BookOpen, BarChart3, Heart } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { getPromptsForMood, type Prompt } from '@/lib/prompts';

// Mood configuration
const moods = [
  { value: 'amazing', label: '😊', color: 'text-green-600', bg: 'bg-green-50' },
  { value: 'good', label: '🙂', color: 'text-blue-600', bg: 'bg-blue-50' },
  { value: 'okay', label: '😐', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { value: 'bad', label: '😕', color: 'text-orange-600', bg: 'bg-orange-50' },
  { value: 'terrible', label: '😢', color: 'text-red-600', bg: 'bg-red-50' },
  { value: 'contemplative', label: '🤔', color: 'text-purple-600', bg: 'bg-purple-50' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [todayEntry, setTodayEntry] = useState<any>(null);
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    // Initialize prompts on component mount
    setPrompts(getPromptsForMood(''));
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [entriesRes, statsRes] = await Promise.all([
        apiClient.getEntries({ limit: 5 }),
        apiClient.getStats()
      ]);

      // Check if today's entry exists
      const today = new Date().toISOString().split('T')[0];
      const entriesArray = Array.isArray(entriesRes) ? entriesRes : [];
      const todayEntryFound = entriesArray.find(
        (entry: any) => entry.created_at.startsWith(today)
      );

      if (todayEntryFound) {
        setTodayEntry(todayEntryFound);
        setContent(todayEntryFound.content);
        setSelectedMood(todayEntryFound.mood || '');
      }

      setRecentEntries(entriesArray.slice(0, 3));
      setStats(statsRes);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      if (todayEntry) {
        // Update existing entry
        const updated = await apiClient.updateEntry(todayEntry.id, {
          content,
          mood: selectedMood || undefined,
        });
        setTodayEntry(updated);
      } else {
        // Create new entry
        const created = await apiClient.createEntry({
          content,
          mood: selectedMood || undefined,
        });
        setTodayEntry(created);
      }
      
      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to save entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getTimeIcon = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      // Morning: Sun in warm yellow/orange
      return <Sun className="w-6 h-6 text-yellow-500" />;
    } else if (hour >= 12 && hour < 18) {
      // Afternoon: Cloud in soft blue
      return <Cloud className="w-6 h-6 text-blue-400" />;
    } else {
      // Evening/Night: Moon in purple
      return <Moon className="w-6 h-6 text-purple-500" />;
    }
  };

  const handleMoodSelect = (moodValue: string) => {
    setSelectedMood(moodValue);
    const newPrompts = getPromptsForMood(moodValue);
    setPrompts(newPrompts);
    
    // Keep selected prompt if it exists in new prompts
    if (selectedPrompt && !newPrompts.some(p => p.id === selectedPrompt.id)) {
      setSelectedPrompt(null);
    }
  };

  const handlePromptSelect = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    // Navigate to new entry page with the selected prompt
    const params = new URLSearchParams();
    params.set('promptId', prompt.id);
    if (selectedMood) {
      params.set('mood', selectedMood);
    }
    router.push(`/dashboard/entries/new?${params.toString()}`);
  };

  const handleNewEntry = () => {
    const params = new URLSearchParams();
    if (selectedMood) {
      params.set('mood', selectedMood);
    }
    if (selectedPrompt) {
      params.set('promptId', selectedPrompt.id);
    }
    router.push(`/dashboard/entries/new?${params.toString()}`);
  };

  return (
    <DashboardLayout activeSection="today">
      <div className={cn(
        "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800",
        isDarkMode && "from-slate-900 to-blue-900 text-slate-100"
      )}>
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                  {getGreeting()}!
                  {getTimeIcon()}
                </h1>
                <p className="text-slate-600 mt-1">
                  {format(new Date(), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-slate-600 text-sm">How are you feeling today?</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-4 mr-4">
                  <div className="text-sm text-slate-600">
                    <span className="font-medium text-slate-900">{stats?.total_entries || 0}</span> entries
                  </div>
                  <span className="text-slate-300">•</span>
                  <div className="text-sm text-slate-600">
                    <span className="font-medium text-slate-900">{stats?.current_streak || 0}</span> day streak
                  </div>
                </div>
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 transition-colors"
                >
                  <Sun size={20} className="text-yellow-600" />
                </button>
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                >
                  <Moon size={20} className="text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Today's Entry */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mood Selector */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold mb-4">How are you feeling?</h3>
                <div className="flex gap-3">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => handleMoodSelect(mood.value)}
                      className={cn(
                        "w-12 h-12 rounded-lg bg-white hover:bg-slate-50 transition-all hover:scale-110 flex items-center justify-center text-2xl shadow-sm",
                        selectedMood === mood.value && `${mood.bg} ring-2 ring-offset-2 ring-current ${mood.color}`
                      )}
                    >
                      {mood.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Today's Prompts */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-purple-500" />
                  Today's Prompts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {prompts.slice(0, 4).map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => handlePromptSelect(prompt)}
                      className={cn(
                        "p-4 rounded-lg text-left transition-all",
                        selectedPrompt?.id === prompt.id
                          ? 'bg-purple-100 border-2 border-purple-300'
                          : 'bg-white hover:bg-slate-50 border-2 border-transparent'
                      )}
                    >
                      <p className="text-sm">{prompt.text}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Commented out Your Thoughts section
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Your Reflection</h3>
                  <span className="text-sm text-slate-500">{content.split(' ').filter(w => w).length} words</span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={selectedPrompt ? `Reflecting on: "${selectedPrompt.text}"` : "Start writing your thoughts..."}
                  className="w-full h-64 p-4 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={isSaving || !content.trim()}
                    className={cn(
                      "px-6 py-2.5 rounded-lg font-medium transition-all duration-200",
                      "bg-primary-600 text-white hover:bg-primary-700",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    )}
                  >
                    {isSaving ? 'Saving...' : todayEntry ? 'Update Entry' : 'Save Entry'}
                  </button>
                </div>
              </div>
              */}

              {/* New Entry Button */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Ready to reflect?</h3>
                  <p className="text-slate-600 mb-4">Start writing about your day and thoughts</p>
                  <button
                    onClick={handleNewEntry}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    New Entry
                  </button>
                </div>
              </div>

              {/* Recent Entries */}
              {recentEntries.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Recent Entries</h2>
                    <Link
                      href="/dashboard/entries"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      View all
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {recentEntries.map((entry) => (
                      <Link
                        key={entry.id}
                        href={`/dashboard/entries/${entry.id}`}
                        className="block px-6 py-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-900 line-clamp-2">
                              {entry.content}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs text-slate-500">
                                {format(new Date(entry.created_at), 'MMM d, yyyy')}
                              </span>
                              {entry.mood && (
                                <span className="text-lg">
                                  {moods.find(m => m.value === entry.mood)?.label}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Quick Stats & Actions */}
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Progress</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Current Streak</p>
                        <p className="text-xs text-slate-600">Keep it going!</p>
                      </div>
                    </div>
                    <span className="text-2xl font-semibold text-blue-600">
                      {stats?.current_streak || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Total Entries</p>
                        <p className="text-xs text-slate-600">Since joining</p>
                      </div>
                    </div>
                    <span className="text-2xl font-semibold text-green-600">
                      {stats?.total_entries || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Words This Week</p>
                        <p className="text-xs text-slate-600">Keep writing</p>
                      </div>
                    </div>
                    <span className="text-2xl font-semibold text-orange-600">
                      {stats?.week_word_count || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Streak Widget */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-90">Current Streak</span>
                  <span className="text-2xl font-bold">{stats?.current_streak || 0}</span>
                </div>
                <div className="text-xs opacity-80">Keep it up! 🔥</div>
              </div>

              {/* AI Assistant */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Brain className="text-purple-500" size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Reflection Assistant</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      I noticed you've been writing about similar themes this week. Would you like to explore what "growth through challenges" means to you?
                    </p>
                    <div className="flex gap-2">
                      <button className="text-sm px-3 py-1 bg-white rounded-lg hover:bg-slate-50 transition-colors">
                        Yes, let's explore
                      </button>
                      <button className="text-sm px-3 py-1 bg-white rounded-lg hover:bg-slate-50 transition-colors">
                        Show me patterns
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Writing Tips */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-100 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Tip of the day</h3>
                <p className="text-sm text-blue-700">
                  Try to write at the same time each day. Building a routine helps make journaling a lasting habit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}