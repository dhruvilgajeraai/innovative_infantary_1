import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck,
  Trophy,
  Activity
} from 'lucide-react';
import { SportType } from '../../types';

interface SportsShowcaseSlideProps {
  initialSport?: SportType;
  onBookCourt: (sport: SportType) => void;
  onRegister: () => void;
  onBackToLanding: () => void;
  onSportChange?: (sport: SportType) => void;
}

const SPORTS_CONFIG: Record<SportType, {
  slideNumber: string;
  name: string;
  tagline: string;
  description: string;
  pitchType: string;
  atmosphere: string;
  ballAction: string;
  playerAction: string;
  accentColor: string;
  glowColor: string;
  bgGradient: string;
  pitchBg: string;
  pitchLineColor: string;
  courtDetails: {
    dimensions: string;
    surface: string;
    lighting: string;
    peakRate: string;
    memberRate: string;
  };
  features: string[];
  equipmentRecommended: string;
}> = {
  football: {
    slideNumber: 'SLIDE 02',
    name: 'Football Arena',
    tagline: 'Precision Strikes Under Championship Floodlights',
    description: 'Experience 5v5 FIFA Approved all-weather astro pitch with high-lux anti-glare floodlighting, precision shock absorption, and perimeter ball rebound nets.',
    pitchType: '5v5 FIFA Approved Turf Pitch',
    atmosphere: 'Roaring evening stadium crowd, sunlit and floodlit daytime visibility, micro turf spray particles.',
    ballAction: 'Curling top-corner shot dipping past the goalkeeper',
    playerAction: 'Forward striking volley from right wing towards goal',
    accentColor: '#059669',
    glowColor: 'rgba(5, 150, 105, 0.15)',
    bgGradient: 'from-emerald-950/60 via-slate-900 to-black',
    pitchBg: 'bg-emerald-950/40',
    pitchLineColor: 'border-emerald-500/40',
    courtDetails: {
      dimensions: '42m × 25m',
      surface: 'FIFA Pro 50mm Monofilament Synthetic Turf',
      lighting: '800 Lux Low-Glare Floodlight Array',
      peakRate: '₹60 / hr',
      memberRate: '₹30 / hr (50% Off)'
    },
    features: ['Ball return netting', 'Electronic digital scoreboard', 'Coaching tactical whiteboard', 'Automated match camera recording'],
    equipmentRecommended: 'Adidas Predator Pro Match Ball & Turf Boots'
  },
  tennis: {
    slideNumber: 'SLIDE 03',
    name: 'Tennis Centre Court',
    tagline: 'Championship Red Clay & Grand Slam Hard Courts',
    description: 'Play on Roland Garros inspired red clay and Australian Open acrylic hard courts. Equipped with laser-leveled drainage and high-contrast tournament lines.',
    pitchType: 'Centre Clay Court 1 & Grand Slam Hard Court 2',
    atmosphere: 'Golden sunlit afternoon ambiance, red clay dust kickback, crisp acoustic racket pops.',
    ballAction: 'Heavy topspin forehand dipping aggressively over the net',
    playerAction: 'Baseline player unleashing an open-stance forehand drive',
    accentColor: '#d97706',
    glowColor: 'rgba(217, 119, 6, 0.15)',
    bgGradient: 'from-amber-950/60 via-slate-900 to-black',
    pitchBg: 'bg-amber-950/40',
    pitchLineColor: 'border-amber-500/40',
    courtDetails: {
      dimensions: '23.77m × 10.97m',
      surface: 'Classic Red Clay / Pro Cushion Hard Court',
      lighting: '1000 Lux LED Tournament Lighting',
      peakRate: '₹35 - ₹40 / hr',
      memberRate: '₹15 - ₹20 / hr'
    },
    features: ['Clay drag mat & line sweeps', 'Spinfire Pro 2 automated ball machine', 'Umpire elevated chair', 'Covered players bench'],
    equipmentRecommended: 'Head Speed Pro Racket & Wilson US Open Extra Duty Balls'
  },
  cricket: {
    slideNumber: 'SLIDE 04',
    name: 'Cricket Coliseum',
    tagline: 'High-Impact Box Pitch & Automated Bowling Nets',
    description: 'Dedicated high-density turf box pitch with high tensile safety netting, bowling run-up marks, and automated bowling speed radar integration.',
    pitchType: 'Floodlit Astro Turf Box Pitch',
    atmosphere: 'Vibrant stadium spotlights, echoing leather-on-willow cracks, cheering supporters around perimeter fence.',
    ballAction: 'Lofted drive piercing the cover-point boundary',
    playerAction: 'Right-handed batsman executing a textbook cover drive on the front foot',
    accentColor: '#dc2626',
    glowColor: 'rgba(220, 38, 38, 0.15)',
    bgGradient: 'from-rose-950/60 via-slate-900 to-black',
    pitchBg: 'bg-rose-950/40',
    pitchLineColor: 'border-rose-500/40',
    courtDetails: {
      dimensions: '30m × 12m Enclosed Box',
      surface: 'High-Density 12mm Woven Cricket Turf',
      lighting: '750 Lux Vertical Floodlight Pillars',
      peakRate: '₹50 / hr',
      memberRate: '₹25 / hr'
    },
    features: ['Bowling speed radar display', 'Full enclosure protective netting', 'Dual-wheel programmable bowling machine', 'Padded batting crease'],
    equipmentRecommended: 'English Willow Bats, Heavy Tennis & Leather Match Balls'
  },
  badminton: {
    slideNumber: 'SLIDE 05',
    name: 'Badminton Smash Hub',
    tagline: 'Explosive Smashes on BWF Sprung Floors',
    description: 'BWF standard wooden spring sprung timber courts engineered with non-slip polyurethane coating and zero-glare overhead diffuse LED lamps.',
    pitchType: 'Indoor Wooden Courts A & B',
    atmosphere: 'Climate-controlled arena acoustics, shuttlecock sonic pops, focused daylight stadium glow.',
    ballAction: 'Steep down-the-line jump smash at 380 km/h',
    playerAction: 'Badminton player airborne at peak extension for a steep smash',
    accentColor: '#0284c7',
    glowColor: 'rgba(2, 132, 199, 0.15)',
    bgGradient: 'from-sky-950/60 via-slate-900 to-black',
    pitchBg: 'bg-sky-950/40',
    pitchLineColor: 'border-sky-500/40',
    courtDetails: {
      dimensions: '13.4m × 6.1m',
      surface: 'Multi-layer Oak Sprung Wood + Non-Slip Matte Finish',
      lighting: '650 Lux Non-Glare Indirect LED Arrays',
      peakRate: '₹24 / hr',
      memberRate: '₹10 / hr'
    },
    features: ['Zero-draft HVAC ventilation', 'Shock absorbent sub-floor', 'Tournament net tension gauges', 'Continuous wall contrast backdrop'],
    equipmentRecommended: 'Yonex Nanoflare Rackets & Aerosensa 30 Shuttlecocks'
  },
  padel: {
    slideNumber: 'SLIDE 06',
    name: 'Padel Glass Dome',
    tagline: 'Panoramic Glass & Fast Rebound Rallies',
    description: 'The fastest growing club sport in Europe and America. 12mm panoramic tempered safety glass walls, textured monofilament blue turf, and premium acoustics.',
    pitchType: 'Panoramic Glass Padel Courts 1 & 2',
    atmosphere: 'High-energy spectator viewing deck, rapid doubles exchanges, crystal glass wall rebounds.',
    ballAction: 'Chiquita drop shot kissing the metallic mesh cage',
    playerAction: 'Padel player retrieving off the rear glass wall with a backhand lob',
    accentColor: '#7c3aed',
    glowColor: 'rgba(124, 58, 237, 0.15)',
    bgGradient: 'from-purple-950/60 via-slate-900 to-black',
    pitchBg: 'bg-purple-950/40',
    pitchLineColor: 'border-purple-500/40',
    courtDetails: {
      dimensions: '20m × 10m',
      surface: 'Mondo Supercourt XN Textured Blue Turf',
      lighting: '8-Column 800 Lux LED Floodlights',
      peakRate: '₹32 / hr',
      memberRate: '₹12 / hr'
    },
    features: ['12mm Panoramic Tempered Glass', 'Anti-injury curved mesh framework', 'Official World Padel Tour specifications', 'Courtside spectator seating'],
    equipmentRecommended: 'Bullpadel Vertex 03 Comfort Racket & Padel Pro Balls'
  },
  running: {
    slideNumber: 'SLIDE 07',
    name: 'Athletics Sprint Track',
    tagline: 'Precision 400m Tartan Speed Track',
    description: 'Olympic quality polyurethane tartan sprint lanes with laser measured distance markers, timing gate sensors, and stadium track illumination.',
    pitchType: '400m Tartan Athletic Lane 1-4',
    atmosphere: 'Crisp morning & evening athletics track, rhythmic spike impacts, timing gate laser precision.',
    ballAction: 'Sprinter breaking the timing gate laser line at full velocity',
    playerAction: 'Runner in mid-stride acceleration down the home straight',
    accentColor: '#db2777',
    glowColor: 'rgba(219, 39, 119, 0.15)',
    bgGradient: 'from-pink-950/60 via-slate-900 to-black',
    pitchBg: 'bg-pink-950/40',
    pitchLineColor: 'border-pink-500/40',
    courtDetails: {
      dimensions: '400m Oval (4 Standard Competition Lanes)',
      surface: 'Full PU Cast Tartan System with Micro-Grip Texture',
      lighting: '500 Lux Continuous Oval Perimeter Lighting',
      peakRate: '₹15 / hr',
      memberRate: 'FREE for Gold/Silver Members'
    },
    features: ['RFID Lap Timing Gate', 'Start blocks & sprint hurdles available', 'Distance calibration marks every 50m', 'Heart-rate monitoring zone'],
    equipmentRecommended: 'Asics Running Performance Shoes & Electrolyte Hydration'
  },
  pool: {
    slideNumber: 'SLIDE 08',
    name: 'Pool & 8-Ball Snooker',
    tagline: 'VIP Italian Slates & Championship Cloth',
    description: 'Championship 9ft Italian slate tables with Strachan 6811 gold emerald wool cloth, laser cue alignments, and private lounge bar service.',
    pitchType: 'VIP Slate Table 1 & 2',
    atmosphere: 'Ultra-luxurious sunlit lounge ambiance, soothing acoustic lo-fi vibes, resonant crack of precision phenolic resin balls.',
    ballAction: 'Cue ball with heavy backspin pocketing the 8-ball in corner pocket',
    playerAction: 'Player lining up a precision bank shot across the tournament slate',
    accentColor: '#0d9488',
    glowColor: 'rgba(13, 148, 136, 0.15)',
    bgGradient: 'from-teal-950/60 via-slate-900 to-black',
    pitchBg: 'bg-teal-950/40',
    pitchLineColor: 'border-teal-500/40',
    courtDetails: {
      dimensions: '9ft × 4.5ft Tournament Rasson Tables',
      surface: 'Strachan 6811 English Worsted Emerald Wool',
      lighting: 'Overhead 1200 Lux Directional Anti-Glare LED Canopy',
      peakRate: '₹800 / hr',
      memberRate: '₹400 / hr (50% Off)'
    },
    features: ['Predator Revo carbon fiber cues available', 'Laser sight aiming assistance', 'Individual mechanical bridges and Triangle chalk', 'Courtside VIP booth with direct Bar POS ordering'],
    equipmentRecommended: 'Predator Revo Carbon Cue & Aramith Pro 8-Ball Set'
  },
  volleyball: {
    slideNumber: 'SLIDE 09',
    name: 'Volleyball Arena',
    tagline: 'High-Altitude Spikes & Olympic Sands',
    description: 'Championship pro indoor sprung court and Olympic beach sand arena with FIVB approved 2.43m competition net systems, antennas, and precision perimeter lines.',
    pitchType: 'Championship Pro Indoor & Beach Sand Courts',
    atmosphere: 'Vibrant championship arena atmosphere, echoing block spikes, daylight illumination, and spectator bleachers.',
    ballAction: 'Thunderous spike over the double-block traveling at 110 km/h into deep court',
    playerAction: 'Spiker elevated high above the net executing an angled cross-court smash',
    accentColor: '#ea580c',
    glowColor: 'rgba(234, 88, 12, 0.15)',
    bgGradient: 'from-orange-950/60 via-slate-900 to-black',
    pitchBg: 'bg-orange-950/40',
    pitchLineColor: 'border-orange-500/40',
    courtDetails: {
      dimensions: '18m × 9m',
      surface: 'Taraflex Pro Sports Flooring / Olympic Washed Sand',
      lighting: '1000 Lux Tournament Grade Anti-Glare Lighting',
      peakRate: '₹1400 / hr',
      memberRate: '₹700 / hr (50% Off)'
    },
    features: ['FIVB Regulation 2.43m Steel Tension Posts', 'Referees elevated platform stand', 'Shock absorbing elastic underlay', 'Padded safety post covers'],
    equipmentRecommended: 'Mikasa V200W Match Volleyball & Asics Sky Elite FF Shoes'
  }
};

