export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'user' | 'admin';
export type RightsStatus = 'public_domain' | 'licensed' | 'owned';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          email: string | null;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          role?: UserRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          role?: UserRole;
          created_at?: string;
        };
      };
      movies: {
        Row: {
          id: string;
          title: string;
          original_title: string | null;
          slug: string;
          description: string | null;
          release_year: number | null;
          duration_minutes: number | null;
          country: string | null;
          language: string | null;
          director: string | null;
          cast_members: string[] | null;
          poster_url: string | null;
          backdrop_url: string | null;
          trailer_url: string | null;
          video_provider: string | null;
          embed_url: string | null;
          rating: number | null;
          view_count: number;
          is_featured: boolean;
          is_published: boolean;
          has_turkish_subtitle: boolean;
          rights_status: RightsStatus | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          original_title?: string | null;
          slug: string;
          description?: string | null;
          release_year?: number | null;
          duration_minutes?: number | null;
          country?: string | null;
          language?: string | null;
          director?: string | null;
          cast_members?: string[] | null;
          poster_url?: string | null;
          backdrop_url?: string | null;
          trailer_url?: string | null;
          video_provider?: string | null;
          embed_url?: string | null;
          rating?: number | null;
          view_count?: number;
          is_featured?: boolean;
          is_published?: boolean;
          has_turkish_subtitle?: boolean;
          rights_status?: RightsStatus | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          original_title?: string | null;
          slug?: string;
          description?: string | null;
          release_year?: number | null;
          duration_minutes?: number | null;
          country?: string | null;
          language?: string | null;
          director?: string | null;
          cast_members?: string[] | null;
          poster_url?: string | null;
          backdrop_url?: string | null;
          trailer_url?: string | null;
          video_provider?: string | null;
          embed_url?: string | null;
          rating?: number | null;
          view_count?: number;
          is_featured?: boolean;
          is_published?: boolean;
          has_turkish_subtitle?: boolean;
          rights_status?: RightsStatus | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      genres: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      movie_genres: {
        Row: {
          movie_id: string;
          genre_id: string;
        };
        Insert: {
          movie_id: string;
          genre_id: string;
        };
        Update: {
          movie_id?: string;
          genre_id?: string;
        };
      };
      subtitles: {
        Row: {
          id: string;
          movie_id: string;
          language: string;
          label: string | null;
          subtitle_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          movie_id: string;
          language: string;
          label?: string | null;
          subtitle_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          movie_id?: string;
          language?: string;
          label?: string | null;
          subtitle_url?: string | null;
          created_at?: string;
        };
      };
      favorites: {
        Row: {
          user_id: string;
          movie_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          movie_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          movie_id?: string;
          created_at?: string;
        };
      };
      watchlist: {
        Row: {
          user_id: string;
          movie_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          movie_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          movie_id?: string;
          created_at?: string;
        };
      };
      watch_history: {
        Row: {
          id: string;
          user_id: string;
          movie_id: string;
          progress_seconds: number;
          completed: boolean;
          last_watched_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          movie_id: string;
          progress_seconds?: number;
          completed?: boolean;
          last_watched_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          movie_id?: string;
          progress_seconds?: number;
          completed?: boolean;
          last_watched_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
