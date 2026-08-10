import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchPublishedMovies } from '@/services/movies';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { MovieGridSkeleton } from '@/components/movie/MovieSkeleton';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { SEO } from '@/components/common/SEO';

export const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['search-movies', searchTerm],
    queryFn: () => searchPublishedMovies(searchTerm),
    enabled: searchTerm.trim().length > 0,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8 animate-fade-in">
      <SEO
        title="Lêgerîn — Fîlîmvan Arşîva Sînemayê"
        description="Fîlm, derhêner û lîstikvanan di arşîva Fîlîmvanê de bigere."
      />

      {/* Header & Big Search Input */}
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider bg-accent/10 px-3 py-1 rounded-full border border-accent/30">
            <Search className="w-3.5 h-3.5" />
            Lêgerîna Arşîva Sînemayê
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Fîlm an Derhêner Bigere
          </h1>
          <p className="text-sm text-cinema-300">
            Ji bo ku hûn fîlm, derhêner an lîstikvanan bibînin li jêr binivîsin.
          </p>
        </div>

        <div className="relative">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Navê fîlm, derhêner an lîstikvan binivîse..."
            leftIcon={<Search className="w-5 h-5 text-accent" />}
            className="py-4 text-sm rounded-2xl bg-cinema-900 border-white/20 shadow-2xl focus:border-accent"
          />
        </div>
      </div>

      {/* Search Output Section */}
      {searchTerm.trim().length > 0 && (
        <div className="space-y-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white uppercase">
              Encamên Lêgerînê: "{searchTerm}"
            </h2>
            <span className="text-xs text-cinema-300 font-mono">
              {searchResults.length} encam hat dîtin
            </span>
          </div>

          {isLoading ? (
            <MovieGridSkeleton count={6} />
          ) : (
            <MovieGrid movies={searchResults} emptyMessage={`Bi peyva "${searchTerm}" fîlm nehat dîtin.`} />
          )}
        </div>
      )}
    </div>
  );
};
