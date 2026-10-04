import React from 'react';
import { 
  X, 
  Flame, 
  Calendar, 
  Users, 
  ShoppingBag, 
  Coffee, 
  Trophy, 
  DollarSign, 
  Briefcase, 
  UserCheck, 
  Megaphone, 
  Headphones, 
  Activity, 
  Globe, 
  ShieldCheck, 
  Key, 
  ChevronRight, 
  Layers,
  Radio
} from 'lucide-react';
import { SportType, AuthorityId } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSport: SportType;
  onSelectSport: (sport: SportType) => void;
  onNavigateView: (view: string) => void;
}

const SPORTS_LIST: { id: SportType; name: string; emoji: string; subtitle: string; courts: string; color: string }[] = [
  { id: 'football', name: 'Football Arena', emoji: '⚽', subtitle: '5v5 FIFA Approved Turf', courts: '1 Pitch', color: '#10b981' },
  { id: 'cricket', name: 'Cricket Coliseum', emoji: '🏏', subtitle: 'Floodlit Box Pitch & Nets', courts: '1 Pitch', color: '#ef4444' },
  { id: 'pool', name: 'Pool & 8-Ball Snooker', emoji: '🎱', subtitle: 'VIP Slate Table Lounge', courts: '2 Tables', color: '#059669' },
  { id: 'tennis', name: 'Tennis Centre Court', emoji: '🎾', subtitle: 'Red Clay & Acrylic Hard', courts: '2 Courts', color: '#f59e0b' },
  { id: 'badminton', name: 'Badminton Smash Hub', emoji: '🏸', subtitle: 'BWF Sprung Wood Floors', courts: '2 Courts', color: '#06b6d4' },
  { id: 'padel', name: 'Padel Glass Dome', emoji: '🏓', subtitle: 'Panoramic Glass & Blue Turf', courts: '2 Courts', color: '#8b5cf6' },
  { id: 'running', name: 'Athletics Sprint Track', emoji: '🏃', subtitle: '400m Olympic Tartan Lanes', courts: '4 Lanes', color: '#ec4899' },
  { id: 'volleyball', name: 'Volleyball Arena', emoji: '🏐', subtitle: 'Pro Indoor & Beach Sand', courts: '2 Courts', color: '#f97316' },
];

const DEPARTMENTS: { id: AuthorityId; name: string; icon: any; color: string }[] = [
  { id: 'ADMIN-001', name: 'General Administrator', icon: ShieldCheck, color: 'text-sky-600' },
  { id: 'SUPER-001', name: 'Super Admin HQ', icon: ShieldCheck, color: 'text-sky-700' },
  { id: 'BOOKING-001', name: 'Court Bookings', icon: Calendar, color: 'text-sky-600' },
  { id: 'MEMBER-001', name: 'Memberships', icon: Users, color: 'text-sky-600' },
  { id: 'SHOP-001', name: 'Pro Shop & Stock', icon: ShoppingBag, color: 'text-sky-600' },
  { id: 'POS-001', name: 'Bar & Cafeteria POS', icon: Coffee, color: 'text-sky-600' },
  { id: 'EVENT-001', name: 'Events & Tournaments', icon: Trophy, color: 'text-sky-600' },
  { id: 'FINANCE-001', name: 'Finance & Treasury', icon: DollarSign, color: 'text-sky-600' },
  { id: 'CRM-001', name: 'Corporate CRM', icon: Briefcase, color: 'text-sky-600' },
  { id: 'STAFF-001', name: 'Staff & Rosters', icon: UserCheck, color: 'text-sky-600' },
  { id: 'MARKETING-001', name: 'Marketing & Promos', icon: Megaphone, color: 'text-sky-600' },
  { id: 'SERVICE-001', name: 'Helpdesk & Support', icon: Headphones, color: 'text-sky-600' },
  { id: 'SPORT-001', name: 'Sports Operations', icon: Activity, color: 'text-sky-600' },
  { id: 'CONTENT-001', name: 'Website CMS', icon: Globe, color: 'text-sky-600' },
];