const SPORT_ORDER: SportType[] = ['football', 'tennis', 'cricket', 'badminton', 'padel', 'running', 'pool', 'volleyball'];

export const SportsShowcaseSlide: React.FC<SportsShowcaseSlideProps> = ({
  initialSport = 'football',
  onBookCourt,
  onRegister,
  onBackToLanding,
  onSportChange
}) => {
  const [currentSport, setCurrentSport] = useState<SportType>(initialSport);

  useEffect(() => {
    setCurrentSport(initialSport);
  }, [initialSport]);

  const changeSport = (sport: SportType) => {
    setCurrentSport(sport);
    if (onSportChange) {
      onSportChange(sport);
    }
  };

  const sportConfig = SPORTS_CONFIG[currentSport] || SPORTS_CONFIG.football;
  const currentIndex = SPORT_ORDER.indexOf(currentSport);

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % SPORT_ORDER.length;
    changeSport(SPORT_ORDER[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + SPORT_ORDER.length) % SPORT_ORDER.length;
    changeSport(SPORT_ORDER[prevIdx]);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-[#070b14] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-10 transition-all duration-500 overflow-hidden">
      
      {/* Soft Ambient Light Glow */}
      <div 
        className="absolute top-0 right-1/4 w-[500px] h-[350px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-60"
        style={{ backgroundColor: sportConfig.glowColor }}
      />
      
      {/* Top Bar with Slide Breadcrumbs & Transitions */}
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToLanding}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-extrabold border border-slate-700 shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-slate-300" />
            <span>Home</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white shadow-sm">
              {sportConfig.slideNumber}
            </span>
            <span className="text-xs text-slate-400 font-extrabold tracking-wider uppercase">
              Sports Experience
            </span>
          </div>
        </div>

        {/* Transition Selector: Football -> Tennis -> Cricket -> Badminton -> Padel -> Running -> Pool -> Volleyball */}
        <div className="flex items-center space-x-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-lg overflow-x-auto max-w-full backdrop-blur-md">
          {SPORT_ORDER.map((s, idx) => {
            const isSelected = currentSport === s;
            return (
              <button
                key={s}
                onClick={() => changeSport(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold capitalize transition-all whitespace-nowrap ${
                  isSelected
                    ? 'text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                style={{
                  backgroundColor: isSelected ? sportConfig.accentColor : 'transparent'
                }}
              >
                {idx + 1}. {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Sport Stage: Left Content vs Right Player & Court Visuals */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-6 sm:py-8 relative z-10 items-center">
        
        {/* Left Column: Content */}
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 shadow-md text-xs font-extrabold text-slate-200">
            <Sparkles className="w-3.5 h-3.5" style={{ color: sportConfig.accentColor }} />
            <span>{sportConfig.pitchType}</span>
          </div>

          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight">
              {sportConfig.name}
            </h2>
            <p className="text-lg sm:text-xl font-extrabold mt-1 tracking-tight" style={{ color: sportConfig.accentColor }}>
              {sportConfig.tagline}
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-xl">
            {sportConfig.description}
          </p>

          {/* Court Metrics Card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 sm:p-5 rounded-3xl bg-slate-900/85 border border-slate-800 shadow-2xl backdrop-blur-md">
            <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="text-[11px] uppercase font-extrabold text-slate-400 tracking-wider">Dimensions</div>
              <div className="text-sm font-extrabold text-white mt-0.5">{sportConfig.courtDetails.dimensions}</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="text-[11px] uppercase font-extrabold text-slate-400 tracking-wider">Surface Spec</div>
              <div className="text-sm font-extrabold text-white mt-0.5">{sportConfig.courtDetails.surface.split('/')[0]}</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="text-[11px] uppercase font-extrabold text-slate-400 tracking-wider">Lighting</div>
              <div className="text-sm font-extrabold text-white mt-0.5">{sportConfig.courtDetails.lighting}</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="text-[11px] uppercase font-extrabold text-slate-400 tracking-wider">Walk-in Rate</div>
              <div className="text-sm font-extrabold text-emerald-400 mt-0.5">{sportConfig.courtDetails.peakRate}</div>
            </div>
            <div className="col-span-2 p-2.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase font-extrabold text-emerald-300 tracking-wider">Member Benefit</div>
                <div className="text-sm font-extrabold text-emerald-300 mt-0.5">{sportConfig.courtDetails.memberRate}</div>
              </div>
              <ShieldCheck className="w-6 h-6 text-emerald-400 mr-2 shrink-0" />
            </div>
          </div>

          {/* Key Arena Features */}
          <div className="space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Arena Specifications</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200 font-bold">
              {sportConfig.features.map((f, i) => (
                <div key={i} className="flex items-center space-x-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: sportConfig.accentColor }} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onBookCourt(currentSport)}
              className="px-6 py-3.5 rounded-2xl font-black text-xs text-white flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 shadow-xl active:scale-95"
              style={{
                backgroundColor: sportConfig.accentColor,
                boxShadow: `0 10px 25px -5px ${sportConfig.glowColor}`
              }}
            >
              <Calendar className="w-4 h-4 text-white" />
              <span className="text-white">Book Court &bull; 30-Min Slot Engine</span>
            </button>

            <button
              onClick={onRegister}
              className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-black text-white flex items-center space-x-1.5 transition-colors shadow-md"
            >
              <span>Join Club as Member</span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Right Column: Player Positioned Right with Stadium Pitch Canvas */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[380px] lg:min-h-[480px]">
          
          {/* Pitch Field Visual Box */}
          <div className="w-full h-full max-h-[480px] rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl backdrop-blur-md group">
            
            {/* Top Atmospheric Floodlight Bar */}
            <div className="flex justify-between items-center z-10 mb-3">
              <span className="text-xs font-mono font-extrabold tracking-widest text-white uppercase">
                {sportConfig.name} Live Court
              </span>
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-extrabold text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: sportConfig.accentColor }} />
                <span>Floodlights Active</span>
              </div>
            </div>

            {/* Stadium Pitch Markings Canvas Graphic */}
            <div className={`my-auto relative h-60 w-full rounded-2xl ${sportConfig.pitchBg} border-2 ${sportConfig.pitchLineColor} flex items-center justify-center overflow-hidden shadow-inner`}>
              
              {/* Pitch Court Grid lines */}
              <div className={`absolute inset-4 border-2 ${sportConfig.pitchLineColor} rounded-lg flex items-center justify-center`}>
                <div className={`w-full h-[2px] ${sportConfig.pitchLineColor}`} />
                <div className={`absolute w-[2px] h-full ${sportConfig.pitchLineColor}`} />
                <div className={`absolute w-24 h-24 rounded-full border-2 ${sportConfig.pitchLineColor}`} />
              </div>

              {/* Dynamic Atmospheric Motion Particles */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-sky-400 shadow-md animate-ping" />
                <div className="absolute bottom-1/3 right-1/4 w-2.5 h-2.5 rounded-full shadow-md animate-pulse" style={{ backgroundColor: sportConfig.accentColor }} />
                <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              </div>

              {/* Player Positioned on the Right */}
              <div className="absolute right-6 bottom-4 sm:right-8 sm:bottom-6 flex flex-col items-center z-20">
                <div className="relative">
                  {/* Glowing player aura */}
                  <div 
                    className="absolute -inset-2 rounded-full blur-md opacity-60 animate-pulse"
                    style={{ backgroundColor: sportConfig.accentColor }}
                  />
                  
                  {/* Stylized Player Silhouette Card */}
                  <div className="relative w-32 h-40 rounded-2xl bg-slate-900 border-2 border-slate-700 p-2.5 flex flex-col items-center justify-center text-center shadow-2xl">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center font-black text-sm text-white shadow-md mb-1.5"
                      style={{ backgroundColor: sportConfig.accentColor }}
                    >
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[11px] font-black text-white uppercase tracking-tight">{sportConfig.name}</span>
                    <span className="text-[9px] font-bold text-slate-300 leading-tight mt-1 line-clamp-2">{sportConfig.playerAction}</span>
                  </div>
                </div>

                {/* Moving Ball / Object Graphic */}
                <div 
                  className="absolute -left-10 top-8 w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-600 shadow-lg animate-bounce flex items-center justify-center text-[10px] font-black text-white"
                  style={{
                    boxShadow: `0 0 15px 2px ${sportConfig.glowColor}`
                  }}
                >
                  &bull;
                </div>
              </div>

              {/* Left Action Overlay Tag */}
              <div className="absolute left-4 top-4 max-w-[200px] z-10 bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-slate-700 shadow-lg">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Atmosphere</span>
                <p className="text-[11px] font-bold text-slate-200 leading-snug">
                  {sportConfig.atmosphere}
                </p>
                <div className="mt-2 text-[10px] font-mono font-bold text-sky-300 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                  {sportConfig.ballAction}
                </div>
              </div>
            </div>

            {/* Bottom Gear & Equipment Bar */}
            <div className="z-10 pt-3 mt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <span className="text-slate-400 font-semibold text-[11px]">
                Recommended Gear: <strong className="text-white font-extrabold">{sportConfig.equipmentRecommended}</strong>
              </span>
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 w-fit">
                Live Status: Available
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Slide Navigation Footer: Prev / Next */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between pt-4 border-t border-slate-800 relative z-10">
        <button
          onClick={handlePrev}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-extrabold border border-slate-700 shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-slate-300" />
          <span>Previous Sport</span>
        </button>

        <div className="text-xs text-slate-400 font-bold hidden sm:block">
          Transition: Football &rarr; Tennis &rarr; Cricket &rarr; Badminton &rarr; Padel &rarr; Running &rarr; Pool &rarr; Volleyball
        </div>

        <button
          onClick={handleNext}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-extrabold border border-slate-700 shadow-md transition-all"
        >
          <span>Next Sport</span>
          <ArrowRight className="w-4 h-4 text-slate-300" />
        </button>
      </div>

    </div>
  );
};
