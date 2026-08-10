import { supabase } from '@/lib/supabase';
import { Movie } from '@/types/movie';
import { mapRowToMovie, MovieRow } from '@/services/movies';

export type HistoryItem = {
  id: string;
  user_id: string;
  movie_id: string;
  progress_seconds: number;
  completed: boolean;
  last_watched_at: string;
  movie: Movie;
};

// FAVORITES
export async function getUserFavorites(): Promise<Movie[]> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('movie_id, movies(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data
      .map((item: any) => item.movies)
      .filter((m: MovieRow | null) => m && m.is_published)
      .map((m: MovieRow) => mapRowToMovie(m));
  } catch (err) {
    console.error('Error fetching favorites:', err);
    return [];
  }
}

export async function checkIsFavorite(movieId: string): Promise<boolean> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) return false;

  const { data } = await supabase
    .from('favorites')
    .select('movie_id')
    .eq('user_id', userId)
    .eq('movie_id', movieId)
    .maybeSingle();

  return !!data;
}

export async function toggleFavorite(movieId: string): Promise<boolean> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) throw new Error('Unauthenticated');

  const isFav = await checkIsFavorite(movieId);
  if (isFav) {
    await supabase.from('favorites').delete().eq('user_id', userId).eq('movie_id', movieId);
    return false;
  } else {
    await (supabase.from('favorites') as any).insert([{ user_id: userId, movie_id: movieId }]);
    return true;
  }
}

// WATCHLIST
export async function getUserWatchlist(): Promise<Movie[]> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('watchlist')
      .select('movie_id, movies(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data
      .map((item: any) => item.movies)
      .filter((m: MovieRow | null) => m && m.is_published)
      .map((m: MovieRow) => mapRowToMovie(m));
  } catch (err) {
    console.error('Error fetching watchlist:', err);
    return [];
  }
}

export async function checkIsInWatchlist(movieId: string): Promise<boolean> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) return false;

  const { data } = await supabase
    .from('watchlist')
    .select('movie_id')
    .eq('user_id', userId)
    .eq('movie_id', movieId)
    .maybeSingle();

  return !!data;
}

export async function toggleWatchlist(movieId: string): Promise<boolean> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) throw new Error('Unauthenticated');

  const inList = await checkIsInWatchlist(movieId);
  if (inList) {
    await supabase.from('watchlist').delete().eq('user_id', userId).eq('movie_id', movieId);
    return false;
  } else {
    await (supabase.from('watchlist') as any).insert([{ user_id: userId, movie_id: movieId }]);
    return true;
  }
}

// WATCH HISTORY & CONTINUE WATCHING
export async function getUserWatchHistory(): Promise<HistoryItem[]> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('watch_history')
      .select('*, movies(*)')
      .eq('user_id', userId)
      .order('last_watched_at', { ascending: false });

    if (error || !data) return [];

    return data
      .filter((item: any) => item.movies && item.movies.is_published)
      .map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        movie_id: item.movie_id,
        progress_seconds: item.progress_seconds || 0,
        completed: item.completed || false,
        last_watched_at: item.last_watched_at,
        movie: mapRowToMovie(item.movies as MovieRow),
      }));
  } catch (err) {
    console.error('Error fetching watch history:', err);
    return [];
  }
}

export async function getContinueWatching(): Promise<HistoryItem[]> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('watch_history')
      .select('*, movies(*)')
      .eq('user_id', userId)
      .eq('completed', false)
      .gt('progress_seconds', 10)
      .order('last_watched_at', { ascending: false })
      .limit(6);

    if (error || !data) return [];

    return data
      .filter((item: any) => item.movies && item.movies.is_published)
      .map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        movie_id: item.movie_id,
        progress_seconds: item.progress_seconds || 0,
        completed: item.completed || false,
        last_watched_at: item.last_watched_at,
        movie: mapRowToMovie(item.movies as MovieRow),
      }));
  } catch (err) {
    console.error('Error fetching continue watching:', err);
    return [];
  }
}

export async function updateWatchProgress(
  movieId: string,
  progressSeconds: number,
  durationSeconds: number
): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) return;

  const completed = durationSeconds > 0 && progressSeconds / durationSeconds > 0.9;

  try {
    await (supabase.from('watch_history') as any).upsert(
      {
        user_id: userId,
        movie_id: movieId,
        progress_seconds: Math.floor(progressSeconds),
        completed,
        last_watched_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,movie_id' }
    );
  } catch (err) {
    console.error('Error updating watch progress:', err);
  }
}

export async function deleteHistoryItem(id: string): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) return;

  await supabase.from('watch_history').delete().eq('id', id).eq('user_id', userId);
}

// MOVIE RATINGS
export async function getUserMovieRating(movieId: string): Promise<number | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) return null;

  try {
    const { data } = await (supabase.from('movie_ratings') as any)
      .select('score')
      .eq('user_id', userId)
      .eq('movie_id', movieId)
      .maybeSingle();

    return data?.score ? Number(data.score) : null;
  } catch (err) {
    return null;
  }
}

export async function getMovieSiteRating(movieId: string): Promise<{ average: number | null; count: number }> {
  if (!movieId) return { average: null, count: 0 };
  try {
    const { data, error } = await (supabase.from('movie_ratings') as any)
      .select('score')
      .eq('movie_id', movieId);

    if (!error && data && data.length > 0) {
      const total = (data as any[]).reduce((sum, r) => sum + Number(r.score), 0);
      const avg = Number((total / data.length).toFixed(1));
      return { average: avg, count: data.length };
    }
    return { average: null, count: 0 };
  } catch (err) {
    return { average: null, count: 0 };
  }
}

export async function rateMovie(movieId: string, score: number): Promise<{ success: boolean; averageRating?: number }> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) {
    throw new Error('Ji bo ku hûn pûan bidin ji kerema xwe têkevin hesabê xwe.');
  }

  try {
    // 1. Try upserting individual rating into Supabase movie_ratings table
    const { error: ratingErr } = await (supabase.from('movie_ratings') as any).upsert(
      {
        user_id: userId,
        movie_id: movieId,
        score: score,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,movie_id' }
    );

    if (ratingErr) {
      console.error('movie_ratings upsert error:', ratingErr);
    }

    // 2. Fetch all ratings from Supabase for this movie to calculate exact site average
    let avg = score;
    const { data: allRatings } = await (supabase.from('movie_ratings') as any)
      .select('score')
      .eq('movie_id', movieId);

    if (allRatings && allRatings.length > 0) {
      const total = (allRatings as any[]).reduce((sum, r) => sum + Number(r.score), 0);
      avg = Number((total / allRatings.length).toFixed(1));
    }

    // 3. Try updating site_rating on movies table if column exists
    try {
      await (supabase.from('movies') as any)
        .update({ site_rating: avg, updated_at: new Date().toISOString() })
        .eq('id', movieId);
    } catch (e) {
      // ignore if site_rating column is missing on movies table
    }

    return { success: true, averageRating: avg };
  } catch (err) {
    console.error('rateMovie Error:', err);
    return { success: false };
  }
}
