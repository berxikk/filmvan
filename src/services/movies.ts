import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { Movie } from '@/types/movie';

export type MovieRow = Database['public']['Tables']['movies']['Row'];
export type MovieInsert = Database['public']['Tables']['movies']['Insert'];
export type MovieUpdate = Database['public']['Tables']['movies']['Update'];
export type GenreRow = Database['public']['Tables']['genres']['Row'];

const FALLBACK_GENRES: GenreRow[] = [
  { id: '1', name: 'Aksiyon & Macera', slug: 'aksiyon-macera', description: 'Fîlmên bi heyecan, tije tevger û serpêhatiyên wêrek.', created_at: new Date().toISOString() },
  { id: '2', name: 'Dram', slug: 'dram', description: 'Çîrokên kûr ên mirovî û rêwîtiyên hestyarî.', created_at: new Date().toISOString() },
  { id: '3', name: 'Klasîkên Bêdem', slug: 'klasikler', description: 'Şaheserên bêdem ên ku di dîroka sînemayê de cîh girtine.', created_at: new Date().toISOString() },
  { id: '4', name: 'Korku & Gerilim', slug: 'korku-gerilim', description: 'Atmosferên tarî û kêliyên tijî tirs û mereq.', created_at: new Date().toISOString() },
  { id: '5', name: 'Komedi', slug: 'komedi', description: 'Fîlmên tijî ken û şahî ji bo hemû malbatê.', created_at: new Date().toISOString() },
  { id: '6', name: 'Bilim Kurgu & Fantastik', slug: 'bilim-kurgu', description: 'Vîzyonên paşerojê, cîhanên cûda û distopya.', created_at: new Date().toISOString() },
  { id: '7', name: 'Belgefilm (Dokuman)', slug: 'belgesel', description: 'Bûyerên rastîn, sirûşt û belgefilman zanyarî.', created_at: new Date().toISOString() },
  { id: '8', name: 'Anîmasyon & Malbat', slug: 'animasyon', description: 'Fîlmên rengîn û şad ji bo zarok û malbatê.', created_at: new Date().toISOString() },
  { id: '9', name: 'Sûç & Polîsîye', slug: 'polisiye', description: 'Çîrokên razdar ên edaletê, sûç û suddariyê.', created_at: new Date().toISOString() },
  { id: '10', name: 'Dîrokî & Şer', slug: 'tarih', description: 'Bûyerên dîrokî, şerên mezin û destanên berê.', created_at: new Date().toISOString() },
  { id: '11', name: 'Mîstîk & Razdarî', slug: 'gizem', description: 'Fîlmên psikolojîk û sirên nehatine eşkere kirin.', created_at: new Date().toISOString() },
  { id: '12', name: 'Mûzîkal & Hunermendî', slug: 'muzikal', description: 'Ahengên mûzîkî û performansên hunerî.', created_at: new Date().toISOString() },
];

export function mapRowToMovie(m: MovieRow): Movie {
  return {
    id: m.id,
    title: m.title,
    originalTitle: m.original_title || undefined,
    slug: m.slug,
    year: m.release_year || 1920,
    duration: m.duration_minutes ? `${m.duration_minutes} deq` : '90 deq',
    director: m.director || 'Bilinmiyor',
    genres: ['Klasikler'],
    rating: m.rating ? Number(m.rating) : 8.0,
    siteRating: (m as any).site_rating ? Number((m as any).site_rating) : undefined,
    votes: '10K+',
    quality: '1080p',
    posterUrl: m.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: m.backdrop_url || 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1600&q=80',
    description: m.description || '',
    longDescription: m.description || '',
    cast: (m.cast_members || []).map((name) => ({ name, role: 'Lîstikvan' })),
    videoUrl: m.embed_url || '',
    trailerUrl: m.trailer_url || undefined,
    isFeatured: m.is_featured,
    sections: m.is_featured ? ['popular', 'classic'] : ['new', 'classic'],
  };
}

export async function getPublishedMovies(): Promise<Movie[]> {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('is_published', true)
      .order('release_year', { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }
    return (data as MovieRow[]).map(mapRowToMovie);
  } catch (err) {
    return [];
  }
}

export interface PaginatedFilterOptions {
  page?: number;
  limit?: number;
  genre?: string;
  year?: string;
  country?: string;
  language?: string;
  minRating?: string;
  hasSubtitles?: boolean;
  sortBy?: 'newest' | 'oldest' | 'rating' | 'title' | 'most_viewed';
}

