'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { apiClient, JournalEntry } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Save,
  MapPin,
  Download,
  FileText,
  Filter,
  RefreshCw,
  MessageSquare,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<string>('today');
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
  const [attachments, setAttachments] = useState<File[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number; place_name: string } | null>(null);
  
  // New states for enhanced features
  const [aiPrompts, setAiPrompts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    mood: '',
    startDate: '',
    endDate: '',
    hasLocation: false
  });
  const [insights, setInsights] = useState<any>(null);
  const [themes, setThemes] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [reflection, setReflection] = useState<string>('');
  
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

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    loadEntries();
    loadStats();
    loadAIPrompts();
    loadInsights();
    loadThemes();
  };

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
        topMood: "Contemplative"
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadAIPrompts = async () => {
    try {
      const prompts = await apiClient.getDailyPrompts();
      setAiPrompts(prompts);
    } catch (error) {
      console.error('Failed to load AI prompts:', error);
    }
  };

  const loadInsights = async () => {
    try {
      const data = await apiClient.getInsights();
      setInsights(data);
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
  };

  const loadThemes = async () => {
    try {
      const data = await apiClient.getThemes();
      setThemes(data.themes || []);
    } catch (error) {
      console.error('Failed to load themes:', error);
    }
  };

  const searchEntries = async () => {
    try {
      const results = await apiClient.searchEntries({
        q: searchQuery,
        mood: searchFilters.mood,
        start_date: searchFilters.startDate,
        end_date: searchFilters.endDate,
        has_location: searchFilters.hasLocation
      });
      setEntries(results);
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Search failed",
        description: "Could not search entries. Please try again.",
        variant: "destructive"
      });
    }
  };

  const analyzeEntry = async (entry: JournalEntry) => {
    setIsAnalyzing(true);
    try {
      const analysis = await apiClient.analyzeEntry(entry.id);
      const { reflection } = await apiClient.getReflection(entry.id);
      
      setSelectedEntry(entry);
      setReflection(reflection);
      
      toast({
        title: "Analysis complete",
        description: `Sentiment: ${analysis.analysis.primary_emotion}`,
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis failed",
        description: "Could not analyze entry.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exportData = async (format: 'csv' | 'pdf' | 'json') => {
    try {
      let blob: Blob;
      let filename: string;
      
      switch (format) {
        case 'csv':
          blob = await apiClient.exportToCSV();
          filename = `journal_export_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'pdf':
          blob = await apiClient.exportToPDF();
          filename = `journal_export_${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        case 'json':
          blob = await apiClient.exportToJSON();
          filename = `journal_backup_${new Date().toISOString().split('T')[0]}.json`;
          break;
      }
      
      // Download file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: `Your journal has been exported as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export failed",
        description: "Could not export your journal. Please try again.",
        variant: "destructive"
      });
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
      const tags = selectedPrompt ? [selectedPrompt.category] : [];
      
      const newEntry = await apiClient.createEntry({
        content: journalText,
        mood: moodName,
        tags,
        location: location || undefined
      });
      
      // Upload attachments
      for (const file of attachments) {
        await apiClient.uploadAttachment(newEntry.id, file);
      }
      
      // Analyze the new entry automatically
      apiClient.analyzeEntry(newEntry.id).catch(console.error);
      
      toast({
        title: "Entry saved!",
        description: "Your journal entry has been saved successfully.",
      });
      
      // Clear form and reload data
      setJournalText('');
      setSelectedMood('');
      setSelectedPrompt(null);
      setAttachments([]);
      setLocation(null);
      loadData();
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
            <p className="text-xs text-slate-500 mt-1">
              Welcome back, {user.first_name || user.username || user.email}
            </p>
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
            view="search" 
            icon={Search} 
            label="Search & Filter" 
            active={activeView === 'search'} 
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
          <NavButton 
            view="export" 
            icon={Download} 
            label="Export" 
            active={activeView === 'export'} 
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
          <Link href="/dashboard/settings">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-slate-100 text-slate-700">
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </Link>
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
                  <button 
                    onClick={loadAIPrompts}
                    className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 transition-colors"
                    title="Refresh prompts"
                  >
                    <RefreshCw size={20} className="text-purple-600" />
                  </button>
                </div>
              </div>
              
              {/* Mood Selector */}
              <div className="flex gap-3 mb-6 flex-wrap">
                {moods.map((mood) => (
                  <button
                    key={mood.name}
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
            
            {/* AI Prompts */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Brain size={20} className="text-purple-500" />
                AI-Generated Prompts for You
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {aiPrompts.map((prompt) => (
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
                    <span className="text-xs text-purple-500 mt-2 inline-block">
                      {prompt.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Writing Area */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-slate-900">Your Reflection</h3>
              </div>
              <Textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder={selectedPrompt ? `Reflecting on: "${selectedPrompt.text}"` : "Start writing your thoughts..."}
                className="w-full h-64 p-4 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/50"
              />
              <div className="mt-2 flex items-center gap-4">
                <label className="cursor-pointer text-sm text-slate-600 hover:text-slate-800 flex items-center gap-1">
                  <Plus size={16} />
                  <span>Add Photo</span>
                  <input type="file" multiple hidden onChange={(e) => e.target.files && setAttachments(Array.from(e.target.files))} />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      setLocation({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        place_name: `${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`
                      });
                    });
                  }}
                  className="text-sm text-slate-600 hover:text-slate-800 flex items-center gap-1"
                >
                  <MapPin size={16} />
                  <span>Add Location</span>
                </button>
                {location && <span className="text-sm text-slate-500">📍 {location.place_name}</span>}
                {attachments.length > 0 && (
                  <span className="text-sm text-slate-500">📎 {attachments.length} file(s)</span>
                )}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700"
                    onClick={() => {
                      setJournalText('');
                      setSelectedMood('');
                      setSelectedPrompt(null);
                      setAttachments([]);
                      setLocation(null);
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
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Save Entry
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeView === 'search' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Search & Filter</h2>
            
            {/* Search Bar */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 mb-6">
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your entries..."
                    className="pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && searchEntries()}
                  />
                </div>
                <Button onClick={searchEntries} className="bg-blue-500 text-white">
                  Search
                </Button>
              </div>
              
              {/* Filters */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">Mood</label>
                  <select
                    value={searchFilters.mood}
                    onChange={(e) => setSearchFilters({ ...searchFilters, mood: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  >
                    <option value="">All moods</option>
                    {moods.map(mood => (
                      <option key={mood.name} value={mood.name}>{mood.emoji} {mood.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">Date Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={searchFilters.startDate}
                      onChange={(e) => setSearchFilters({ ...searchFilters, startDate: e.target.value })}
                      className="flex-1"
                    />
                    <span className="self-center">to</span>
                    <Input
                      type="date"
                      value={searchFilters.endDate}
                      onChange={(e) => setSearchFilters({ ...searchFilters, endDate: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Search Results */}
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
                      {entry.mood_score !== null && entry.mood_score !== undefined && (
                        <span className={`px-2 py-1 rounded text-xs ${
                          entry.mood_score > 0.3 ? 'bg-green-100 text-green-700' :
                          entry.mood_score < -0.3 ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          Sentiment: {entry.mood_score.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => analyzeEntry(entry)}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <MessageSquare size={16} />
                      )}
                      <span className="ml-1">AI Reflect</span>
                    </Button>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {entry.content.length > 200 ? `${entry.content.substring(0, 200)}...` : entry.content}
                  </p>
                  {entry.location && (
                    <p className="mt-2 text-sm text-slate-500">📍 {entry.location.place_name}</p>
                  )}
                </div>
              ))}
            </div>
            
            {/* AI Reflection Modal */}
            {selectedEntry && reflection && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                  <h3 className="text-lg font-semibold mb-4">AI Reflection</h3>
                  <p className="text-slate-700 mb-4">{reflection}</p>
                  <Button onClick={() => { setSelectedEntry(null); setReflection(''); }}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeView === 'calendar' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Past Entries</h2>
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm text-slate-500">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                    {entry.mood && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {entry.mood}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {entry.content.length > 200 ? `${entry.content.substring(0, 200)}...` : entry.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeView === 'insights' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Your Writing Insights</h2>
            {insights && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">Total Entries</h3>
                  <p className="text-3xl font-bold text-blue-500">{insights.total_entries}</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">Writing Pattern</h3>
                  <p className="text-xl font-medium text-purple-600">
                    You're a {insights.writing_pattern}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Most active at {insights.most_active_hour}:00
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">Average Sentiment</h3>
                  <div className="flex items-center gap-2">
                    <div className={`text-3xl ${
                      insights.average_sentiment > 0.3 ? 'text-green-500' :
                      insights.average_sentiment < -0.3 ? 'text-red-500' :
                      'text-yellow-500'
                    }`}>
                      {insights.average_sentiment > 0.3 ? '😊' :
                       insights.average_sentiment < -0.3 ? '😔' : '😐'}
                    </div>
                    <span className="text-xl">{(insights.average_sentiment * 100).toFixed(0)}% positive</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">Words This Week</h3>
                  <p className="text-3xl font-bold text-indigo-500">{stats.wordsThisWeek}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === 'themes' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Your Journal Themes</h2>
            {themes.length > 0 ? (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <p className="text-sm text-slate-600 mb-4">
                  Based on your recent entries, here are the recurring themes in your writing:
                </p>
                <div className="space-y-4">
                  {themes.map((theme, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-slate-900">{theme.theme}</span>
                        <span className="text-sm text-slate-500">{theme.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                          style={{ width: `${theme.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <p className="text-slate-500 text-center py-8">
                  Keep writing! We'll analyze your themes once you have more entries.
                </p>
              </div>
            )}
          </div>
        )}

        {activeView === 'export' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Export Your Journal</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 text-center">
                <FileText className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">CSV Export</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Export your entries as a spreadsheet for data analysis
                </p>
                <Button onClick={() => exportData('csv')} className="w-full">
                  Export to CSV
                </Button>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 text-center">
                <FileText className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">PDF Export</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Create a beautifully formatted PDF of your journal
                </p>
                <Button onClick={() => exportData('pdf')} className="w-full">
                  Export to PDF
                </Button>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 text-center">
                <Download className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">Full Backup</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Download all your data as JSON for backup
                </p>
                <Button onClick={() => exportData('json')} className="w-full">
                  Export Backup
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}