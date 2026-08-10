import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMovieBySlug, getPublishedMovies } from '@/services/movies';
import { getMovieSiteRating } from '@/services/userActivity';
import { useAuth } from '@/hooks/useAuth';
import { 
  Play, 
  Star, 
  Share2, 
  Film, 
  UserCheck, 
  ShieldCheck,
  ChevronLeft,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MovieSection } from '@/components/movie/MovieSection';
import { FavoriteButton } from '@/components/movie/FavoriteButton';
import { WatchlistButton } from '@/components/movie/WatchlistButton';
import { MovieRatingWidget } from '@/components/movie/MovieRatingWidget';
import { SEO } from '@/components/common/SEO';
import { formatRating } from '@/lib/utils';

export const MovieDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [copied, setCopied] = useState<boolean>(false);

  const isAdmin = profile?.role === 'admin';

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie-detail', slug, isAdmin],
    queryFn: () => getMovieBySlug(slug || '', isAdmin),
  });

  const { data: siteRatingData } = useQuery({
    queryKey: ['movie-site-rating', movie?.id],
    queryFn: () => getMovieSiteRating(movie?.id || ''),
    enabled: !!movie?.id,
  });

  const { data: allPublished = [] } = useQuery({
    queryKey: ['public-movies'],
    queryFn: getPublishedMovies,
  });

  const displaySiteRating = siteRatingData?.average ?? movie?.siteRating ?? null;

  const similarMovies = movie
    ? (allPublished || []).filter((m) => m && m.id && m.id !== movie.id && m.genres && Array.isArray(m.genres) && m.genres.some((g) => (movie.genres || []).includes(g)))
    : [];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-cinema-300 text-xs font-semibold">Hûragahiyên Fîlm Tên Bar-kirin...</div>;
  }

  if (!movie || !movie.id) {
    return (
      <div className="max-w-md mx-auto py-32 text-center space-y-4">
        <h1 className="text-xl font-bold text-white uppercase">Fîlm Nehat Dîtin</h1>
        <p className="text-xs text-cinema-300">Fîlma ku hûn lê digerin nehatî weşandin an jî tune ye.</p>
        <Link to="/movies">
          <Button variant="secondary" size="sm">Vegere Hemû Fîlman</Button>
        </Link>
      </div>
    );
  }

  const poster = movie.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80';
  const backdrop = movie.backdropUrl || poster;

  return (
    <div className="pb-20 space-y-12 animate-fade-in">
      {/* Dynamic SEO Meta Tags */}
      <SEO
        title={`${movie.title} (${movie.year || 2024}) — Niha Temaşe Bike`}
        description={`${movie.title} (${movie.year || 2024}) bi kalîteya bilind li ser platforma Fîlîmvanê temşa bikin.`}
        ogImage={backdrop}
        ogType="video.movie"
      />

      {/* Hero Backdrop Section */}
      <div className="relative w-full h-[70vh] min-h-[500px] bg-cinema-950 overflow-hidden">
        <img
          src={backdrop}
          alt={movie.title}
          className="w-full h-full object-cover object-center opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent hidden md:block" />

        {/* Back Button */}
        <div className="absolute top-24 left-4 sm:left-8 z-10">
          <button
            onClick={() => navigate(-1)}
            aria-label="Vegere Paş"
            className="flex items-center gap-2 bg-cinema-950/80 hover:bg-white/10 text-cinema-300 hover:text-white px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Vegere Paş</span>
          </button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 inset-x-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 flex flex-col md:flex-row gap-8 items-end">
            {/* Poster Card */}
            <div className="shrink-0 w-44 sm:w-56 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 hidden sm:block aspect-[2/3] bg-cinema-900">
              <img src={poster} alt={movie.title} className="w-full h-full object-cover" />
            </div>

            {/* Info Summary */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent">FULL HD</Badge>
                <Badge variant="quality">{movie.quality || '1080p'}</Badge>
                <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{formatRating(movie.rating || 8.0)} IMDb</span>
                </div>
                {displaySiteRating && (
                  <div className="flex items-center gap-1 text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2.5 py-0.5 rounded text-xs font-bold">
                    <Flame className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                    <span>{formatRating(displaySiteRating)} Fîlîmvan</span>
                  </div>
                )}
                <span className="text-cinema-300 text-xs">{movie.year || 2024}</span>
                <span className="text-cinema-300 text-xs">•</span>
                <span className="text-cinema-300 text-xs">{movie.duration || '90 deq'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                {movie.title}
              </h1>

              {movie.originalTitle && movie.originalTitle !== movie.title && (
                <p className="text-xs text-cinema-300/70 font-mono italic">
                  Navê Orijînal: {movie.originalTitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {(movie.genres || ['Klasîk']).map((g) => (
                  <span key={g} className="text-xs font-medium text-cinema-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                    {g}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link to={`/watch/${movie.slug}`}>
                  <Button size="lg" variant="primary" className="rounded-xl px-8 gap-3 shadow-xl font-bold">
                    <Play className="w-5 h-5 fill-white" />
                    <span>Niha Temaşe Bike</span>
                  </Button>
                </Link>

                <WatchlistButton movieId={movie.id} variant="text" />

                <FavoriteButton movieId={movie.id} size="lg" className="p-3" />

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleShare}
                  aria-label="Parve bike"
                  className="rounded-xl border border-white/10 p-3"
                  title="Parve bike"
                >
                  <Share2 className="w-5 h-5 text-cinema-300" />
                </Button>
                {copied && <span className="text-xs text-emerald-400 font-semibold">Girêdan hat kopîkirin!</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Main Overview & Rating */}
          <div className="lg:col-span-2 space-y-8">
            {/* Story */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                <Film className="w-5 h-5 text-accent" />
                Der Barê Fîlm De & Mijar
              </h2>
              <p className="text-cinema-300 text-sm leading-relaxed whitespace-pre-line">
                {movie.longDescription || movie.description || 'Şirove tune ye.'}
              </p>
            </div>

            {/* User Movie Rating Widget */}
            <MovieRatingWidget movieId={movie.id} imdbRating={movie.rating} siteRating={displaySiteRating || undefined} />

            {/* Cast */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                <UserCheck className="w-5 h-5 text-accent" />
                Lîstikvan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(movie.cast || []).map((c, i) => (
                  <div key={i} className="bg-cinema-900/80 border border-white/10 p-3.5 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center font-bold text-accent text-sm">
                      {(c.name || 'L').charAt(0)}
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-bold text-white truncate">{c.name}</span>
                      <span className="text-[11px] text-cinema-300 truncate">{c.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Meta Information */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl space-y-4 border border-white/10">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
                Agahiyên Fîlm
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-cinema-300">Derhêner</span>
                  <span className="font-semibold text-white">{movie.director || 'Nenas'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-cinema-300">Sal</span>
                  <span className="font-semibold text-white">{movie.year || 2024}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-cinema-300">Dem</span>
                  <span className="font-semibold text-white">{movie.duration || '90 deq'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-cinema-300">Pûana IMDb</span>
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{formatRating(movie.rating || 8.0)} / 10</span>
                  </div>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-cinema-300">Pûana Fîlîmvanê</span>
                  <div className="flex items-center gap-1 text-sky-400 font-bold">
                    <Flame className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                    <span>{displaySiteRating ? `${formatRating(displaySiteRating)} / 10` : 'Hêj tune'}</span>
                  </div>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-cinema-300">Kalîte</span>
                  <Badge variant="quality">{movie.quality || '1080p'}</Badge>
                </div>
              </div>
            </div>

            {/* Quality Guarantee Card */}
            <div className="bg-accent/10 border border-accent/30 p-5 rounded-3xl space-y-2">
              <div className="flex items-center gap-2 text-accent font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                Kalîteya Bilind a Sînemayê
              </div>
              <p className="text-[11px] text-cinema-300 leading-relaxed">
                Ev berhem li ser platforma Fîlîmvanê bi kalîteya herî bilind a dîmen û dengî tê pêşkêşkirin.
              </p>
            </div>
          </div>
        </div>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <MovieSection
            title="Fîlmên Duhan (Wekî Vî)"
            subtitle="Fîlmên din ên ku ji bo we tên pêşniyarkirin"
            movies={similarMovies}
            viewAllLink="/movies"
          />
        )}
      </div>
    </div>
  );
};
