import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, ShieldCheck, LogOut, Heart, Bookmark, History } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { SEO } from '@/components/common/SEO';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  if (!user) {
    navigate('/login');
    return null;
  }

  const isAdmin = profile?.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8 animate-fade-in">
      <SEO title="Profila Min — Fîlîmvan" description="Zanyarî û çalakiyên hesabê xwe birêve bibin." />

      {/* Header */}
      <div className="border-b border-white/10 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider">
          <User className="w-4 h-4 text-accent" />
          Hesabê Şexsî
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Profila Min
        </h1>
        <p className="text-sm text-cinema-300">
          Zanyariyên hesabê xwe yê Fîlîmvanê kontrol bikin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Profile Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 md:col-span-2">
          <div className="flex items-center gap-4 border-b border-white/10 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/40 text-accent flex items-center justify-center font-black text-2xl uppercase shadow-xl">
              {(profile?.display_name || user.email || 'U').charAt(0)}
            </div>
            <div className="space-y-1 overflow-hidden">
              <h2 className="text-xl font-bold text-white truncate">
                {profile?.display_name || 'Bikarhêner'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-cinema-300">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{user.email}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-cinema-300 font-semibold">Rola Hesabê</span>
              <span className="font-bold text-accent uppercase">
                {isAdmin ? 'BERXO Rêveber (Admin)' : 'Endam (Member)'}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-cinema-300 font-semibold">Dîroka Endamtiyê</span>
              <span className="font-medium text-white">
                {new Date(user.created_at || Date.now()).toLocaleDateString('tr-TR')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {isAdmin && (
              <Link to="/berxo">
                <Button variant="primary" size="sm" className="rounded-xl px-5 gap-2 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>BERXO Panel</span>
                </Button>
              </Link>
            )}

            <Button
              variant="secondary"
              size="sm"
              onClick={() => signOut()}
              className="rounded-xl px-5 gap-2 text-red-400 border-red-500/20 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
              <span>Derkeve</span>
            </Button>
          </div>
        </div>

        {/* Right Shortcuts */}
        <div className="space-y-4">
          <Link
            to="/watchlist"
            className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-accent/40 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase group-hover:text-accent transition-colors">
                  Lîsteya Min
                </h3>
                <span className="text-[11px] text-cinema-300">Fîlmên tomarkirî</span>
              </div>
            </div>
          </Link>

          <Link
            to="/favorites"
            className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-accent/40 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center">
                <Heart className="w-4 h-4 fill-accent" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase group-hover:text-accent transition-colors">
                  Favorî
                </h3>
                <span className="text-[11px] text-cinema-300">Fîlmên favorî</span>
              </div>
            </div>
          </Link>

          <Link
            to="/history"
            className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-accent/40 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase group-hover:text-accent transition-colors">
                  Dîroka Mêzekirinê
                </h3>
                <span className="text-[11px] text-cinema-300">Qeydên temşakirinê</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
