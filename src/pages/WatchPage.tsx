import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMovieBySlug } from '@/services/movies';
import { updateWatchProgress } from '@/services/userActivity';
import { useAuth } from '@/hooks/useAuth';
import { VideoPlayerShell } from '@/components/video/VideoPlayerShell';
import { FavoriteButton } from '@/components/movie/FavoriteButton';
import { WatchlistButton } from '@/components/movie/WatchlistButton';
import { MovieRatingWidget } from '@/components/movie/MovieRatingWidget';
import { ArrowLeft, Star, Flame } from 'lucide-react';

export const WatchPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [lastSavedTime, setLastSavedTime] = useState<number>(0);

  const isAdmin = profile?.role === 'admin';

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie-watch', slug, isAdmin],
    queryFn: () => getMovieBySlug(slug || '', isAdmin),
  });

  const handleTimeUpdate = (currentTime: number, duration: number) => {
    if (movie && (currentTime - lastSavedTime >= 10 || currentTime / duration > 0.95)) {
      setLastSavedTime(currentTime);
      updateWatchProgress(movie.id, currentTime, duration);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-cinema-300 text-xs font-semibold">
        Lîstikvana Fîlm Tê Amadekirin...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4 text-center p-4">
        <h1 className="text-xl font-bold text-white uppercase">Fîlm Nayê Lîstikirin</h1>
        <p className="text-xs text-cinema-300">Fîlma ku hûn lê digerin nehatî weşandin an jî tune ye.</p>
        <button
          onClick={() => navigate('/movies')}
          className="px-4 py-2 bg-cinema-900 text-white rounded-xl text-xs font-bold border border-white/10"
        >
          Vegere Fîlman
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-16">
      {/* Top Header Bar */}
      <div className="bg-cinema-950/90 border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-cinema-300 hover:text-white border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-white text-base sm:text-lg line-clamp-1">
              {movie.title}
            </h1>
            <span className="text-xs text-cinema-300 font-mono">
              {movie.year} • {movie.director}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <WatchlistButton movieId={movie.id} />
          <FavoriteButton movieId={movie.id} />
        </div>
      </div>

      {/* Main Video Player Area */}
      <div className="flex-1 w-full bg-black flex items-center justify-center p-0 sm:p-4">
        <div className="w-full max-w-6xl aspect-video rounded-none sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-cinema-950">
          <VideoPlayerShell
            movie={movie}
            onTimeUpdate={handleTimeUpdate}
          />
        </div>
      </div>

      {/* Bottom Info Footer & Rating */}
      <div className="bg-cinema-950 border-t border-white/10 px-4 sm:px-8 py-6 space-y-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white uppercase">{movie.title} ({movie.year})</h2>
            <p className="text-xs text-cinema-300 max-w-2xl line-clamp-2">{movie.description}</p>
          </div>

          <div className="flex items-center gap-3 text-xs shrink-0">
            <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-3 py-1 rounded-xl border border-amber-400/20">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{movie.rating.toFixed(1)} IMDb</span>
            </div>

            {movie.siteRating && (
              <div className="flex items-center gap-1 text-sky-400 font-bold bg-sky-500/10 px-3 py-1 rounded-xl border border-sky-500/20">
                <Flame className="w-4 h-4 text-sky-400 fill-sky-400" />
                <span>{movie.siteRating.toFixed(1)} Fîlîmvan</span>
              </div>
            )}

            <Link to={`/movie/${movie.slug}`} className="text-accent font-semibold hover:underline">
              Hûragahiyên Fîlm →
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <MovieRatingWidget movieId={movie.id} imdbRating={movie.rating} siteRating={movie.siteRating} />
        </div>
      </div>
    </div>
  );
};
