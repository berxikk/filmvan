import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Subtitles, PlusCircle, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type SubtitleRow = Database['public']['Tables']['subtitles']['Row'];
type MovieRow = Database['public']['Tables']['movies']['Row'];

export const BerxoSubtitles: React.FC = () => {
  const queryClient = useQueryClient();
  const [movieId, setMovieId] = useState<string>('');
  const [language, setLanguage] = useState<string>('tr');
  const [label, setLabel] = useState<string>('Türkçe Altyazı');
  const [subtitleUrl, setSubtitleUrl] = useState<string>('');

  const { data: movies = [] } = useQuery({
    queryKey: ['admin-movies'],
    queryFn: async () => {
      const { data } = await supabase.from('movies').select('*').order('title', { ascending: true });
      return (data as MovieRow[]) || [];
    },
  });

  const { data: subtitles = [], isLoading } = useQuery({
    queryKey: ['admin-subtitles'],
    queryFn: async () => {
      const { data } = await supabase.from('subtitles').select('*').order('created_at', { ascending: false });
      return (data as SubtitleRow[]) || [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await (supabase.from('subtitles') as any)
        .insert([{ movie_id: movieId, language, label, subtitle_url: subtitleUrl }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subtitles'] });
      setSubtitleUrl('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('subtitles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subtitles'] });
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieId || !subtitleUrl) return;
    addMutation.mutate();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-white/10 pb-5">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Subtitles className="w-6 h-6 text-sky-400" />
          Altyazı Yönetimi
        </h1>
        <p className="text-xs text-cinema-300">
          Filmler için VTT/SRT altyazı dosyalarını sisteme bağlayın ve yönetin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleAdd} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 h-fit">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
            Altyazı Ekle
          </h2>

          <div>
            <label className="block text-xs font-semibold text-cinema-300 uppercase mb-1">Film Seçin *</label>
            <select
              value={movieId}
              onChange={(e) => setMovieId(e.target.value)}
              className="w-full bg-cinema-900 text-white border border-white/10 rounded-xl p-2.5 text-xs focus:outline-none focus:border-accent"
              required
            >
              <option value="">Film seç...</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.release_year})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-cinema-300 uppercase mb-1">Dil Kodu *</label>
            <Input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="tr, en..." required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cinema-300 uppercase mb-1">Etiket (Label) *</label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Türkçe Altyazı" required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cinema-300 uppercase mb-1">Altyazı URL (.vtt) *</label>
            <Input value={subtitleUrl} onChange={(e) => setSubtitleUrl(e.target.value)} placeholder="https://..." required />
          </div>

          <Button type="submit" isLoading={addMutation.isPending} className="w-full py-2.5 rounded-xl gap-2 font-bold uppercase text-xs">
            <PlusCircle className="w-4 h-4" />
            <span>Altyazı Kaydet</span>
          </Button>
        </form>

        <div className="lg:col-span-2 glass-panel rounded-3xl border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
            Mevcut Altyazılar ({subtitles.length})
          </h2>
          {isLoading ? (
            <p className="text-xs text-cinema-300 text-center py-8">Altyazılar Yükleniyor...</p>
          ) : subtitles.length === 0 ? (
            <p className="text-xs text-cinema-300 text-center py-8">Henüz kayıtlı altyazı yok.</p>
          ) : (
            <div className="space-y-2">
              {subtitles.map((s) => {
                const parentMovie = movies.find((m) => m.id === s.movie_id);
                return (
                  <div key={s.id} className="p-3.5 rounded-2xl bg-cinema-900/80 border border-white/10 flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-white uppercase">{s.label} ({s.language})</span>
                      {parentMovie && <p className="text-[11px] text-accent font-semibold">Film: {parentMovie.title}</p>}
                      <p className="text-[11px] text-cinema-300 font-mono truncate max-w-sm">{s.subtitle_url}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => confirm('Altyazıyı silmek istiyor musunuz?') && deleteMutation.mutate(s.id)}
                      className="w-8 h-8 rounded-lg text-red-400 hover:bg-red-500/10 border border-red-500/20 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
