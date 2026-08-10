import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Film, Sparkles, Search, CheckCircle, Clapperboard, Loader2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { isAllowedVideoUrl } from '@/lib/videoSecurity';
import { searchTMDBMovies, fetchTMDBMovieDetails, TMDBMovieSearchResult } from '@/services/tmdb';

// Turkish/Latin Slugify Helper Function
function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/î/g, 'i')
    .replace(/ê/g, 'e')
    .replace(/û/g, 'u')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const movieSchema = z.object({
  title: z.string().min(2, 'Film adı en az 2 karakter olmalıdır.'),
  original_title: z.string().optional().default(''),
  slug: z.string().min(2, 'Slug adresi en az 2 karakter olmalıdır.'),
  description: z.string().optional().default(''),
  release_year: z.coerce.number().min(1890).max(2100),
  duration_minutes: z.coerce.number().min(1).max(600),
  country: z.string().optional().default('USA'),
  language: z.string().optional().default('Türkçe'),
  director: z.string().optional().default(''),
  cast_members: z.string().optional().default(''),
  poster_url: z.string().optional().default(''),
  backdrop_url: z.string().optional().default(''),
  trailer_url: z.string().optional().default(''),
  video_provider: z.string().default('iframe'),
  embed_url: z
    .string()
    .optional()
    .default('')
    .refine(
      (val) => !val || isAllowedVideoUrl(val),
      'Güvenlik Uyarısı: Video URL adresi izin verilen bir sunucuya ait olmalıdır (Vdohide, StreamHide, YouTube, Archive.org, Google Cloud vb.).'
    ),
  rating: z.coerce.number().min(0).max(10),
  rights_status: z.enum(['public_domain', 'licensed', 'owned']).default('public_domain'),
  has_turkish_subtitle: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(true),
  confirm_rights: z.boolean().default(true),
});

export type MovieFormValues = z.infer<typeof movieSchema>;

export interface MovieFormProps {
  initialValues?: Partial<MovieFormValues>;
  onSubmit: (values: MovieFormValues) => Promise<void>;
  isLoading?: boolean;
}

