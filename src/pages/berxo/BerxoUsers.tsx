import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, ShieldCheck, User as UserIcon, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export const BerxoUsers: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data as ProfileRow[]) || [];
    },
  });

  const toggleRoleMutation = useMutation({
    mutationFn: async ({ userId, currentRole }: { userId: string; currentRole: string }) => {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      const { error } = await (supabase.from('profiles') as any).update({ role: newRole }).eq('id', userId);
      if (error) throw error;
      return { userId, newRole };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users-count'] });
    },
    onError: (err: Error) => {
      alert(`Yetki Hatası (RLS): ${err.message}`);
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-white/10 pb-5">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-sky-400" />
          Kullanıcı Yönetimi
        </h1>
        <p className="text-xs text-cinema-300">
          Sistemde kayıtlı kullanıcı profillerini, e-postalarını ve `admin` yetkilendirmelerini yönetin.
        </p>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-cinema-300 text-xs font-semibold">Kullanıcılar Yükleniyor...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-cinema-300 text-xs font-semibold">Henüz kullanıcı profili bulunmuyor.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cinema-900 text-cinema-300 uppercase font-bold text-[11px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-4">Kullanıcı</th>
                  <th className="p-4">Kullanıcı Adı</th>
                  <th className="p-4">E-Posta</th>
                  <th className="p-4">Katılım Tarihi</th>
                  <th className="p-4">Rol</th>
                  <th className="p-4 text-right">Rol Değiştir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/40 text-accent font-bold flex items-center justify-center">
                        {(u.display_name || u.username || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-white text-sm">{u.display_name || u.username || 'Anonim'}</span>
                    </td>
                    <td className="p-4 font-mono text-cinema-300">@{u.username || 'yok'}</td>
                    <td className="p-4 text-cinema-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-cinema-300/70" />
                        <span>{u.email || 'Belirtilmemiş'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-cinema-300">
                      {new Date(u.created_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4">
                      {u.role === 'admin' ? (
                        <Badge variant="accent" className="font-bold flex items-center gap-1 w-fit">
                          <ShieldCheck className="w-3 h-3" /> ADMIN
                        </Badge>
                      ) : (
                        <Badge variant="neutral" className="font-medium flex items-center gap-1 w-fit">
                          <UserIcon className="w-3 h-3" /> KULLANICI
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        variant={u.role === 'admin' ? 'secondary' : 'outline'}
                        isLoading={toggleRoleMutation.isPending}
                        onClick={() => toggleRoleMutation.mutate({ userId: u.id, currentRole: u.role })}
                        className="text-xs py-1.5 px-3"
                      >
                        {u.role === 'admin' ? 'User Yap' : 'Admin Yap'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
