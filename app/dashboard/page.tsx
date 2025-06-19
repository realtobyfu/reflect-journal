'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
  Settings
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState('today');
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [journalText, setJournalText] = useState('');
  
  const prompts = [
    { id: 1, text: "What moment from today would you want to remember in 5 years?", category: "memory" },
    { id: 2, text: "What challenged you today, and how did you grow from it?", category: "growth" },
    { id: 3, text: "Describe a small detail you noticed today that others might have missed.", category: "mindfulness" },
    { id: 4, text: "If today had a color, what would it be and why?", category: "creative" }
  ];

  const stats = {
    streak: 7,
    totalEntries: 42,
    wordsThisWeek: 3420,
    topMood: "Contemplative"
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
                {['😊', '😔', '😴', '🤔', '😍', '😤'].map((mood, i) => (
                  <button
                    key={i}
                    className="w-12 h-12 rounded-lg bg-white hover:bg-slate-50 transition-all hover:scale-110 flex items-center justify-center text-2xl shadow-sm border border-slate-200"
                  >
                    {mood}
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
                  <Button variant="outline" className="bg-slate-100 hover:bg-slate-200 text-slate-700">
                    Save as Draft
                  </Button>
                  <Button variant="outline" className="bg-slate-100 hover:bg-slate-200 text-slate-700">
                    Add Photo
                  </Button>
                </div>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2">
                  <BookOpen size={16} />
                  Complete Entry
                </Button>
              </div>
            </div>
            
            {/* AI Assistant */}
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Brain className="text-purple-500" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2 text-slate-900">Reflection Assistant</h4>
                  <p className="text-sm text-slate-600 mb-3">
                    I noticed you've been writing about similar themes this week. Would you like to explore what "growth through challenges" means to you?
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="bg-white hover:bg-slate-50">
                      Yes, let's explore
                    </Button>
                    <Button size="sm" variant="outline" className="bg-white hover:bg-slate-50">
                      Show me patterns
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeView === 'insights' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-slate-900">Your Journey Insights</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600">Total Entries</span>
                  <BookOpen size={20} className="text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{stats.totalEntries}</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600">Words This Week</span>
                  <BarChart3 size={20} className="text-green-500" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{stats.wordsThisWeek.toLocaleString()}</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600">Current Streak</span>
                  <TrendingUp size={20} className="text-orange-500" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{stats.streak} days</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600">Top Mood</span>
                  <Heart size={20} className="text-pink-500" />
                </div>
                <p className="text-xl font-bold text-slate-900">{stats.topMood}</p>
              </div>
            </div>
            
            {/* Mood Chart Placeholder */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Emotional Journey</h3>
              <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                <p className="text-slate-500">Mood tracking visualization coming soon</p>
              </div>
            </div>
            
            {/* Recent Themes */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Recurring Themes</h3>
              <div className="flex flex-wrap gap-2">
                {['Growth', 'Relationships', 'Creativity', 'Work-Life Balance', 'Self-Discovery', 'Gratitude'].map((theme) => (
                  <span key={theme} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'calendar' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-slate-900">Past Entries</h2>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Calendar View Coming Soon</h3>
                <p className="text-slate-600">Browse through your past reflections and see your journey over time</p>
              </div>
            </div>
          </div>
        )}

        {activeView === 'themes' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-slate-900">Explore Themes</h2>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Theme Analysis Coming Soon</h3>
                <p className="text-slate-600">Discover patterns and recurring themes in your reflective journey</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 