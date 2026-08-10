import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { getAdminMovies, updateMovie } from '@/services/movies';
import { MovieForm, MovieFormValues } from '@/components/movie/MovieForm';
import { Button } from '@/components/ui/Button';

export const EditMovie: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: movies = [], isLoading } = useQuery({
    queryKey: ['admin-movies'],
    queryFn: getAdminMovies,
  });

  const movieToEdit = movies.find((m) => m.id === id);

  const updateMutation = useMutation({
    mutationFn: (values: MovieFormValues) => {
      const castArray = values.cast_members
        ? values.cast_members.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      return updateMovie(id!, {
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
        video_provider: values.video_provider || 'html5',
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
      navigate('/berxo/movies');
    },
  });

  const handleSubmit = async (values: MovieFormValues) => {
    await updateMutation.mutateAsync(values);
  };

  if (isLoading) {
    return <div className="p-12 text-center text-cinema-300 text-xs font-semibold">Film Detayları Yükleniyor...</div>;
  }

  if (!movieToEdit) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-cinema-300 text-xs font-semibold">Film bulunamadı.</p>
        <Link to="/berxo/movies">
          <Button variant="secondary" size="sm">Listeye Dön</Button>
        </Link>
      </div>
    );
  }

  const initialValues: Partial<MovieFormValues> = {
    title: movieToEdit.title,
    original_title: movieToEdit.original_title || '',
    slug: movieToEdit.slug,
    description: movieToEdit.description || '',
    release_year: movieToEdit.release_year || 1926,
    duration_minutes: movieToEdit.duration_minutes || 90,
    country: movieToEdit.country || 'USA',
    language: movieToEdit.language || 'Silent',
    director: movieToEdit.director || '',
    cast_members: (movieToEdit.cast_members || []).join(', '),
    poster_url: movieToEdit.poster_url || '',
    backdrop_url: movieToEdit.backdrop_url || '',
    trailer_url: movieToEdit.trailer_url || '',
    video_provider: movieToEdit.video_provider || 'html5',
    embed_url: movieToEdit.embed_url || '',
    rating: movieToEdit.rating ? Number(movieToEdit.rating) : 8.0,
    rights_status: (movieToEdit.rights_status as any) || 'public_domain',
    has_turkish_subtitle: movieToEdit.has_turkish_subtitle,
    is_featured: movieToEdit.is_featured,
    is_published: movieToEdit.is_published,
    confirm_rights: true,
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
            Filmi Düzenle: {movieToEdit.title}
          </h1>
          <p className="text-xs text-cinema-300">Film bilgilerini ve yasal statüsünü güncelleyin.</p>
        </div>
      </div>

      {updateMutation.isError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
          Hata: {(updateMutation.error as Error).message}
        </div>
      )}

      <MovieForm initialValues={initialValues} onSubmit={handleSubmit} isLoading={updateMutation.isPending} />
    </div>
  );
};