export const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  selectedSport,
  onSelectSport,
  onNavigateView
}) => {
  const { currentUser, currentAuthority, accountType, switchActiveAuthority, isAuthenticated } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Soft Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
      />

      {/* Slide-out Sidebar Drawer in Dark Coliseum Theme */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-slate-950 border-r border-slate-800 shadow-2xl flex flex-col h-full z-10 overflow-hidden text-slate-100 animate-in slide-in-from-left duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-sky-500 to-indigo-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display font-extrabold text-base text-white">
                  The Champions <span className="text-sky-400">Club</span>
                </h3>
                <span className="text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 font-bold">
                  PORTAL
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Sports &amp; Operations Matrix
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          
          {/* Section 1: Sports Arenas & Live Background */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-sky-400 animate-pulse" />
                <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold">
                  SPORTS ARENAS
                </h4>
              </div>
              <span className="text-[10px] font-mono text-sky-400 font-bold">
                1-CLICK SWITCH
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {SPORTS_LIST.map((sport) => {
                const isSelected = selectedSport === sport.id;
                return (
                  <button
                    key={sport.id}
                    onClick={() => {
                      onSelectSport(sport.id);
                      onNavigateView('sports-showcase');
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all text-left ${
                      isSelected
                        ? 'bg-sky-950/80 border-sky-500/60 shadow-lg'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner border"
                        style={{ backgroundColor: `${sport.color}25`, borderColor: `${sport.color}50` }}
                      >
                        {sport.emoji}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-white">
                            {sport.name}
                          </span>
                          {isSelected && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-600 text-white font-bold uppercase">
                              LIVE BG
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {sport.subtitle} • <span className="text-slate-300 font-bold">{sport.courts}</span>
                        </p>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Club Facilities & Guest Access */}
          <div>
            <div className="flex items-center space-x-2 mb-2.5">
              <Globe className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold">
                CLUB SERVICES &amp; FACILITIES
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onNavigateView('schedule');
                  onClose();
                }}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 text-left transition-colors shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase text-sky-400 font-bold">SLOTS</span>
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-xs font-bold text-white">Court Schedule</div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium">30-Min Live Slots</div>
              </button>

              <button
                onClick={() => {
                  onNavigateView('shop');
                  onClose();
                }}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 text-left transition-colors shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">GEAR</span>
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-xs font-bold text-white">Pro Gear Shop</div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Apparel &amp; Rackets</div>
              </button>

              <button
                onClick={() => {
                  onNavigateView('memberships');
                  onClose();
                }}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 text-left transition-colors shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">TIERS</span>
                  <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-xs font-bold text-white">Membership Plans</div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Gold, Silver &amp; Jr</div>
              </button>

              <button
                onClick={() => {
                  if (isAuthenticated) {
                    onNavigateView('user-panel');
                  } else {
                    onNavigateView('login');
                  }
                  onClose();
                }}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 text-left transition-colors shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase text-sky-400 font-bold">ACCOUNT</span>
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-xs font-bold text-white">Member Portal</div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Bookings &amp; Passes</div>
              </button>
            </div>
          </div>

          {/* Section 3: Staff & Executive Workspaces (STRICTLY HIDDEN FROM NORMAL USERS & GUESTS) */}
          {isAuthenticated && (accountType === 'superadmin' || (currentUser?.assignedAuthorities && currentUser.assignedAuthorities.length > 0)) && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold">
                    AUTHORIZED DESKS
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  ACTIVE SESSION
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DEPARTMENTS.filter(dept => 
                  accountType === 'superadmin' || 
                  (currentUser?.assignedAuthorities && currentUser.assignedAuthorities.includes(dept.id))
                ).map((dept) => {
                   const Icon = dept.icon;
                   const isCurrent = currentAuthority?.id === dept.id;
                   return (
                     <button
                       key={dept.id}
                       onClick={() => {
                         switchActiveAuthority(dept.id);
                         if (dept.id === 'ADMIN-001') {
                           onNavigateView('authority-admin-001');
                         } else {
                           onNavigateView(`authority-${dept.id.toLowerCase()}`);
                         }
                         onClose();
                       }}
                      className={`flex items-center space-x-2.5 p-2.5 rounded-xl border text-left transition-all ${
                        isCurrent
                          ? 'bg-sky-950/90 border-sky-500/60 text-sky-200 shadow-md'
                          : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${dept.color}`} />
                      <div className="truncate">
                        <div className="text-[11px] font-bold truncate text-slate-100">{dept.name}</div>
                        <div className="text-[9px] font-mono text-slate-500">{dept.id}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 4: Live Arena Telemetry HUD */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-[11px] font-mono text-slate-300">
            <div className="flex items-center justify-between text-white font-bold">
              <span>ARENA TELEMETRY</span>
              <span className="text-emerald-400 flex items-center space-x-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>ONLINE</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Floodlight Power</span>
              <span className="text-sky-300 font-semibold">800 - 1200 Lux</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Collision Avoidance</span>
              <span className="text-emerald-300 font-semibold">0 Overlaps</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Base Currency</span>
              <span className="text-amber-300 font-semibold">Indian Rupee (₹)</span>
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-900/90 text-center text-[10px] font-mono text-slate-500">
          ArenaFlow v2.4 • “One Arena. Every Sport.”
        </div>

      </div>
    </div>
  );
};
