'use client';

// @ts-nocheck

import { useState, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MoodSelector } from './mood-selector';
import { MapPin, Camera, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface EntryEditorProps {
  onSave: (entry: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function JournalEntryEditor({ onSave, onCancel, initialData }: EntryEditorProps) {
  const [content, setContent] = useState(initialData?.content || '');
  const [mood, setMood] = useState(initialData?.mood || null);
  const [location, setLocation] = useState(initialData?.location || null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      const entry = await apiClient.createEntry({
        content,
        mood,
        location,
        tags: [],
      });

      // Upload attachments
      for (const file of attachments) {
        await apiClient.uploadAttachment(entry.id, file);
      }

      onSave(entry);
      toast({
        title: 'Success',
        description: 'Entry saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save entry',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Error',
        description: 'Geolocation is not supported',
        variant: 'destructive',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          
          setLocation({
            lat: latitude,
            lng: longitude,
            place_name: data.display_name.split(',')[0] || 'Unknown location',
          });
          
          toast({
            title: 'Location added',
            description: data.display_name.split(',')[0] || 'Location tagged',
          });
        } catch (error) {
          console.error('Geocoding error:', error);
        }
      },
      (error) => {
        toast({
          title: 'Error',
          description: 'Failed to get location',
          variant: 'destructive',
        });
      }
    );
  };

  return (
    <div className="space-y-4">
      <MoodSelector value={mood} onChange={setMood} />

      <div className="relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind today?"
          className="min-h-[200px]"
        />
        <div className="absolute bottom-2 right-2 text-sm text-gray-500">
          {wordCount} words
        </div>
      </div>

      {location && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
          <MapPin className="w-4 h-4" />
          {location.place_name}
          <button
            onClick={() => setLocation(null)}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {attachments.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-20 h-20 object-cover rounded"
              />
              <button
                onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            disabled={!!location}
          >
            <MapPin className="w-4 h-4 mr-1" />
            Location
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="w-4 h-4 mr-1" />
            Photo
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                setAttachments([...attachments, ...Array.from(e.target.files)]);
              }
            }}
            className="hidden"
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!content.trim() || loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Entry
          </Button>
        </div>
      </div>
    </div>
  );
} 