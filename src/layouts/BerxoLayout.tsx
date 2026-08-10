import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Film, 
  PlusCircle, 
  FolderKanban, 
  Subtitles, 
  Users, 
  ExternalLink, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export const BerxoLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const menuItems = [
    { name: 'Dashboard', path: '/berxo', icon: LayoutDashboard, exact: true },
    { name: 'Filmler', path: '/berxo/movies', icon: Film, exact: false },
    { name: 'Film Ekle', path: '/berxo/movies/new', icon: PlusCircle, exact: true },
    { name: 'Kategoriler', path: '/berxo/genres', icon: FolderKanban, exact: true },
    { name: 'Altyazılar', path: '/berxo/subtitles', icon: Subtitles, exact: true },
    { name: 'Kullanıcılar', path: '/berxo/users', icon: Users, exact: true },
  ];

  const isActive = (path: string, exact: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-cinema-950 text-cinema-100 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-cinema-900 border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-black text-white text-sm shadow-md shadow-accent/40">
            B
          </div>
          <span className="font-black text-white text-base uppercase tracking-wider">
            BERXO <span className="text-accent">PANEL</span>
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-cinema-300 hover:text-white rounded-lg hover:bg-white/10"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-cinema-900 border-r border-white/10 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 space-y-6">
          {/* Admin Header */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="w-10 h-10 rounded-xl bg-accent text-white font-black text-lg flex items-center justify-center shadow-lg shadow-accent/30 shrink-0">
              B
            </div>
            <div className="flex flex-col">
              <span className="font-black text-white text-lg tracking-wider uppercase">
                BERXO <span className="text-accent text-xs">ADMIN</span>
              </span>
              <span className="text-[10px] text-cinema-300 font-mono tracking-widest flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-accent" /> YÖNETİM SİSTEMİ
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200',
                    active
                      ? 'bg-accent text-white shadow-lg shadow-accent/20 border border-accent/40 font-bold'
                      : 'text-cinema-300 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className={cn('w-4 h-4', active ? 'text-white' : 'text-cinema-300')} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-white/10 space-y-3 bg-cinema-950/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-cinema-300 truncate max-w-[120px] font-medium">
              {profile?.display_name || profile?.username || 'Admin'}
            </span>
            <Badge variant="accent" className="text-[10px] font-bold">ADMIN</Badge>
          </div>

          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-cinema-300 hover:text-white text-xs font-semibold transition-colors border border-white/10"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ana Siteye Git</span>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 justify-center gap-2 border border-red-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Çıkış Yap</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-background p-4 sm:p-8 lg:p-10 min-h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
