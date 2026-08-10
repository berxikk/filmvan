import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { checkIsFavorite, toggleFavorite } from '@/services/userActivity';
import { Button } from '@/components/ui/Button';

export interface FavoriteButtonProps {
  movieId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  movieId,
  className = '',
  size = 'md',
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: isFavorite = false, isLoading } = useQuery({
    queryKey: ['favorite', movieId, user?.id],
    queryFn: () => checkIsFavorite(movieId),
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: () => toggleFavorite(movieId),
    onSuccess: (newStatus) => {
      queryClient.setQueryData(['favorite', movieId, user?.id], newStatus);
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
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

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleClick}
      isLoading={isLoading || mutation.isPending}
      className={`rounded-xl border transition-all ${
        isFavorite
          ? 'bg-accent/10 border-accent/40 text-accent hover:bg-accent/20'
          : 'border-white/10 text-cinema-300 hover:text-white hover:bg-white/10'
      } ${className}`}
      title={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
    >
      <Heart
        className={`${
          size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
        } ${isFavorite ? 'fill-accent text-accent' : ''}`}
      />
    </Button>
  );
};
