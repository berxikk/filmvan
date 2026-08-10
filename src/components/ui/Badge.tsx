import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'accent' | 'quality' | 'rating' | 'outline' | 'neutral' | 'gold';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold tracking-wider transition-colors';

  const variants = {
    accent: 'bg-accent/20 text-accent border border-accent/40',
    quality: 'bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-mono',
    rating: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold',
    outline: 'bg-transparent text-cinema-300 border border-white/15',
    neutral: 'bg-white/10 text-cinema-100 border border-white/10',
    gold: 'bg-amber-400/20 text-amber-300 border border-amber-400/40',
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
