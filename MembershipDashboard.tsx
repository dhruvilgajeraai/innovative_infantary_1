import React, { useState } from 'react';
import { 
  Award, 
  Users, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Plus, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Download,
  Flame,
  Clock
} from 'lucide-react';
import { MembershipTier } from '../../types';

type MemberTab = 
  | 'dashboard' 
  | 'members' 
  | 'plans' 
  | 'renewals' 
  | 'expiring' 
  | 'payments' 
  | 'reports';

interface MemberRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: MembershipTier;
  startDate: string;
  expiryDate: string;
  status: 'active' | 'expiring' | 'expired';
  monthlyFee: number;
}

const SEED_MEMBERS: MemberRecord[] = [
  { id: 'MEM-001', name: 'Jonathan Reed', email: 'jonathan.reed@gmail.com', phone: '+44 7700 900111', tier: 'gold', startDate: '2025-10-01', expiryDate: '2026-10-05', status: 'expiring', monthlyFee: 8500 },
  { id: 'MEM-002', name: 'Alexander Wright', email: 'alex.wright@gmail.com', phone: '+44 7700 900222', tier: 'silver', startDate: '2026-04-15', expiryDate: '2027-04-15', status: 'active', monthlyFee: 4500 },
  { id: 'MEM-003', name: 'Leo Sterling', email: 'leo.sterling@outlook.com', phone: '+44 7700 900333', tier: 'junior', startDate: '2026-02-01', expiryDate: '2027-02-01', status: 'active', monthlyFee: 2500 },
  { id: 'MEM-004', name: 'Dr. Helen Carter', email: 'helen.carter@hospital.nhs.uk', phone: '+44 7700 900444', tier: 'gold', startDate: '2026-01-10', expiryDate: '2027-01-10', status: 'active', monthlyFee: 8500 },
  { id: 'MEM-005', name: 'Marcus Bennet', email: 'marcus.bennet@gmail.com', phone: '+44 7700 900555', tier: 'silver', startDate: '2025-09-01', expiryDate: '2026-09-01', status: 'expired', monthlyFee: 4500 },
  { id: 'MEM-006', name: 'Emma Watson', email: 'emma.w@thestudio.co.uk', phone: '+44 7700 900666', tier: 'gold', startDate: '2026-07-01', expiryDate: '2027-07-01', status: 'active', monthlyFee: 8500 },
];

