import { Component, ErrorInfo, ReactNode } from 'react';
import { Film, AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cinema-950 flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-accent" />
          </div>

          <div className="space-y-2 max-w-md">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              Bir Hata Oluştu
            </h1>
            <p className="text-xs text-cinema-300 leading-relaxed">
              Üzgünüz, beklenmedik bir sistem hatası meydana geldi. Lütfen sayfayı yenilemeyi veya ana sayfaya dönmeyi deneyin.
            </p>
            {this.state.error && (
              <div className="p-3 rounded-xl bg-cinema-900 border border-white/10 text-[11px] font-mono text-red-400 truncate max-w-sm mx-auto">
                {this.state.error.message}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" onClick={this.handleReload} className="rounded-xl px-5 gap-2">
              <RotateCcw className="w-4 h-4" />
              <span>Sayfayı Yenile</span>
            </Button>
            <a href="/">
              <Button variant="secondary" size="sm" className="rounded-xl px-5 gap-2">
                <Film className="w-4 h-4" />
                <span>Ana Sayfa</span>
              </Button>
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
