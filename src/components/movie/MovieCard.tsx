import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Star } from 'lucide-react';
import { Movie } from '@/types/movie';
import { Badge } from '@/components/ui/Badge';
import { FavoriteButton } from '@/components/movie/FavoriteButton';
import { WatchlistButton } from '@/components/movie/WatchlistButton';
import { formatRating } from '@/lib/utils';

export interface MovieCardProps {
  movie: Movie;
  isInWatchlist?: boolean;
  watchlistIds?: string[];
  onToggleWatchlist?: (id: string) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  if (!movie || !movie.id) return null;

  const poster = movie.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-accent/40 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-1">
      {/* Poster Media */}
      <div className="aspect-[2/3] w-full relative overflow-hidden bg-cinema-900">
        <img
          src={poster}
          alt={movie.title || 'Afîşa Fîlm'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-950 via-cinema-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" />

        {/* Top Badges & Actions (z-20: sits above hover blur overlay) */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20">
          <Badge variant="accent" className="font-bold text-[10px] tracking-wider uppercase backdrop-blur-md">
            {movie.year || 2024}
          </Badge>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 backdrop-blur-md bg-black/60 p-1 rounded-xl border border-white/20 opacity-90 group-hover:opacity-100 transition-opacity">
            <FavoriteButton movieId={movie.id} size="sm" className="w-7 h-7 p-0 border-none bg-transparent hover:scale-110 transition-transform" />
            <WatchlistButton movieId={movie.id} className="w-7 h-7 p-0 border-none bg-transparent hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Hover Play Overlay (z-10: sits behind badges & buttons) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-black/40 backdrop-blur-xs">
          <Link to={`/watch/${movie.slug}`} className="z-10">
            <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-xl shadow-accent/50 scale-75 group-hover:scale-100 transition-transform duration-300 hover:bg-accent-hover">
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </div>
          </Link>
        </div>

        {/* Bottom Quick Info (z-20: sits above hover blur overlay) */}
        <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between text-xs text-cinema-300 pointer-events-none">
          <div className="flex items-center gap-1 font-bold text-amber-400 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg border border-amber-400/30">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{formatRating(movie.rating || 8.0)}</span>
          </div>
          <span className="text-[11px] font-semibold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10">
            {movie.duration || '90 deq'}
          </span>
        </div>
      </div>

      {/* Title & Metadata */}
      <div className="p-4 space-y-1 bg-cinema-950/90 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/movie/${movie.slug}`} className="font-bold text-white text-sm hover:text-accent transition-colors line-clamp-1">
            {movie.title}
          </Link>
          <p className="text-[11px] text-cinema-300 line-clamp-1">
            {movie.director || 'Nenas'}
          </p>
        </div>
      </div>
    </div>
  );
};
