import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ShieldCheck, Heart, Globe, Share2, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-cinema-950 border-t border-white/10 text-cinema-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white uppercase tracking-wider">
                Fîlîm<span className="text-accent">van</span>
              </span>
            </Link>
            <p className="text-xs text-cinema-300/80 leading-relaxed">
              Platforma serhêl a fîlm û sînemayê bi kalîteya bilind û naveroka dewlemend bo hezkiriyên sînemayê.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cinema-300 hover:text-white hover:bg-white/10 transition-colors" title="Web">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cinema-300 hover:text-white hover:bg-white/10 transition-colors" title="Parve bike">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cinema-300 hover:text-white hover:bg-white/10 transition-colors" title="E-Posta">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navîgasyon</h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/" className="hover:text-white transition-colors">Malper</Link></li>
              <li><Link to="/movies" className="hover:text-white transition-colors">Hemû Fîlm</Link></li>
              <li><Link to="/genres" className="hover:text-white transition-colors">Kategorî</Link></li>
              <li><Link to="/search" className="hover:text-white transition-colors">Lêgerîn</Link></li>
              <li><Link to="/watchlist" className="hover:text-white transition-colors">Lîsteya Min</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Agahî & Qanûnî</h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/about" className="hover:text-white transition-colors">Der barê me de</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Polîtîkaya Veşarîtiyê</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Mercên Bikaranînê</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Têkilî</Link></li>
            </ul>
          </div>

          {/* Rights Note */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-accent font-semibold text-xs mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Kalîteya Bilind a Weşanê</span>
            </div>
            <p className="text-[11px] text-cinema-300/80 leading-normal">
              Naverokên li ser platforma Fîlîmvanê bi kalîteya herî bilind a dîmen û dengî tên pêşkêşkirin.
            </p>
          </div>
        </div>

        <div className="pt-8 mt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cinema-300/60">
          <p>© {new Date().getFullYear()} Fîlîmvan. Hemû maf parastî ne.</p>
          <div className="flex items-center gap-1.5 text-cinema-300/80">
            <span>Bi hezkirina sînemayê hat amadekirin</span>
            <Heart className="w-3.5 h-3.5 text-accent fill-accent" />
          </div>
        </div>
      </div>
    </footer>
  );
};
