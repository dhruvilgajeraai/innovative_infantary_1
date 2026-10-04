import React, { useState } from 'react';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  Phone, 
  Building, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AccountType } from '../../types';

interface RegistrationSlideProps {
  onSuccess: (userId: string, email: string) => void;
  onGoToLogin: () => void;
}

export const RegistrationSlide: React.FC<RegistrationSlideProps> = ({
  onSuccess,
  onGoToLogin
}) => {
  const { registerUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('The Champions Club');
  const [accountType, setAccountType] = useState<AccountType>('normal');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  // Validate form
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required.';
    
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      errs.email = 'Valid Email or Gmail address is required.';
    }

    // Phone
    if (!phone.trim() || phone.length < 8) {
      errs.phone = 'Valid phone number is required.';
    }

    // Strong password check: min 8 chars, 1 number
    if (!password || password.length < 8) {
      errs.password = 'Password must be at least 8 characters long.';
    } else if (!/\d/.test(password)) {
      errs.password = 'Password must contain at least one numerical digit.';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!termsAccepted) {
      errs.terms = 'You must accept the ArenaFlow terms & club policies.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const res = await registerUser({
      name,
      email,
      phone,
      password,
      organization,
      requestedType: accountType
    });
    setIsSubmitting(false);

    if (res.success) {
      setSuccessBanner(true);
      setTimeout(() => {
        onSuccess(res.userId, email);
      }, 1200);
    } else {
      setErrors({ email: 'An account with this email address already exists.' });
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 lg:p-10 relative">
      
      <div className="max-w-2xl w-full bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-2xl relative z-10 text-slate-100">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <span>The Champions Club &bull; Member Registration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Join The Champions Club
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Register to book courts, manage memberships, attend Friday Socials, and access pro club amenities.
          </p>
        </div>

        {/* Security Policy Reminder */}
        <div className="mb-6 p-3.5 rounded-2xl bg-sky-950/70 border border-sky-500/40 flex items-start space-x-3 text-xs text-sky-200 font-medium">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <p>
            <strong>Authority Governance Policy:</strong> Self-registration registers you as an active club user. Staff and Authority access requires verification and assignment by Super Admin.
          </p>
        </div>

        {successBanner ? (
          <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Registration Successful!</h3>
            <p className="text-xs text-slate-300">
              Your profile has been created. Redirecting to Gmail confirmation code verification...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name & Organization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Liam Davies"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:bg-slate-950 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                {errors.name && <span className="text-[11px] text-rose-400 font-semibold mt-1 block">{errors.name}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Organization / Club Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={organization}
                    onChange={e => setOrganization(e.target.value)}
                    placeholder="The Champions Club"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:bg-slate-950 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email / Gmail Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="athlete@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:bg-slate-950 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                {errors.email && <span className="text-[11px] text-rose-400 font-semibold mt-1 block">{errors.email}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number *</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:bg-slate-950 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                {errors.phone && <span className="text-[11px] text-rose-400 font-semibold mt-1 block">{errors.phone}</span>}
              </div>
            </div>

            {/* Account Type Request Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Account Type Selection
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'normal', label: 'Normal User', sub: 'Standard Member' },
                  { id: 'staff', label: 'Staff User', sub: 'Coach / Desk' },
                  { id: 'authority', label: 'Authority User', sub: 'Dept Admin' },
                  { id: 'superadmin', label: 'Super Admin', sub: 'Master Exec' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAccountType(opt.id as AccountType)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      accountType === opt.id 
                        ? 'bg-sky-950/80 border-sky-500 text-sky-200 shadow-md font-semibold' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="text-xs font-bold truncate text-white">{opt.label}</div>
                    <div className="text-[10px] text-slate-400 truncate">{opt.sub}</div>
                  </button>
                ))}
              </div>
              {accountType !== 'normal' && (
                <p className="text-[10px] text-amber-300 mt-1.5 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                  Requesting {accountType} account type will queue an authorization review with SUPER-001.
                </p>
              )}
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Personal Password *</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 chars, 1 digit"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:bg-slate-950 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                />
                {errors.password && <span className="text-[11px] text-rose-400 font-semibold mt-1 block">{errors.password}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:bg-slate-950 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                />
                {errors.confirmPassword && <span className="text-[11px] text-rose-400 font-semibold mt-1 block">{errors.confirmPassword}</span>}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="pt-2">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-sky-500 focus:ring-sky-500 bg-slate-950"
                />
                <span className="text-xs text-slate-400">
                  I agree to the ArenaFlow Terms of Service, Club Booking Rules (max 2 plays/day, 60-min slots), and Privacy Policy.
                </span>
              </label>
              {errors.terms && <span className="text-[11px] text-rose-400 font-semibold mt-1 block">{errors.terms}</span>}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-sky-500/25 transition-all flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? 'Registering Account...' : 'Complete Registration &bull; Proceed to Verification'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Link to login */}
            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">Already registered? </span>
              <button
                type="button"
                onClick={onGoToLogin}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline"
              >
                Sign in to your account
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
