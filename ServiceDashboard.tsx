import React, { useState } from 'react';
import { 
  Headphones, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Users, 
  ShieldAlert, 
  Sparkles, 
  Filter, 
  Plus, 
  FileText, 
  ChevronRight, 
  Star, 
  AlertTriangle, 
  ThumbsUp, 
  Search,
  Calendar,
  Check,
  X,
  RefreshCw,
  PhoneCall
} from 'lucide-react';
import { SupportTicket } from '../../types';

interface ComplaintItem {
  id: string;
  memberId: string;
  memberName: string;
  category: 'Court Maintenance' | 'Lighting' | 'Locker Rooms' | 'Pro Shop' | 'POS Bar' | 'Booking System';
  severity: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  filedAt: string;
  status: 'pending' | 'under_investigation' | 'resolved';
  assignedTo: string;
}

interface FollowUpItem {
  id: string;
  ticketId: string;
  memberName: string;
  contactMethod: 'Phone Call' | 'In-Person Desk' | 'Email';
  scheduledDate: string;
  notes: string;
  completed: boolean;
}

const SEED_TICKETS: SupportTicket[] = [
  { id: 'TKT-1041', userId: 'usr-01', userName: 'Alexander Wright', subject: 'Locker #14 Combination Reset', category: 'facilities', priority: 'medium', status: 'resolved', createdAt: '2026-10-02 14:10', message: 'Combination was stuck on dial after swimming.', response: 'Reset provided at Front Desk with secondary physical master key override.' },
  { id: 'TKT-1042', userId: 'usr-02', userName: 'Elena Petrova', subject: 'Racket Stringing Tension Inquiry', category: 'gear_shop', priority: 'low', status: 'in_progress', createdAt: '2026-10-03 09:30', message: 'Need Babolat RPM Blast re-strung at 54 lbs before Saturday afternoon tournament match.' },
  { id: 'TKT-1043', userId: 'usr-03', userName: 'Jonathan Reed', subject: 'Guest Pass Credit Missing on Account', category: 'membership', priority: 'high', status: 'open', createdAt: '2026-10-03 11:20', message: 'Renewed Gold pass yesterday but 4 guest passes are not yet credited in dashboard.' },
  { id: 'TKT-1044', userId: 'usr-04', userName: 'Meera Patel', subject: 'Padel Glass Court Lighting Flicker', category: 'facilities', priority: 'high', status: 'open', createdAt: '2026-10-03 12:45', message: 'Court 2 LED bank 4 flickers during evening matchplay sessions.' },
  { id: 'TKT-1045', userId: 'usr-05', userName: 'Marcus Sterling', subject: 'Corporate Friday Booking Invoice Adjustment', category: 'billing', priority: 'medium', status: 'resolved', createdAt: '2026-10-01 16:00', message: 'Requested split receipt for VAT reimbursement.', response: 'Corrected corporate tax invoice dispatched via Finance module.' }
];

const SEED_COMPLAINTS: ComplaintItem[] = [
  { id: 'CMP-201', memberId: 'usr-04', memberName: 'Meera Patel', category: 'Lighting', severity: 'high', description: 'Padel Court 2 floodlight strobe effect during night volley drills.', filedAt: '2026-10-03 12:50', status: 'under_investigation', assignedTo: 'Chief Facilities Engineer' },
  { id: 'CMP-202', memberId: 'usr-07', memberName: 'Vikram Joshi', category: 'Court Maintenance', severity: 'medium', description: 'Clay Court 1 baseline requires brush drag & hydration after heavy morning session.', filedAt: '2026-10-02 11:15', status: 'resolved', assignedTo: 'Groundskeeping Roster' },
  { id: 'CMP-203', memberId: 'usr-08', memberName: 'Sophie Zhang', category: 'POS Bar', severity: 'low', description: 'Wait time at coffee bar during peak 18:00 changeover exceeded 12 minutes.', filedAt: '2026-10-01 18:20', status: 'resolved', assignedTo: 'F&B Manager' }
];

const SEED_FOLLOWUPS: FollowUpItem[] = [
  { id: 'FOL-301', ticketId: 'TKT-1043', memberName: 'Jonathan Reed', contactMethod: 'Phone Call', scheduledDate: '2026-10-03 16:30', notes: 'Call member to confirm 4 Gold guest passes credited after Member Authority sync.', completed: false },
  { id: 'FOL-302', ticketId: 'TKT-1042', memberName: 'Elena Petrova', contactMethod: 'In-Person Desk', scheduledDate: '2026-10-03 17:00', notes: 'Notify player when Babolat racket stringing is dry & tested at 54 lbs.', completed: false },
  { id: 'FOL-303', ticketId: 'TKT-1041', memberName: 'Alexander Wright', contactMethod: 'Email', scheduledDate: '2026-10-02 18:00', notes: 'Check in on locker dial operational comfort.', completed: true }
];

