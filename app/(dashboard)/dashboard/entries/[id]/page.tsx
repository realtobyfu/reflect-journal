'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit3, Trash2, Calendar, MapPin, Hash, Clock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const moods = [
  { value: 'amazing', label: '😊', name: 'Amazing', color: 'text-green-600', bg: 'bg-green-50' },
  { value: 'good', label: '🙂', name: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' },
  { value: 'okay', label: '😐', name: 'Okay', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { value: 'bad', label: '😕', name: 'Bad', color: 'text-orange-600', bg: 'bg-orange-50' },
  { value: 'terrible', label: '😢', name: 'Terrible', color: 'text-red-600', bg: 'bg-red-50' },
];

export default function EntryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [entry, setEntry] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editMood, setEditMood] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchEntry();
  }, [params.id]);

  const fetchEntry = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getEntry(params.id);
      setEntry(data);
      setEditContent(data.content);
      setEditMood(data.mood || '');
    } catch (error) {
      console.error('Failed to fetch entry:', error);
      router.push('/dashboard/entries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editContent.trim()) return;

    setIsSaving(true);
    try {
      const updated = await apiClient.updateEntry(params.id, {
        content: editContent,
        mood: editMood || undefined,
      });
      setEntry(updated);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.deleteEntry(params.id);
      router.push('/dashboard/entries');
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout activeSection="entries">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!entry) {
    return (
      <DashboardLayout activeSection="entries">
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-neutral-600">Entry not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const currentMood = moods.find(m => m.value === (isEditing ? editMood : entry.mood));

  return (
    <DashboardLayout activeSection="entries">
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/dashboard/entries"
                className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Entries
              </Link>
              
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-error hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditContent(entry.content);
                        setEditMood(entry.mood || '');
                      }}
                      className="px-4 py-2 text-neutral-600 hover:text-neutral-900 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving || !editContent.trim()}
                      className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                        "bg-primary-600 text-white hover:bg-primary-700",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            {/* Entry Metadata */}
            <div className="px-6 py-6 border-b border-neutral-100">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-neutral-900 flex items-center gap-3">
                    {format(new Date(entry.created_at), 'EEEE, MMMM d, yyyy')}
                    {currentMood && (
                      <span className="text-3xl">{currentMood.label}</span>
                    )}
                  </h1>
                  <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {format(new Date(entry.created_at), 'h:mm a')}
                    </span>
                    {entry.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {entry.location}
                      </span>
                    )}
                    <span>{entry.word_count} words</span>
                  </div>
                </div>
              </div>

              {/* Mood Editor (when editing) */}
              {isEditing && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Mood
                  </label>
                  <div className="flex gap-2">
                    {moods.map((mood) => (
                      <button
                        key={mood.value}
                        onClick={() => setEditMood(mood.value)}
                        className={cn(
                          "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200",
                          editMood === mood.value
                            ? `${mood.bg} ${mood.color} ring-2 ring-offset-2 ring-current`
                            : "bg-neutral-50 hover:bg-neutral-100"
                        )}
                      >
                        <span className="text-xl">{mood.label}</span>
                        <span className="text-xs">{mood.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Entry Content */}
            <div className="px-6 py-6">
              {isEditing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full min-h-[400px] text-lg leading-relaxed resize-none focus:outline-none"
                  autoFocus
                />
              ) : (
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg leading-relaxed text-neutral-800 whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </div>
              )}
            </div>

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="px-6 py-4 border-t border-neutral-100">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-neutral-400" />
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Related Insights */}
          {entry.sentiment_score !== null && (
            <div className="mt-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
              <h3 className="text-lg font-semibold text-primary-900 mb-3">Entry Insights</h3>
              <div className="space-y-2 text-sm text-primary-700">
                <p>
                  Sentiment: {entry.sentiment_score > 0.6 ? 'Positive' : entry.sentiment_score < -0.6 ? 'Negative' : 'Neutral'}
                  ({(entry.sentiment_score * 100).toFixed(0)}%)
                </p>
                {entry.themes && entry.themes.length > 0 && (
                  <p>Themes: {entry.themes.join(', ')}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Delete Entry?
              </h3>
              <p className="text-neutral-600 mb-6">
                This action cannot be undone. This entry will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 text-white bg-error hover:bg-error-dark rounded-lg transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}