export async function getFilteredMovies(options: PaginatedFilterOptions = {}): Promise<{ movies: Movie[]; total: number }> {
  try {
    let query = supabase.from('movies').select('*', { count: 'exact' }).eq('is_published', true);

    if (options.year) {
      query = query.eq('release_year', parseInt(options.year));
    }

    if (options.minRating) {
      query = query.gte('rating', parseFloat(options.minRating));
    }

    if (options.hasSubtitles) {
      query = query.eq('has_turkish_subtitle', true);
    }

    // Sorting
    switch (options.sortBy) {
      case 'oldest':
        query = query.order('release_year', { ascending: true });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'most_viewed':
        query = query.order('view_count', { ascending: false });
        break;
      case 'title':
        query = query.order('title', { ascending: true });
        break;
      case 'newest':
      default:
        query = query.order('release_year', { ascending: false });
        break;
    }

    const { data, error, count } = await query;
    if (error || !data) return { movies: [], total: 0 };

    return {
      movies: (data as MovieRow[]).map(mapRowToMovie),
      total: count || data.length,
    };
  } catch (err) {
    console.error('getFilteredMovies error:', err);
    return { movies: [], total: 0 };
  }
}

export async function getPaginatedPublishedMovies(options: PaginatedFilterOptions = {}): Promise<{ movies: Movie[]; total: number; totalPages: number }> {
  const res = await getFilteredMovies(options);
  const limit = options.limit || 12;
  const totalPages = Math.ceil(res.total / limit) || 1;
  return { ...res, totalPages };
}

export async function searchPublishedMovies(searchTerm: string): Promise<Movie[]> {
  if (!searchTerm || !searchTerm.trim()) return [];

  try {
    const term = `%${searchTerm.trim()}%`;
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('is_published', true)
      .or(`title.ilike.${term},director.ilike.${term},description.ilike.${term}`)
      .order('release_year', { ascending: false });

    if (error || !data) return [];
    return (data as MovieRow[]).map(mapRowToMovie);
  } catch (err) {
    console.error('searchPublishedMovies error:', err);
    return [];
  }
}

export async function getMovieBySlug(slug: string, isAdmin: boolean = false): Promise<Movie | null> {
  try {
    let query = supabase.from('movies').select('*').eq('slug', slug);
    if (!isAdmin) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query.single();
    if (error || !data) return null;

    const movieRow = data as MovieRow;

    // Increment view count asynchronously
    try {
      await (supabase.from('movies') as any)
        .update({ view_count: (movieRow.view_count || 0) + 1 })
        .eq('id', movieRow.id);
    } catch (e) {}

    return mapRowToMovie(movieRow);
  } catch (err) {
    console.error('getMovieBySlug error:', err);
    return null;
  }
}

export async function getFeaturedMovies(): Promise<Movie[]> {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true);

    if (error || !data || data.length === 0) {
      return [];
    }
    return (data as MovieRow[]).map(mapRowToMovie);
  } catch (err) {
    return [];
  }
}

export async function getPopularMovies(): Promise<Movie[]> {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('is_published', true)
      .order('view_count', { ascending: false })
      .limit(6);

    if (error || !data || data.length === 0) {
      return [];
    }
    return (data as MovieRow[]).map(mapRowToMovie);
  } catch (err) {
    return [];
  }
}

export async function getGenres(): Promise<GenreRow[]> {
  try {
    const { data, error } = await supabase.from('genres').select('*').order('name', { ascending: true });
    if (!error && data && data.length > 0) {
      return data as GenreRow[];
    }
    return FALLBACK_GENRES;
  } catch (err) {
    return FALLBACK_GENRES;
  }
}

export async function getAdminMovies(): Promise<MovieRow[]> {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as MovieRow[]) || [];
}

export async function createMovie(movieData: MovieInsert): Promise<MovieRow> {
  const { data, error } = await (supabase.from('movies') as any)
    .insert([movieData])
    .select();

  if (error) throw error;
  if (!data || data.length === 0) {
    return { ...movieData } as MovieRow;
  }
  return data[0] as MovieRow;
}

export async function updateMovie(id: string, movieData: MovieUpdate): Promise<MovieRow> {
  const { data, error } = await (supabase.from('movies') as any)
    .update({ ...movieData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) {
    return { id, ...movieData } as MovieRow;
  }
  return data[0] as MovieRow;
}

export async function deleteMovie(id: string): Promise<void> {
  const { error } = await supabase.from('movies').delete().eq('id', id);
  if (error) throw error;
}

export async function publishMovie(id: string): Promise<void> {
  const { error } = await (supabase.from('movies') as any)
    .update({ is_published: true, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

export async function unpublishMovie(id: string): Promise<void> {
  const { error } = await (supabase.from('movies') as any)
    .update({ is_published: false, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}
