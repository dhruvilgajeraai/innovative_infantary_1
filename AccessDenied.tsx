import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AccessDeniedProps {
  requiredPermission?: string;
  onReturn?: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  requiredPermission,
  onReturn
}) => {
  const { currentAuthority, currentUser, switchActiveAuthority } = useAuth();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="max-w-md w-full bg-slate-900/90 border border-rose-500/30 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold tracking-wide uppercase mb-3">
          <Lock className="w-3 h-3" />
          <span>403 — Access Denied</span>
        </div>

        <h2 className="text-2xl font-display font-extrabold text-white mb-2">
          Unauthorized Access
        </h2>

        <p className="text-sm text-slate-300 mb-4">
          You do not have permission to access this area. Fixed Authority data isolation prevents cross-authority exposure.
        </p>

        {requiredPermission && (
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-400 mb-6">
            Required Permission: <span className="text-rose-400 font-semibold">{requiredPermission}</span>
          </div>
        )}

        <div className="text-xs text-slate-400 mb-6">
          Current Context: <strong className="text-cyan-400">{currentAuthority ? currentAuthority.id : (currentUser?.accountType || 'Guest')}</strong>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              if (onReturn) onReturn();
              else switchActiveAuthority('user-panel');
            }}
            className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
