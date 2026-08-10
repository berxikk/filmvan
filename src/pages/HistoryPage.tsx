import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserWatchHistory, deleteHistoryItem } from '@/services/userActivity';
import { History, Play, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const HistoryPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: historyItems = [], isLoading } = useQuery({
    queryKey: ['user-watch-history'],
    queryFn: getUserWatchHistory,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteHistoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-watch-history'] });
      queryClient.invalidateQueries({ queryKey: ['continue-watching'] });
    },
  });

  const formatProgress = (progressSeconds: number, durationMinutes: number) => {
    const totalSeconds = (durationMinutes || 90) * 60;
    const percentage = Math.min(Math.round((progressSeconds / totalSeconds) * 100), 100);
    return { percentage, progressMinutes: Math.floor(progressSeconds / 60) };
  };

  const validItems = (historyItems || []).filter((item) => item && item.movie && item.movie.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider">
            <History className="w-4 h-4 text-accent" />
            Çalakîya Temşakirinê
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Dîroka Mêzekirinê
          </h1>
          <p className="text-sm text-cinema-300">
            Qeydên hemû fîlmên ku we berê temşa kiriye an jî nîvco hiştiye.
          </p>
        </div>

        <div className="text-xs text-cinema-300 font-medium bg-cinema-900 border border-white/10 px-4 py-2 rounded-xl">
          Bi giştî <span className="text-white font-bold">{validItems.length}</span> çalakî
        </div>
      </div>

      {/* History Table or Loading or Empty */}
      {isLoading ? (
        <div className="p-12 text-center text-cinema-300 text-xs font-semibold">Dîroka Mêzekirinê Tê Bar-kirin...</div>
      ) : validItems.length === 0 ? (
        <div className="glass-panel p-12 sm:p-16 rounded-3xl text-center border border-white/10 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center mx-auto">
            <History className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-lg font-bold text-white uppercase">Dîroka Te Ya Mêzekirinê Paqij E</h2>
          <p className="text-xs text-cinema-300 leading-relaxed">
            Hêj fîlmek ku we temşa kiribe tune ye. Dema ku hûn dest bi temşakirinê bikin rewş bixweber li vir tê zêdekirin.
          </p>
          <Link to="/movies">
            <Button variant="primary" size="sm" className="rounded-xl px-6 gap-2">
              <Play className="w-4 h-4 fill-white" />
              <span>Dest bi Temşakirinê Buke</span>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cinema-900 text-cinema-300 uppercase font-bold text-[11px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-4">Fîlm</th>
                  <th className="p-4">Temşakirina Dawî</th>
                  <th className="p-4">Pêşveçûn (İlerleme)</th>
                  <th className="p-4">Rewş</th>
                  <th className="p-4 text-right">Çalakî</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {validItems.map((item) => {
                  const durationMins = parseInt(item.movie.duration) || 90;
                  const { percentage, progressMinutes } = formatProgress(item.progress_seconds, durationMins);
                  const poster = item.movie.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80';

                  return (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      {/* Movie Info */}
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={poster}
                          alt={item.movie.title}
                          className="w-10 h-14 object-cover rounded-lg bg-cinema-900 shrink-0"
                        />
                        <div className="space-y-0.5">
                          <Link to={`/movie/${item.movie.slug}`} className="font-bold text-white text-sm hover:text-accent transition-colors block">
                            {item.movie.title}
                          </Link>
                          <span className="text-[11px] text-cinema-300 font-mono">
                            {item.movie.year} • {item.movie.director}
                          </span>
                        </div>
                      </td>

                      {/* Last Watched Date */}
                      <td className="p-4 text-cinema-300">
                        {new Date(item.last_watched_at).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      {/* Progress Bar */}
                      <td className="p-4 space-y-1 w-48">
                        <div className="flex items-center justify-between text-[11px] text-cinema-300 font-medium">
                          <span>{progressMinutes} deq / {durationMins} deq</span>
                          <span className="font-bold text-white">%{percentage}</span>
                        </div>
                        <div className="w-full h-1.5 bg-cinema-900 rounded-full overflow-hidden border border-white/10">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {item.completed ? (
                          <Badge variant="accent" className="font-bold flex items-center gap-1 w-fit bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
                            <CheckCircle2 className="w-3 h-3" /> TEMAM BÛ
                          </Badge>
                        ) : (
                          <Badge variant="neutral" className="font-medium flex items-center gap-1 w-fit text-amber-400 border-amber-400/30">
                            <Clock className="w-3 h-3" /> DEWAM DIKE
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/watch/${item.movie.slug}`}>
                            <Button size="sm" variant="primary" className="rounded-xl px-3 text-xs gap-1.5">
                              <Play className="w-3.5 h-3.5 fill-white" />
                              <span>{item.completed ? 'Dîsa Temşa Buke' : 'Dewam Buke'}</span>
                            </Button>
                          </Link>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteMutation.mutate(item.id)}
                            className="w-8 h-8 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-400"
                            title="Paqij bike"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
