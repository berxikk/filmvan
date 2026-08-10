import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserWatchlist } from '@/services/userActivity';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { MovieGridSkeleton } from '@/components/movie/MovieSkeleton';
import { Bookmark, Film } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const WatchlistPage: React.FC = () => {
  const { data: watchlist = [], isLoading } = useQuery({
    queryKey: ['user-watchlist'],
    queryFn: getUserWatchlist,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider">
            <Bookmark className="w-4 h-4 text-accent" />
            Daxwaza Mêzekirinê
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Lîsteya Min A Mêzekirinê
          </h1>
          <p className="text-sm text-cinema-300">
            Fîlmên ku we tomar kiriye bo paşê temşa bikin.
          </p>
        </div>

        <div className="text-xs text-cinema-300 font-medium bg-cinema-900 border border-white/10 px-4 py-2 rounded-xl">
          Bi giştî <span className="text-white font-bold">{watchlist.length}</span> berhemên tomarkirî
        </div>
      </div>

      {/* Grid or Skeleton or Empty */}
      {isLoading ? (
        <MovieGridSkeleton count={4} />
      ) : watchlist.length === 0 ? (
        <div className="glass-panel p-12 sm:p-16 rounded-3xl text-center border border-white/10 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-lg font-bold text-white uppercase">Lîsteya Te Ya Mêzekirinê Vala Ye</h2>
          <p className="text-xs text-cinema-300 leading-relaxed">
            Hûn dikarin fîlmên ku balê dikişînin bi tikandina "Zêde bike Lîsteya Min" tomar bikin.
          </p>
          <Link to="/movies">
            <Button variant="primary" size="sm" className="rounded-xl px-6 gap-2">
              <Film className="w-4 h-4" />
              <span>Katalogê Bixwîne</span>
            </Button>
          </Link>
        </div>
      ) : (
        <MovieGrid movies={watchlist} />
      )}
    </div>
  );
};
