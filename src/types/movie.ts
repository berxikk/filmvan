export interface CastMember {
  name: string;
  role: string;
  avatarUrl?: string;
}

export type VideoQuality = '4K' | '1080p' | '720p';

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  slug: string;
  year: number;
  duration: string;
  director: string;
  genres: string[];
  rating: number; // IMDb Rating
  siteRating?: number; // Fîlîmvan Platform Rating
  votes: string;
  quality: VideoQuality;
  posterUrl: string;
  backdropUrl: string;
  description: string;
  longDescription: string;
  cast: CastMember[];
  videoUrl: string;
  trailerUrl?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isClassic?: boolean;
  sections: ('new' | 'popular' | 'classic' | 'action' | 'drama')[];
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  movieCount: number;
  coverUrl: string;
}

export interface FilterOptions {
  query?: string;
  genre?: string;
  year?: string;
  sortBy?: 'rating' | 'year' | 'title' | 'popular';
}
