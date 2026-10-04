import React, { useState, useEffect } from 'react';
import { SportType } from '../../types';
import { ArenaFlow3DCanvas, ArenaZone } from '../canvas/ArenaFlow3DCanvas';
import { ArenaFlowHeroOverlay } from '../ui/ArenaFlowHeroOverlay';

interface LandingSlideProps {
  onRegister: () => void;
  onLogin: () => void;
  onExploreSport: (sport: SportType) => void;
  onExplorePlatform: () => void;
  onBookCourt?: (sport: SportType) => void;
}

export const LandingSlide: React.FC<LandingSlideProps> = ({
  onRegister,
  onLogin,
  onExploreSport,
  onExplorePlatform,
  onBookCourt = onExploreSport
}) => {
  const [activeZone, setActiveZone] = useState<ArenaZone>('hero');

  const handleZoneSelect = (zone: ArenaZone) => {
    setActiveZone(zone);
  };

  const handleCourtSelect = (courtTitle: string, sport: SportType) => {
    if (sport === 'football') handleZoneSelect('football');
    else if (sport === 'cricket') handleZoneSelect('cricket');
    else if (sport === 'volleyball') handleZoneSelect('volleyball');
    else if (sport === 'tennis') handleZoneSelect('tennis');
    else if (sport === 'padel') handleZoneSelect('padel');
    else if (sport === 'badminton') handleZoneSelect('badminton');
    else if (sport === 'running') handleZoneSelect('running');
    else if (sport === 'pool') handleZoneSelect('pool');
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] overflow-hidden bg-[#070b14] select-none">
      
      {/* 1. Main 3D WebGL Three.js Stadium & Camera Timeline Canvas */}
      <ArenaFlow3DCanvas
        scrollProgress={0}
        activeZone={activeZone}
        onSelectCourt={handleCourtSelect}
        onSelectZone={handleZoneSelect}
      />

      {/* 2. Modern Futuristic White Stadium Glassmorphic HUD Overlay */}
      <ArenaFlowHeroOverlay
        activeZone={activeZone}
        onSelectZone={handleZoneSelect}
        onRegister={onRegister}
        onLogin={onLogin}
        onBookCourt={(sport) => onBookCourt(sport)}
        onExploreSport={onExploreSport}
      />

      {/* 3. High-Tech Grid & Lighting Ambient Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(2, 132, 199, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(2, 132, 199, 0.4) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

    </div>
  );
};
