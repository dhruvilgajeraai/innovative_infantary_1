import React from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  LogOut, 
  Sparkles,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthorityHeaderProps {
  onOpenHelp: () => void;
  activeTabTitle?: string;
}

export const AuthorityHeader: React.FC<AuthorityHeaderProps> = ({
  onOpenHelp,
  activeTabTitle
}) => {
  const { currentAuthority, logout } = useAuth();

  if (!currentAuthority) return null;

  return (
    <div className="w-full bg-slate-950/95 border-b border-slate-800 px-4 sm:px-6 py-4 shadow-xl mb-6 text-slate-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left: Authority Identification */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-sky-400" />
          </div>

          <div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-xs font-bold tracking-widest uppercase text-sky-400">
                ArenaFlow Operating System
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>AUTHENTICATED</span>
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
              <h1 className="text-lg sm:text-2xl font-display font-extrabold text-white">
                {currentAuthority.name}
              </h1>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-sky-300">
                Authority ID: {currentAuthority.id}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-0.5">
              {currentAuthority.description}
            </p>
          </div>
        </div>

        {/* Right: Operational Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3 self-end md:self-center">
          
          <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-medium">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Fixed Authority Policy Active</span>
          </div>

          {/* Contextual In-Page Help */}
          <button
            onClick={onOpenHelp}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>Guide</span>
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 text-xs font-bold text-rose-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {activeTabTitle && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-semibold text-slate-300">Active View:</span>
            <span className="text-sky-300 font-bold">{activeTabTitle}</span>
          </div>
          <span className="text-[11px] text-slate-500">Data Isolation: Enforced</span>
        </div>
      )}
    </div>
  );
};
