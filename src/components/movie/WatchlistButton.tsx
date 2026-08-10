import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { checkIsInWatchlist, toggleWatchlist } from '@/services/userActivity';
import { Button } from '@/components/ui/Button';

export interface WatchlistButtonProps {
  movieId: string;
  className?: string;
  variant?: 'icon' | 'text';
}

export const WatchlistButton: React.FC<WatchlistButtonProps> = ({
  movieId,
  className = '',
  variant = 'icon',
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: isInWatchlist = false, isLoading } = useQuery({
    queryKey: ['watchlist', movieId, user?.id],
    queryFn: () => checkIsInWatchlist(movieId),
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: () => toggleWatchlist(movieId),
    onSuccess: (newStatus) => {
      queryClient.setQueryData(['watchlist', movieId, user?.id], newStatus);
      queryClient.invalidateQueries({ queryKey: ['user-watchlist'] });
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    mutation.mutate();
  };

  if (variant === 'text') {
    return (
      <Button
        type="button"
        variant="secondary"
        onClick={handleClick}
        isLoading={isLoading || mutation.isPending}
        className={`rounded-xl border-white/20 gap-2 ${className}`}
      >
        {isInWatchlist ? (
          <>
            <Check className="w-5 h-5 text-accent" />
            <span>Listede</span>
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            <span>Listeme Ekle</span>
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleClick}
      isLoading={isLoading || mutation.isPending}
      className={`rounded-xl border transition-all ${
        isInWatchlist
          ? 'bg-accent/10 border-accent/40 text-accent hover:bg-accent/20'
          : 'border-white/10 text-cinema-300 hover:text-white hover:bg-white/10'
      } ${className}`}
      title={isInWatchlist ? 'Listemden Çıkar' : 'İzleme Listeme Ekle'}
    >
      {isInWatchlist ? (
        <Check className="w-5 h-5 text-accent" />
      ) : (
        <Plus className="w-5 h-5 text-cinema-300" />
      )}
    </Button>
  );
};
