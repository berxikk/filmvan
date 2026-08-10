import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getGenres, getPaginatedPublishedMovies } from '@/services/movies';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { MovieGridSkeleton } from '@/components/movie/MovieSkeleton';
import { FolderKanban, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const GenreDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);

  const { data: genres = [] } = useQuery({
    queryKey: ['genres-list'],
    queryFn: getGenres,
  });

  const currentGenre = genres.find((g) => g.slug === slug);

  const { data: result, isLoading } = useQuery({
    queryKey: ['genre-movies', slug],
    queryFn: () =>
      getPaginatedPublishedMovies({
        genre: slug,
        limit: 12,
        sortBy: 'newest',
      }),
  });

  const movies = result?.movies || [];

  const toggleWatchlist = (id: string) => {
    setWatchlistIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8 animate-fade-in">
      {/* Back & Header */}
      <div className="space-y-4 border-b border-white/10 pb-6">
        <Link to="/genres">
          <Button variant="ghost" size="sm" className="border border-white/10 text-xs gap-1.5 rounded-xl">
            <ChevronLeft className="w-4 h-4" />
            <span>Tüm Türlere Dön</span>
          </Button>
        </Link>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider">
            <FolderKanban className="w-4 h-4" />
            Kategori Filmleri
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            {currentGenre?.name || 'Tür Detayı'}
          </h1>
          <p className="text-sm text-cinema-300">
            {currentGenre?.description || 'Bu türdeki restore edilmiş yayınlanmış tüm filmler.'}
          </p>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <MovieGridSkeleton count={6} />
      ) : movies.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-white/10 max-w-md mx-auto space-y-3">
          <h2 className="text-sm font-bold text-white uppercase">Bu Türde Film Bulunamadı</h2>
          <p className="text-xs text-cinema-300">
            Bu kategoriye ait yayınlanmış film bulunmuyor.
          </p>
          <Link to="/movies">
            <Button variant="secondary" size="sm" className="rounded-xl">Tüm Kataloğu Gör</Button>
          </Link>
        </div>
      ) : (
        <MovieGrid
          movies={movies}
          watchlistIds={watchlistIds}
          onToggleWatchlist={toggleWatchlist}
        />
      )}
    </div>
  );
};
