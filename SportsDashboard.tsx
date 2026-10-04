import React, { useState } from 'react';
import { 
  Activity, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles,
  Zap,
  Flame,
  Award,
  Layers
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { SportType } from '../../types';

type SportsTab = 
  | 'dashboard' 
  | 'football' 
  | 'tennis' 
  | 'cricket' 
  | 'badminton' 
  | 'padel' 
  | 'running' 
  | 'fitness' 
  | 'courts' 
  | 'availability' 
  | 'schedules' 
  | 'players' 
  | 'coaches' 
  | 'reports';

export const SportsDashboard: React.FC = () => {
  const { courts, staff } = useData();

  const [activeTab, setActiveTab] = useState<SportsTab>('dashboard');

  const coaches = staff.filter(s => s.role.includes('Coach') || s.role.includes('Trainer'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* 1. TOP SCI-FI IRON MAN HUD TELEMETRY BAR & GUIDANCE */}
      <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500"
          style={{ boxShadow: '0 0 12px rgba(20, 184, 166, 0.6)' }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                <span>SPORTS OPERATIONS // SPORT-001</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] font-mono text-cyan-400">ARENA MATRIX ONLINE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
              Multi-Sport Facility &amp; Coaching Matrix
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              <strong>Contextual Guidance (Rule 55):</strong> Oversee specialized turf conditioning, court floodlight lux calibration, coach masterclass assignments, and athlete training rosters across all 6 core sports.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3.5 py-2 rounded-xl bg-slate-800/80 text-emerald-400 border border-slate-700 text-xs font-mono font-bold">
              100% OPERATIONAL STATUS
            </span>
          </div>
        </div>
      </div>

      {/* 2. METRIC TELEMETRY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Total Sports Handled</div>
          <div className="text-2xl font-bold font-mono text-cyan-400">6 Core Disciplines</div>
          <div className="text-[10px] text-slate-400">Football, Tennis, Cricket, Badminton, Padel, Running</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Active Courts &amp; Pitches</div>
          <div className="text-2xl font-bold font-mono text-white">{courts.length} Facilities</div>
          <div className="text-[10px] text-emerald-400 font-semibold">Laser-leveled &amp; certified</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Pro Coaching Staff</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{coaches.length} Coaches</div>
          <div className="text-[10px] text-slate-400">Head, academy &amp; fitness trainers</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Weekly Coached Sessions</div>
          <div className="text-2xl font-bold font-mono text-indigo-400">46 Masterclasses</div>
          <div className="text-[10px] text-indigo-300">Junior &amp; Adult leagues</div>
        </div>
      </div>

      {/* 3. MENU TABS (RULE 23 SPECIFIED MENUS) */}
      <div className="flex border-b border-slate-800/80 pb-2 gap-1.5 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'football', label: 'Football' },
          { id: 'tennis', label: 'Tennis' },
          { id: 'cricket', label: 'Cricket' },
          { id: 'badminton', label: 'Badminton' },
          { id: 'padel', label: 'Padel' },
          { id: 'running', label: 'Running' },
          { id: 'fitness', label: 'Fitness & Gym' },
          { id: 'courts', label: 'Courts' },
          { id: 'availability', label: 'Availability' },
          { id: 'schedules', label: 'Schedules' },
          { id: 'players', label: 'Players' },
          { id: 'coaches', label: 'Coaches' },
          { id: 'reports', label: 'Reports' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SportsTab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-teal-500/20 border-teal-500/40 text-teal-300 shadow-lg shadow-teal-500/10'
                  : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" />
              <span>Court Surfaces &amp; Operational Health</span>
            </h4>
            <div className="space-y-3">
              {courts.slice(0, 4).map(c => (
                <div key={c.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{c.name}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{c.sport} &bull; {c.indoor ? 'Indoor Climate Enclosed' : 'Outdoor Floodlit'}</div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {c.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Assigned Coaching Leads</span>
            </h4>
            <div className="space-y-3">
              {coaches.map(co => (
                <div key={co.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{co.name}</div>
                    <div className="text-[10px] text-cyan-400 font-mono">{co.role}</div>
                  </div>
                  <span className="font-mono text-xs text-slate-300 font-semibold">{co.shift}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: INDIVIDUAL SPORT SCREENS (FOOTBALL, TENNIS, CRICKET, BADMINTON, PADEL, RUNNING) */}
      {(['football', 'tennis', 'cricket', 'badminton', 'padel', 'running'] as SportType[]).includes(activeTab as any) && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">SPORT SPECIFICATION MATRIX</span>
              <h3 className="text-2xl font-display font-extrabold text-white capitalize mt-0.5">{activeTab} Discipline</h3>
            </div>
            <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300">
              Tournament Regulation Grade
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Floodlight Array</span>
              <div className="text-sm font-bold text-white">800 - 1000 Lux Uniform LED</div>
              <p className="text-[11px] text-slate-400">Zero-glare night broadcast standard</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Surface Certification</span>
              <div className="text-sm font-bold text-emerald-400">Federation Certified Surface</div>
              <p className="text-[11px] text-slate-400">Shock-absorbing sub-layers</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Standard Booking Rate</span>
              <div className="text-sm font-bold text-cyan-400 font-mono">₹800 - ₹3000 / hr</div>
              <p className="text-[11px] text-slate-400">50% discount for Gold members</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-3">Allocated Facilities in this Sport</h4>
            <div className="space-y-2">
              {courts.filter(c => c.sport === activeTab).map(c => (
                <div key={c.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white text-sm">{c.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{c.indoor ? 'Indoor Air-Conditioned Hall' : 'Outdoor Championship Court'}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-emerald-400">₹{c.memberHourlyRate}/hr (Member)</div>
                    <span className="text-[10px] text-slate-500 font-mono">Walk-in: ₹{c.hourlyRate}/hr</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: FITNESS & GYM */}
      {activeTab === 'fitness' && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white">Strength, Conditioning &amp; Athletic Recovery Studio</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono font-bold text-[10px] uppercase">Cardio &amp; Free Weights</span>
              <div className="text-sm font-bold text-white">Technogym Pure Strength &amp; Skillrun Treadmills</div>
              <p className="text-slate-400">Full Olympic lifting platforms with bumper plates and dumbells up to 50kg.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono font-bold text-[10px] uppercase">Athletic Recovery</span>
              <div className="text-sm font-bold text-cyan-400">Cold Plunge Pool &amp; Cedar Wood Sauna</div>
              <p className="text-slate-400">Post-match cryo-recovery and hydro-massage units for members.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: COURTS & AVAILABILITY */}
      {(activeTab === 'courts' || activeTab === 'availability') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courts.map(c => (
            <div key={c.id} className="p-5 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 space-y-3 shadow-xl">
              <div className="flex justify-between items-start">
                <span className="font-bold text-white text-sm">{c.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-mono">
                  {c.status}
                </span>
              </div>
              <div className="text-xs text-slate-400">Sport: <strong className="text-cyan-400 capitalize">{c.sport}</strong></div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between"><span>Status:</span><span className="text-emerald-400 font-bold">AVAILABLE NOW</span></div>
                <div className="flex justify-between"><span>Next Slot:</span><span className="text-white font-mono">18:00 (Today)</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: SCHEDULES */}
      {activeTab === 'schedules' && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white">Daily Coached Masterclass Schedule</h4>
          <div className="space-y-2 text-xs">
            {[
              { time: '08:00 - 09:30', sport: 'Tennis', title: 'High-Performance Topspin Clinic', coach: 'Coach David Vance', capacity: '8/8 Full' },
              { time: '10:00 - 11:30', sport: 'Padel', title: 'Tactical Glass Rebound Masterclass', coach: 'Coach Lucia Mendez', capacity: '6/8 Open' },
              { time: '17:00 - 18:30', sport: 'Football', title: '5v5 Pressing & Finishing Academy', coach: 'Coach David Vance', capacity: '12/14 Open' },
              { time: '19:00 - 20:30', sport: 'Badminton', title: 'Jump Smash & Fast Doubles Drills', coach: 'Coach Jin Woo', capacity: '8/8 Full' }
            ].map((sch, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{sch.title}</div>
                  <div className="text-slate-400 font-mono mt-0.5">{sch.time} &bull; {sch.sport} with {sch.coach}</div>
                </div>
                <span className="font-mono text-cyan-400 font-bold px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800">
                  {sch.capacity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PLAYERS & COACHES */}
      {(activeTab === 'players' || activeTab === 'coaches') && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white">
            {activeTab === 'coaches' ? 'Certified Head & Assistant Coaches' : 'Active Registered Club Athletes'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {coaches.map(co => (
              <div key={co.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-white text-sm">{co.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    CERTIFIED PRO
                  </span>
                </div>
                <p className="text-slate-400">{co.role} &bull; Shift: {co.shift}</p>
                <div className="text-[11px] text-emerald-400 font-mono">&check; Full First-Aid &amp; SafeGuard Accredited</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: REPORTS */}
      {activeTab === 'reports' && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white">Sports Operations &amp; Surface Wear Report</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono uppercase font-bold text-[10px]">Surface Maintenance Health</span>
              <div className="space-y-1 font-mono">
                <div className="flex justify-between"><span>FIFA Turf Infill:</span><strong className="text-emerald-400">98% Optimal</strong></div>
                <div className="flex justify-between"><span>Clay Moisture Sprinklers:</span><strong className="text-emerald-400">100% Operational</strong></div>
                <div className="flex justify-between"><span>Padel 12mm Glass Clarity:</span><strong className="text-cyan-400">Inspected Today</strong></div>
                <div className="flex justify-between"><span>Tartan Track Traction:</span><strong className="text-emerald-400">Normal</strong></div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono uppercase font-bold text-[10px]">Floodlight Consumption</span>
              <div className="space-y-1 font-mono">
                <div className="flex justify-between"><span>Evening LED Load:</span><strong className="text-white">42 kW / hr</strong></div>
                <div className="flex justify-between"><span>Low-Glare Efficiency:</span><strong className="text-emerald-400">A+ Eco Grade</strong></div>
                <div className="flex justify-between"><span>Automation Sensors:</span><strong className="text-cyan-400">Active on Dusk</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
