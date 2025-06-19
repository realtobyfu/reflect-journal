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
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('access_token');
    }
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(options.body && !(options.body instanceof FormData) && {
          'Content-Type': 'application/json',
        }),
      },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        this.setToken(null);
        window.location.href = '/login';
      }
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  }

  // Auth endpoints
  async register(data: { email: string; username: string; password: string }): Promise<User> {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(username: string, password: string): Promise<{ access_token: string; token_type: string }> {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    return this.request('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
  }

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