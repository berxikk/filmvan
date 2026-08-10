import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Film, Eye, FolderKanban, Users, PlusCircle, ShieldCheck, EyeOff, BarChart3, TrendingUp, Star } from 'lucide-react';
import { getAdminMovies } from '@/services/movies';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';

export const BerxoDashboard: React.FC = () => {
  const { data: movies = [], isLoading: moviesLoading } = useQuery({
    queryKey: ['admin-movies'],
    queryFn: getAdminMovies,
  });

  const { data: usersCount = 0 } = useQuery({
    queryKey: ['admin-users-count'],
    queryFn: async () => {
      const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: genresCount = 0 } = useQuery({
    queryKey: ['admin-genres-count'],
    queryFn: async () => {
      const { count } = await supabase.from('genres').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const totalMovies = movies.length;
  const publishedMovies = movies.filter((m) => m.is_published).length;
  const draftMovies = totalMovies - publishedMovies;
  const totalViews = movies.reduce((acc, m) => acc + Number(m.view_count || 0), 0);

  // Top Most Watched Movies
  const mostWatchedMovies = [...movies]
    .sort((a, b) => Number(b.view_count || 0) - Number(a.view_count || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            BERXO KONTROL MERKEZİ
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            Yönetim Genel Bakış
          </h1>
          <p className="text-xs text-cinema-300">
            Fîlîmvan içerik kataloğunu, kategorilerini, altyazıları ve sistem kullanıcılarını tek ekrandan yönetin.
          </p>
        </div>

        <Link to="/berxo/movies/new" className="z-10 shrink-0">
          <Button size="lg" variant="primary" className="rounded-xl px-6 gap-2 shadow-xl">
            <PlusCircle className="w-5 h-5" />
            <span>Yeni Film Ekle</span>
          </Button>
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Movies */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-cinema-300 font-semibold uppercase tracking-wider">Total Movies</span>
            <div className="text-2xl font-black text-white">{moviesLoading ? '...' : totalMovies}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent border border-accent/30 flex items-center justify-center">
            <Film className="w-5 h-5" />
          </div>
        </div>

        {/* Published */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-cinema-300 font-semibold uppercase tracking-wider">Published</span>
            <div className="text-2xl font-black text-emerald-400">{moviesLoading ? '...' : publishedMovies}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        {/* Draft */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-cinema-300 font-semibold uppercase tracking-wider">Draft</span>
            <div className="text-2xl font-black text-amber-400">{moviesLoading ? '...' : draftMovies}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
        </div>

        {/* Users */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-cinema-300 font-semibold uppercase tracking-wider">Users</span>
            <div className="text-2xl font-black text-sky-400">{usersCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Views */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-cinema-300 font-semibold uppercase tracking-wider">Views</span>
            <div className="text-2xl font-black text-purple-400">{moviesLoading ? '...' : totalViews.toLocaleString()}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Most Watched Movies Table Section */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            En Çok İzlenen Filmler (Most Watched)
          </h2>
          <Link to="/berxo/movies" className="text-xs font-semibold text-cinema-300 hover:text-white transition-colors">
            Tüm Kataloğu Gör →
          </Link>
        </div>

        {moviesLoading ? (
          <div className="p-8 text-center text-xs text-cinema-300">Yükleniyor...</div>
        ) : mostWatchedMovies.length === 0 ? (
          <div className="p-8 text-center text-xs text-cinema-300">İzlenme verisi bulunmuyor.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cinema-900 text-cinema-300 uppercase font-bold text-[11px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-3">Sıra</th>
                  <th className="p-3">Film Adı</th>
                  <th className="p-3">Yıl</th>
                  <th className="p-3">IMDb</th>
                  <th className="p-3">Yayın Durumu</th>
                  <th className="p-3 text-right">Toplam İzlenme</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mostWatchedMovies.map((movie, index) => (
                  <tr key={movie.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-accent">#{index + 1}</td>
                    <td className="p-3 font-bold text-white">{movie.title}</td>
                    <td className="p-3 text-cinema-300">{movie.release_year}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {movie.rating ? Number(movie.rating).toFixed(1) : '-'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${movie.is_published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {movie.is_published ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-purple-400">
                      {Number(movie.view_count || 0).toLocaleString()} izlenme
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
          Hızlı Yönetim Eylemleri
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/berxo/movies"
            className="p-5 rounded-2xl bg-cinema-900/80 border border-white/10 hover:border-accent/50 hover:bg-white/5 transition-all flex flex-col justify-between h-32 group"
          >
            <div className="flex items-center justify-between">
              <Film className="w-6 h-6 text-accent" />
              <span className="text-xs font-mono text-cinema-300 group-hover:text-white">Yönet →</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Film Kataloğunu Düzenle</h3>
              <p className="text-[11px] text-cinema-300">Yayın durumu, ekleme ve silme</p>
            </div>
          </Link>

          <Link
            to="/berxo/genres"
            className="p-5 rounded-2xl bg-cinema-900/80 border border-white/10 hover:border-accent/50 hover:bg-white/5 transition-all flex flex-col justify-between h-32 group"
          >
            <div className="flex items-center justify-between">
              <FolderKanban className="w-6 h-6 text-amber-400" />
              <span className="text-xs font-mono text-cinema-300 group-hover:text-white">Yönet →</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Kategorileri Yönet ({genresCount})</h3>
              <p className="text-[11px] text-cinema-300">Yeni tür ekleme ve düzenleme</p>
            </div>
          </Link>

          <Link
            to="/berxo/users"
            className="p-5 rounded-2xl bg-cinema-900/80 border border-white/10 hover:border-accent/50 hover:bg-white/5 transition-all flex flex-col justify-between h-32 group"
          >
            <div className="flex items-center justify-between">
              <Users className="w-6 h-6 text-sky-400" />
              <span className="text-xs font-mono text-cinema-300 group-hover:text-white">Yönet →</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Kullanıcı Rolleri ({usersCount})</h3>
              <p className="text-[11px] text-cinema-300">Kullanıcı & Admin yetkilendirme</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