export const ServiceDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'requests' | 'customers' | 'complaints' | 'followups' | 'history' | 'reports'>('dashboard');
  const [tickets, setTickets] = useState<SupportTicket[]>(SEED_TICKETS);
  const [complaints, setComplaints] = useState<ComplaintItem[]>(SEED_COMPLAINTS);
  const [followUps, setFollowUps] = useState<FollowUpItem[]>(SEED_FOLLOWUPS);
  
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');
  
  // New Request Form State
  const [showNewModal, setShowNewModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newCategory, setNewCategory] = useState<'facilities' | 'gear_shop' | 'membership' | 'billing'>('facilities');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newMessage, setNewMessage] = useState('');

  // Metrics
  const openRequests = tickets.filter(t => t.status === 'open').length;
  const inProgressRequests = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedRequests = tickets.filter(t => t.status === 'resolved').length;
  const pendingComplaints = complaints.filter(c => c.status !== 'resolved').length;
  const avgResolutionTime = '16 mins';
  const serviceSatisfaction = '98.4%';

  const handleResolveTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { 
      ...t, 
      status: 'resolved', 
      response: replyText.trim() || 'Ticket reviewed and marked as resolved by Member Care Desk.' 
    } : t));
    setSelectedTicketId(null);
    setReplyText('');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMemberName.trim()) return;

    const newTicket: SupportTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: `usr-${Date.now().toString().slice(-4)}`,
      userName: newMemberName,
      subject: newSubject,
      category: newCategory,
      priority: newPriority,
      status: 'open',
      createdAt: '2026-10-03 14:00',
      message: newMessage
    };

    setTickets(prev => [newTicket, ...prev]);
    setShowNewModal(false);
    setNewSubject('');
    setNewMemberName('');
    setNewMessage('');
  };

  const toggleFollowUp = (id: string) => {
    setFollowUps(prev => prev.map(f => f.id === id ? { ...f, completed: !f.completed } : f));
  };

  const resolveComplaint = (id: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'resolved' } : c));
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* Top Glowing Laser Telemetry Strip */}
      <div 
        className="h-1 rounded-full w-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600"
        style={{ boxShadow: '0 0 14px rgba(245, 158, 11, 0.6)' }}
      />

      {/* Header Banner & Rule 31 Security Isolation Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold tracking-widest text-amber-400 uppercase">
              SERVICE-001 &bull; Member Services &amp; Concierge Desk
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              SLA GUARD ACTIVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            Member Care &amp; Service Terminal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Omnichannel concierge support, court complaints escalation, gear inquiries, and real-time SLA telemetry.
          </p>
        </div>

        {/* Rule 31 Strict Isolation Tag */}
        <div className="flex items-center space-x-2 bg-slate-950/80 px-3.5 py-2 rounded-2xl border border-slate-800 text-[11px] text-slate-400">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Rule 31: Service Authority isolated from Finance, Sales &amp; Staff records.</span>
        </div>
      </div>

      {/* Rule 55 Contextual Guidance Bar */}
      <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Service SLA Standard:</strong> Respond to urgent court complaints within 15 minutes. Resolve gear stringing and locker tickets same-day.
          </span>
        </div>
        <button 
          onClick={() => setShowNewModal(true)}
          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-glow-amber shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Member Request</span>
        </button>
      </div>

      {/* Rule 31 Seven Mandatory Menu Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-2 scrollbar-none">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'requests', label: `Requests (${openRequests + inProgressRequests})` },
          { id: 'customers', label: 'Customers' },
          { id: 'complaints', label: `Complaints (${pendingComplaints})` },
          { id: 'followups', label: 'Follow-ups' },
          { id: 'history', label: 'History' },
          { id: 'reports', label: 'Reports' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeMenu === item.id 
                ? 'bg-amber-500 text-slate-950 shadow-glow-amber' 
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* TAB: DASHBOARD */}
      {activeMenu === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Rule 31 Metrics: 7 Core Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px]">Open Requests</div>
              <div className="text-2xl font-bold font-mono text-rose-400">{openRequests}</div>
              <div className="text-[10px] text-rose-300">Requires triage</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px]">In Progress</div>
              <div className="text-2xl font-bold font-mono text-amber-400">{inProgressRequests}</div>
              <div className="text-[10px] text-amber-300">Active handling</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px]">Resolved Requests</div>
              <div className="text-2xl font-bold font-mono text-emerald-400">{resolvedRequests}</div>
              <div className="text-[10px] text-emerald-300">This cycle</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px]">Pending Complaints</div>
              <div className="text-2xl font-bold font-mono text-orange-400">{pendingComplaints}</div>
              <div className="text-[10px] text-orange-300">Facilities / Courts</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px]">Customer Feedback</div>
              <div className="text-2xl font-bold font-mono text-cyan-400">4.9 / 5.0</div>
              <div className="text-[10px] text-cyan-300">92 Member reviews</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px]">Avg Resolution</div>
              <div className="text-2xl font-bold font-mono text-white">{avgResolutionTime}</div>
              <div className="text-[10px] text-slate-500">Under 1hr target</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px]">Satisfaction</div>
              <div className="text-2xl font-bold font-mono text-emerald-400">{serviceSatisfaction}</div>
              <div className="text-[10px] text-emerald-300 font-semibold">Tier-1 Club standard</div>
            </div>
          </div>

          {/* Quick Dual Columns: Active Inquiries & High Severity Complaints */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Active Tickets Snapshot */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Headphones className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Live Member Inquiries</h3>
                </div>
                <button onClick={() => setActiveMenu('requests')} className="text-xs text-amber-400 hover:underline">
                  View All ({tickets.length}) &rarr;
                </button>
              </div>

              <div className="space-y-2.5">
                {tickets.slice(0, 3).map(t => (
                  <div key={t.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-amber-400 font-bold">{t.id}</span>
                        <span className="font-bold text-white">{t.subject}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' :
                        t.status === 'in_progress' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] line-clamp-1">{t.message}</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                      <span>{t.userName} &bull; {t.createdAt}</span>
                      <span className="capitalize text-slate-400">Dept: {t.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Complaints Under Escalation */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  <h3 className="text-base font-bold text-white">Priority Facility Complaints</h3>
                </div>
                <button onClick={() => setActiveMenu('complaints')} className="text-xs text-amber-400 hover:underline">
                  Inspect All &rarr;
                </button>
              </div>

              <div className="space-y-2.5">
                {complaints.map(c => (
                  <div key={c.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{c.category}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.severity === 'high' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {c.severity}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{c.description}</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>Assigned: <strong className="text-slate-400">{c.assignedTo}</strong></span>
                      <span className="text-amber-400 font-semibold uppercase">{c.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB: REQUESTS */}
      {activeMenu === 'requests' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search ticket ID, member, keyword..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {(['all', 'open', 'in_progress', 'resolved'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs capitalize font-bold transition-all ${
                    statusFilter === st 
                      ? 'bg-amber-500 text-slate-950' 
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-3">
            {filteredTickets.map(t => (
              <div key={t.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-amber-400 font-bold text-xs">{t.id}</span>
                    <h4 className="font-bold text-white text-sm">{t.subject}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.priority === 'high' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase self-start sm:self-auto ${
                    t.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' :
                    t.status === 'in_progress' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {t.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">{t.message}</p>

                {t.response && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs space-y-1">
                    <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolution Response:</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{t.response}</p>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-800">
                  <span>Member: <strong className="text-slate-300">{t.userName}</strong> &bull; {t.createdAt}</span>
                  {t.status !== 'resolved' && (
                    <button
                      onClick={() => setSelectedTicketId(t.id)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-glow-amber transition-all"
                    >
                      Reply &amp; Mark Resolved
                    </button>
                  )}
                </div>

                {selectedTicketId === t.id && (
                  <div className="pt-3 space-y-2 border-t border-slate-800/80">
                    <textarea
                      rows={2}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Type official member service resolution note..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedTicketId(null)}
                        className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleResolveTicket(t.id)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                      >
                        Submit Resolution
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB: CUSTOMERS */}
      {activeMenu === 'customers' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Active Service Directory &bull; High Touch Members</h3>
              <p className="text-xs text-slate-400">Concierge profiles, sports preferences, and service interaction logs.</p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
              4 Accounts Tracked
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'usr-01', name: 'Alexander Wright', tier: 'Gold Tier', sport: 'Tennis / Swimming', tickets: 3, sat: '5.0 / 5.0' },
              { id: 'usr-02', name: 'Elena Petrova', tier: 'Silver Tier', sport: 'Tennis (Competitive)', tickets: 2, sat: '4.8 / 5.0' },
              { id: 'usr-03', name: 'Jonathan Reed', tier: 'Gold Tier', sport: 'Padel / Fitness', tickets: 4, sat: '4.9 / 5.0' },
              { id: 'usr-04', name: 'Meera Patel', tier: 'Gold Tier', sport: 'Padel / Badminton', tickets: 2, sat: '4.7 / 5.0' }
            ].map(c => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h5 className="font-bold text-white text-sm">{c.name}</h5>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                      {c.tier}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Focus: {c.sport}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Interaction Count: {c.tickets} Service Inquiries</div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                    <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                    <span>{c.sat}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Member Rating</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: COMPLAINTS */}
      {activeMenu === 'complaints' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Facility &amp; Operations Complaints Log</h3>
              <p className="text-xs text-slate-400">Formal grievance tracking with automated engineering escalation.</p>
            </div>
            <span className="text-xs text-orange-400 font-bold bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
              {pendingComplaints} Unresolved
            </span>
          </div>

          <div className="space-y-3">
            {complaints.map(c => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-amber-400 font-bold text-xs">{c.id}</span>
                    <span className="font-bold text-white text-sm">{c.category}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      c.severity === 'high' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {c.severity} Severity
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    c.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-300'
                  }`}>
                    {c.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-slate-300 text-xs">{c.description}</p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/80 gap-2">
                  <span>Reported by: <strong className="text-slate-300">{c.memberName}</strong> &bull; Assigned to: <strong className="text-slate-300">{c.assignedTo}</strong></span>
                  {c.status !== 'resolved' && (
                    <button
                      onClick={() => resolveComplaint(c.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/40"
                    >
                      Mark Resolved by Staff
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: FOLLOW-UPS */}
      {activeMenu === 'followups' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Concierge Follow-up Schedule</h3>
              <p className="text-xs text-slate-400">Scheduled phone calls, desk check-ins, and resolution verifications.</p>
            </div>
            <span className="text-xs text-cyan-400 font-bold bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
              {followUps.filter(f => !f.completed).length} Pending Follow-ups
            </span>
          </div>

          <div className="space-y-3">
            {followUps.map(f => (
              <div key={f.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-amber-400 font-bold text-xs">{f.id}</span>
                    <span className="font-bold text-white text-sm">{f.memberName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-300">
                      {f.contactMethod}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{f.notes}</p>
                  <div className="text-[10px] text-slate-500">Scheduled: {f.scheduledDate} &bull; Linked: {f.ticketId}</div>
                </div>

                <button
                  onClick={() => toggleFollowUp(f.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shrink-0 ${
                    f.completed 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                      : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-glow-amber'
                  }`}
                >
                  {f.completed ? '✓ Completed' : 'Mark Done'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: HISTORY */}
      {activeMenu === 'history' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Archived Resolutions &amp; Service Ledger</h3>
          <p className="text-xs text-slate-400">Chronological audit log of all handled inquiries and member feedbacks.</p>

          <div className="space-y-2">
            {tickets.filter(t => t.status === 'resolved').map(t => (
              <div key={t.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-amber-400 font-bold">{t.id}</span>
                    <span className="font-bold text-white">{t.subject}</span>
                    <span className="text-[10px] text-slate-500">({t.userName})</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{t.response}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 uppercase">
                  RESOLVED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: REPORTS */}
      {activeMenu === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Department Resolution SLA Audit</h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Facilities &amp; Locker Rooms</span>
                  <span className="font-mono text-emerald-400 font-bold">14 mins avg</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[92%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Pro Gear Shop Re-Stringing</span>
                  <span className="font-mono text-amber-400 font-bold">2.4 hrs avg</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className="h-full bg-amber-500 w-[78%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Court Floodlight &amp; Net Issues</span>
                  <span className="font-mono text-rose-400 font-bold">18 mins avg</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className="h-full bg-rose-500 w-[88%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Member CSAT Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-300">5-Star Flawless Rating</span>
                <span className="text-xs font-mono font-bold text-emerald-400">84% (77 Reviews)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-300">4-Star Satisfied Rating</span>
                <span className="text-xs font-mono font-bold text-cyan-400">14% (13 Reviews)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-300">3-Star or Below Rating</span>
                <span className="text-xs font-mono font-bold text-rose-400">2% (2 Reviews)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Member Request Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Log In-Person / Phone Inquiry</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white text-xs">
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 pt-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Member Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Davies"
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Subject / Inquiry Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Racket grip tape replacement"
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="facilities">Facilities</option>
                    <option value="gear_shop">Pro Gear Shop</option>
                    <option value="membership">Membership</option>
                    <option value="billing">Billing &amp; Fees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Describe member request in detail..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-glow-amber"
                >
                  Log Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
