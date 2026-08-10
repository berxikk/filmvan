import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getPaginatedPublishedMovies, PaginatedFilterOptions } from '@/services/movies';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { MovieGridSkeleton } from '@/components/movie/MovieSkeleton';
import { Film, Filter, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SEO } from '@/components/common/SEO';

export const MoviesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State from URL params or default
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const yearParam = searchParams.get('year') || 'all';
  const countryParam = searchParams.get('country') || 'all';
  const sortParam = (searchParams.get('sort') as any) || 'newest';

  const [page, setPage] = useState<number>(pageParam);
  const [year, setYear] = useState<string>(yearParam);
  const [country, setCountry] = useState<string>(countryParam);
  const [sortBy, setSortBy] = useState<PaginatedFilterOptions['sortBy']>(sortParam);

  const filterOptions: PaginatedFilterOptions = {
    page,
    limit: 12,
    year,
    country,
    sortBy,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['movies-catalog', page, year, country, sortBy],
    queryFn: () => getPaginatedPublishedMovies(filterOptions),
  });

  const updateFilters = (newFilters: Partial<{ page: number; year: string; country: string; sort: string }>) => {
    const params = new URLSearchParams(searchParams);
    if (newFilters.page) {
      setPage(newFilters.page);
      params.set('page', newFilters.page.toString());
    }
    if (newFilters.year !== undefined) {
      setYear(newFilters.year);
      if (newFilters.year === 'all') params.delete('year');
      else params.set('year', newFilters.year);
      setPage(1);
      params.set('page', '1');
    }
    if (newFilters.country !== undefined) {
      setCountry(newFilters.country);
      if (newFilters.country === 'all') params.delete('country');
      else params.set('country', newFilters.country);
      setPage(1);
      params.set('page', '1');
    }
    if (newFilters.sort !== undefined) {
      setSortBy(newFilters.sort as any);
      if (newFilters.sort === 'newest') params.delete('sort');
      else params.set('sort', newFilters.sort);
      setPage(1);
      params.set('page', '1');
    }
    setSearchParams(params);
  };

  const resetFilters = () => {
    setPage(1);
    setYear('all');
    setCountry('all');
    setSortBy('newest');
    setSearchParams({});
  };

  const movies = data?.movies || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8 animate-fade-in">
      <SEO
        title="Hemû Fîlm — Fîlîmvan Arşîva Sînemayê"
        description="Fîlmên kalîteya bilind bi vebijarkên fîlterkirina sal, cîhan û kategoriyan li ser platforma Fîlîmvanê temşa bikin."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider">
            <Film className="w-4 h-4 text-accent" />
            Arşîva Sînemayê
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Hemû Fîlm
          </h1>
          <p className="text-sm text-cinema-300">
            Kataloga giştî ya sînemayê li gorî hezkirina xwe fîlter bikin û temşa bikin.
          </p>
        </div>

        <div className="text-xs text-cinema-300 font-medium bg-cinema-900 border border-white/10 px-4 py-2 rounded-xl">
          Bi giştî <span className="text-white font-bold">{total}</span> berhem hene
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-4 h-4 text-accent" />
            Fîlterên Sînemayê
          </span>

          {(year !== 'all' || country !== 'all' || sortBy !== 'newest') && (
            <button
              onClick={resetFilters}
              className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Paqij bike</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Sort Selection */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-cinema-300 uppercase tracking-wider block">
              Rêzkirin
            </label>
            <select
              value={sortBy}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="w-full bg-cinema-900 text-white border border-white/10 rounded-xl p-2.5 text-xs focus:outline-none focus:border-accent"
            >
              <option value="newest">Yên Nûtirîn (Newest)</option>
              <option value="oldest">Yên Kevnar (Oldest)</option>
              <option value="rating">Puan (Bilind)</option>
              <option value="most_viewed">Yên Herî Zêde Mêzekirî</option>
              <option value="alphabetical">Alfabetîk (A-Z)</option>
            </select>
          </div>

          {/* Year Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-cinema-300 uppercase tracking-wider block">
              Sal
            </label>
            <select
              value={year}
              onChange={(e) => updateFilters({ year: e.target.value })}
              className="w-full bg-cinema-900 text-white border border-white/10 rounded-xl p-2.5 text-xs focus:outline-none focus:border-accent"
            >
              <option value="all">Hemû Sal</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="1930">1930</option>
              <option value="1926">1926</option>
              <option value="1925">1925</option>
            </select>
          </div>

          {/* Country Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-cinema-300 uppercase tracking-wider block">
              Welat
            </label>
            <select
              value={country}
              onChange={(e) => updateFilters({ country: e.target.value })}
              className="w-full bg-cinema-900 text-white border border-white/10 rounded-xl p-2.5 text-xs focus:outline-none focus:border-accent"
            >
              <option value="all">Hemû Welat</option>
              <option value="USA">DHA (USA)</option>
              <option value="Germany">Almanya</option>
              <option value="France">Fransa</option>
              <option value="USSR">SSCB</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movie Grid or Loading */}
      {isLoading ? (
        <MovieGridSkeleton count={12} />
      ) : (
        <MovieGrid movies={movies} emptyMessage="Bi van krîteran fîlm nehat dîtin." />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => updateFilters({ page: page - 1 })}
            className="rounded-xl border border-white/10 gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Paşve</span>
          </Button>

          <div className="text-xs text-cinema-300 font-mono">
            Rûpel <span className="text-white font-bold">{page}</span> / {totalPages}
          </div>

          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => updateFilters({ page: page + 1 })}
            className="rounded-xl border border-white/10 gap-1"
          >
            <span>Pêşve</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
