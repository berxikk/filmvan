import { supabase } from '@/lib/supabase';
import { Movie, Genre } from '@/types/movie';
import { Database } from '@/types/database';
import { MOCK_MOVIES, MOCK_GENRES } from '@/services/mockData';

type MovieRow = Database['public']['Tables']['movies']['Row'];
type GenreRow = Database['public']['Tables']['genres']['Row'];

export async function fetchPublishedMovies(): Promise<Movie[]> {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('is_published', true)
      .order('release_year', { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_MOVIES;
    }

    const dbMovies = data as unknown as MovieRow[];

    return dbMovies.map((m) => ({
      id: m.id,
      title: m.title,
      originalTitle: m.original_title || undefined,
      slug: m.slug,
      year: m.release_year || 1920,
      duration: m.duration_minutes ? `${m.duration_minutes} dk` : '90 dk',
      director: m.director || 'Bilinmiyor',
      genres: ['Klasikler'],
      rating: m.rating ? Number(m.rating) : 8.0,
      votes: '10K+',
      quality: '1080p',
      posterUrl: m.poster_url || MOCK_MOVIES[0].posterUrl,
      backdropUrl: m.backdrop_url || MOCK_MOVIES[0].backdropUrl,
      description: m.description || '',
      longDescription: m.description || '',
      cast: (m.cast_members || []).map((name: string) => ({ name, role: 'Oyuncu' })),
      videoUrl: m.embed_url || MOCK_MOVIES[0].videoUrl,
      trailerUrl: m.trailer_url || undefined,
      isFeatured: m.is_featured,
      sections: m.is_featured ? ['popular', 'classic'] : ['new', 'classic'],
    }));
  } catch (err) {
    console.warn('Supabase fetch error, fallback mock data:', err);
    return MOCK_MOVIES;
  }
}

export async function fetchGenres(): Promise<Genre[]> {
  try {
    const { data, error } = await supabase
      .from('genres')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_GENRES;
    }

    const dbGenres = data as unknown as GenreRow[];

    return dbGenres.map((g) => ({
      id: g.id,
      name: g.name,
      slug: g.slug,
      description: g.description || '',
      iconName: 'Film',
      movieCount: 10,
      coverUrl: MOCK_GENRES[0].coverUrl,
    }));
  } catch (err) {
    return MOCK_GENRES;
  }
}
