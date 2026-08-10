import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, LogIn, Lock, Mail, AlertCircle, ShieldCheck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { SEO } from '@/components/common/SEO';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signIn, verifyOtp, resendOtp } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [isOtpStep, setIsOtpStep] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);

  // If user is already authenticated, immediately redirect to homepage
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Ji kerema xwe re e-posta û şîfreyê binivîsin.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await signIn(email, password);
      if (res?.error) {
        const msg = res.error.message || '';
        // Detect if email is unconfirmed / unverified in Supabase
        if (msg.toLowerCase().includes('email not confirmed') || msg.toLowerCase().includes('not verified')) {
          setIsOtpStep(true);
          setInfoMsg(`E-posta te nehatiye piştrastkirin. Ji kerema xwe koda 6 reqemî ya ku ji ${email} re hatî şandin binivîsin.`);
          await resendOtp(email);
        } else {
          setErrorMsg(msg || 'Têketin bi ser neket. Ji kerema xwe zanyariyên xwe kontrol bikin.');
        }
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Têketin bi ser neket. Ji kerema xwe zanyariyên xwe kontrol bikin.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      setErrorMsg('Ji kerema xwe koda 6 reqemî ya derbasdar binivîsin.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await verifyOtp(email, otpCode.trim());
      if (res?.error) {
        setErrorMsg(res.error.message || 'Koda piştrastkirinê çewt e an jî dema wê derbas bûye.');
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Piştrastkirin bi ser neket.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setErrorMsg(null);
    try {
      const res = await resendOtp(email);
      if (res?.error) {
        setErrorMsg(res.error.message || 'Şandina kodê bi ser neket.');
      } else {
        setInfoMsg('Koda nû ji adresa e-postayê re hat şandin.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Şandina kodê bi ser neket.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 sm:px-6 lg:px-8 animate-fade-in">
      <SEO title="Têkeve — Fîlîmvan" description="Têkeve hesabê xwe yê Fîlîmvanê." />

      <div className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center mx-auto shadow-lg shadow-accent/40 mb-3">
            {isOtpStep ? <ShieldCheck className="w-6 h-6 text-white" /> : <Film className="w-6 h-6 text-white" />}
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            {isOtpStep ? 'Koda Piştrastkirinê' : 'Têkeve Hesabê Xwe'}
          </h1>
          <p className="text-xs text-cinema-300">
            {isOtpStep
              ? `Koda 6 reqemî ya ku ji adresa ${email} re hatî şandin binivîsin.`
              : 'Ji bo ku hûn li lîsteya xwe fîlman zêde bikin têkevin platformê.'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* OTP Step Form */}
        {isOtpStep ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-cinema-300 uppercase tracking-wider mb-1.5">
                Koda Piştrastkirinê (6 Reqemî) *
              </label>
              <Input
                type="text"
                placeholder="123456"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                leftIcon={<ShieldCheck className="w-4 h-4 text-cinema-300" />}
                className="text-center font-mono tracking-widest text-base py-3"
                required
              />
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full py-3.5 rounded-xl gap-2 font-bold uppercase text-xs shadow-xl shadow-accent/30 mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Kodu Piştrast Buke & Têkeve</span>
            </Button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resending}
                className="text-cinema-300 hover:text-accent flex items-center gap-1.5 font-semibold transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                <span>Kodu Dîsa Bişîne</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOtpStep(false)}
                className="text-cinema-300 hover:text-white transition-colors"
              >
                Têketina Asayî
              </button>
            </div>
          </form>
        ) : (
          /* Normal Login Form */
          <form onSubmit={handleSubmitLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-cinema-300 uppercase tracking-wider mb-1.5">
                Adresa E-Postayê
              </label>
              <Input
                type="email"
                placeholder="mînak@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-cinema-300" />}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-cinema-300 uppercase tracking-wider mb-1.5">
                Şîfre
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-cinema-300" />}
                required
              />
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full py-3.5 rounded-xl gap-2 font-bold uppercase text-xs shadow-xl shadow-accent/30 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Têkeve</span>
            </Button>
          </form>
        )}

        {/* Footer Link */}
        {!isOtpStep && (
          <div className="text-center pt-2 border-t border-white/10 text-xs text-cinema-300">
            <span>Hesabê te tune ye? </span>
            <Link to="/register" className="text-accent font-bold hover:underline ml-1">
              Qeyd Bibe
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
