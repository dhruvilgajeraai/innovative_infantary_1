import React, { useState, useEffect } from 'react';
import { 
  MailCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface EmailVerificationSlideProps {
  userId: string;
  email: string;
  onVerified: () => void;
}

export const EmailVerificationSlide: React.FC<EmailVerificationSlideProps> = ({
  userId,
  email,
  onVerified
}) => {
  const { verifyEmailOtp } = useAuth();

  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']); // Pre-filled default demo OTP for instant convenience
  const [resendCountdown, setResendCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setInterval(() => setResendCountdown(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCountdown]);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the confirmation code.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    const res = await verifyEmailOtp(userId, code);
    setIsVerifying(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        onVerified();
      }, 1500);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setCanResend(false);
    setResendCountdown(45);
    setErrorMsg(null);
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 lg:p-10 relative">
      
      <div className="max-w-md w-full bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-2xl relative z-10 text-center space-y-6 text-slate-100">
        
        {/* Slide 09 Header */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-950/70 border border-sky-500/40 text-sky-300 text-xs font-bold uppercase tracking-wider">
          <span>Slide 09 &bull; Gmail Confirmation</span>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 text-sky-400 flex items-center justify-center mx-auto shadow-md shadow-sky-500/10">
          <MailCheck className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-display font-extrabold text-white">
            Confirm Your Email
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            We sent a 6-digit confirmation security code to:
          </p>
          <div className="mt-1 font-mono text-xs font-bold text-sky-300 bg-slate-950 py-1.5 px-3 rounded-lg border border-slate-800 inline-block">
            {email || 'alex.wright@gmail.com'}
          </div>
        </div>

        {success ? (
          <div className="py-6 space-y-3 animate-in zoom-in">
            <div className="w-12 h-12 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Email Confirmed Successfully!</h4>
            <p className="text-xs text-slate-400">
              Opening Normal User Panel (Slide 10)...
            </p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            
            {/* 6-Digit OTP inputs */}
            <div className="flex justify-center gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(idx, e.target.value)}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center font-mono text-lg font-extrabold rounded-xl bg-slate-950 border border-slate-700 text-white focus:bg-slate-950 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
                />
              ))}
            </div>

            <p className="text-[11px] text-slate-400">
              Demo tip: Pre-loaded code is valid. Click Verify to unlock your user panel.
            </p>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-300 font-semibold flex items-center justify-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-sky-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <span>{isVerifying ? 'Verifying Code...' : 'Verify Email & Enter User Panel'}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            {/* Resend Link */}
            <div className="text-xs text-slate-400 flex items-center justify-center space-x-2 pt-1">
              <span>Didn&apos;t receive code?</span>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-bold text-sky-400 hover:underline"
                >
                  Resend Code
                </button>
              ) : (
                <span className="text-slate-500">
                  Resend in <strong className="text-slate-300">{resendCountdown}s</strong>
                </span>
              )}
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
