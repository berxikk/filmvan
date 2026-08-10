import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { createMovie } from '@/services/movies';
import { MovieForm, MovieFormValues } from '@/components/movie/MovieForm';
import { Button } from '@/components/ui/Button';

export const CreateMovie: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (values: MovieFormValues) => {
      const castArray = values.cast_members
        ? values.cast_members.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      return createMovie({
        title: values.title,
        original_title: values.original_title || null,
        slug: values.slug,
        description: values.description || null,
        release_year: values.release_year,
        duration_minutes: values.duration_minutes,
        country: values.country || null,
        language: values.language || null,
        director: values.director || null,
        cast_members: castArray,
        poster_url: values.poster_url || null,
        backdrop_url: values.backdrop_url || null,
        trailer_url: values.trailer_url || null,
        video_provider: values.video_provider || 'iframe',
        embed_url: values.embed_url || null,
        rating: values.rating,
        rights_status: values.rights_status,
        has_turkish_subtitle: values.has_turkish_subtitle,
        is_featured: values.is_featured,
        is_published: values.is_published,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
      queryClient.invalidateQueries({ queryKey: ['public-movies'] });
      queryClient.invalidateQueries({ queryKey: ['featured-movies'] });
      queryClient.invalidateQueries({ queryKey: ['popular-movies'] });
      navigate('/berxo/movies');
    },
  });

  const handleSubmit = async (values: MovieFormValues) => {
    try {
      await createMutation.mutateAsync(values);
    } catch (err) {
      console.error('Create Movie Submit Error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 border-b border-white/10 pb-5">
        <Link to="/berxo/movies">
          <Button variant="ghost" size="sm" className="border border-white/10 p-2 rounded-xl">
            <ArrowLeft className="w-4 h-4 text-cinema-300" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            Yeni Film Ekle
          </h1>
          <p className="text-xs text-cinema-300">
            Kataloğa eklenecek filmin tüm bilgilerini ve yasal telif hakkı beyanını doldurun.
          </p>
        </div>
      </div>

      {createMutation.isError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
          Hata: {(createMutation.error as Error).message}
        </div>
      )}

      <MovieForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
    </div>
  );
};
