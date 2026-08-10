// TMDB API Service for Auto-fetching Movie Metadata in English & Translating Overview to Kurdish

const DEFAULT_TMDB_API_KEY = '83513ce3d9ed386e3d2e5a668630c3d5';

export interface TMDBMovieSearchResult {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: { id: number; name: string }[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { iso_639_1: string; english_name: string; name: string }[];
  director: string;
  cast: { name: string; role: string }[];
}

function getApiKey(customKey?: string): string {
  return customKey || import.meta.env.VITE_TMDB_API_KEY || DEFAULT_TMDB_API_KEY;
}

/**
 * Free Auto-Translation to Kurmanji Kurdish (ku)
 */
export async function translateToKurdish(text: string): Promise<string> {
  if (!text || !text.trim()) return '';
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ku&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) return text;
    const data = await res.json();
    if (data && data[0] && Array.isArray(data[0])) {
      const translatedText = data[0].map((item: any) => item[0]).filter(Boolean).join('');
      return translatedText || text;
    }
    return text;
  } catch (err) {
    console.error('Translation error:', err);
    return text;
  }
}

export async function searchTMDBMovies(query: string, apiKey?: string): Promise<TMDBMovieSearchResult[]> {
  if (!query || !query.trim()) return [];
  const key = getApiKey(apiKey);
  // Fetch in English (en-US)
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&query=${encodeURIComponent(query)}&page=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('TMDB Arama Başarısız');
    const data = await res.json();
    return (data.results || []).slice(0, 8);
  } catch (err) {
    console.error('TMDB Search Error:', err);
    return [];
  }
}

export async function fetchTMDBMovieDetails(tmdbId: number | string, apiKey?: string): Promise<TMDBMovieDetails | null> {
  const key = getApiKey(apiKey);
  // Fetch in English (en-US)
  const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${key}&language=en-US&append_to_response=credits`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('TMDB Detay Getirilemedi');
    const data = await res.json();

    // Extract Director
    const directorObj = data.credits?.crew?.find((c: any) => c.job === 'Director');
    const director = directorObj ? directorObj.name : 'Unknown';

    // Extract Top 5 Cast Members
    const cast = (data.credits?.cast || []).slice(0, 5).map((c: any) => ({
      name: c.name,
      role: c.character || 'Lîstikvan',
    }));

    // Helper for TMDB image path
    const getPosterUrl = (path: string | null) => {
      if (!path) return null;
      return path.startsWith('http') ? path : `https://image.tmdb.org/t/p/w500${path}`;
    };

    const getBackdropUrl = (path: string | null) => {
      if (!path) return null;
      return path.startsWith('http') ? path : `https://image.tmdb.org/t/p/original${path}`;
    };

    // Auto-translate English overview to Kurmanji Kurdish
    const rawOverview = data.overview || '';
    const kurdishOverview = rawOverview ? await translateToKurdish(rawOverview) : '';

    return {
      id: data.id,
      title: data.title || data.original_title,
      original_title: data.original_title || data.title,
      overview: kurdishOverview || rawOverview,
      release_date: data.release_date || '',
      runtime: data.runtime || null,
      vote_average: data.vote_average ? Number(data.vote_average.toFixed(1)) : 8.0,
      poster_path: getPosterUrl(data.poster_path),
      backdrop_path: getBackdropUrl(data.backdrop_path),
      genres: data.genres || [],
      production_countries: data.production_countries || [],
      spoken_languages: data.spoken_languages || [],
      director,
      cast,
    };
  } catch (err) {
    console.error('TMDB Fetch Details Error:', err);
    return null;
  }
}
