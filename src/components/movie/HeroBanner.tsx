import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus, Check, Star, Info } from 'lucide-react';
import { Movie } from '@/types/movie';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatRating } from '@/lib/utils';

export interface HeroBannerProps {
  movie: Movie;
  isInWatchlist?: boolean;
  onToggleWatchlist?: (movieId: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movie,
  isInWatchlist = false,
  onToggleWatchlist,
}) => {
  if (!movie) return null;

  const backdrop = movie.backdropUrl || movie.posterUrl || 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1600&q=80';

  return (
    <div className="relative w-full h-[85vh] min-h-[580px] max-h-[850px] overflow-hidden bg-cinema-950">
      {/* Backdrop Background Image */}
      <div className="absolute inset-0">
        <img
          src={backdrop}
          alt={movie.title || 'Fîlm'}
          className="w-full h-full object-cover object-center scale-105 animate-pulse-glow"
        />
        {/* Sinematik Gradyan Maske */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-950 via-cinema-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-950 via-cinema-950/80 to-transparent hidden md:block" />
      </div>

      {/* Hero Content Container */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-end pb-16 sm:pb-20 pt-28">
        <div className="max-w-2xl flex flex-col gap-4 sm:gap-5 animate-slide-up">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="accent" className="font-bold">SÎNEMAYA DESTNÎŞANNAV</Badge>
            <Badge variant="quality">{movie.quality || '1080p'}</Badge>
            <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{formatRating(movie.rating || 8.0)}</span>
              <span className="text-cinema-300 font-normal ml-1">({movie.votes || '10K+'})</span>
            </div>
            <span className="text-cinema-300 text-xs font-medium">{movie.year || 2024}</span>
            <span className="text-cinema-300 text-xs font-medium">•</span>
            <span className="text-cinema-300 text-xs font-medium">{movie.duration || '90 deq'}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none uppercase drop-shadow-2xl">
            {movie.title}
          </h1>

          {/* Genres Tagline */}
          <div className="flex flex-wrap items-center gap-2">
            {(movie.genres || ['Klasîk']).map((g) => (
              <span
                key={g}
                className="text-xs font-medium text-cinema-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-sm"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-cinema-300/90 line-clamp-3 sm:line-clamp-4 leading-relaxed max-w-xl font-normal drop-shadow-md">
            {movie.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to={`/watch/${movie.slug}`}>
              <Button size="lg" variant="primary" className="rounded-xl px-7 gap-3 shadow-xl font-bold">
                <Play className="w-5 h-5 fill-white" />
                <span>Niha Temaşe Bike</span>
              </Button>
            </Link>

            {onToggleWatchlist && (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => onToggleWatchlist(movie.id)}
                className="rounded-xl border-white/20 gap-2.5 backdrop-blur-xl font-semibold"
              >
                {isInWatchlist ? (
                  <>
                    <Check className="w-5 h-5 text-accent" />
                    <span>Li ser Lîsteya Min e</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Zêde bike Lîsteya Min</span>
                  </>
                )}
              </Button>
            )}

            <Link to={`/movie/${movie.slug}`}>
              <Button size="lg" variant="ghost" className="rounded-xl border border-white/10 gap-2 font-semibold">
                <Info className="w-5 h-5 text-cinema-300" />
                <span>Hûragahî</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
