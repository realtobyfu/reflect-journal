'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { apiClient, JournalEntry } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  Sparkles, 
  Moon, 
  Sun, 
  Heart, 
  Brain, 
  ChevronRight, 
  Plus, 
  Search, 
  BarChart3, 
  Feather,
  LogOut,
  Settings,
  Save
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState('today');
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [journalText, setJournalText] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    streak: 0,
    totalEntries: 0,
    wordsThisWeek: 0,
    topMood: "Contemplative"
  });
  
  const prompts = [
    { id: 1, text: "What moment from today would you want to remember in 5 years?", category: "memory" },
    { id: 2, text: "What challenged you today, and how did you grow from it?", category: "growth" },
    { id: 3, text: "Describe a small detail you noticed today that others might have missed.", category: "mindfulness" },
    { id: 4, text: "If today had a color, what would it be and why?", category: "creative" }
  ];

  const moods = [
    { emoji: '😊', name: 'Happy' },
    { emoji: '😔', name: 'Sad' },
    { emoji: '😴', name: 'Tired' },
    { emoji: '🤔', name: 'Thoughtful' },
    { emoji: '😍', name: 'Excited' },
    { emoji: '😤', name: 'Frustrated' }
  ];

  useEffect(() => {
    if (user) {
      loadEntries();
      loadStats();
    }
  }, [user]);

  const loadEntries = async () => {
    try {
      const data = await apiClient.getEntries({ limit: 10 });
      setEntries(data);
    } catch (error) {
      console.error('Failed to load entries:', error);
    }
  };

  const loadStats = async () => {
    try {
      const data = await apiClient.getStats();
      setStats({
        streak: data.current_streak || 0,
        totalEntries: data.total_entries || 0,
        wordsThisWeek: data.week_word_count || 0,
        topMood: "Contemplative" // Could be derived from mood_distribution
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const saveEntry = async () => {
    if (!journalText.trim()) {
      toast({
        title: "Empty entry",
        description: "Please write something before saving.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const moodName = moods.find(m => m.emoji === selectedMood)?.name;
      await apiClient.createEntry({
        content: journalText,
        mood: moodName,
        tags: selectedPrompt ? [selectedPrompt.category] : []
      });
      
      toast({
        title: "Entry saved!",
        description: "Your journal entry has been saved successfully.",
      });
      
      // Clear form and reload data
      setJournalText('');
      setSelectedMood('');
      setSelectedPrompt(null);
      loadEntries();
      loadStats();
    } catch (error: any) {
      console.error('Failed to save entry:', error);
      toast({
        title: "Failed to save",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const NavButton = ({ view, icon: Icon, label, active }: any) => (
    <button
      onClick={() => setActiveView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100 text-slate-700'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-sm border-r border-slate-200 p-6 z-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Feather className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-slate-900">Reflect</h1>
          </div>
          <p className="text-sm text-slate-600">Your daily mindfulness companion</p>
          {user && (
            <p className="text-xs text-slate-500 mt-1">Welcome back, {user.email}</p>
          )}
        </div>
        
        <nav className="space-y-2 mb-8">
          <NavButton 
            view="today" 
            icon={Feather} 
            label="Today's Entry" 
            active={activeView === 'today'} 
          />
          <NavButton 
            view="calendar" 
            icon={Calendar} 
            label="Past Entries" 
            active={activeView === 'calendar'} 
          />
          <NavButton 
            view="insights" 
            icon={TrendingUp} 
            label="Insights" 
            active={activeView === 'insights'} 
          />
          <NavButton 
            view="themes" 
            icon={Sparkles} 
            label="Themes" 
            active={activeView === 'themes'} 
          />
        </nav>

        {/* Stats Widget */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">Current Streak</span>
              <span className="text-2xl font-bold">{stats.streak}</span>
            </div>
            <div className="text-xs opacity-80">Keep it up! 🔥</div>
          </div>
        </div>

        {/* User menu */}
        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-slate-100 text-slate-700">
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-red-50 text-red-600"
          >
            <LogOut size={20} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="ml-64 p-8">
        {activeView === 'today' && (
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h2>
                  <p className="text-slate-600 mt-1">How are you feeling today?</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 transition-colors">
                    <Sun size={20} className="text-yellow-600" />
                  </button>
                  <button className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors">
                    <Moon size={20} className="text-blue-600" />
                  </button>
                </div>
              </div>
              
              {/* Mood Selector */}
              <div className="flex gap-3 mb-6">
                {moods.map((mood, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedMood(mood.emoji)}
                    className={`w-12 h-12 rounded-lg bg-white hover:bg-slate-50 transition-all hover:scale-110 flex items-center justify-center text-2xl shadow-sm border-2 ${
                      selectedMood === mood.emoji ? 'border-blue-400 bg-blue-50' : 'border-slate-200'
                    }`}
                    title={mood.name}
                  >
                    {mood.emoji}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Prompts */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Sparkles size={20} className="text-purple-500" />
                Today's Prompts
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {prompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => setSelectedPrompt(prompt)}
                    className={`p-4 rounded-lg text-left transition-all ${
                      selectedPrompt?.id === prompt.id
                        ? 'bg-purple-100 border-2 border-purple-300'
                        : 'bg-white hover:bg-slate-50 border-2 border-transparent shadow-sm'
                    }`}
                  >
                    <p className="text-sm text-slate-700">{prompt.text}</p>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Writing Area */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Your Reflection</h3>
                <span className="text-sm text-slate-500">{journalText.split(' ').filter(w => w).length} words</span>
              </div>
              <Textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder={selectedPrompt ? `Reflecting on: "${selectedPrompt.text}"` : "Start writing your thoughts..."}
                className="w-full h-64 p-4 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/50"
              />
              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700"
                    onClick={() => {
                      setJournalText('');
                      setSelectedMood('');
                      setSelectedPrompt(null);
                    }}
                  >
                    Clear
                  </Button>
                </div>
                <Button 
                  onClick={saveEntry}
                  disabled={isLoading || !journalText.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Save Entry
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeView === 'calendar' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Past Entries</h2>
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </span>
                      {entry.mood && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {entry.mood}
                        </span>
                      )}
                </div>
                    <span className="text-sm text-slate-500">{entry.word_count} words</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {entry.content.length > 200 ? `${entry.content.substring(0, 200)}...` : entry.content}
                  </p>
                </div>
              ))}
              {entries.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No entries yet. Start writing your first reflection!</p>
              </div>
              )}
            </div>
          </div>
        )}
        
        {activeView === 'insights' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">Total Entries</h3>
                <p className="text-3xl font-bold text-blue-500">{stats.totalEntries}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">Words This Week</h3>
                <p className="text-3xl font-bold text-green-500">{stats.wordsThisWeek}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">Current Streak</h3>
                <p className="text-3xl font-bold text-purple-500">{stats.streak} days</p>
              </div>
            </div>
          </div>
        )}

        {activeView === 'themes' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Themes</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <p className="text-slate-500 text-center py-8">
                Theme analysis coming soon! We'll analyze your entries to identify patterns and recurring themes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 