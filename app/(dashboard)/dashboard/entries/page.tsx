'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { apiClient } from '@/lib/api-client';
import { Search, Calendar, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
// Simple debounce function to avoid lodash dependency
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const moods = [
  { value: 'amazing', label: '😊', color: 'text-green-600', bg: 'bg-green-50' },
  { value: 'good', label: '🙂', color: 'text-blue-600', bg: 'bg-blue-50' },
  { value: 'okay', label: '😐', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { value: 'bad', label: '😕', color: 'text-orange-600', bg: 'bg-orange-50' },
  { value: 'terrible', label: '😢', color: 'text-red-600', bg: 'bg-red-50' },
];

export default function EntriesPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 10;

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      await fetchEntries(1, query, selectedMood, selectedDate);
    }, 300),
    [selectedMood, selectedDate]
  );

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    } else {
      fetchEntries(currentPage, '', selectedMood, selectedDate);
    }
  }, [searchQuery, selectedMood, selectedDate, currentPage]);

  const fetchEntries = async (page = 1, search = '', mood = '', date = '') => {
    try {
      setIsLoading(true);
      const params: any = {
        skip: (page - 1) * itemsPerPage,
        limit: itemsPerPage,
      };

      if (search) params.search = search;
      if (mood) params.mood = mood;
      if (date) {
        params.start_date = date;
        params.end_date = date;
      }

      const response = await apiClient.getEntries(params);
      // Handle API response - it returns an array directly
      const entriesArray = Array.isArray(response) ? response : [];
      setEntries(entriesArray);
      setTotalPages(Math.ceil(entriesArray.length / itemsPerPage));
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
      // Set empty array on error to prevent undefined issues
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMood('');
    setSelectedDate('');
    setCurrentPage(1);
  };

  return (
    <DashboardLayout activeSection="entries">
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-neutral-900">Your Entries</h1>
                <p className="text-neutral-600 mt-1">
                  Browse and search through all your journal entries
                </p>
              </div>
              
              <Link
                href="/dashboard/entries/new"
                className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                New Entry
              </Link>
            </div>

            {/* Search and Filters */}
            <div className="mt-6 space-y-4">
              <div className="flex gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your entries..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium transition-colors",
                    showFilters
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
                  )}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {(selectedMood || selectedDate) && (
                    <span className="ml-1 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                      {[selectedMood, selectedDate].filter(Boolean).length}
                    </span>
                  )}
                </button>
              </div>

              {/* Filter Options */}
              {showFilters && (
                <div className="flex flex-wrap gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  {/* Mood Filter */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Filter by mood
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedMood('')}
                        className={cn(
                          "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                          !selectedMood
                            ? "bg-primary-100 text-primary-700"
                            : "bg-white text-neutral-600 hover:bg-neutral-100"
                        )}
                      >
                        All
                      </button>
                      {moods.map((mood) => (
                        <button
                          key={mood.value}
                          onClick={() => setSelectedMood(mood.value)}
                          className={cn(
                            "px-3 py-1.5 rounded-md text-lg transition-colors",
                            selectedMood === mood.value
                              ? `${mood.bg} ring-2 ring-offset-1 ring-current`
                              : "bg-white hover:bg-neutral-100"
                          )}
                        >
                          {mood.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Filter */}
                  <div className="min-w-[200px]">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Filter by date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-3 py-1.5 rounded-md border border-neutral-300 text-sm"
                    />
                  </div>

                  {/* Clear Filters */}
                  {(selectedMood || selectedDate) && (
                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        className="px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-900"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Entries List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : entries.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
              <p className="text-neutral-600">
                {searchQuery || selectedMood || selectedDate
                  ? 'No entries found matching your filters.'
                  : 'No entries yet. Start writing your first entry!'}
              </p>
              {!searchQuery && !selectedMood && !selectedDate && (
                <Link
                  href="/dashboard/entries/new"
                  className="inline-flex items-center justify-center mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Create Your First Entry
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {entries.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/dashboard/entries/${entry.id}`}
                    className="block bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md hover:border-neutral-300 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <time className="text-sm font-medium text-neutral-900">
                            {format(new Date(entry.created_at), 'EEEE, MMMM d, yyyy')}
                          </time>
                          {entry.mood && (
                            <span className="text-lg">
                              {moods.find(m => m.value === entry.mood)?.label}
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-700 line-clamp-3">
                          {entry.content}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-xs text-neutral-500">
                            {entry.word_count} words
                          </span>
                          {entry.location && (
                            <>
                              <span className="text-neutral-300">•</span>
                              <span className="text-xs text-neutral-500">
                                📍 {entry.location}
                              </span>
                            </>
                          )}
                          {entry.tags && entry.tags.length > 0 && (
                            <>
                              <span className="text-neutral-300">•</span>
                              <div className="flex gap-1">
                                {entry.tags.slice(0, 3).map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {entry.tags.length > 3 && (
                                  <span className="text-xs text-neutral-500">
                                    +{entry.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      currentPage === 1
                        ? "text-neutral-300 cursor-not-allowed"
                        : "text-neutral-600 hover:bg-neutral-100"
                    )}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        if (totalPages <= 7) return true;
                        if (page === 1 || page === totalPages) return true;
                        if (Math.abs(page - currentPage) <= 1) return true;
                        if (page === currentPage - 2 || page === currentPage + 2) return false;
                        return false;
                      })
                      .map((page, index, array) => (
                        <div key={page} className="flex items-center">
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 text-neutral-400">...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={cn(
                              "w-10 h-10 rounded-lg font-medium transition-colors",
                              currentPage === page
                                ? "bg-primary-600 text-white"
                                : "text-neutral-600 hover:bg-neutral-100"
                            )}
                          >
                            {page}
                          </button>
                        </div>
                      ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      currentPage === totalPages
                        ? "text-neutral-300 cursor-not-allowed"
                        : "text-neutral-600 hover:bg-neutral-100"
                    )}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}