import React, { useRef, useEffect } from 'react';
import { SportType } from '../../types';

interface VideoBackgroundProps {
  sport?: SportType;
  isLoginPage?: boolean;
  onSelectSport?: (sport: SportType) => void;
}

// THE CHAMPIONS CLUB SIGNATURE SPORTS COMPLEX THEMES
const CHAMPIONS_COLISEUM_THEME = {
  name: 'The Champions Coliseum',
  badge: 'CHAMPIONSHIP SPORTS MATRIX // 1400 LUX',
  arenaTitle: 'CENTRAL SPORTS COMPLEX & COLISEUM',
  accent: '#0ea5e9',
  secondary: '#f59e0b',
  videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stadium-lights-at-night-40291-large.mp4',
  fallbackVideo: 'https://assets.mixkit.co/videos/preview/mixkit-spectators-at-a-sports-stadium-at-night-40289-large.mp4',
  poster: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1920&auto=format&fit=crop&q=85',
  particleColors: ['#0ea5e9', '#38bdf8', '#f59e0b', '#10b981', '#6366f1']
};

const SPORT_THEMES: Record<SportType, {
  name: string;
  badge: string;
  arenaTitle: string;
  accent: string;
  secondary: string;
  videoUrl: string;
  fallbackVideo: string;
  poster: string;
  particleColors: string[];
}> = {
  tennis: {
    name: 'Centre Clay & Grand Slam Courts',
    badge: 'ROLAND GARROS CLAY // 1000 LUX',
    arenaTitle: 'CENTRE COURT TENNIS ARENA',
    accent: '#f59e0b',
    secondary: '#0ea5e9',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tennis-player-hitting-the-ball-40445-large.mp4',
    fallbackVideo: 'https://assets.mixkit.co/videos/preview/mixkit-stadium-lights-at-night-40291-large.mp4',
    poster: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=1920&auto=format&fit=crop&q=85',
    particleColors: ['#f59e0b', '#fbbf24', '#0ea5e9', '#ea580c', '#38bdf8']
  },
  cricket: {
    name: 'Floodlit Box Cricket Coliseum',
    badge: 'ASTRO ENCLOSURE // 1000 LUX',
    arenaTitle: 'CHAMPIONSHIP BOX CRICKET ARENA',
    accent: '#ef4444',
    secondary: '#f59e0b',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-spectators-at-a-sports-stadium-at-night-40289-large.mp4',
    fallbackVideo: 'https://assets.mixkit.co/videos/preview/mixkit-stadium-lights-at-night-40291-large.mp4',
    poster: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?w=1920&auto=format&fit=crop&q=85',
    particleColors: ['#ef4444', '#f59e0b', '#fbbf24', '#f97316', '#dc2626']
  },
  padel: {
    name: 'Panoramic Glass Padel Dome',
    badge: '12MM TEMPERED GLASS // MONDO TURF',
    arenaTitle: 'PANORAMIC GLASS PADEL CAGE',
    accent: '#8b5cf6',
    secondary: '#ec4899',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stadium-lights-at-night-40291-large.mp4',
    fallbackVideo: 'https://assets.mixkit.co/videos/preview/mixkit-tennis-player-hitting-the-ball-40445-large.mp4',
    poster: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1920&auto=format&fit=crop&q=85',
    particleColors: ['#8b5cf6', '#a855f7', '#0ea5e9', '#ec4899', '#6366f1']
  },
  badminton: {
    name: 'BWF Sprung Wood Badminton Hub',
    badge: 'BWF CERTIFIED // ANTI-GLARE LED',
    arenaTitle: 'HYPER SMASH BADMINTON ARENA',
    accent: '#06b6d4',
    secondary: '#10b981',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stadium-lights-at-night-40291-large.mp4',
    fallbackVideo: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-running-on-a-running-track-40335-large.mp4',
    poster: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1920&auto=format&fit=crop&q=85',
    particleColors: ['#06b6d4', '#10b981', '#38bdf8', '#818cf8', '#22d3ee']
  },
  football: {
    name: '5v5 FIFA Approved Turf Pitch',
    badge: 'MONOFILAMENT TURF // 800 LUX',
    arenaTitle: 'FIFA PRO 5-A-SIDE TURF ARENA',
    accent: '#10b981',
    secondary: '#0ea5e9',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-a-ball-40439-large.mp4',
    fallbackVideo: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-scoring-a-goal-in-a-stadium-40441-large.mp4',
    poster: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1920&auto=format&fit=crop&q=85',
    particleColors: ['#10b981', '#34d399', '#0ea5e9', '#6ee7b7', '#059669']
  },
  pool: {
    name: 'VIP 8-Ball & Snooker Lounge',
    badge: 'ITALIAN SLATE // SIMONIS 860',
    arenaTitle: 'VIP BILLIARDS & SNOOKER LOUNGE',
    accent: '#059669',
    secondary: '#f59e0b',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-people-playing-billiards-in-a-bar-42998-large.mp4',
    fallbackVideo: 'https://assets.mixkit.co/videos/preview/mixkit-hands-hitting-a-billiard-ball-with-the-cue-43000-large.mp4',
    poster: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?w=1920&auto=format&fit=crop&q=85',
    particleColors: ['#10b981', '#fbbf24', '#8b5cf6', '#06b6d4', '#34d399']
  },
  running: {
    name: 'Olympic Tartan 400m Track',
    badge: 'POLYURETHANE RUBBER // 4 LANES',
    arenaTitle: 'OLYMPIC ATHLETICS SPRINT TRACK',
    accent: '#ec4899',
    secondary: '#f97316',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-running-on-a-running-track-40335-large.mp4',
    fallbackVideo: 'https://assets.mixkit.co/videos/preview/mixkit-stadium-lights-at-night-40291-large.mp4',
    poster: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&auto=format&fit=crop&q=85',
    particleColors: ['#ec4899', '#f43f5e', '#f97316', '#fbbf24', '#0ea5e9']
  },
  volleyball: {
    name: 'Volleyball Arena & Beach Sand',
    badge: 'TARAFLEX PRO // 800 LUX',
    arenaTitle: 'CHAMPIONSHIP VOLLEYBALL ARENA',
    accent: '#f97316',
    secondary: '#0ea5e9',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stadium-lights-at-night-40291-large.mp4',
    fallbackVideo: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-running-on-a-running-track-40335-large.mp4',
    poster: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1920&auto=format&fit=crop&q=85',
    particleColors: ['#f97316', '#fbbf24', '#0ea5e9', '#ea580c', '#38bdf8']
  }
};

