import React, { useState } from 'react';
import { 
  Ticket, 
  QrCode, 
  Users, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Search, 
  Sparkles,
  Flame,
  Megaphone,
  Download,
  ShieldCheck,
  X
} from 'lucide-react';
import { useData } from '../../context/DataContext';

type EventTab = 
  | 'dashboard' 
  | 'events' 
  | 'tickets' 
  | 'participants' 
  | 'attendance' 
  | 'qr_checkin' 
  | 'announcements' 
  | 'reports';

export const EventDashboard: React.FC = () => {
  const { events, eventTickets, checkInEventTicket } = useData();

  const [activeTab, setActiveTab] = useState<EventTab>('dashboard');
  const [scanCodeInput, setScanCodeInput] = useState('QR-AF-EVT1-ALEX982');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; ticket?: any } | null>(null);

  const totalTicketsSold = events.reduce((s, e) => s + e.registeredCount, 0);
  const totalCapacity = events.reduce((s, e) => s + e.capacity, 0);
  const totalEventRevenue = events.reduce((s, e) => s + (e.registeredCount * e.ticketPriceMember), 0);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanCodeInput.trim()) return;
    const res = checkInEventTicket(scanCodeInput.trim());
    setScanResult(res);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* 1. TOP SCI-FI IRON MAN HUD TELEMETRY BAR & GUIDANCE */}
      <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500"
          style={{ boxShadow: '0 0 12px rgba(236, 72, 153, 0.6)' }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
                <span>EVENTS AUTHORITY // EVENT-001</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] font-mono text-purple-400">TOURNAMENT ENGINE ACTIVE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
              Tournaments, Competitions &amp; Community Events
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              <strong>Contextual Guidance (Rule 26, 39 &amp; 55):</strong> Create tournament draws, set member vs non-member entry rates, monitor arena capacity, conduct fast QR badge check-ins, and broadcast community alerts.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('qr_checkin')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white text-xs font-bold shadow-lg shadow-pink-500/20 transition-all flex items-center space-x-1.5"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Scanner</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. METRIC TELEMETRY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Total Tickets Booked</div>
          <div className="text-2xl font-bold font-mono text-cyan-400">{totalTicketsSold} Passes</div>
          <div className="text-[10px] text-slate-400">Across {events.length} Upcoming Tournaments</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Total Arena Capacity</div>
          <div className="text-2xl font-bold font-mono text-white">{totalCapacity} Athletes</div>
          <div className="text-[10px] text-emerald-400 font-semibold">81.2% Overall Occupancy</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">QR Verified Check-ins</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {eventTickets.filter(t => t.checkedIn).length} Admitted
          </div>
          <div className="text-[10px] text-slate-400">Fast barcode scanner admission</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Friday Social Play</div>
          <div className="text-2xl font-bold font-mono text-pink-400">38 Enrolled</div>
          <div className="text-[10px] text-pink-300">DJ &amp; Drinks Reception Ready</div>
        </div>
      </div>

      {/* 3. MENU TABS (RULE 26 SPECIFIED MENUS) */}
      <div className="flex border-b border-slate-800/80 pb-2 gap-1.5 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'events', label: `Events (${events.length})` },
          { id: 'tickets', label: `Tickets (${eventTickets.length})` },
          { id: 'participants', label: 'Participants' },
          { id: 'attendance', label: 'Attendance' },
          { id: 'qr_checkin', label: 'QR Check-in' },
          { id: 'announcements', label: 'Announcements' },
          { id: 'reports', label: 'Reports' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as EventTab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-pink-500/20 border-pink-500/40 text-pink-300 shadow-lg shadow-pink-500/10'
                  : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: DASHBOARD & EVENTS (RULE 39) */}
      {(activeTab === 'dashboard' || activeTab === 'events') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map(e => (
            <div key={e.id} className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl">
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-pink-400 uppercase tracking-wider">{e.sport}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 border border-slate-800 text-slate-300">
                    {e.registeredCount} / {e.capacity} Spots
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mt-2">{e.title}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{e.description}</p>
                <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date:</span>
                    <span className="text-white">{e.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time:</span>
                    <span className="text-white">{e.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Member Entry:</span>
                    <span className="text-emerald-400 font-bold">₹{e.ticketPriceMember}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Non-Member:</span>
                    <span className="text-slate-300">₹{e.ticketPriceRegular}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" 
                    style={{ width: `${Math.round((e.registeredCount / e.capacity) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: QR CHECK-IN TERMINAL (RULE 39) */}
      {activeTab === 'qr_checkin' && (
        <div className="max-w-md mx-auto p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-2xl space-y-5 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center">
            <QrCode className="w-8 h-8 text-pink-400 animate-pulse" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Event Pass QR Verification Station</h3>
            <p className="text-xs text-slate-400 mt-1">Scan pass QR or paste ticket barcode verification ID</p>
          </div>

          <form onSubmit={handleScan} className="space-y-3">
            <input
              type="text"
              value={scanCodeInput}
              onChange={e => setScanCodeInput(e.target.value)}
              placeholder="e.g. QR-AF-EVT1-ALEX982"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-mono"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold text-xs shadow-glow-rose transition-all"
            >
              Verify Pass &amp; Check-In
            </button>
          </form>

          {scanResult && (
            <div className={`p-4 rounded-2xl text-xs space-y-1.5 text-left ${
              scanResult.success ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
            }`}>
              <div className="flex items-center space-x-2 font-bold">
                {scanResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                <span>{scanResult.message}</span>
              </div>
              {scanResult.ticket && (
                <div className="font-mono text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                  <div>Attendee: {scanResult.ticket.userName} ({scanResult.ticket.userEmail})</div>
                  <div>Event: {scanResult.ticket.eventId} &bull; QR Code: {scanResult.ticket.qrCode}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: TICKETS & PARTICIPANTS & ATTENDANCE */}
      {(activeTab === 'tickets' || activeTab === 'participants' || activeTab === 'attendance') && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white">Issued Passes &amp; Registered Athletes</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] font-mono">
                <tr>
                  <th className="pb-3 px-3">Ticket ID</th>
                  <th className="pb-3 px-3">Event</th>
                  <th className="pb-3 px-3">Athlete Name</th>
                  <th className="pb-3 px-3">Price Paid</th>
                  <th className="pb-3 px-3">QR Verification Key</th>
                  <th className="pb-3 px-3 text-right">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {eventTickets.map(t => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-cyan-400 font-semibold">{t.id}</td>
                    <td className="py-3 px-3 text-slate-200">{t.eventId}</td>
                    <td className="py-3 px-3 font-bold text-white">{t.userName}</td>
                    <td className="py-3 px-3 font-mono text-emerald-400 font-bold">₹{t.paidAmount}</td>
                    <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">{t.qrCode}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        t.checkedIn ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {t.checkedIn ? 'Checked-In' : 'Pending Entry'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-pink-400" />
              <span>Event Broadcast Announcements</span>
            </h4>
            <button
              onClick={() => alert('New Announcement Published')}
              className="px-3.5 py-1.5 rounded-xl bg-pink-500 text-white font-bold text-xs shadow-glow-rose"
            >
              + Broadcast Announcement
            </button>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Autumn Open Padel Tournament Draws Live', date: 'Today, 14:00', text: 'All 32 teams have been seeded into Court 1 & 2 schedules.' },
              { title: 'Friday Night Social Doubles Entry Extended', date: 'Yesterday', text: '4 spots added for mixed doubles under floodlights.' }
            ].map((a, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">{a.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{a.date}</span>
                </div>
                <p className="text-slate-400">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: REPORTS */}
      {activeTab === 'reports' && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Event Ticket Sales &amp; Revenue Analytics</h4>
            <button
              onClick={() => alert('Exporting Event_Analytics.pdf')}
              className="px-3.5 py-1.5 rounded-xl bg-pink-500 text-white font-bold text-xs shadow-glow-rose"
            >
              Export Report
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Pass Sales Revenue</span>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between"><span>Tournament Registrations:</span><strong className="text-emerald-400">₹76,000</strong></div>
                <div className="flex justify-between"><span>Member Subsidized Passes:</span><strong className="text-white">68%</strong></div>
                <div className="flex justify-between"><span>Guest Entry Passes:</span><strong className="text-white">32%</strong></div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Check-in Speed Metric</span>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between"><span>Avg QR Scan Time:</span><strong className="text-cyan-400">1.4 Seconds</strong></div>
                <div className="flex justify-between"><span>Capacity Threshold:</span><strong className="text-emerald-400">Zero Overcrowding</strong></div>
                <div className="flex justify-between"><span>No-Show Rate:</span><strong className="text-white">3.1%</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
