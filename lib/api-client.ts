import { auth } from './firebase';

export interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  created_at: string;
}

export interface JournalEntry {
  id: number;
  user_id: number;
  content: string;
  mood?: string;
  mood_score?: number;
  emotions?: EmotionData;
  energy_level?: number;
  location?: {
    lat: number;
    lng: number;
    place_name: string;
  };
  weather?: any;
  tags: string[];
  word_count: number;
  created_at: string;
  updated_at: string;
  attachments: Attachment[];
}

export interface EmotionData {
  primary: {
    emotion: string;
    intensity: number;
  };
  secondary?: string[];
  energy: number;
  context?: {
    location?: string;
    activity?: string;
    social?: boolean;
    trigger?: string;
  };
}

export interface EmotionSuggestion {
  emotion: string;
  intensity: number;
  reason: string;
}

export interface EmotionPattern {
  emotion: string;
  frequency: number;
  avg_intensity: number;
  trend: string;
}

export interface EmotionHistoryResponse {
  patterns: EmotionPattern[];
  recent_emotions: EmotionData[];
  insights: string[];
}

export interface Attachment {
  id: number;
  type: string;
  url: string;
  thumbnail_url?: string;
  metadata: any;
  created_at: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Get Firebase ID token if available
    let idToken: string | null = null;
    if (auth.currentUser) {
      try {
      idToken = await auth.currentUser.getIdToken();
      } catch (error) {
        console.error('Failed to get Firebase token:', error);
      }
    } else if (this.token) {
      idToken = this.token;
    }

    const headers: Record<string, string> = {
      ...options.headers as Record<string, string>,
      ...(idToken && { Authorization: `Bearer ${idToken}` }),
    };

    // Set JSON content type when needed
    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = { ...options, headers };

    try {
      console.log('API Request:', {
        url,
        method: options.method || 'GET',
        headers: { ...headers, Authorization: headers.Authorization ? '***' : undefined },
        body: options.body
      });

    const response = await fetch(url, config);
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
      if (response.status === 401) {
        this.setToken(null);
          if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
        }
        throw new Error(`API Error: ${response.statusText} - ${errorText}`);
    }
    
      const result = await response.json();
      console.log('API Success Response:', result);
      return result;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get current user (Firebase creates user automatically)
  async getMe(): Promise<User> {
    return this.request('/api/auth/me');
  }

  // Update current user profile
  async updateMe(data: {
    first_name?: string;
    last_name?: string;
    email?: string;
    username?: string;
    password?: string;
  }): Promise<User> {
    return this.request('/api/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Journal entries
  async createEntry(data: {
    content: string;
    mood?: string;
    location?: { lat: number; lng: number; place_name: string };
    tags?: string[];
  }): Promise<JournalEntry> {
    return this.request('/api/entries/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEntries(params?: {
    skip?: number;
    limit?: number;
    start_date?: string;
    end_date?: string;
    mood?: string;
  }): Promise<JournalEntry[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/api/entries/?${searchParams}`);
  }

  async getEntry(id: number): Promise<JournalEntry> {
    return this.request(`/api/entries/${id}`);
  }

  async updateEntry(id: number, data: Partial<JournalEntry>): Promise<JournalEntry> {
    return this.request(`/api/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEntry(id: number): Promise<void> {
    await this.request(`/api/entries/${id}`, {
      method: 'DELETE',
    });
  }

  async uploadAttachment(entryId: number, file: File): Promise<Attachment> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.request(`/api/entries/${entryId}/attachments`, {
      method: 'POST',
      body: formData,
    });
  }

  async getStats(): Promise<{
    total_entries: number;
    week_word_count: number;
    current_streak: number;
    mood_distribution: Record<string, number>;
  }> {
    return this.request('/api/stats');
  }

  // AI Features
  async getDailyPrompts(): Promise<any[]> {
    return this.request('/api/ai/prompts/daily');
  }

  async analyzeEntry(entryId: number): Promise<any> {
    return this.request(`/api/ai/entries/${entryId}/analyze`, {
      method: 'POST',
    });
  }

  async getReflection(entryId: number): Promise<{ reflection: string }> {
    return this.request(`/api/ai/entries/${entryId}/reflect`, {
      method: 'POST',
    });
  }

  async getInsights(): Promise<any> {
    return this.request('/api/ai/insights');
  }

  async getThemes(limit: number = 30): Promise<any> {
    return this.request(`/api/ai/themes?limit=${limit}`);
  }

  // Search
  async searchEntries(params: {
    q?: string;
    mood?: string;
    start_date?: string;
    end_date?: string;
    has_location?: boolean;
    tags?: string;
    sort_by?: string;
    order?: string;
    skip?: number;
    limit?: number;
  }): Promise<JournalEntry[]> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    return this.request(`/api/search/entries/search?${searchParams}`);
  }

  async getSearchSuggestions(q: string): Promise<{
    moods: string[];
    locations: string[];
    tags: string[];
  }> {
    return this.request(`/api/search/entries/suggestions?q=${encodeURIComponent(q)}`);
  }

  async getCalendarEntries(year: number, month: number): Promise<any> {
    return this.request(`/api/search/entries/calendar?year=${year}&month=${month}`);
  }

  // Export
  async exportToCSV(startDate?: string, endDate?: string): Promise<Blob> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await fetch(
      `${this.baseUrl}/api/export/csv?${params}`,
      {
        headers: {
          Authorization: `Bearer ${await this.getAuthToken()}`,
        },
      }
    );
    
    if (!response.ok) throw new Error('Export failed');
    return response.blob();
  }

  async exportToPDF(startDate?: string, endDate?: string): Promise<Blob> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await fetch(
      `${this.baseUrl}/api/export/pdf?${params}`,
      {
        headers: {
          Authorization: `Bearer ${await this.getAuthToken()}`,
        },
      }
    );
    
    if (!response.ok) throw new Error('Export failed');
    return response.blob();
  }

  async exportToJSON(): Promise<Blob> {
    const response = await fetch(
      `${this.baseUrl}/api/export/json`,
      {
        headers: {
          Authorization: `Bearer ${await this.getAuthToken()}`,
        },
      }
    );
    
    if (!response.ok) throw new Error('Export failed');
    return response.blob();
  }

  // Emotion System API
  async updateEntryEmotions(entryId: number, emotionData: EmotionData): Promise<{ message: string; entry_id: number }> {
    return this.request(`/api/emotions/entries/${entryId}/emotions`, {
      method: 'POST',
      body: JSON.stringify(emotionData),
    });
  }

  async getEmotionSuggestions(): Promise<EmotionSuggestion[]> {
    return this.request('/api/emotions/suggestions');
  }

  async getEmotionHistory(days: number = 30): Promise<EmotionHistoryResponse> {
    return this.request(`/api/emotions/history?days=${days}`);
  }

  private async getAuthToken(): Promise<string | null> {
    if (auth.currentUser) {
      return auth.currentUser.getIdToken();
    }
    return this.token;
  }
}

export const apiClient = new ApiClient();