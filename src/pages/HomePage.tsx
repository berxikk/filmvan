import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPublishedMovies, getFeaturedMovies, getPopularMovies } from '@/services/movies';
import { getContinueWatching } from '@/services/userActivity';
import { useAuth } from '@/hooks/useAuth';
import { HeroBanner } from '@/components/movie/HeroBanner';
import { MovieSection } from '@/components/movie/MovieSection';
import { MovieGridSkeleton } from '@/components/movie/MovieSkeleton';
import { Button } from '@/components/ui/Button';
import { Film, Sparkles, TrendingUp, History, Play, RotateCcw, Clock } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);

  const { data: featuredMovies = [], isLoading: featuredLoading } = useQuery({
    queryKey: ['home-featured-movies'],
    queryFn: getFeaturedMovies,
  });

  const { data: popularMovies = [], isLoading: popularLoading } = useQuery({
    queryKey: ['home-popular-movies'],
    queryFn: getPopularMovies,
  });

  const { data: allPublishedMovies = [], isLoading: allLoading } = useQuery({
    queryKey: ['home-all-published-movies'],
    queryFn: getPublishedMovies,
  });

  // Fetch Continue Watching for logged in user (uncompleted only)
  const { data: continueWatchingList = [] } = useQuery({
    queryKey: ['continue-watching', user?.id],
    queryFn: getContinueWatching,
    enabled: !!user,
  });

  const toggleWatchlist = (id: string) => {
    setWatchlistIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const heroMovie = (featuredMovies && featuredMovies[0]) || (allPublishedMovies && allPublishedMovies[0]) || null;
  const recentlyAdded = [...allPublishedMovies].slice(0, 6);
  const classics = [...allPublishedMovies].sort((a, b) => a.year - b.year).slice(0, 6);

  const validContinueWatching = (continueWatchingList || []).filter((item) => item && item.movie && item.movie.id);

  return (
    <div className="pb-20 space-y-12 animate-fade-in">
      {/* Dynamic Hero Banner */}
      {featuredLoading || allLoading ? (
        <div className="w-full h-[85vh] bg-cinema-900 animate-pulse flex items-center justify-center text-cinema-300 text-xs font-semibold">
          Fîlîmvan Arşîva Sînemayê Tê Bar-kirin...
        </div>
      ) : heroMovie ? (
        <HeroBanner movie={heroMovie} />
      ) : (
        /* Empty State Banner when 0 published movies exist in Supabase */
        <div className="w-full h-[60vh] min-h-[400px] bg-cinema-950 flex flex-col items-center justify-center text-center p-6 space-y-4 border-b border-white/10 pt-20">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center">
            <Clock className="w-8 h-8 text-accent" />
          </div>
          <div className="space-y-2 max-w-md">
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Di Nêz De Fîlm Dê Bêne Zêdekirin
            </h1>
            <p className="text-xs sm:text-sm text-cinema-300">
              Naveroka arşîva me ya sînemayê gelek nêz de li vir be.
            </p>
          </div>
        </div>
      )}

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pt-6">
        {/* Kaldığın Yerden Devam Et (Continue Watching - Authenticated Users Only) */}
        {user && validContinueWatching.length > 0 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider">
                  <RotateCcw className="w-4 h-4 text-accent" />
                  Pêşveçûna Lîstikvana Şexsî
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  Ji Cihê Ku Tu Mâyî Dewam Buke
                </h2>
              </div>

              <Link to="/history" className="text-xs font-semibold text-cinema-300 hover:text-white transition-colors">
                Hemû Dîrok →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {validContinueWatching.map((item) => {
                const durationMins = parseInt(item.movie.duration) || 90;
                const totalSeconds = durationMins * 60;
                const percentage = Math.min(Math.round((item.progress_seconds / totalSeconds) * 100), 100);
                const backdrop = item.movie.backdropUrl || item.movie.posterUrl;

                return (
                  <div key={item.id} className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3 hover:border-accent/50 transition-all group relative overflow-hidden">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-cinema-900">
                      <img src={backdrop} alt={item.movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Link to={`/watch/${item.movie.slug}`}>
                          <Button size="icon" variant="primary" className="w-12 h-12 rounded-full shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </Button>
                        </Link>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 h-1.5 bg-cinema-950">
                        <div className="h-full bg-accent" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-white text-sm truncate">{item.movie.title}</h3>
                      <div className="flex items-center justify-between text-[11px] text-cinema-300 font-medium">
                        <span>%{percentage} temam bû</span>
                        <span>{item.movie.year}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Öne Çıkanlar (Featured) */}
        {featuredLoading ? (
          <div className="space-y-4">
            <div className="h-6 w-44 bg-white/10 rounded animate-pulse" />
            <MovieGridSkeleton count={4} />
          </div>
        ) : (
          featuredMovies.length > 0 && (
            <MovieSection
              title="Şaheserên Destnîşankirî"
              subtitle="Hilbijartina taybet a edîtorên Fîlîmvanê"
              movies={featuredMovies}
              watchlistIds={watchlistIds}
              onToggleWatchlist={toggleWatchlist}
              viewAllLink="/movies?featured=true"
              icon={<Sparkles className="w-5 h-5 text-accent" />}
            />
          )
        )}

        {/* Popüler Filmler (Popular / Most Viewed) */}
        {popularLoading ? (
          <div className="space-y-4">
            <div className="h-6 w-44 bg-white/10 rounded animate-pulse" />
            <MovieGridSkeleton count={4} />
          </div>
        ) : (
          popularMovies.length > 0 && (
            <MovieSection
              title="Yên Herî Zêde Hatine Mêzekirin"
              subtitle="Fîlmên herî navdar ên li ser platformê"
              movies={popularMovies}
              watchlistIds={watchlistIds}
              onToggleWatchlist={toggleWatchlist}
              viewAllLink="/movies?sort=most_viewed"
              icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
            />
          )
        )}

        {/* Yeni Eklenenler (Recently Added) */}
        {allLoading ? (
          <div className="space-y-4">
            <div className="h-6 w-44 bg-white/10 rounded animate-pulse" />
            <MovieGridSkeleton count={4} />
          </div>
        ) : (
          recentlyAdded.length > 0 && (
            <MovieSection
              title="Fîlmên Nû Hatine Zêdekirin"
              subtitle="Fîlmên kalîteya bilind ên dawî hatine zêdekirin"
              movies={recentlyAdded}
              watchlistIds={watchlistIds}
              onToggleWatchlist={toggleWatchlist}
              viewAllLink="/movies?sort=newest"
              icon={<Film className="w-5 h-5 text-emerald-400" />}
            />
          )
        )}

        {/* Zamansız Klasikler (Classics) */}
        {allLoading ? (
          <div className="space-y-4">
            <div className="h-6 w-44 bg-white/10 rounded animate-pulse" />
            <MovieGridSkeleton count={4} />
          </div>
        ) : (
          classics.length > 0 && (
            <MovieSection
              title="Klasîkên Bêdem"
              subtitle="Şaheserên nebîrveçûyî yên dîroka sînemayê"
              movies={classics}
              watchlistIds={watchlistIds}
              onToggleWatchlist={toggleWatchlist}
              viewAllLink="/movies?sort=oldest"
              icon={<History className="w-5 h-5 text-amber-400" />}
            />
          )
        )}
      </div>
    </div>
  );
};
