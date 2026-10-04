import React, { useState } from 'react';
import { 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Flame, 
  ChevronDown, 
  Key, 
  Award, 
  Menu,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface NavbarProps {
  onOpenNotifications: () => void;
  onOpenPasswordModal: () => void;
  onNavigateSlide: (slide: string) => void;
  onOpenSideMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNotifications,
  onOpenPasswordModal,
  onNavigateSlide,
  onOpenSideMenu
}) => {
  const { 
    currentUser, 
    currentAuthority, 
    accountType, 
    isAuthenticated, 
    isAuthorityMode, 
    switchActiveAuthority, 
    logout 
  } = useAuth();

  const { notifications } = useData();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Authority-scoped unread notifications count
  const unreadCount = notifications.filter(n => {
    if (n.read) return false;
    if (accountType === 'superadmin') return true;
    if (currentAuthority) return n.authorityScope === currentAuthority.id || n.authorityScope === 'all';
    return n.authorityScope === 'user' || n.authorityScope === 'all';
  }).length;

  const isAdminUser = isAuthenticated && (
    accountType === 'superadmin' || 
    currentAuthority?.id === 'SUPER-001' || 
    currentAuthority?.id === 'ADMIN-001'
  );

  return (
    <header 
      className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl overflow-x-clip"
    >
      <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand & Menu Trigger */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div 
            onClick={() => onNavigateSlide('landing')} 
            className="flex items-center space-x-2 sm:space-x-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-sky-500 to-indigo-600 p-0.5 shadow-md shadow-sky-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-display font-black text-sm sm:text-lg tracking-tight text-white group-hover:text-sky-400 transition-colors">
                  The Champions <span className="text-sky-400">Club</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] sm:text-xs font-extrabold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 shrink-0">
                  SPORTS COMPLEX
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide hidden 2xl:block">
                “One Arena. Every Sport.”
              </p>
            </div>
          </div>

          {/* Public Quick Navigation Links (Visible on large desktop/wide screens, accessible via ARENA MENU on all screens) */}
          <nav className="hidden xl:flex items-center space-x-1 pl-2.5 border-l border-slate-800 shrink-0">
            <button
              onClick={() => onNavigateSlide('landing')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              🏟️ Arena
            </button>
            <button
              onClick={() => onNavigateSlide('sports-showcase')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              🎾 Sports
            </button>
            <button
              onClick={() => onNavigateSlide('schedule')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              📅 Schedule
            </button>
            <button
              onClick={() => onNavigateSlide('shop')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-amber-300 hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              🛍️ Pro Shop
            </button>
            <button
              onClick={() => onNavigateSlide('memberships')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-emerald-300 hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              💎 Memberships
            </button>
            <button
              onClick={() => onNavigateSlide('trial')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-purple-300 hover:bg-purple-950/60 transition-colors cursor-pointer"
            >
              🎯 Trial &amp; Quote
            </button>
          </nav>

          {/* Arena Hub Drawer Toggle */}
          <button
            onClick={onOpenSideMenu}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-800 text-xs sm:text-sm font-extrabold shadow-sm transition-colors shrink-0 cursor-pointer"
            title="Open Sports Arenas Menu"
          >
            <Menu className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="font-mono tracking-wider uppercase text-[11px] sm:text-xs hidden sm:inline">ARENA MENU</span>
          </button>
        </div>

        {/* Right Action Profile & Admin Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          
          {/* ONLY DISPLAY ADMIN ACCESS IF AUTHENTICATED AS ADMIN/SUPERADMIN */}
          {isAdminUser && (
            <button
              onClick={() => onNavigateSlide('authority-admin-001')}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-500/50 text-xs sm:text-sm font-black shadow-md transition-all shrink-0 cursor-pointer"
              title="Coliseum Master Data & Administration"
            >
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="hidden sm:inline">Admin Panel</span>
              <span className="sm:hidden">Admin</span>
            </button>
          )}

          {/* Department Staff Badge (Only visible when staff member is logged in) */}
          {isAuthenticated && isAuthorityMode && currentAuthority && !isAdminUser && (
            <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-sky-300 max-w-[140px] truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="truncate">{currentAuthority.id}</span>
            </div>
          )}

          {/* Notifications Bell */}
          <button 
            onClick={onOpenNotifications}
            className="relative p-2 sm:p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-sky-400 transition-colors shadow-sm shrink-0 cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile / Status */}
          {isAuthenticated && currentUser ? (
            <div className="relative shrink-0">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-1.5 sm:space-x-2 pl-1.5 sm:pl-2 pr-2 sm:pr-3 py-1 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors shadow-sm shrink-0 cursor-pointer"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-xs sm:text-sm text-white shadow-sm shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block max-w-[85px] md:max-w-[110px] lg:max-w-[130px]">
                  <div className="text-xs sm:text-sm font-bold text-white truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] sm:text-xs text-sky-400 font-semibold truncate">
                    {isAuthorityMode && currentAuthority ? currentAuthority.id : (currentUser.membershipTier.toUpperCase() + ' Member')}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3.5 z-50 space-y-3 animate-in fade-in"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="border-b border-slate-800 pb-2.5">
                    <p className="text-sm font-extrabold text-white">{currentUser.name}</p>
                    <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-sky-950/80 text-sky-300 border border-sky-500/40 uppercase">
                        {accountType}
                      </span>
                      {currentUser.membershipTier !== 'none' && (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          {currentUser.membershipTier.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Multiple Authority Switcher (Only visible to assigned staff) */}
                  {currentUser.assignedAuthorities && currentUser.assignedAuthorities.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Assigned Workspaces
                      </div>
                      <button
                        onClick={() => { switchActiveAuthority('user-panel'); setProfileDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-between transition-colors ${
                          !isAuthorityMode ? 'bg-sky-950/80 text-sky-300 font-bold border border-sky-500/40' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>Normal Member Panel</span>
                        {!isAuthorityMode && <span className="text-xs font-bold text-sky-400">Active</span>}
                      </button>

                      {currentUser.assignedAuthorities.map(aId => (
                        <button
                          key={aId}
                          onClick={() => { switchActiveAuthority(aId); setProfileDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-between transition-colors ${
                            currentAuthority?.id === aId ? 'bg-indigo-950/80 text-indigo-300 font-bold border border-indigo-500/40' : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span>{aId} Department</span>
                          {currentAuthority?.id === aId && <span className="text-xs font-bold text-indigo-400">Active</span>}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Password Change for Normal Users */}
                  {!isAuthorityMode && (
                    <button
                      onClick={() => { onOpenPasswordModal(); setProfileDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs sm:text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                    >
                      <Key className="w-4 h-4 text-sky-400" />
                      <span>Security &amp; Password</span>
                    </button>
                  )}

                  <button
                    onClick={() => { logout(); setProfileDropdownOpen(false); }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs sm:text-sm text-rose-400 hover:bg-rose-950/50 transition-colors font-bold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              <button
                onClick={() => onNavigateSlide('login')}
                className="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigateSlide('register')}
                className="px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white transition-all shadow-md shadow-sky-500/20 shrink-0 cursor-pointer"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
