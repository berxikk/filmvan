import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getGenres } from '@/services/movies';
import { FolderKanban, ChevronRight, Film } from 'lucide-react';

export const GenresPage: React.FC = () => {
  const { data: genres = [], isLoading } = useQuery({
    queryKey: ['genres-list'],
    queryFn: getGenres,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider">
          <FolderKanban className="w-4 h-4" />
          Rêbera Kategoriyan
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Kategorî & Cureyên Fîlman
        </h1>
        <p className="text-sm text-cinema-300">
          Cure û kategoriyên cihêreng ên cîhana sînemayê kifş bikin.
        </p>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 glass-panel rounded-3xl animate-pulse bg-cinema-900/50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              to={`/genre/${genre.slug}`}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-accent/50 hover:bg-white/5 transition-all group flex flex-col justify-between h-44 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center font-bold">
                  <Film className="w-5 h-5" />
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-accent group-hover:text-white text-cinema-300 flex items-center justify-center transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1 z-10">
                <h2 className="text-lg font-bold text-white uppercase group-hover:text-accent transition-colors">
                  {genre.name}
                </h2>
                <p className="text-xs text-cinema-300 line-clamp-2">
                  {genre.description || `Fîlmên di kategoriya ${genre.name} de.`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
