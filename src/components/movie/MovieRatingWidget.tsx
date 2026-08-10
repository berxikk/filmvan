import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, CheckCircle, LogIn, Flame } from 'lucide-react';
import { getUserMovieRating, getMovieSiteRating, rateMovie } from '@/services/userActivity';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

export interface MovieRatingWidgetProps {
  movieId: string;
  imdbRating?: number;
  siteRating?: number;
}

export const MovieRatingWidget: React.FC<MovieRatingWidgetProps> = ({
  movieId,
  imdbRating = 8.0,
  siteRating,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [hoverScore, setHoverScore] = useState<number | null>(null);
  const [optimisticScore, setOptimisticScore] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { data: userScore } = useQuery({
    queryKey: ['user-movie-rating', movieId, user?.id],
    queryFn: () => getUserMovieRating(movieId),
    enabled: !!user && !!movieId,
  });

  const { data: liveSiteRatingData } = useQuery({
    queryKey: ['movie-site-rating', movieId],
    queryFn: () => getMovieSiteRating(movieId),
    enabled: !!movieId,
  });

  const rateMutation = useMutation({
    mutationFn: (score: number) => rateMovie(movieId, score),
    onMutate: async (newScore) => {
      // 0ms INSTANT RESPONSE (Optimistic UI)
      setOptimisticScore(newScore);
      setSuccessMsg('Pûana te bi serkeftî hat tomar kirin!');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-movie-rating', movieId] });
      queryClient.invalidateQueries({ queryKey: ['movie-site-rating', movieId] });
      queryClient.invalidateQueries({ queryKey: ['movie-detail'] });
      queryClient.invalidateQueries({ queryKey: ['public-movies'] });
      setTimeout(() => setSuccessMsg(null), 3000);
    },
    onError: () => {
      setOptimisticScore(null);
      setSuccessMsg(null);
    },
  });

  const handleScoreClick = (score: number) => {
    if (!user) return;
    // Instant 0ms Local Feedback
    setOptimisticScore(score);
    setSuccessMsg('Pûana te bi serkeftî hat tomar kirin!');
    rateMutation.mutate(score);
  };

  const effectiveUserScore = optimisticScore ?? userScore ?? null;
  const activeScore = hoverScore ?? effectiveUserScore ?? null;
  const displaySiteRating = liveSiteRatingData?.average ?? siteRating ?? null;
  const voteCount = liveSiteRatingData?.count ?? 0;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            Pûankirina Fîlmê
          </h3>
          <p className="text-xs text-cinema-300">
            Hûn dikarin pûana xwe ya ji 1 heta 10’an bidin vê fîlmê.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* IMDb Rating Badge */}
          <div className="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-xl flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>IMDb: {imdbRating.toFixed(1)}</span>
          </div>

          {/* Fîlîmvan Platform Average Rating Badge */}
          {displaySiteRating ? (
            <div className="text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-500/30 px-3 py-1 rounded-xl flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
              <span>Fîlîmvan: {displaySiteRating.toFixed(1)} {voteCount > 0 && `(${voteCount})`}</span>
            </div>
          ) : (
            <div className="text-xs font-semibold text-cinema-300 bg-white/5 border border-white/10 px-3 py-1 rounded-xl flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-cinema-300" />
              <span>Fîlîmvan: Hêj tune</span>
            </div>
          )}

          {/* User's Submitted Rating Badge */}
          {effectiveUserScore && (
            <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl flex items-center gap-1.5 animate-pulse-glow">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Pûana Te: {effectiveUserScore} / 10</span>
            </div>
          )}
        </div>
      </div>

      {!user ? (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-cinema-300">
            Ji bo ku hûn pûan bidin vî fîlmî ji kerema xwe têkevin hesabê xwe.
          </span>
          <Link
            to="/login"
            className="px-4 py-2 bg-accent text-white rounded-xl font-bold flex items-center gap-2 hover:bg-accent-hover transition-colors shrink-0"
          >
            <LogIn className="w-4 h-4" />
            <span>Têkeve</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Star Selection Bar 1-10 */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-2">
            {Array.from({ length: 10 }).map((_, index) => {
              const score = index + 1;
              const isSelected = activeScore !== null && score <= activeScore;

              return (
                <button
                  key={score}
                  type="button"
                  onClick={() => handleScoreClick(score)}
                  onMouseEnter={() => setHoverScore(score)}
                  onMouseLeave={() => setHoverScore(null)}
                  className={`group relative p-2 rounded-xl transition-all duration-150 flex flex-col items-center gap-1 cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-amber-400/20 border border-amber-400/50 text-amber-400 scale-105'
                      : 'bg-cinema-900 border border-white/10 text-cinema-300 hover:border-amber-400/40 hover:text-white'
                  }`}
                  title={`${score} Pûan`}
                >
                  <Star
                    className={`w-5 h-5 transition-transform group-hover:scale-125 ${
                      isSelected ? 'fill-amber-400 text-amber-400' : 'fill-transparent'
                    }`}
                  />
                  <span className="text-[10px] font-mono font-bold">{score}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback Label */}
          <div className="text-center text-xs text-cinema-300 font-medium">
            {hoverScore ? (
              <span className="text-amber-400 font-bold">{hoverScore} / 10 Pûan Berbajar</span>
            ) : effectiveUserScore ? (
              <span>Te {effectiveUserScore} pûan daye vê fîlmê. Ji bo guherandinê pûana nû hilbijêre.</span>
            ) : (
              <span>Ji bo pûankirinê stêrkan bistêrîne.</span>
            )}
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center animate-fade-in">
          {successMsg}
        </div>
      )}
    </div>
  );
};
