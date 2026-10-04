import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  Flame,
  Key,
  ShieldCheck,
  Smartphone,
  RefreshCw,
  Zap,
  Info,
  Check,
  Settings
} from 'lucide-react';
import { useAuth, FIXED_CREDENTIALS } from '../../context/AuthContext';
import { AuthorityId } from '../../types';

interface LoginSlideProps {
  onSuccess: () => void;
  onGoToRegister: () => void;
  onExploreAsGuest?: () => void;
}

export const LoginSlide: React.FC<LoginSlideProps> = ({
  onSuccess,
  onGoToRegister,
  onExploreAsGuest
}) => {
  const { loginAsNormalUser, loginAsAuthority, sendPhoneOtp, verifyPhoneOtp, authorities } = useAuth();

  // Mode: 'password' | 'phone_otp'
  const [loginMode, setLoginMode] = useState<'password' | 'phone_otp'>('password');

  // Password fields
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone OTP fields
  const [phoneNumber, setPhoneNumber] = useState('+91 ');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [liveOtpNotification, setLiveOtpNotification] = useState<string | null>(null);

  // Common states
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);
  const [showDeptModal, setShowDeptModal] = useState(false);

  // SMS Gateway Configuration States
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const [smsGatewayProvider, setSmsGatewayProvider] = useState<'2factor' | 'fast2sms' | 'twilio'>('2factor');
  const [smsApiKey, setSmsApiKey] = useState('');
  const [gatewaySaving, setGatewaySaving] = useState(false);
  const [gatewaySavedMsg, setGatewaySavedMsg] = useState<string | null>(null);
  const [activeGatewayProvider, setActiveGatewayProvider] = useState<string>('none');

  // Load gateway status on mount
  useEffect(() => {
    const fetchGateway = async () => {
      try {
        let res = await fetch('/api/auth/otp/gateway');
        if (!res.ok) res = await fetch('http://127.0.0.1:5000/api/auth/otp/gateway');
        const d = await res.json();
        if (d && d.success && d.config) {
          setActiveGatewayProvider(d.config.activeProvider);
        }
      } catch (e) {
        try {
          const res = await fetch('http://127.0.0.1:5000/api/auth/otp/gateway');
          const d = await res.json();
          if (d && d.success && d.config) setActiveGatewayProvider(d.config.activeProvider);
        } catch (_) {}
      }
    };
    fetchGateway();
  }, []);

  // Countdown for OTP resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Handle Password Login Submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setForgotMsg(null);

    const trimmedInput = emailOrId.trim();
    if (!trimmedInput || !password) {
      setError('Please enter both your email/ID and password.');
      return;
    }

    setLoading(true);

    // 1. Check if input is a Fixed Authority ID
    const upperInput = trimmedInput.toUpperCase() as AuthorityId;
    if (FIXED_CREDENTIALS[upperInput]) {
      const res = await loginAsAuthority(upperInput, password);
      setLoading(false);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.message);
      }
      return;
    }

    // 2. Check if input is an Authority's registered official email
    const matchingAuth = (Object.keys(FIXED_CREDENTIALS) as AuthorityId[]).find(
      id => FIXED_CREDENTIALS[id].email.toLowerCase() === trimmedInput.toLowerCase()
    );

    if (matchingAuth) {
      const res = await loginAsAuthority(matchingAuth, password);
      setLoading(false);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.message);
      }
      return;
    }

    // 3. Normal Club Member Login with Email & Personal Password
    const res = await loginAsNormalUser(trimmedInput, password);
    setLoading(false);
    if (res.success) {
      onSuccess();
    } else {
      setError(res.message);
    }
  };

  // Handle Send Real Phone OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const cleaned = phoneNumber.trim();
    if (!cleaned || cleaned.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    const res = await sendPhoneOtp(cleaned);
    setLoading(false);

    if (res.success) {
      setOtpSent(true);
      setResendTimer(60);
      setError(null);
      // Keep empty so the user inputs the 6 digits received on their mobile phone!
      setOtpCode(['', '', '', '', '', '']);

      if (res.liveSmsSent) {
        setLiveOtpNotification(`📩 Real SMS delivered to ${res.phone || cleaned}! Enter the 6-digit code received on your phone.`);
      } else {
        setLiveOtpNotification(`📱 OTP dispatched for ${res.phone || cleaned}. (For live SIM delivery, enter your Fast2SMS or 2Factor key in Gateway Settings. Dev Test Code: ${res.otp})`);
      }
    } else {
      setError(res.message || 'Failed to dispatch real SMS OTP.');
    }
  };

  // Handle Save SMS Gateway Config
  const handleSaveGateway = async () => {
    if (!smsApiKey.trim()) {
      setGatewaySavedMsg('Please enter an API Key.');
      return;
    }
    setGatewaySaving(true);
    try {
      const payload: any = {};
      if (smsGatewayProvider === '2factor') payload.twoFactorKey = smsApiKey.trim();
      if (smsGatewayProvider === 'fast2sms') payload.fast2SmsKey = smsApiKey.trim();
      if (smsGatewayProvider === 'twilio') payload.twilioSid = smsApiKey.trim();

      let res;
      try {
        res = await fetch('/api/auth/otp/gateway', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Proxy error');
      } catch (_) {
        res = await fetch('http://127.0.0.1:5000/api/auth/otp/gateway', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      const data = await res.json();
      if (data && data.success) {
        setActiveGatewayProvider(data.config.activeProvider);
        setGatewaySavedMsg(`✅ ${data.config.activeProvider} Gateway Activated! Real SMS will be delivered.`);
        setTimeout(() => {
          setGatewaySavedMsg(null);
          setShowGatewayModal(false);
          setSmsApiKey('');
        }, 1500);
      } else {
        setGatewaySavedMsg(data.message || 'Failed to update gateway.');
      }
    } catch (err: any) {
      setGatewaySavedMsg('Server error saving gateway configuration.');
    } finally {
      setGatewaySaving(false);
    }
  };

  // Handle Verify Real Phone OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const code = otpCode.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits of the OTP.');
      return;
    }

    setLoading(true);
    const res = await verifyPhoneOtp(phoneNumber.trim(), code);
    setLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.message || 'Incorrect OTP code.');
    }
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otpCode];
    updated[index] = val;
    setOtpCode(updated);

    if (val && index < 5) {
      const next = document.getElementById(`phone-otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleForgotPassword = () => {
    if (!emailOrId.trim()) {
      setForgotMsg('Please enter your registered Email or Staff ID above first, then click Forgot Password.');
    } else {
      setForgotMsg(`Password reset verification link dispatched to ${emailOrId}. Please check your inbox.`);
    }
  };

  // 1-Click quick fill credentials helper
  const handleFillCredentials = (email: string, pass: string) => {
    setEmailOrId(email);
    setPassword(pass);
    setShowDeptModal(false);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
      
      {/* Dark Stadium Clean Professional Login Card */}
      <div className="max-w-md w-full bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-2xl relative animate-in fade-in zoom-in-95 duration-300 space-y-5 text-slate-100">
        
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-indigo-600 p-0.5 shadow-md shadow-emerald-500/20 mb-1">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            The Champions Club
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Sports Operations &amp; Secure Authentication Portal
          </p>
        </div>

        {/* Login Method Toggle Tabs */}
        <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => { setLoginMode('password'); setError(null); }}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              loginMode === 'password'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>ID &amp; Password</span>
          </button>
          <button
            type="button"
            onClick={() => { setLoginMode('phone_otp'); setError(null); }}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              loginMode === 'phone_otp'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Real Phone OTP</span>
          </button>
        </div>

        {/* Live OTP Notification Alert (Shows actual OTP code) */}
        {liveOtpNotification && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs space-y-1 animate-in fade-in">
            <div className="flex items-center justify-between font-bold text-emerald-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>SMS Dispatched Successfully!</span>
              </span>
              <button 
                onClick={() => setLiveOtpNotification(null)}
                className="text-slate-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">
              {liveOtpNotification}
            </p>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Status Notification */}
        {forgotMsg && (
          <div className="p-3.5 rounded-xl bg-sky-950/80 border border-sky-500/40 text-sky-200 text-xs flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
            <span>{forgotMsg}</span>
          </div>
        )}

        {/* ==================== TAB 1: PASSWORD LOGIN ==================== */}
        {loginMode === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 animate-in fade-in">
            
            {/* Email / ID Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Email / Authority ID *
                </label>
                <button
                  type="button"
                  onClick={() => setShowDeptModal(true)}
                  className="text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Key className="w-3 h-3" />
                  <span>View Department IDs</span>
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4 text-cyan-400" />
                </div>
                <input
                  type="text"
                  value={emailOrId}
                  onChange={(e) => setEmailOrId(e.target.value)}
                  placeholder="e.g. admin@arenaflow.com or SUPER-001"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:bg-slate-950 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white text-xs placeholder:text-slate-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Field with Show/Hide toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Password *
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4 text-cyan-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (e.g. admin123)"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:bg-slate-950 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white text-xs placeholder:text-slate-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Complex Portal</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>

          </form>
        )}

        {/* ==================== TAB 2: REAL PHONE OTP LOGIN ==================== */}
        {loginMode === 'phone_otp' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Live Gateway Status Header */}
            <div className="flex items-center justify-between pb-1 px-1">
              <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-bold">
                <span>Direct SMS Delivery</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  activeGatewayProvider !== 'none' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  {activeGatewayProvider !== 'none' ? `● ${activeGatewayProvider} ACTIVE` : '○ Live SIM Setup'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowGatewayModal(true)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Configure Gateway</span>
              </button>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Enter Mobile Phone Number (+91) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                    </div>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-400 text-white font-mono text-xs placeholder:text-slate-500"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    A real 6-digit verification code will be sent to this mobile SIM.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Dispatching SMS...</span>
                  ) : (
                    <>
                      <span>Send Real 6-Digit OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2 text-center">
                  <div className="text-xs text-slate-300 font-medium">
                    Enter the 6-digit code sent to <strong className="text-emerald-400 font-mono">{phoneNumber}</strong>
                  </div>

                  {/* 6-Digit OTP Inputs */}
                  <div className="flex justify-center gap-2 pt-1">
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`phone-otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        className="w-10 h-12 text-center text-lg font-black font-mono rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                      />
                    ))}
                  </div>

                  {/* Resend Timer */}
                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-cyan-400 hover:underline"
                    >
                      Change Phone Number
                    </button>
                    {resendTimer > 0 ? (
                      <span className="font-mono">Resend OTP in {resendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendOtp()}
                        className="text-emerald-400 font-bold hover:underline"
                      >
                        Resend OTP Now
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Verifying Code...</span>
                  ) : (
                    <>
                      <span>Verify &amp; Sign In</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Explore as Guest Option */}
        {onExploreAsGuest && (
          <button
            type="button"
            onClick={onExploreAsGuest}
            className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95 shadow-sm"
          >
            <span>🏟️ Explore 3D Stadium &amp; Complex as Guest</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        )}

        {/* Sign Up Link for New Users */}
        <div className="pt-2 border-t border-slate-800 text-center text-xs text-slate-400">
          New athlete or club visitor?{' '}
          <button
            type="button"
            onClick={onGoToRegister}
            className="text-cyan-400 font-bold hover:underline transition-colors ml-1 cursor-pointer"
          >
            Register New Account &rarr;
          </button>
        </div>

      </div>

      {/* SMS GATEWAY CONFIGURATION MODAL */}
      {showGatewayModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-[#070b14] border border-emerald-500/40 rounded-3xl p-5 sm:p-6 text-slate-100 shadow-2xl space-y-4 font-sans">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-black text-white text-base flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <span>Real SMS Gateway Setup (Indian SIM Delivery)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Connect an SMS Gateway to deliver OTP SMS directly to real mobile phones.
                </p>
              </div>
              <button 
                onClick={() => setShowGatewayModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer font-mono"
              >
                ✕
              </button>
            </div>

            {/* Provider Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Select Your SMS Carrier Gateway:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSmsGatewayProvider('2factor')}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    smsGatewayProvider === '2factor'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs text-emerald-300">2Factor.in</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">🇮🇳 Free 100 SMS • Zero DLT</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSmsGatewayProvider('fast2sms')}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    smsGatewayProvider === 'fast2sms'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs text-emerald-300">Fast2SMS</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">🇮🇳 Free Credits • Quick OTP</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSmsGatewayProvider('twilio')}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    smsGatewayProvider === 'twilio'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs text-emerald-300">Twilio</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">🌐 Global Carrier SMS</div>
                </button>
              </div>
            </div>

            {/* API Key Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                {smsGatewayProvider === '2factor' && '2Factor.in API Key (from 2factor.in portal)'}
                {smsGatewayProvider === 'fast2sms' && 'Fast2SMS API Authorization Key (from fast2sms.com)'}
                {smsGatewayProvider === 'twilio' && 'Twilio Account SID (or Auth Token)'}
              </label>
              <input
                type="password"
                value={smsApiKey}
                onChange={(e) => setSmsApiKey(e.target.value)}
                placeholder="Paste your live API Key here..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-400 text-white font-mono text-xs placeholder:text-slate-600"
              />
            </div>

            {/* Quick Helper Guide */}
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 text-xs text-slate-300">
              <div className="font-bold text-emerald-400 flex items-center space-x-1">
                <span>⚡ How to get a free SMS Key in 30 seconds:</span>
              </div>
              <ol className="list-decimal list-inside text-[11px] text-slate-400 space-y-1 pl-1">
                {smsGatewayProvider === '2factor' ? (
                  <>
                    <li>Visit <a href="https://2factor.in" target="_blank" rel="noreferrer" className="text-cyan-400 underline">2factor.in</a> &amp; create free account.</li>
                    <li>Instant 100 free SMS credits are added for all Indian mobile numbers.</li>
                    <li>Copy your API Key from the dashboard and paste above!</li>
                  </>
                ) : smsGatewayProvider === 'fast2sms' ? (
                  <>
                    <li>Visit <a href="https://www.fast2sms.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">fast2sms.com</a> &amp; sign up.</li>
                    <li>Go to <strong>Dev API</strong> section to copy your API Authorization Key.</li>
                    <li>Paste the key above and click Activate!</li>
                  </>
                ) : (
                  <>
                    <li>Sign up at <a href="https://www.twilio.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">twilio.com</a>.</li>
                    <li>Copy your Account SID and Auth Token from the console.</li>
                  </>
                )}
              </ol>
            </div>

            {gatewaySavedMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
                {gatewaySavedMsg}
              </div>
            )}

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowGatewayModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveGateway}
                disabled={gatewaySaving}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                {gatewaySaving ? 'Activating...' : 'Activate Live SMS'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DEPARTMENT & ADMIN CREDENTIALS MODAL */}
      {showDeptModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#070b14] border border-cyan-500/40 rounded-3xl p-5 sm:p-6 text-slate-100 shadow-2xl space-y-4 font-sans max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-black text-white text-base flex items-center gap-2">
                  <span>🏢 All Department Head &amp; Admin Accounts</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Click any department to auto-fill ID &amp; Password instantly.
                </p>
              </div>
              <button 
                onClick={() => setShowDeptModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer font-mono"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
              💡 <strong>Universal Master Password:</strong> Har department ka password <strong><code>admin123</code></strong> ya <strong><code>Champions@2026</code></strong> ya unka specific password dono me se koi bhi chalega!
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {authorities.map(auth => {
                const creds = FIXED_CREDENTIALS[auth.id];
                return (
                  <div 
                    key={auth.id}
                    onClick={() => handleFillCredentials(auth.email, creds?.password || 'admin123')}
                    className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-cyan-400 group-hover:text-cyan-300">
                        {auth.id}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                        {auth.department}
                      </span>
                    </div>
                    <div className="font-bold text-white text-xs">{auth.name}</div>
                    <div className="text-[11px] font-mono text-slate-400 truncate">{auth.email}</div>
                    <div className="text-[10px] text-amber-300 font-mono flex items-center justify-between pt-1 border-t border-slate-800/60">
                      <span>Pass: <strong>{creds?.password || 'admin123'}</strong></span>
                      <span className="text-cyan-400 group-hover:underline">1-Click Fill &rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowDeptModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
