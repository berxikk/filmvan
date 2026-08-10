import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SEO } from '@/components/common/SEO';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cinema-950 flex flex-col items-center justify-center p-6 text-center space-y-6 pt-20">
      <SEO title="404 Sayfa Bulunamadı" description="Aradığınız sayfa mevcut değil veya taşınmış olabilir." />

      <div className="relative">
        <div className="text-8xl sm:text-9xl font-black text-white/10 select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/40 text-accent flex items-center justify-center">
            <Film className="w-8 h-8 text-accent" />
          </div>
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
          Aradığınız Sahne Bulunamadı
        </h1>
        <p className="text-xs sm:text-sm text-cinema-300 leading-relaxed">
          Ulaşmaya çalıştığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak erişilemiyor olabilir.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="primary" size="sm" className="rounded-xl px-5 gap-2">
            <Home className="w-4 h-4" />
            <span>Ana Sayfaya Dön</span>
          </Button>
        </Link>
        <Link to="/movies">
          <Button variant="secondary" size="sm" className="rounded-xl px-5 gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Kataloğa Git</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