export const MovieForm: React.FC<MovieFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<MovieFormValues>({
    resolver: zodResolver(movieSchema) as any,
    defaultValues: {
      title: initialValues?.title || '',
      original_title: initialValues?.original_title || '',
      slug: initialValues?.slug || '',
      description: initialValues?.description || '',
      release_year: initialValues?.release_year || 2024,
      duration_minutes: initialValues?.duration_minutes || 110,
      country: initialValues?.country || 'USA',
      language: initialValues?.language || 'Türkçe',
      director: initialValues?.director || '',
      cast_members: initialValues?.cast_members || '',
      poster_url: initialValues?.poster_url || '',
      backdrop_url: initialValues?.backdrop_url || '',
      trailer_url: initialValues?.trailer_url || '',
      video_provider: initialValues?.video_provider || 'iframe',
      embed_url: initialValues?.embed_url || '',
      rating: initialValues?.rating || 8.0,
      rights_status: initialValues?.rights_status || 'public_domain',
      has_turkish_subtitle: initialValues?.has_turkish_subtitle ?? true,
      is_featured: initialValues?.is_featured ?? false,
      is_published: initialValues?.is_published ?? true,
      confirm_rights: true,
    },
  });

  const watchTitle = watch('title');

  // TMDB State
  const [tmdbQuery, setTmdbQuery] = useState<string>('');
  const [tmdbResults, setTmdbResults] = useState<TMDBMovieSearchResult[]>([]);
  const [isSearchingTmdb, setIsSearchingTmdb] = useState<boolean>(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState<boolean>(false);
  const [tmdbSuccessMsg, setTmdbSuccessMsg] = useState<string | null>(null);

  // Auto-generate slug if title changes and slug is being created
  useEffect(() => {
    if (!initialValues?.slug && watchTitle) {
      const generatedSlug = slugify(watchTitle);
      if (generatedSlug) {
        setValue('slug', generatedSlug, { shouldValidate: true, shouldDirty: true });
        clearErrors('slug');
      }
    }
  }, [watchTitle, initialValues, setValue, clearErrors]);

  // Search TMDB
  const handleTMDBSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tmdbQuery.trim()) return;

    setIsSearchingTmdb(true);
    setTmdbSuccessMsg(null);
    try {
      const results = await searchTMDBMovies(tmdbQuery);
      setTmdbResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingTmdb(false);
    }
  };

  // Populate form from selected TMDB movie
  const handleSelectTMDBMovie = async (tmdbId: number) => {
    setIsFetchingDetails(true);
    try {
      const details = await fetchTMDBMovieDetails(tmdbId);
      if (details) {
        const valOptions = { shouldValidate: true, shouldDirty: true, shouldTouch: true };

        const generatedSlug = slugify(details.title) || `film-${details.id}`;

        setValue('title', details.title, valOptions);
        setValue('slug', generatedSlug, valOptions);
        setValue('original_title', details.original_title || '', valOptions);
        setValue('description', details.overview || '', valOptions);
        setValue('rating', details.vote_average || 8.0, valOptions);
        setValue('director', details.director || '', valOptions);

        if (details.release_date) {
          const year = new Date(details.release_date).getFullYear();
          if (!isNaN(year)) setValue('release_year', year, valOptions);
        }

        if (details.runtime) {
          setValue('duration_minutes', details.runtime, valOptions);
        }

        if (details.poster_path) {
          setValue('poster_url', details.poster_path, valOptions);
        }

        if (details.backdrop_path) {
          setValue('backdrop_url', details.backdrop_path, valOptions);
        }

        if (details.cast && details.cast.length > 0) {
          const castStr = details.cast.map((c) => c.name).join(', ');
          setValue('cast_members', castStr, valOptions);
        }

        // Clear any old validation errors
        clearErrors();

        setTmdbResults([]);
        setTmdbQuery('');
        setTmdbSuccessMsg(`"${details.title}" verileri İngilizce çekildi ve özet otomatik Kürtçeye çevrildi! Şimdi Vdohide embed linkinizi ekleyebilirsiniz.`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const handleFormSubmit: SubmitHandler<MovieFormValues> = async (data) => {
    await onSubmit({
      ...data,
      rights_status: 'public_domain',
      confirm_rights: true,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* TMDB Auto-Fetch Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border border-sky-500/30 bg-sky-500/5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clapperboard className="w-5 h-5 text-sky-400" />
              TMDB Otomatik Film Bilgisi Çek (İngilizce ➔ Kürtçe Çevirili)
            </h2>
            <p className="text-xs text-cinema-300">
              Film adını girip Enter'a basın; tüm veriler İngilizce çekilecek ve konu özeti otomatik Kürtçeye çevrilecektir.
            </p>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={tmdbQuery}
              onChange={(e) => setTmdbQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleTMDBSearch();
                }
              }}
              placeholder="TMDB'de İngilizce/Orijinal film adı ara (Örn: Inception, Oppenheimer, Godfather...)"
              className="w-full bg-cinema-900 text-white border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-sky-400 pl-10"
            />
            <Search className="w-4 h-4 text-cinema-300 absolute left-3 top-3" />
          </div>
          <Button
            type="button"
            onClick={() => handleTMDBSearch()}
            isLoading={isSearchingTmdb}
            className="rounded-xl px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shrink-0 gap-2"
          >
            <Search className="w-4 h-4" />
            <span>TMDB'de Ara</span>
          </Button>
        </div>

        {/* Search Results Dropdown Grid */}
        {isSearchingTmdb && (
          <div className="p-4 text-center text-xs text-cinema-300 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            <span>TMDB İngilizce Veritabanı Taranıyor...</span>
          </div>
        )}

        {isFetchingDetails && (
          <div className="p-4 text-center text-xs text-sky-400 font-bold flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            <span>Veriler İngilizce Alınıyor ve Açıklama Otomatik Kürtçeye Çevriliyor...</span>
          </div>
        )}

        {tmdbSuccessMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{tmdbSuccessMsg}</span>
          </div>
        )}

        {tmdbResults.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {tmdbResults.map((m) => (
              <div
                key={m.id}
                onClick={() => handleSelectTMDBMovie(m.id)}
                className="p-3 rounded-2xl bg-cinema-900 border border-white/10 hover:border-sky-400 cursor-pointer transition-all flex items-center gap-3 group"
              >
                {m.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${m.poster_path}`}
                    alt={m.title}
                    className="w-12 h-16 object-cover rounded-lg shrink-0"
                  />
                ) : (
                  <div className="w-12 h-16 bg-white/5 rounded-lg flex items-center justify-center text-xs text-cinema-300 shrink-0">
                    Görsel Yok
                  </div>
                )}
                <div className="space-y-0.5 overflow-hidden">
                  <h4 className="font-bold text-white text-xs truncate group-hover:text-sky-400 transition-colors">
                    {m.title}
                  </h4>
                  <span className="text-[11px] text-cinema-300 block">
                    {m.release_date ? m.release_date.split('-')[0] : 'Bilinmiyor'} • IMDb {m.vote_average?.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-sky-400 font-semibold block">Formu Doldur & Çevir →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Basic Metadata */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-white/10">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
          <Film className="w-4 h-4 text-accent" />
          Temel Film Bilgileri
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-cinema-300 uppercase tracking-wider mb-1.5">
              Film Adı (Title) *
            </label>
            <Input {...register('title')} error={errors.title?.message} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cinema-300 uppercase tracking-wider mb-1.5">
              URL Slug *
            </label>
            <Input {...register('slug')} error={errors.slug?.message} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cinema-300 uppercase tracking-wider mb-1.5">
              Orijinal Adı (Original Title)
            </label>
            <Input {...register('original_title')} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cinema-300 uppercase tracking-wider mb-1.5">
              Yönetmen (Director)
            </label>
            <Input {...register('director')} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cinema-300 uppercase tracking-wider mb-1.5">
              Yapım Yılı (Release Year) *
            </label>
            <Input type="number" {...register('release_year')} error={errors.release_year?.message} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cinema-300 uppercase tracking-wider mb-1.5">
              Süre (Dakika) *
            </label>
            <Input type="number" {...register('duration_minutes')} error={errors.duration_minutes?.message} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cinema-300 uppercase tracking-wider mb-1.5">
              IMDb / Puan (0-10) *
            </label>
            <Input type="number" step="0.1" {...register('rating')} error={errors.rating?.message} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cinema-300 uppercase tracking-wider mb-1.5">
              Oyuncu Kadrosu (Virgülle Ayırın)
            </label>
            <Input placeholder="Oyuncu 1, Oyuncu 2..." {...register('cast_members')} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-cinema-300 uppercase tracking-wider mb-1.5">
            Açıklama & Konu Özeti (Kürtçeye Otomatik Çevrildi)
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full bg-cinema-900 text-white border border-white/10 rounded-xl p-3.5 text-xs focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Media & Embed */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-white/10">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
          <Sparkles className="w-4 h-4 text-accent" />
          Medya & Video Akış Bağlantısı (Vdohide / StreamHide)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-cinema-300 uppercase tracking-wider mb-1.5">
              Poster Görsel URL (TMDB Otomatik)
            </label>
            <Input placeholder="https://..." {...register('poster_url')} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cinema-300 uppercase tracking-wider mb-1.5">
              Backdrop Görsel URL (TMDB Otomatik)
            </label>
            <Input placeholder="https://..." {...register('backdrop_url')} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-cinema-300 uppercase tracking-wider mb-1.5">
              Video Oynatma Tipi (Provider)
            </label>
            <select
              {...register('video_provider')}
              className="w-full bg-cinema-900 text-white border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-accent"
            >
              <option value="iframe">iFrame Embed (Vdohide / StreamHide / Video Player)</option>
              <option value="html5">HTML5 Direct MP4/WebM Video</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-cinema-300 uppercase tracking-wider mb-1.5">
              Fragman URL (Trailer)
            </label>
            <Input placeholder="https://..." {...register('trailer_url')} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-cinema-300 uppercase tracking-wider mb-1.5">
            Video Embed Linkiniz (Vdohide / StreamHide / Player URL) *
          </label>
          <Input
            placeholder="https://vdohide.com/e/example veya https://streamhide.to/e/example"
            {...register('embed_url')}
            error={errors.embed_url?.message}
          />
          <p className="mt-1.5 text-[11px] text-cinema-300/70">
            Desteklenen Oynatıcılar: Vdohide, StreamHide, VidHide, FileLions, YouTube, Archive.org, Google Cloud vb.
          </p>
        </div>
      </div>

      {/* Publishing Settings Box */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border border-white/10">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
          <Globe className="w-4 h-4 text-accent" />
          Yayınlama & Görünürlük Ayarları
        </h2>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-cinema-300">
            <input
              type="checkbox"
              {...register('is_published')}
              className="w-4 h-4 accent-accent rounded"
            />
            <span className="text-white">Filmi Yayına Al (Is Published)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-cinema-300">
            <input
              type="checkbox"
              {...register('is_featured')}
              className="w-4 h-4 accent-accent rounded"
            />
            <span className="text-white">Ana Sayfa Öne Çıkan Yap (Is Featured)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-cinema-300">
            <input
              type="checkbox"
              {...register('has_turkish_subtitle')}
              className="w-4 h-4 accent-accent rounded"
            />
            <span>Türkçe Altyazı Var</span>
          </label>
        </div>
      </div>

      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full py-4 rounded-2xl gap-3 font-bold uppercase text-sm shadow-2xl shadow-accent/30"
      >
        <Save className="w-5 h-5" />
        <span>Filmi Kaydet & Yayınla</span>
      </Button>
    </form>
  );
};