export const MembershipDashboard: React.FC = () => {
  const [members, setMembers] = useState<MemberRecord[]>(SEED_MEMBERS);
  const [activeTab, setActiveTab] = useState<MemberTab>('dashboard');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const activeCount = members.filter(m => m.status === 'active').length;
  const expiringCount = members.filter(m => m.status === 'expiring').length;
  const monthlyRevenue = members.filter(m => m.status !== 'expired').reduce((s, m) => s + m.monthlyFee, 0);

  const filteredMembers = members.filter(m => {
    const matchesTier = filterTier === 'all' || m.tier === filterTier;
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.email.toLowerCase().includes(search.toLowerCase()) ||
                          m.id.toLowerCase().includes(search.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const handleRenew = (id: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, status: 'active', expiryDate: '2027-10-05' };
      }
      return m;
    }));
    setNotice(`Membership renewed for 12 months for member ${id}.`);
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* 1. TOP SCI-FI IRON MAN HUD TELEMETRY BAR & GUIDANCE */}
      <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-emerald-500"
          style={{ boxShadow: '0 0 12px rgba(245, 158, 11, 0.6)' }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>MEMBERSHIP AUTHORITY // MEMBER-001</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] font-mono text-emerald-400">BENEFITS ENGINE ACTIVE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
              Member Registry, Plans &amp; Renewal Engine
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              <strong>Contextual Guidance (Rule 22, 35 &amp; 55):</strong> Manage member subscription privileges, digital club cards, automated 30-day renewal alerts, and tier benefits (50% court discount for Gold, 20% bar discount).
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('plans')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/20 transition-all"
            >
              Membership Plans
            </button>
          </div>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* 2. METRIC TELEMETRY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Active Members</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{activeCount} Athletes</div>
          <div className="text-[10px] text-slate-400">Gold, Silver &amp; Junior</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Expiring in 30 Days</div>
          <div className="text-2xl font-bold font-mono text-amber-400">{expiringCount} Accounts</div>
          <div className="text-[10px] text-amber-300">Renewal reminders sent</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Recurring Monthly MRR</div>
          <div className="text-2xl font-bold font-mono text-white">₹{monthlyRevenue.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 font-semibold">+14.2% YoY growth</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Member Retention Rate</div>
          <div className="text-2xl font-bold font-mono text-cyan-400">96.4%</div>
          <div className="text-[10px] text-cyan-300 font-semibold">Industry benchmark: 82%</div>
        </div>
      </div>

      {/* 3. MENU TABS (RULE 22 SPECIFIED MENUS) */}
      <div className="flex border-b border-slate-800/80 pb-2 gap-1.5 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'members', label: `Members (${members.length})` },
          { id: 'plans', label: 'Membership Plans' },
          { id: 'renewals', label: 'Renewals' },
          { id: 'expiring', label: `Expiring (${expiringCount})` },
          { id: 'payments', label: 'Payments' },
          { id: 'reports', label: 'Reports' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as MemberTab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: DASHBOARD & MEMBERS DIRECTORY */}
      {(activeTab === 'dashboard' || activeTab === 'members') && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h4 className="text-sm font-bold text-white">Registered Club Athletes &amp; Members</h4>

            <div className="flex items-center space-x-2">
              <select
                value={filterTier}
                onChange={e => setFilterTier(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">All Tiers</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="junior">Junior</option>
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search member..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] font-mono">
                <tr>
                  <th className="pb-3 px-3">Member ID</th>
                  <th className="pb-3 px-3">Full Name</th>
                  <th className="pb-3 px-3">Tier</th>
                  <th className="pb-3 px-3">Monthly Fee</th>
                  <th className="pb-3 px-3">Start Date</th>
                  <th className="pb-3 px-3">Expiry Date</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMembers.map(m => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-cyan-400 font-semibold">{m.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{m.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{m.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                        m.tier === 'gold' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        m.tier === 'silver' ? 'bg-slate-800 text-slate-300 border border-slate-700' :
                        'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {m.tier}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">₹{m.monthlyFee}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{m.startDate}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{m.expiryDate}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                        m.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                        m.status === 'expiring' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {m.status === 'expiring' && (
                        <button
                          onClick={() => handleRenew(m.id)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold font-mono"
                        >
                          Renew +12M
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

      {/* TAB CONTENT: MEMBERSHIP PLANS (RULE 35) */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-amber-500/40 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">PREMIUM VIP TIER</span>
                <h3 className="text-xl font-bold text-white mt-1">Gold Championship</h3>
              </div>
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400"><Award className="w-5 h-5" /></span>
            </div>
            <div className="text-3xl font-display font-black text-white">₹8,500 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="flex items-center gap-2">&check; 50% Off all Court Bookings</div>
              <div className="flex items-center gap-2">&check; 20% Bar &amp; Cafeteria Discount</div>
              <div className="flex items-center gap-2">&check; Free Tartan Running Track Pass</div>
              <div className="flex items-center gap-2">&check; 4 Complimentary Guest Passes / Year</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">STANDARD CLUB TIER</span>
                <h3 className="text-xl font-bold text-white mt-1">Silver Athlete</h3>
              </div>
              <span className="p-2 rounded-xl bg-slate-800 text-slate-300"><Sparkles className="w-5 h-5" /></span>
            </div>
            <div className="text-3xl font-display font-black text-white">₹4,500 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="flex items-center gap-2">&check; 25% Off Court Bookings</div>
              <div className="flex items-center gap-2">&check; 10% Bar &amp; Pro Shop Discount</div>
              <div className="flex items-center gap-2">&check; Priority 7-Day Advance Slot Booking</div>
              <div className="flex items-center gap-2">&check; Friday Social Play Admission</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-cyan-500/40 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">YOUTH &amp; ACADEMY</span>
                <h3 className="text-xl font-bold text-white mt-1">Junior Under-18</h3>
              </div>
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400"><Users className="w-5 h-5" /></span>
            </div>
            <div className="text-3xl font-display font-black text-white">₹2,500 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="flex items-center gap-2">&check; Weekend Coaching Masterclass Access</div>
              <div className="flex items-center gap-2">&check; Subsidized Badminton &amp; Padel Rates</div>
              <div className="flex items-center gap-2">&check; Certified Youth Coaching Supervision</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: RENEWALS & EXPIRING */}
      {(activeTab === 'renewals' || activeTab === 'expiring') && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white">Expiring Accounts &amp; Automated Outreach</h4>
          <div className="space-y-3">
            {members.filter(m => m.status === 'expiring').map(m => (
              <div key={m.id} className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{m.name} &bull; {m.id}</div>
                  <div className="text-amber-400 font-mono mt-0.5">Expires: {m.expiryDate} (Action Required)</div>
                </div>
                <button
                  onClick={() => handleRenew(m.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-glow-amber"
                >
                  Renew Membership +1 Year
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PAYMENTS & REPORTS */}
      {(activeTab === 'payments' || activeTab === 'reports') && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Membership Recurring Revenue &amp; Churn Reports</h4>
            <button
              onClick={() => alert('Exporting Membership_Annual_Audit.csv')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-glow-amber"
            >
              Export Member Ledger
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Tier Distribution</span>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between"><span>Gold VIP:</span><strong className="text-white">48%</strong></div>
                <div className="flex justify-between"><span>Silver Standard:</span><strong className="text-white">38%</strong></div>
                <div className="flex justify-between"><span>Junior Academy:</span><strong className="text-white">14%</strong></div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Annual Renewal Conversion</span>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between"><span>Auto-Renew Enrolled:</span><strong className="text-emerald-400">92.4%</strong></div>
                <div className="flex justify-between"><span>Average LTV:</span><strong className="text-white">₹84,000 / athlete</strong></div>
                <div className="flex justify-between"><span>Payment Success Rate:</span><strong className="text-cyan-400">99.8%</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
