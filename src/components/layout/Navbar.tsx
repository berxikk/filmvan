import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Film, 
  Home, 
  Grid, 
  Search, 
  Bookmark, 
  Heart, 
  User as UserIcon, 
  Menu, 
  X,
  History,
  Sparkles,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Malper', path: '/', icon: Home },
    { name: 'Fîlm', path: '/movies', icon: Film },
    { name: 'Kategorî', path: '/genres', icon: Grid },
    { name: 'Lêgerîn', path: '/search', icon: Search },
    { name: 'Lîsteya Min', path: '/watchlist', icon: Bookmark },
    { name: 'Favorî', path: '/favorites', icon: Heart },
    { name: 'Dîrok', path: '/history', icon: History },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-cinema-950/85 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl shadow-black/80'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/40 group-hover:scale-105 transition-transform duration-300">
            <Film className="w-6 h-6 text-white fill-white/20" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-wider text-white font-sans uppercase">
              Fîlîm<span className="text-accent">van</span>
            </span>
            <span className="text-[9px] text-cinema-300 font-medium tracking-widest -mt-1 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-accent" /> KULTUR & SÎNEMA
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 flex items-center gap-1.5',
                  active
                    ? 'text-white bg-white/10 font-semibold border border-white/10 shadow-inner'
                    : 'text-cinema-300 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className={cn('w-4 h-4', active ? 'text-accent' : 'text-cinema-300')} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          {isAdmin && (
            <Link to="/berxo">
              <Button variant="primary" size="sm" className="rounded-full gap-1.5 shadow-lg shadow-accent/30 font-bold">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>BERXO Panel</span>
              </Button>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <Button variant="secondary" size="sm" className="rounded-full gap-2 border-white/10">
                  <UserIcon className="w-4 h-4 text-accent" />
                  <span className="truncate max-w-[100px]">
                    {profile?.display_name || profile?.username || 'Profila Min'}
                  </span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                className="rounded-full border border-white/10 text-cinema-300 hover:text-red-400"
                title="Derkeve"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="primary" size="sm" className="rounded-full px-5">
                Têkeve
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Action Controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => navigate('/search')}
            className="p-2 text-cinema-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Lêgerîn"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate(user ? '/profile' : '/login')}
            className="p-2 text-cinema-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Profil"
          >
            <UserIcon className="w-5 h-5 text-accent" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-cinema-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Menü"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-accent" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[70px] bg-cinema-950/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl p-5 animate-slide-up">
          <nav className="flex flex-col gap-2">
            {isAdmin && (
              <Link
                to="/berxo"
                className="px-4 py-3 rounded-xl text-sm font-bold bg-accent text-white flex items-center gap-3 shadow-lg shadow-accent/20 mb-2"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>BERXO Panel</span>
              </Link>
            )}

            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3',
                    active
                      ? 'text-white bg-accent/20 border border-accent/40 font-semibold'
                      : 'text-cinema-300 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className={cn('w-5 h-5', active ? 'text-accent' : 'text-cinema-300')} />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-2.5">
              {user ? (
                <Button onClick={() => signOut()} variant="secondary" className="w-full justify-center text-red-400 gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>Derkeve</span>
                </Button>
              ) : (
                <Link to="/login" className="w-full">
                  <Button variant="primary" className="w-full justify-center">
                    Têkeve / Qeyd Bibe
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
