import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(duration: string): string {
  return duration;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
