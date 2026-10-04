import React from 'react';
import { 
  ArrowRight, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Radio, 
  ChevronRight, 
  Crosshair, 
  Compass, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { SportType } from '../../types';
import { ArenaZone } from '../canvas/ArenaFlow3DCanvas';

interface ArenaFlowHeroOverlayProps {
  activeZone: ArenaZone;
  scrollProgress?: number;
  onSelectZone: (zone: ArenaZone) => void;
  onRegister: () => void;
  onLogin: () => void;
  onBookCourt: (sport: SportType) => void;
  onExploreSport: (sport: SportType) => void;
}

const ZONE_DATA: Record<ArenaZone, {
  title: string;
  sport: SportType;
  subtitle: string;
  dimensions: string;
  surface: string;
  lighting: string;
  rate: string;
  memberRate: string;
  accent: string;
  bgBadge: string;
  description: string;
  status: 'available' | 'booked' | 'selected';
  slotsAvailable: number;
}> = {
  hero: {
    title: 'Multi-Sport Championship Coliseum',
    sport: 'football',
    subtitle: 'High-Performance 3D Sports Operations Matrix',
    dimensions: '200m × 200m Unified Arena',
    surface: 'Hybrid Astro Turf, Clay, Tartan & Glass',
    lighting: '1400 Lux Tournament Day Floodlights',
    rate: '₹500 - ₹3000 / hr',
    memberRate: 'Up to 50% Off with Membership',
    accent: '#0284c7',
    bgBadge: '0% HERO OVERHEAD // SYSTEM ONLINE',
    description: 'Centralized multi-sport facility management operating on a zero-collision 30-min slot engine with integrated pro shop, bar POS, and treasury.',
    status: 'available',
    slotsAvailable: 42
  },
  football: {
    title: '5v5 FIFA Approved Turf Pitch',
    sport: 'football',
    subtitle: 'Precision Shock Absorption & Floodlights',
    dimensions: '42m × 25m Enclosed Arena',
    surface: 'FIFA Pro 50mm Monofilament Synthetic Turf',
    lighting: '800 Lux Floodlights',
    rate: '₹3000 / hr',
    memberRate: '₹1500 / hr (Gold: 50% Off)',
    accent: '#059669',
    bgBadge: '20% FOOTBALL ZONE // TURF LEVEL',
    description: 'All-weather 5-a-side astro pitch engineered with organic infill and micro-shock absorption for competitive leagues.',
    status: 'available',
    slotsAvailable: 8
  },
  tennis: {
    title: 'Centre Red Clay & Grand Slam Courts',
    sport: 'tennis',
    subtitle: 'Laser-Leveled Roland Garros Red Clay & Acrylic',
    dimensions: '23.77m × 10.97m',
    surface: 'Roland Garros Red Clay & Cushion Acrylic',
    lighting: '1000 Lux Tournament Grade Lighting',
    rate: '₹1500 / hr',
    memberRate: '₹750 / hr (50% Off)',
    accent: '#ea580c',
    bgBadge: '40% TENNIS ZONE // BASELINE GLOW',
    description: 'Championship red clay court meticulously leveled with automatic moisture sprinklers and cushioned sub-layers.',
    status: 'available',
    slotsAvailable: 5
  },
  padel: {
    title: 'Panoramic Glass Padel Arena',
    sport: 'padel',
    subtitle: '12mm Panoramic Tempered Safety Glass & Blue Turf',
    dimensions: '20m × 10m Cage Arena',
    surface: 'Mondo Supercourt XN Textured Blue Turf',
    lighting: '8-Column 800 Lux LED Floodlights',
    rate: '₹1600 / hr',
    memberRate: '₹800 / hr (50% Off)',
    accent: '#7c3aed',
    bgBadge: '50% PADEL GLASS // PANORAMIC CAGE',
    description: 'Panoramic glass court engineered to World Padel Tour specifications with zero-obstruction corner view.',
    status: 'available',
    slotsAvailable: 6
  },
  cricket: {
    title: 'Floodlit Box Cricket Pitch & Nets',
    sport: 'cricket',
    subtitle: 'High Tensile Safety Cage & Automated Bowling',
    dimensions: '30m × 12m Astro Enclosure',
    surface: 'Astro Turf with Shock-Pad Substrate',
    lighting: '1000 Lux Non-Glare LED Beams',
    rate: '₹2200 / hr',
    memberRate: '₹1100 / hr (50% Off)',
    accent: '#dc2626',
    bgBadge: '60% CRICKET ZONE // FLOODLIT PITCH',
    description: 'Enclosed floodlit turf box pitch equipped with ball machines and digital scoreboards for night tournaments.',
    status: 'available',
    slotsAvailable: 7
  },
  badminton: {
    title: 'BWF Standard Badminton Smash Arena',
    sport: 'badminton',
    subtitle: 'Multi-Tier Sprung Hardwood & Anti-Glare Array',
    dimensions: '13.4m × 6.1m Court',
    surface: 'Sprung Wooden Sub-Floor with Vinyl Mat',
    lighting: 'BWF Grade-A Vertical LED System',
    rate: '₹800 / hr',
    memberRate: '₹400 / hr (50% Off)',
    accent: '#0284c7',
    bgBadge: '70% BADMINTON HUB // COURT 1 & 2',
    description: 'BWF tournament approved cushioned flooring with non-glare vertical lighting arrays minimizing optical eye strain.',
    status: 'available',
    slotsAvailable: 4
  },
  running: {
    title: 'Olympic Tartan 400m Athletics Track',
    sport: 'running',
    subtitle: '4-Lane Olympic Standard Synthetic Rubber',
    dimensions: '400m Oval with 4 Lanes',
    surface: 'Full Pour Polyurethane Sandwich Rubber',
    lighting: 'Stadium Perimeter Floodlights',
    rate: '₹400 / hr / lane',
    memberRate: 'Free for Gold Members',
    accent: '#db2777',
    bgBadge: '80% RUNNING TRACK // SPRINT MATRIX',
    description: 'World Athletics certified polyurethane surface delivering peak energy return and reducing joint fatigue during training.',
    status: 'available',
    slotsAvailable: 12
  },
  volleyball: {
    title: 'Indoor & Beach Volleyball Colosseum',
    sport: 'volleyball',
    subtitle: 'Shock Absorbing Hardwood & Washed River Sand',
    dimensions: '18m × 9m Court',
    surface: 'Taraflex Pro Surface / Washed Quartz Sand',
    lighting: '800 Lux Low-Glare Floodlights',
    rate: '₹1200 / hr',
    memberRate: '₹600 / hr (50% Off)',
    accent: '#ea580c',
    bgBadge: '85% VOLLEYBALL // BEACH & INDOOR',
    description: 'Dual-purpose arena with Olympic-grade adjustable net tensioners and professional perimeter runoff zones.',
    status: 'available',
    slotsAvailable: 6
  },
  pool: {
    title: 'VIP 8-Ball & Snooker Lounge',
    sport: 'pool',
    subtitle: '9ft Rasson Tournament Slate Tables & Simonis 860 Cloth',
    dimensions: 'Private VIP Billiards Lounge',
    surface: 'Italian Slate with Simonis 860 Worsted Cloth',
    lighting: 'Precision Overhead LED Canopy',
    rate: '₹600 / hr',
    memberRate: '₹300 / hr (50% Off)',
    accent: '#059669',
    bgBadge: '90% VIP BILLIARDS // 8-BALL & SNOOKER',
    description: 'Dedicated acoustic lounge featuring tournament slate tables, Aramith Pro ball sets, and craft beverage service.',
    status: 'available',
    slotsAvailable: 2
  },
  map: {
    title: 'Interactive 3D Facility Map Overview',
    sport: 'football',
    subtitle: 'Real-Time 30-min Slot Engine with Zero Collision',
    dimensions: 'Whole Facility Overview',
    surface: 'All Sports Active',
    lighting: 'Live Automated Lighting Control',
    rate: 'Live Dynamic Rates',
    memberRate: 'Gold & Silver Perks Active',
    accent: '#7c3aed',
    bgBadge: '100% CTA // INTERACTIVE COURT MAP',
    description: 'Interactive coliseum map displaying real-time court availability, active bookings, scheduled maintenance, and instant registration checkout.',
    status: 'selected',
    slotsAvailable: 42
  }
};

const TIMELINE_STAGES: { id: ArenaZone; pct: string; label: string; icon: string }[] = [
  { id: 'hero', pct: '0%', label: 'Coliseum Hero', icon: '🏟️' },
  { id: 'football', pct: '20%', label: 'Football Turf', icon: '⚽' },
  { id: 'tennis', pct: '40%', label: 'Tennis & Padel', icon: '🎾' },
  { id: 'cricket', pct: '60%', label: 'Cricket & Badminton', icon: '🏏' },
  { id: 'running', pct: '80%', label: 'Running Track', icon: '🏃' },
  { id: 'map', pct: '100%', label: 'Facility Map CTA', icon: '🗺️' }
];

export const ArenaFlowHeroOverlay: React.FC<ArenaFlowHeroOverlayProps> = ({
  activeZone,
  scrollProgress = 0,
  onSelectZone,
  onRegister,
  onLogin,
  onBookCourt,
  onExploreSport
}) => {
  const currentData = ZONE_DATA[activeZone] || ZONE_DATA.hero;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2.5 sm:p-4 lg:p-6 z-20 overflow-x-hidden overflow-y-auto">
      
      {/* 1. TOP TELEMETRY STATUS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2 sm:mb-3">
        
        {/* Left: Telemetry Status Box */}
        <div className="pointer-events-auto flex items-center space-x-2.5 sm:space-x-3 px-3.5 py-2 sm:py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl text-slate-200">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
            </span>
            <span className="font-mono text-xs sm:text-sm font-black tracking-wider text-sky-400">
              ARENAFLOW 3D MATRIX
            </span>
          </div>

          <span className="text-slate-700">|</span>

          <div className="hidden sm:flex items-center space-x-2 font-mono text-xs sm:text-sm text-slate-300 font-bold">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>COLISEUM ENGINE: 60 FPS</span>
          </div>

          <span className="hidden md:inline text-slate-700">|</span>

          <div className="hidden md:flex items-center space-x-1.5 font-mono text-xs sm:text-sm text-slate-300 font-bold">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>30-MIN SLOTS // ZERO COLLISION</span>
          </div>
        </div>

        {/* Right: Header Action Buttons */}
        <div className="pointer-events-auto flex items-center space-x-2.5">
          <button
            onClick={onLogin}
            className="group relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700 text-xs sm:text-sm font-extrabold tracking-wide transition-all shadow-md flex items-center space-x-2 cursor-pointer active:scale-95"
          >
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Authority Login</span>
          </button>

          <button
            onClick={onRegister}
            className="group relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs sm:text-sm font-black tracking-wide transition-all shadow-lg shadow-sky-500/25 flex items-center space-x-2 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Register Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. OPTIONAL COMPACT 3D CAMERA SCROLL TIMELINE TRACKER (Visible on wide screens without pushing content) */}
      <div className="pointer-events-auto w-full max-w-5xl mx-auto mb-2 hidden 2xl:block">
        <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5 px-1">
            <span className="text-sky-400 font-black flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin" />
              <span>STADIUM CAMERA TIMELINE</span>
            </span>
            <span className="text-slate-400 font-bold">
              CLICK ANY ZONE OR COURT TO FLY CAMERA
            </span>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {TIMELINE_STAGES.map((s) => {
              const isActive = activeZone === s.id;
              return (
                <button
                  key={s.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectZone(s.id);
                  }}
                  className={`group relative p-1.5 sm:p-2 rounded-xl text-center transition-all duration-300 border cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-sky-500/20 border-sky-400 shadow-md shadow-sky-500/20'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1.5 text-xs mb-0.5">
                    <span>{s.icon}</span>
                    <span className={`font-mono text-xs font-black ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>
                      {s.pct}
                    </span>
                  </div>
                  <div className={`text-xs font-extrabold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {s.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. CENTER & BOTTOM: SCI-FI HUD CARD & SPORT DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6 items-end mt-auto">
        
        {/* LEFT COLUMN: CRISP LUXURY SPORTS HUD CARD */}
        <div className="pointer-events-auto lg:col-span-7 xl:col-span-6">
          <div className="p-4 sm:p-5 lg:p-6 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-2xl relative overflow-hidden transition-all duration-300 text-slate-100">
            
            {/* Top Accent Stripe */}
            <div 
              className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-500"
              style={{ backgroundColor: currentData.accent }}
            />

            {/* Live Sport Badge & Status Indicators */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 font-mono text-xs font-bold text-slate-200 tracking-wider">
                <span 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: currentData.accent }} 
                />
                <span>{currentData.bgBadge}</span>
              </div>

              {/* Status Pill */}
              <div className="flex items-center space-x-2">
                {currentData.status === 'available' && (
                  <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-xs font-mono font-extrabold text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>AVAILABLE ({currentData.slotsAvailable} SLOTS)</span>
                  </span>
                )}
                {currentData.status === 'booked' && (
                  <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/50 text-xs font-mono font-extrabold text-rose-300">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span>BOOKED / OCCUPIED</span>
                  </span>
                )}
                {currentData.status === 'selected' && (
                  <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-500/50 text-xs font-mono font-extrabold text-sky-300">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    <span>FACILITY OVERVIEW</span>
                  </span>
                )}
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-black text-white tracking-tight leading-tight mb-2">
              {currentData.title}
            </h1>

            <p className="text-xs sm:text-sm font-medium text-slate-300 mb-3 leading-relaxed">
              {currentData.description}
            </p>

            {/* 4 Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <div className="text-[11px] sm:text-xs font-mono uppercase text-slate-400 font-bold">Dimensions</div>
                <div className="text-xs sm:text-sm font-extrabold text-white truncate mt-0.5">{currentData.dimensions}</div>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <div className="text-[11px] sm:text-xs font-mono uppercase text-slate-400 font-bold">Surface</div>
                <div className="text-xs sm:text-sm font-extrabold text-white truncate mt-0.5">{currentData.surface}</div>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <div className="text-[11px] sm:text-xs font-mono uppercase text-slate-400 font-bold">Lighting</div>
                <div className="text-xs sm:text-sm font-extrabold text-white truncate mt-0.5">{currentData.lighting}</div>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50">
                <div className="text-[11px] sm:text-xs font-mono uppercase text-emerald-400 font-extrabold">Standard Rate</div>
                <div className="text-xs sm:text-sm font-black text-emerald-300 mt-0.5">{currentData.rate}</div>
              </div>
            </div>

            {/* Member Rate Banner */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-sky-950/60 border border-sky-500/50 flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-sky-200">
                  Member Privilege: <span className="font-black text-sky-300">{currentData.memberRate}</span>
                </span>
              </div>
              <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded bg-sky-900/80 text-sky-200 border border-sky-600/50 shrink-0">
                ₹ INR
              </span>
            </div>

            {/* Interactive Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <button
                onClick={() => onBookCourt(currentData.sport)}
                className="flex-1 sm:flex-initial px-5 sm:px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-xs sm:text-sm md:text-base tracking-wide shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
              >
                <Calendar className="w-4 h-4 text-white shrink-0" />
                <span>Book This Court ({currentData.rate.split('-')[0].trim()})</span>
                <ChevronRight className="w-4 h-4 text-white shrink-0" />
              </button>

              <button
                onClick={() => onExploreSport(currentData.sport)}
                className="px-4 sm:px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-extrabold text-xs sm:text-sm md:text-base border border-slate-700 transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
              >
                <ExternalLink className="w-4 h-4 text-slate-300 shrink-0" />
                <span>Explore Sport</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE SPORTS SWITCHER TABS */}
        <div className="pointer-events-auto lg:col-span-5 xl:col-span-6 flex flex-col space-y-2.5">
          <div className="p-3.5 sm:p-4 lg:p-5 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-2xl text-slate-100">
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Crosshair className="w-4 h-4 text-sky-400 animate-pulse" />
                <span className="font-mono text-xs sm:text-sm font-black text-white tracking-wider">
                  INTERACTIVE ARENA SWITCHER
                </span>
              </div>
              <span className="text-xs font-mono text-sky-400 font-extrabold">
                100% COLLISION FREE
              </span>
            </div>

            {/* Sports Switcher Tabs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
              {Object.entries(ZONE_DATA).map(([key, data]) => {
                const zoneKey = key as ArenaZone;
                const isActive = activeZone === zoneKey;
                return (
                  <button
                    key={zoneKey}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectZone(zoneKey);
                    }}
                    className={`relative p-2.5 sm:p-3 rounded-xl text-left transition-all duration-200 flex flex-col justify-between border cursor-pointer active:scale-95 ${
                      isActive 
                        ? 'bg-sky-500/20 border-sky-400 shadow-lg shadow-sky-500/20 translate-y-[-2px]' 
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-lg">
                        {zoneKey === 'hero' ? '🏟️' :
                         zoneKey === 'football' ? '⚽' :
                         zoneKey === 'tennis' ? '🎾' :
                         zoneKey === 'padel' ? '🏓' :
                         zoneKey === 'cricket' ? '🏏' :
                         zoneKey === 'badminton' ? '🏸' :
                         zoneKey === 'running' ? '🏃' :
                         zoneKey === 'volleyball' ? '🏐' :
                         zoneKey === 'pool' ? '🎱' : '🗺️'}
                      </span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                      )}
                    </div>

                    <div>
                      <div className={`text-xs font-black leading-tight capitalize truncate ${isActive ? 'text-sky-300' : 'text-slate-200'}`}>
                        {zoneKey === 'hero' ? 'Full Coliseum' : zoneKey}
                      </div>
                      <div className="text-[10px] font-mono font-bold mt-0.5 truncate">
                        {isActive ? (
                          <span className="text-emerald-400">GROUND VIEW</span>
                        ) : (
                          <span className="text-slate-400 group-hover:text-sky-300">GO TO GROUND</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Authority Multi-Tenant Info Footer */}
            <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 font-mono">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-slate-200 font-black">15 FIXED AUTHORITIES</span>
              </div>
              <span className="text-sky-400 font-black">SUPER-001 OVERSIGHT</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
