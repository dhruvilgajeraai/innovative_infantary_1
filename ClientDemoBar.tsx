import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Globe, 
  Calendar, 
  ShoppingBag, 
  Coffee, 
  Award, 
  Users, 
  DollarSign, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Key,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthorityId } from '../../types';

interface ClientDemoBarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const ClientDemoBar: React.FC<ClientDemoBarProps> = ({ currentView, onNavigate }) => {
  const { 
    currentUser, 
    currentAuthority, 
    isAuthenticated, 
    quickSwitchToDemo, 
    switchActiveAuthority,
    logout 
  } = useAuth();

  const [isExpanded, setIsExpanded] = useState(true);
  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  const handleSwitch = (
    label: string, 
    action: () => void, 
    targetView?: string
  ) => {
    action();
    if (targetView) {
      onNavigate(targetView);
    }
    setActiveNotice(`Switched to ${label}`);
    setTimeout(() => setActiveNotice(null), 3000);
  };

  return (
    <div className="w-full bg-slate-900 text-white border-b border-sky-900/50 shadow-md z-50 sticky top-0">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-black tracking-wide text-sky-400 font-mono text-xs sm:text-sm uppercase flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400 inline" />
            The Champions Club // Client Interactive Demo Mode
          </span>
          {activeNotice && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {activeNotice}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <span className="hidden lg:inline text-slate-300 text-xs sm:text-sm font-medium">
            Current Session: <strong className="text-white font-mono font-black">{isAuthenticated ? (currentAuthority ? currentAuthority.id : (currentUser?.name || 'Member')) : 'Guest Visitor'}</strong>
          </span>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold border border-slate-700 transition-colors"
            title="Toggle Quick Role Switcher"
          >
            <span>{isExpanded ? 'Hide Bar' : 'Quick Roles'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Quick Roles Strip */}
      {isExpanded && (
        <div className="bg-slate-950/95 border-t border-slate-800/80 px-3 sm:px-6 py-2.5 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-2.5 min-w-max">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 mr-1 flex items-center gap-1.5 font-black">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              1-Click Role Switcher:
            </span>

            {/* 1. Public Sports Complex Website */}
            <button
              onClick={() => handleSwitch('Public Sports Website', () => {
                onNavigate('landing');
              }, 'landing')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all border ${
                currentView === 'landing' || currentView === 'public-hub' || currentView === 'sports-showcase'
                  ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4 text-sky-400" />
              <span>🌐 Public Club Website</span>
            </button>

            {/* 2. Super Admin / Club Owner HQ */}
            <button
              onClick={() => handleSwitch('Super Admin / Owner HQ', () => {
                quickSwitchToDemo('super');
                onNavigate('authority-super-001');
              }, 'authority-super-001')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all border ${
                currentView === 'authority-super-001'
                  ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span>👑 Super Admin / Owner</span>
            </button>

            {/* 3. General Admin HQ */}
            <button
              onClick={() => handleSwitch('General Admin HQ', () => {
                quickSwitchToDemo('ADMIN-001');
                onNavigate('authority-admin-001');
              }, 'authority-admin-001')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all border ${
                currentView === 'authority-admin-001'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>🛡️ Admin Data Panel</span>
            </button>

            {/* 4. Court Bookings Authority */}
            <button
              onClick={() => handleSwitch('Court Bookings Authority', () => {
                quickSwitchToDemo('BOOKING-001');
                onNavigate('authority-booking-001');
              }, 'authority-booking-001')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all border ${
                currentView === 'authority-booking-001'
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>🏸 Court Desk (BOOKING-001)</span>
            </button>

            {/* 5. Pro Gear Shop & Unified Stock */}
            <button
              onClick={() => handleSwitch('Pro Gear Shop Authority', () => {
                quickSwitchToDemo('SHOP-001');
                onNavigate('authority-shop-001');
              }, 'authority-shop-001')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all border ${
                currentView === 'authority-shop-001'
                  ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>🛒 Pro Shop (SHOP-001)</span>
            </button>

            {/* 6. Bar & Cafeteria POS */}
            <button
              onClick={() => handleSwitch('Bar & Cafeteria POS', () => {
                quickSwitchToDemo('POS-001');
                onNavigate('authority-pos-001');
              }, 'authority-pos-001')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all border ${
                currentView === 'authority-pos-001'
                  ? 'bg-orange-600 text-white border-orange-500 shadow-sm'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Coffee className="w-4 h-4 text-orange-400" />
              <span>🍹 Bar & POS (POS-001)</span>
            </button>

            {/* 7. Memberships Authority */}
            <button
              onClick={() => handleSwitch('Membership Authority', () => {
                quickSwitchToDemo('MEMBER-001');
                onNavigate('authority-member-001');
              }, 'authority-member-001')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all border ${
                currentView === 'authority-member-001'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>💎 Memberships (MEMBER-001)</span>
            </button>

            {/* 8. Finance & Treasury */}
            <button
              onClick={() => handleSwitch('Finance Authority', () => {
                quickSwitchToDemo('FINANCE-001');
                onNavigate('authority-finance-001');
              }, 'authority-finance-001')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all border ${
                currentView === 'authority-finance-001'
                  ? 'bg-green-600 text-white border-green-500 shadow-sm'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4 text-green-400" />
              <span>💰 Finance & Revenue</span>
            </button>

            {/* 9. CRM & Corporate Inquiries */}
            <button
              onClick={() => handleSwitch('CRM Authority', () => {
                quickSwitchToDemo('CRM-001');
                onNavigate('authority-crm-001');
              }, 'authority-crm-001')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all border ${
                currentView === 'authority-crm-001'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>💼 CRM & Quotes</span>
            </button>

            {/* 10. Gold Member Portal (Alexander Wright) */}
            <button
              onClick={() => handleSwitch('Gold Member Portal', () => {
                quickSwitchToDemo('normal');
                onNavigate('user-panel');
              }, 'user-panel')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all border ${
                currentView === 'user-panel'
                  ? 'bg-amber-500 text-slate-900 border-amber-400 shadow-sm'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>🏆 Member (Gold Tier)</span>
            </button>

            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  onNavigate('landing');
                  setActiveNotice('Logged out to Guest Visitor');
                  setTimeout(() => setActiveNotice(null), 3000);
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-slate-800 transition-colors ml-auto"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
