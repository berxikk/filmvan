import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Movie } from '@/types/movie';
import { MovieCard } from '@/components/movie/MovieCard';

export interface MovieSectionProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  viewAllLink?: string;
  watchlistIds?: string[];
  onToggleWatchlist?: (id: string) => void;
  icon?: React.ReactNode;
}

export const MovieSection: React.FC<MovieSectionProps> = ({
  title,
  subtitle,
  movies = [],
  viewAllLink,
  watchlistIds = [],
  onToggleWatchlist,
  icon,
}) => {
  const validMovies = (movies || []).filter((m) => m && m.id);
  if (validMovies.length === 0) return null;

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-end justify-between border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs text-cinema-300 font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="group inline-flex items-center gap-1 text-xs font-semibold text-cinema-300 hover:text-accent transition-colors"
          >
            <span>Hemûyan Bibîne</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      {/* Movies Grid */}
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
    </section>
  );
};
