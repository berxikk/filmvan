import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Film, PlusCircle, Edit, Trash2, Eye, EyeOff, Search, Star, AlertTriangle } from 'lucide-react';
import { getAdminMovies, deleteMovie, publishMovie, unpublishMovie } from '@/services/movies';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80';

export const BerxoMovies: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState<string>('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data: movies = [], isLoading } = useQuery({
    queryKey: ['admin-movies'],
    queryFn: getAdminMovies,
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => publishMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: (id: string) => unpublishMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
      setDeleteTargetId(null);
    },
  });

  const filteredMovies = (movies || []).filter((m) =>
    m && m.title &&
    (m.title.toLowerCase().includes(search.toLowerCase()) ||
    (m.director && m.director.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Film className="w-6 h-6 text-accent" />
            Film Kataloğu Yönetimi
          </h1>
          <p className="text-xs text-cinema-300">
            Sistemdeki tüm filmleri listeleyin, yayınlayın/yayınını kaldırın veya düzenleyin.
          </p>
        </div>

        <Link to="/berxo/movies/new">
          <Button variant="primary" className="rounded-xl px-5 gap-2 shadow-lg shadow-accent/20">
            <PlusCircle className="w-4 h-4" />
            <span>Yeni Film Ekle</span>
          </Button>
        </Link>
      </div>

      {/* Filter & Search */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Film adı veya yönetmen ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="text-xs font-semibold text-cinema-300">
          Toplam: <span className="text-white">{filteredMovies.length}</span> film
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-cinema-300 text-xs font-semibold">Yükleniyor...</div>
        ) : filteredMovies.length === 0 ? (
          <div className="p-12 text-center text-cinema-300 text-xs font-semibold">Film bulunamadı.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cinema-900 text-cinema-300 uppercase font-bold text-[11px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-4">Poster</th>
                  <th className="p-4">Film Adı</th>
                  <th className="p-4">Yıl</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Views</th>
                  <th className="p-4">Created</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMovies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <img
                        src={movie.poster_url || FALLBACK_POSTER}
                        alt={movie.title}
                        className="w-10 h-14 object-cover rounded-lg bg-cinema-900 shrink-0"
                      />
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white text-sm block">{movie.title}</span>
                        <span className="text-[11px] text-cinema-300 font-mono">/{movie.slug}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-cinema-300">{movie.release_year}</td>
                    <td className="p-4">
                      {movie.is_published ? (
                        <button
                          onClick={() => unpublishMutation.mutate(movie.id)}
                          className="px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors"
                          title="Tıkla ve Yayınını Kaldır (Unpublish)"
                        >
                          <Eye className="w-3.5 h-3.5" /> Yayında
                        </button>
                      ) : (
                        <button
                          onClick={() => publishMutation.mutate(movie.id)}
                          className="px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
                          title="Tıkla ve Yayınla (Publish)"
                        >
                          <EyeOff className="w-3.5 h-3.5" /> Taslak
                        </button>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{movie.rating ? Number(movie.rating).toFixed(1) : '-'}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-cinema-300">
                      {movie.view_count?.toLocaleString() || 0}
                    </td>
                    <td className="p-4 text-cinema-300">
                      {new Date(movie.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Publish / Unpublish Action Button */}
                        {movie.is_published ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => unpublishMutation.mutate(movie.id)}
                            className="text-xs text-amber-400 border border-amber-400/30 hover:bg-amber-400/10"
                          >
                            Unpublish
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => publishMutation.mutate(movie.id)}
                            className="text-xs text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/10"
                          >
                            Publish
                          </Button>
                        )}

                        <Link to={`/berxo/movies/${movie.id}/edit`}>
                          <Button size="icon" variant="ghost" className="w-8 h-8 rounded-lg border border-white/10">
                            <Edit className="w-4 h-4 text-cinema-300 hover:text-white" />
                          </Button>
                        </Link>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteTargetId(movie.id)}
                          className="w-8 h-8 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-red-500/40 space-y-4 shadow-2xl animate-scale-up">
            <div className="flex items-center gap-3 text-red-400 font-bold text-lg">
              <AlertTriangle className="w-6 h-6 shrink-0 text-red-500" />
              <span>Filmi Silmek İstiyor musunuz?</span>
            </div>
            <p className="text-xs text-cinema-300 leading-relaxed">
              Bu işlem veri kaybına neden olur. Seçilen film sistemden kalıcı olarak kaldırılacaktır.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setDeleteTargetId(null)}>
                İptal
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={deleteMutation.isPending}
                onClick={() => deleteTargetId && deleteMutation.mutate(deleteTargetId)}
              >
                Evet, Filmi Sil
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
