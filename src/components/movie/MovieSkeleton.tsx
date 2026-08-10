import React from 'react';

export const MovieCardSkeleton: React.FC = () => {
  return (
    <div className="relative group flex flex-col rounded-2xl overflow-hidden glass-panel border border-white/5 animate-pulse">
      {/* Poster Skeleton */}
      <div className="aspect-[2/3] w-full bg-cinema-900/80 relative">
        <div className="absolute top-3 right-3 w-10 h-5 bg-white/10 rounded-md" />
        <div className="absolute top-3 left-3 w-14 h-5 bg-white/10 rounded-md" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-2 bg-cinema-950/60 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-white/5 rounded w-1/2" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="h-3 bg-white/10 rounded w-12" />
          <div className="h-3 bg-white/10 rounded w-10" />
        </div>
      </div>
    </div>
  );
};

export const MovieGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
};
