import React from 'react';
import { Movie } from '@/types/movie';
import { MovieCard } from '@/components/movie/MovieCard';
import { Film } from 'lucide-react';

export interface MovieGridProps {
  movies: Movie[];
  watchlistIds?: string[];
  onToggleWatchlist?: (id: string) => void;
  emptyMessage?: string;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies = [],
  watchlistIds = [],
  onToggleWatchlist,
  emptyMessage = 'Li gorî van krîteran fîlm nehat dîtin.',
}) => {
  const validMovies = (movies || []).filter((m) => m && m.id);

  if (validMovies.length === 0) {
    return (
      <div className="py-20 text-center glass-panel rounded-3xl p-8 space-y-4 max-w-md mx-auto my-8 border border-white/10">
        <div className="w-16 h-16 rounded-2xl bg-white/5 text-cinema-300 flex items-center justify-center mx-auto border border-white/10">
          <Film className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white uppercase">Encam Nehat Dîtin</h3>
          <p className="text-xs text-cinema-300">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
      {validMovies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isInWatchlist={watchlistIds.includes(movie.id)}
          onToggleWatchlist={onToggleWatchlist}
        />
      ))}
    </div>
  );
};
