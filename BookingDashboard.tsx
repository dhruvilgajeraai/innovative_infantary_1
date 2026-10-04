import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  AlertCircle, 
  Check, 
  Users, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Flame,
  QrCode,
  ArrowRight,
  RefreshCw,
  FileText,
  Download,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { BookingStatus, SportType } from '../../types';

type BookingTab = 
  | 'dashboard' 
  | 'calendar' 
  | 'new' 
  | 'today' 
  | 'upcoming' 
  | 'cancellations' 
  | 'history' 
  | 'checkin' 
  | 'courts' 
  | 'social' 
  | 'reports';

export const BookingDashboard: React.FC = () => {
  const { 
    courts, 
    bookings, 
    createBooking, 
    cancelBooking, 
    checkInBooking 
  } = useData();

  const [activeTab, setActiveTab] = useState<BookingTab>('dashboard');
  const [selectedSportFilter, setSelectedSportFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Check-in terminal state
  const [checkInInput, setCheckInInput] = useState('');
  const [checkInMsg, setCheckInMsg] = useState<{ text: string; error?: boolean } | null>(null);

  // New Booking State
  const [newSport, setNewSport] = useState<SportType>('tennis');
  const [newCourtId, setNewCourtId] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('Alexander Wright');
  const [newCustomerEmail, setNewCustomerEmail] = useState('alex.wright@gmail.com');
  const [newTier, setNewTier] = useState<'gold' | 'silver' | 'junior' | 'none'>('silver');
  const [newDate, setNewDate] = useState('2026-10-03');
  const [newTime, setNewTime] = useState('17:00');
  const [bookingFeedback, setBookingFeedback] = useState<{ text: string; error?: boolean } | null>(null);

  const todayStr = '2026-10-03';
  const todayBookings = bookings.filter(b => b.date === todayStr);
  const upcomingBookings = bookings.filter(b => b.date > todayStr || (b.date === todayStr && b.status === 'BOOKED'));
  const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED');
  const activeBookingsCount = todayBookings.filter(b => b.status === 'BOOKED' || b.status === 'CHECKED-IN').length;
  const totalRevenue = todayBookings.filter(b => b.status !== 'CANCELLED').reduce((s, b) => s + b.amount, 0);

  const filteredBookings = todayBookings.filter(b => {
    const matchesSport = selectedSportFilter === 'all' || b.sport === selectedSportFilter;
    const matchesSearch = b.courtName.toLowerCase().includes(search.toLowerCase()) || 
                          b.userName.toLowerCase().includes(search.toLowerCase()) ||
                          b.id.toLowerCase().includes(search.toLowerCase());
    return matchesSport && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingFeedback(null);

    const availableCourts = courts.filter(c => c.sport === newSport && c.status === 'active');
    const court = courts.find(c => c.id === newCourtId) || availableCourts[0];
    if (!court) {
      setBookingFeedback({ text: 'No active court available for selected sport.', error: true });
      return;
    }

    const [h, m] = newTime.split(':').map(Number);
    const endH = String(h + 1).padStart(2, '0');
    const endM = String(m).padStart(2, '0');
    const endTime = `${endH}:${endM}`;

    const isMember = newTier !== 'none';
    const amount = isMember ? court.memberHourlyRate : court.hourlyRate;

    const res = createBooking({
      courtId: court.id,
      courtName: court.name,
      sport: court.sport,
      userId: `usr-${Date.now().toString(36)}`,
      userName: newCustomerName,
      userEmail: newCustomerEmail,
      userTier: newTier,
      date: newDate,
      startTime: newTime,
      endTime,
      durationMinutes: 60,
      amount,
      status: 'BOOKED'
    });

    if (res.success) {
      setBookingFeedback({ text: res.message });
      setTimeout(() => {
        setActiveTab('today');
        setBookingFeedback(null);
      }, 1500);
    } else {
      setBookingFeedback({ text: res.message, error: true });
    }
  };

  const handleDirectCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckInMsg(null);
    const term = checkInInput.trim().toUpperCase();
    if (!term) return;

    const found = bookings.find(b => b.id.toUpperCase() === term || b.userName.toUpperCase().includes(term));
    if (found) {
      if (found.status === 'CHECKED-IN') {
        setCheckInMsg({ text: `Athlete ${found.userName} was already checked in for ${found.courtName}.` });
      } else {
        checkInBooking(found.id);
        setCheckInMsg({ text: `SUCCESS: ${found.userName} checked in on ${found.courtName} (${found.startTime} - ${found.endTime}).` });
      }
    } else {
      setCheckInMsg({ text: `No active reservation found matching "${checkInInput}". Verify ID or scan QR code again.`, error: true });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* 1. TOP SCI-FI IRON MAN HUD TELEMETRY BAR & GUIDANCE */}
      <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500"
          style={{ boxShadow: '0 0 12px rgba(6, 182, 212, 0.6)' }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>BOOKING AUTHORITY // BOOKING-001</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] font-mono text-emerald-400">ZERO COLLISION ENGINE ACTIVE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
              Court Operations &amp; Reservation Desk
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              <strong>Contextual Guidance (Rule 55):</strong> Select a court &rarr; Select 30-min start time &rarr; Select customer &rarr; Confirm booking. Maximum 2 plays per member per day is strictly enforced by the platform engine.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('checkin')}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all"
            >
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>QR Check-in</span>
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/20 transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ New Booking</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. METRIC TELEMETRY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Today&apos;s Bookings</div>
          <div className="text-2xl font-bold font-mono text-cyan-400">{todayBookings.length}</div>
          <div className="text-[10px] text-slate-500">60-minute match slots</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Occupied Courts</div>
          <div className="text-2xl font-bold font-mono text-white">{activeBookingsCount} / {courts.length}</div>
          <div className="text-[10px] text-emerald-400 font-semibold">{courts.length - activeBookingsCount} Courts Free Right Now</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Court Booking Revenue</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">₹{totalRevenue.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500">Member &amp; Guest fees combined</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Facility Utilization</div>
          <div className="text-2xl font-bold font-mono text-indigo-400">84.2%</div>
          <div className="text-[10px] text-indigo-300">Peak hours 17:00 - 22:00</div>
        </div>
      </div>

      {/* 3. MENU TABS (RULE 21 SPECIFIED MENUS) */}
      <div className="flex border-b border-slate-800/80 pb-2 gap-1.5 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'calendar', label: 'Calendar Grid' },
          { id: 'new', label: '+ New Booking' },
          { id: 'today', label: `Today's Bookings (${todayBookings.length})` },
          { id: 'upcoming', label: `Upcoming (${upcomingBookings.length})` },
          { id: 'cancellations', label: `Cancellations (${cancelledBookings.length})` },
          { id: 'history', label: 'Booking History' },
          { id: 'checkin', label: 'Check-in Terminal' },
          { id: 'courts', label: 'Courts & Availability' },
          { id: 'social', label: 'Friday Social Play' },
          { id: 'reports', label: 'Reports' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as BookingTab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Today&apos;s Active Schedule Overview</span>
              <span className="text-[10px] font-mono text-cyan-400">{todayBookings.length} Sessions</span>
            </h4>
            <div className="space-y-2">
              {todayBookings.slice(0, 5).map(b => (
                <div key={b.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{b.courtName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{b.userName} &bull; {b.startTime} - {b.endTime}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    b.status === 'CHECKED-IN' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Collision Avoidance Matrix (Rule 33)</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every booking allocates a strict 60-minute block aligned to 30-minute incremental starts. Overlapping slots on the same court surface trigger immediate collision barriers.
            </p>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-2">
              <div className="flex justify-between font-mono text-slate-300">
                <span>Member Booking Limit:</span>
                <span className="text-emerald-400 font-bold">Max 2 sessions / day</span>
              </div>
              <div className="flex justify-between font-mono text-slate-300">
                <span>Slot Granularity:</span>
                <span className="text-cyan-400 font-bold">30 Minutes</span>
              </div>
              <div className="flex justify-between font-mono text-slate-300">
                <span>Default Duration:</span>
                <span className="text-white font-bold">60 Minutes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CALENDAR (30-MIN SLOT GRID) */}
      {activeTab === 'calendar' && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Court Timeline &bull; 30-Minute Slot Matrix</span>
            </h4>
            <div className="flex items-center space-x-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700" /> Free</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Booked</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Checked-In</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[850px] space-y-2.5">
              {courts.map(court => (
                <div key={court.id} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
                  <div className="w-44 shrink-0">
                    <div className="font-bold text-xs text-white truncate">{court.name}</div>
                    <div className="text-[10px] text-cyan-400 uppercase font-mono">{court.sport}</div>
                  </div>

                  <div className="flex-1 grid grid-cols-12 gap-1 text-[10px] font-mono text-center">
                    {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'].map(slot => {
                      const isBooked = bookings.find(b => b.courtId === court.id && b.date === todayStr && b.startTime === slot && b.status !== 'CANCELLED');
                      return (
                        <div
                          key={slot}
                          className={`py-2 px-1 rounded-xl border font-semibold transition-all ${
                            isBooked 
                              ? isBooked.status === 'CHECKED-IN' 
                                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' 
                                : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                              : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-emerald-500/40 hover:text-emerald-400 cursor-pointer'
                          }`}
                        >
                          <div>{slot}</div>
                          <div className="text-[9px] mt-0.5 truncate">{isBooked ? isBooked.userName.split(' ')[0] : 'FREE'}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: NEW BOOKING */}
      {activeTab === 'new' && (
        <div className="max-w-xl mx-auto p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Create Direct Reservation</h3>
          </div>
          
          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Customer / Member Name</label>
                <input
                  type="text"
                  required
                  value={newCustomerName}
                  onChange={e => setNewCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Member Tier</label>
                <select
                  value={newTier}
                  onChange={e => setNewTier(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="gold">Gold Member (50% Off)</option>
                  <option value="silver">Silver Member (Standard Rate)</option>
                  <option value="junior">Junior Under-18 (Discounted)</option>
                  <option value="none">Non-member (Walk-in Full Rate)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Sport</label>
                <select
                  value={newSport}
                  onChange={e => { setNewSport(e.target.value as any); setNewCourtId(''); }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 capitalize focus:outline-none focus:border-cyan-500"
                >
                  {['tennis', 'padel', 'football', 'cricket', 'badminton', 'running'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Court / Pitch</label>
                <select
                  value={newCourtId}
                  onChange={e => setNewCourtId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {courts.filter(c => c.sport === newSport && c.status === 'active').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Start Time (30-min steps)</label>
                <select
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  {['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {bookingFeedback && (
              <div className={`p-3 rounded-xl border flex items-center space-x-2 ${
                bookingFeedback.error 
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}>
                {bookingFeedback.error ? <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" /> : <Check className="w-4 h-4 shrink-0 text-emerald-400" />}
                <span>{bookingFeedback.text}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all"
            >
              Verify Collision &amp; Confirm Reservation
            </button>
          </form>
        </div>
      )}

      {/* TAB: TODAY'S BOOKINGS & UPCOMING & HISTORY */}
      {(activeTab === 'today' || activeTab === 'upcoming' || activeTab === 'history') && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h4 className="text-sm font-bold text-white">
              {activeTab === 'today' ? "Today's Active Reservations" :
               activeTab === 'upcoming' ? "Upcoming Scheduled Bookings" : "Complete Historical Booking Ledger"}
            </h4>

            <div className="flex items-center space-x-2">
              <select
                value={selectedSportFilter}
                onChange={e => setSelectedSportFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">All Sports</option>
                <option value="tennis">Tennis</option>
                <option value="padel">Padel</option>
                <option value="football">Football</option>
                <option value="cricket">Cricket</option>
                <option value="badminton">Badminton</option>
                <option value="running">Running</option>
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Filter reservation..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] font-mono">
                <tr>
                  <th className="pb-3 px-3">Booking ID</th>
                  <th className="pb-3 px-3">Court / Surface</th>
                  <th className="pb-3 px-3">Sport</th>
                  <th className="pb-3 px-3">Customer / Member</th>
                  <th className="pb-3 px-3">Slot Time</th>
                  <th className="pb-3 px-3">Fee</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(activeTab === 'today' ? filteredBookings : activeTab === 'upcoming' ? upcomingBookings : bookings).map(b => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-cyan-400 font-semibold">{b.id}</td>
                    <td className="py-3 px-3 font-bold text-white">{b.courtName}</td>
                    <td className="py-3 px-3 capitalize text-slate-300">{b.sport}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{b.userName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{b.userTier.toUpperCase()} MEMBER</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-200">{b.date} ({b.startTime} - {b.endTime})</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">₹{b.amount.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        b.status === 'CHECKED-IN' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                        b.status === 'BOOKED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        b.status === 'COMPLETED' ? 'bg-slate-800 text-slate-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      {b.status === 'BOOKED' && (
                        <button
                          onClick={() => checkInBooking(b.id)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-bold"
                        >
                          Check-in
                        </button>
                      )}
                      {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
                        <button
                          onClick={() => cancelBooking(b.id)}
                          className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px]"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: CANCELLATIONS */}
      {activeTab === 'cancellations' && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Cancellations &amp; Reschedule Log</span>
          </h4>
          <div className="space-y-3">
            {cancelledBookings.map(b => (
              <div key={b.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{b.courtName} &bull; {b.userName}</div>
                  <div className="text-slate-400 font-mono mt-0.5">{b.date} at {b.startTime} - {b.endTime}</div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    CANCELLED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: CHECK-IN TERMINAL */}
      {activeTab === 'checkin' && (
        <div className="max-w-md mx-auto p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-2xl space-y-5 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <QrCode className="w-7 h-7 text-cyan-400 animate-pulse" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Front Desk QR &amp; ID Check-in Terminal</h3>
            <p className="text-xs text-slate-400 mt-1">Scan player pass QR code or type booking ID / player name</p>
          </div>

          <form onSubmit={handleDirectCheckIn} className="space-y-3">
            <input
              type="text"
              value={checkInInput}
              onChange={e => setCheckInInput(e.target.value)}
              placeholder="e.g. bkg-01 or Alexander Wright"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all"
            >
              Verify &amp; Admit Player
            </button>
          </form>

          {checkInMsg && (
            <div className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 text-left ${
              checkInMsg.error ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
            }`}>
              {checkInMsg.error ? <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />}
              <span>{checkInMsg.text}</span>
            </div>
          )}
        </div>
      )}

      {/* TAB: COURTS INVENTORY */}
      {activeTab === 'courts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courts.map(c => (
            <div key={c.id} className="p-5 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 space-y-3 shadow-xl">
              <div className="flex justify-between items-start">
                <span className="font-bold text-white text-sm">{c.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-mono">
                  {c.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">Sport: <strong className="text-cyan-400 capitalize">{c.sport}</strong></p>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Standard Rate:</span>
                  <span className="text-white font-mono font-bold">₹{c.hourlyRate}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Member Privilege:</span>
                  <span className="text-emerald-400 font-mono font-bold">₹{c.memberHourlyRate}/hr</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: FRIDAY SOCIAL PLAY (RULE 34) */}
      {activeTab === 'social' && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/30 uppercase font-mono mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>COMMUNITY PLAY &bull; RULE 34</span>
              </div>
              <h3 className="text-xl font-bold text-white">Friday Night Social Play &amp; Match Assignment</h3>
              <p className="text-xs text-slate-400 mt-0.5">Automated partner pairing, attendance roster, and courtside social mixing</p>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs font-bold text-pink-300">
              Capacity: 38 / 48 Enrolled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono uppercase font-bold text-[10px]">Session Schedule</span>
              <div className="text-sm font-bold text-white">Friday, 18:30 - 21:30</div>
              <p className="text-slate-400">Courts 1-4 Tennis, Padel 1-2, Badminton Hall</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono uppercase font-bold text-[10px]">Refreshments &amp; Bar</span>
              <div className="text-sm font-bold text-white">DJ Set + Welcome Mocktail</div>
              <p className="text-slate-400">20% Gold Member Bar Discount active</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono uppercase font-bold text-[10px]">Attendance</span>
              <div className="text-sm font-bold text-emerald-400">100% Full Attendance Expected</div>
              <p className="text-slate-400">Waitlist opens automatically when full</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: REPORTS */}
      {activeTab === 'reports' && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Court Utilization &amp; Booking Revenue Analytics</h4>
            <button
              onClick={() => alert('Generating Booking_Utilization_Report.pdf')}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-glow-cyan"
            >
              Export Report
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono uppercase font-bold text-[10px]">Utilization by Sport</span>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between font-mono"><span>Tennis:</span><strong className="text-white">88%</strong></div>
                <div className="flex justify-between font-mono"><span>Padel:</span><strong className="text-white">96% (Highest demand)</strong></div>
                <div className="flex justify-between font-mono"><span>Football:</span><strong className="text-white">74%</strong></div>
                <div className="flex justify-between font-mono"><span>Badminton:</span><strong className="text-white">81%</strong></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono uppercase font-bold text-[10px]">Cancellation Metrics</span>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between font-mono"><span>Total Cancellations:</span><strong className="text-white">4.2%</strong></div>
                <div className="flex justify-between font-mono"><span>Rescheduled:</span><strong className="text-emerald-400">89% Recovered</strong></div>
                <div className="flex justify-between font-mono"><span>Weather-Proof Indoor Courts:</span><strong className="text-cyan-400">0% Rainout</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
