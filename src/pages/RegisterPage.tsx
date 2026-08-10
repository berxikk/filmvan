import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, UserPlus, Lock, Mail, User as UserIcon, AlertCircle, ShieldCheck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { SEO } from '@/components/common/SEO';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signUp, verifyOtp, resendOtp } = useAuth();

  const [displayName, setDisplayName] = useState<string>('');
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

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      setErrorMsg('Ji kerema xwe re hemû qadan dagirin.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Şîfre olane herî kêm divê 6 karakter be.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const username = displayName.toLowerCase().replace(/\s+/g, '_') || email.split('@')[0];
      const res = await signUp(email, password, username, displayName);

      if (res?.error) {
        setErrorMsg(res.error.message || 'Qeydkirin bi ser neket. Ji kerema xwe zanyariyên xwe kontrol bikin.');
      } else {
        setIsOtpStep(true);
        setInfoMsg(`Koda piştrastkirinê ya 6 reqemî ji adresa ${email} re hat şandin.`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Qeydkirin bi ser neket. Ji kerema xwe zanyariyên xwe kontrol bikin.');
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
      <SEO title="Qeyd Bibe — Fîlîmvan" description="Di Fîlîmvanê de hesabê nû çêbikin." />

      <div className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center mx-auto shadow-lg shadow-accent/40 mb-3">
            {isOtpStep ? <ShieldCheck className="w-6 h-6 text-white" /> : <Film className="w-6 h-6 text-white" />}
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            {isOtpStep ? 'Koda Piştrastkirinê' : 'Di Fîlîmvanê De Hesab Çêbiku'}
          </h1>
          <p className="text-xs text-cinema-300">
            {isOtpStep
              ? `Koda 6 reqemî ya ku ji adresa ${email} re hatî şandin binivîsin.`
              : 'Bibin endam û lîsteya xwe ya taybet a fîlman amade bikin.'}
          </p>
        </div>

        {/* Alerts */}
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

        {/* Step 2: OTP Verification Form */}
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
                Adresê Biguherîne
              </button>
            </div>
          </form>
        ) : (
          /* Step 1: Registration Form */
          <form onSubmit={handleSubmitRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-cinema-300 uppercase tracking-wider mb-1.5">
                Navê Nîşandanê
              </label>
              <Input
                type="text"
                placeholder="Mînak: Berhat"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                leftIcon={<UserIcon className="w-4 h-4 text-cinema-300" />}
                required
              />
            </div>

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
                Şîfre (Herî kêm 6 karakter)
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
              <UserPlus className="w-4 h-4" />
              <span>Qeyd Bibe & Koda Piştrastkirinê Bistîne</span>
            </Button>
          </form>
        )}

        {/* Footer Link */}
        {!isOtpStep && (
          <div className="text-center pt-2 border-t border-white/10 text-xs text-cinema-300">
            <span>Hesabê te heye? </span>
            <Link to="/login" className="text-accent font-bold hover:underline ml-1">
              Têkeve
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
