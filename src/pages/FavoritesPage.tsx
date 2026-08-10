import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserFavorites } from '@/services/userActivity';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { MovieGridSkeleton } from '@/components/movie/MovieSkeleton';
import { Heart, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const FavoritesPage: React.FC = () => {
  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['user-favorites'],
    queryFn: getUserFavorites,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-accent" />
            Koleksiyona Şexsî
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Fîlmên Min Ên Favorî
          </h1>
          <p className="text-sm text-cinema-300">
            Fîlmên ku we jê hez kiriye û zêde kiriye koleksiyona xwe.
          </p>
        </div>

        <div className="text-xs text-cinema-300 font-medium bg-cinema-900 border border-white/10 px-4 py-2 rounded-xl">
          Bi giştî <span className="text-white font-bold">{favorites.length}</span> berhemên favorî
        </div>
      </div>

      {/* Grid or Skeleton or Empty */}
      {isLoading ? (
        <MovieGridSkeleton count={4} />
      ) : favorites.length === 0 ? (
        <div className="glass-panel p-12 sm:p-16 rounded-3xl text-center border border-white/10 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 fill-accent" />
          </div>
          <h2 className="text-lg font-bold text-white uppercase">Hêj Te Fîlmek Nexistiye Favoriyên Xwe</h2>
          <p className="text-xs text-cinema-300 leading-relaxed">
            Hûn dikarin bi tikandina li ser nîşana dil a fîlman, wan zêde bikin lîsteya xwe ya favoriyan.
          </p>
          <Link to="/movies">
            <Button variant="primary" size="sm" className="rounded-xl px-6 gap-2">
              <Film className="w-4 h-4" />
              <span>Fîlman Kîfş Buke</span>
            </Button>
          </Link>
        </div>
      ) : (
        <MovieGrid movies={favorites} />
      )}
    </div>
  );
};
