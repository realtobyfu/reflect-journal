import { auth } from './firebase';

export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

export interface JournalEntry {
  id: number;
  user_id: number;
  content: string;
  mood?: string;
  mood_score?: number;
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
}

export const apiClient = new ApiClient(); 