export const VideoBackground: React.FC<VideoBackgroundProps> = ({ 
  sport = 'tennis',
  isLoginPage = false,
  onSelectSport
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const theme = isLoginPage 
    ? CHAMPIONS_COLISEUM_THEME 
    : (SPORT_THEMES[sport] || CHAMPIONS_COLISEUM_THEME);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [theme.videoUrl]);

  // Subtle sports atmospheric particle lines and arena lighting
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Lightweight subtle arena light specks
    const particles: { 
      x: number; 
      y: number; 
      size: number; 
      speedY: number; 
      speedX: number;
      opacity: number; 
      color: string;
    }[] = [];

    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedY: -(Math.random() * 0.5 + 0.2),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.2,
        color: theme.particleColors[Math.floor(Math.random() * theme.particleColors.length)]
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme.particleColors]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#090d16]">
      
      {/* 1. HIGH RESOLUTION SPORTS COMPLEX POSTER / BACKDROP IMAGE */}
      <img
        src={theme.poster}
        alt={theme.name}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 scale-105"
        style={{ filter: 'brightness(0.85) contrast(1.15) saturate(1.2)' }}
      />

      {/* 2. REAL 3D ANIMATED STADIUM VIDEO LOOP (Seamless blend) */}
      <video
        ref={videoRef}
        key={theme.videoUrl}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover opacity-60 filter contrast-110 saturate-130 transition-all duration-700 mix-blend-screen"
        poster={theme.poster}
      >
        <source src={theme.videoUrl} type="video/mp4" />
        <source src={theme.fallbackVideo} type="video/mp4" />
      </video>

      {/* 3. CANVAS SUBTLE ARENA EMBERS & RAYS */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />

      {/* 4. PROFESSIONAL DUAL TINT OVERLAY FOR 100% CRISP FOREGROUND READABILITY */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-900/55 to-slate-950/85 backdrop-blur-[2px]"
      />

      {/* 5. TOP ARENA AMBIENT SPOTLIGHT GLOW */}
      <div 
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${theme.accent} 0%, transparent 70%)`
        }}
      />

      {/* 6. CORNER TELEMETRY WATERMARK */}
      <div className="hidden lg:block absolute top-20 left-8 pointer-events-none z-0">
        <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest uppercase text-slate-300 font-bold drop-shadow-md">
          <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: theme.accent }} />
          <span>{theme.badge}</span>
        </div>
        <p className="text-sm font-extrabold text-white font-mono tracking-wider mt-0.5 drop-shadow-md">
          {theme.arenaTitle}
        </p>
      </div>

      {/* 7. QUICK SPORT BACKDROP CONTROLLER (FLOATING PILL ON BOTTOM RIGHT) */}
      {onSelectSport && (
        <div className="pointer-events-auto absolute bottom-6 right-6 hidden md:flex items-center space-x-1.5 p-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl z-30">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 font-bold">
            STADIUM AMBIANCE:
          </span>
          {(['tennis', 'cricket', 'padel', 'badminton', 'football', 'pool', 'running'] as SportType[]).map(s => {
            const isSelected = sport === s;
            const emoji = s === 'tennis' ? '🎾' :
                          s === 'cricket' ? '🏏' :
                          s === 'padel' ? '🏓' :
                          s === 'badminton' ? '🏸' :
                          s === 'football' ? '⚽' :
                          s === 'pool' ? '🎱' : '🏃';
            return (
              <button
                key={s}
                onClick={() => onSelectSport(s)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  isSelected 
                    ? 'bg-sky-500 text-white shadow-sm ring-1 ring-sky-300' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title={`Switch arena atmosphere to ${s}`}
              >
                <span>{emoji}</span>
                <span className="capitalize text-[11px] hidden xl:inline">{s}</span>
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
};
