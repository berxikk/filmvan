import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FolderKanban, PlusCircle, Trash2, Edit } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { MOCK_GENRES } from '@/services/mockData';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type GenreRow = Database['public']['Tables']['genres']['Row'];

export const BerxoGenres: React.FC = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [editingGenre, setEditingGenre] = useState<GenreRow | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');

  const { data: genres = [], isLoading } = useQuery({
    queryKey: ['admin-genres'],
    queryFn: async () => {
      const { data, error } = await supabase.from('genres').select('*').order('name', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as GenreRow[];
      }
      return MOCK_GENRES.map((g) => ({
        id: g.id,
        name: g.name,
        slug: g.slug,
        description: g.description,
        created_at: new Date().toISOString(),
      }));
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-');

      const { data, error } = await (supabase.from('genres') as any)
        .insert([{ name, slug, description }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-genres'] });
      queryClient.invalidateQueries({ queryKey: ['live-genres'] });
      setName('');
      setDescription('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editingGenre) return;
      const slug = editName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-');

      const { error } = await (supabase.from('genres') as any)
        .update({ name: editName, slug, description: editDescription })
        .eq('id', editingGenre.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-genres'] });
      queryClient.invalidateQueries({ queryKey: ['live-genres'] });
      setEditingGenre(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('genres').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-genres'] });
      queryClient.invalidateQueries({ queryKey: ['live-genres'] });
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addMutation.mutate();
  };

  const handleOpenEdit = (genre: GenreRow) => {
    setEditingGenre(genre);
    setEditName(genre.name);
    setEditDescription(genre.description || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName) return;
    updateMutation.mutate();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-white/10 pb-5">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <FolderKanban className="w-6 h-6 text-amber-400" />
          Kategori Yönetimi
        </h1>
        <p className="text-xs text-cinema-300">
          Film türlerini ekleyin, düzenleyin veya kaldırın.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Add */}
        <form onSubmit={handleAdd} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 h-fit">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
            Yeni Kategori Ekle
          </h2>
          <div>
            <label className="block text-xs font-semibold text-cinema-300 uppercase mb-1">Tür Adı *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Örn: Bilim Kurgu" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-cinema-300 uppercase mb-1">Açıklama</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tür açıklaması..."
              rows={3}
              className="w-full bg-cinema-900 text-white border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-accent"
            />
          </div>
          <Button type="submit" isLoading={addMutation.isPending} className="w-full py-2.5 rounded-xl gap-2 font-bold uppercase text-xs">
            <PlusCircle className="w-4 h-4" />
            <span>Kategori Ekle</span>
          </Button>
        </form>

        {/* List */}
        <div className="lg:col-span-2 glass-panel rounded-3xl border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
            Mevcut Kategoriler ({genres.length})
          </h2>
          {isLoading ? (
            <div className="text-xs text-cinema-300 py-8 text-center">Kategoriler Yükleniyor...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {genres.map((g) => (
                <div key={g.id} className="p-4 rounded-2xl bg-cinema-900/80 border border-white/10 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <h3 className="font-bold text-white text-sm truncate">{g.name}</h3>
                    <span className="text-[11px] text-cinema-300 font-mono block">/{g.slug}</span>
                    {g.description && <p className="text-[11px] text-cinema-300/70 truncate">{g.description}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleOpenEdit(g)}
                      className="w-8 h-8 rounded-lg text-cinema-300 hover:text-white border border-white/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => confirm('Bu kategoriyi silmek istiyor musunuz?') && deleteMutation.mutate(g.id)}
                      className="w-8 h-8 rounded-lg text-red-400 hover:bg-red-500/10 border border-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingGenre && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="glass-panel p-6 rounded-3xl max-w-md w-full border border-white/10 space-y-4 shadow-2xl animate-scale-up">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
              Kategoriyi Düzenle: {editingGenre.name}
            </h2>

            <div>
              <label className="block text-xs font-semibold text-cinema-300 uppercase mb-1">Tür Adı *</label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-semibold text-cinema-300 uppercase mb-1">Açıklama</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="w-full bg-cinema-900 text-white border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" size="sm" type="button" onClick={() => setEditingGenre(null)}>
                İptal
              </Button>
              <Button variant="primary" size="sm" type="submit" isLoading={updateMutation.isPending}>
                Kaydet
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
