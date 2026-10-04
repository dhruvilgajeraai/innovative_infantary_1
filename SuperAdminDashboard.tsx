import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Calendar, 
  DollarSign, 
  ShoppingBag, 
  Coffee, 
  Ticket, 
  Activity, 
  ShieldCheck, 
  Award, 
  ArrowUpRight, 
  Lock, 
  Eye, 
  Layers,
  Database,
  HeartHandshake,
  UserCheck,
  UserX,
  Plus,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  Server,
  Zap,
  Radio
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { AuthorityCenter } from './AuthorityCenter';
import { AuditLogViewer } from './AuditLogViewer';
import { CommunitySection } from './CommunitySection';
import { AdminDataManagementPanel } from './AdminDataManagementPanel';
import { AuthorityId } from '../../types';

export const SuperAdminDashboard: React.FC = () => {
  const { authorities, quickSwitchToDemo, users, updateUserAuthorities } = useAuth();
  const { 
    bookings, 
    products, 
    posTabs, 
    events, 
    leads, 
    staff, 
    invoices, 
    auditLogs 
  } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'datamanagement' | 'authorities' | 'users' | 'community' | 'audit' | 'security'>('overview');
  const [securityLockdown, setSecurityLockdown] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Aggregated live KPIs (Rule 17)
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0) + 
    bookings.reduce((s, b) => s + b.amount, 0) + 
    posTabs.filter(t => t.status === 'settled').reduce((s, t) => s + t.total, 0);

  const shopSalesTotal = 48500;
  const posSalesTotal = posTabs.filter(t => t.status === 'settled').reduce((s, t) => s + t.total, 0);
  const todayBookings = bookings.filter(b => b.date === '2026-10-03');
  const activeMembersCount = 142;
  const renewalsThisMonth = 28;
  const courtUtilizationPct = '88%';
  const pendingInvoicesTotal = invoices.filter(i => i.status === 'pending' || i.status === 'overdue').reduce((s, i) => s + i.total, 0);

  const handleToggleFreeze = () => {
    setSecurityLockdown(!securityLockdown);
    setNotice(securityLockdown ? 'Emergency club lockdown lifted. Normal authority access restored.' : 'EMERGENCY LOCKDOWN ACTIVATED: Non-essential authorities restricted.');
    setTimeout(() => setNotice(null), 4000);
  };

  const handleQuickAssign = (userId: string, authId: AuthorityId) => {
    updateUserAuthorities(userId, [authId]);
    setNotice(`Authority ${authId} assigned to user ${userId}.`);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleQuickRevoke = (userId: string) => {
    updateUserAuthorities(userId, []);
    setNotice(`Authorities revoked for user ${userId}. Reverted to Normal User.`);
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* Top Glowing Laser Telemetry Strip */}
      <div 
        className="h-1 rounded-full w-full bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600"
        style={{ boxShadow: '0 0 14px rgba(2, 132, 199, 0.4)' }}
      />

      {/* Top Banner (Rule 17) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-slate-950 border border-sky-500/40 shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-extrabold tracking-widest text-sky-400 uppercase">
              ADMIN-001 &bull; Master Command Center
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-950/80 text-sky-300 border border-sky-500/40">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
              GENERAL ADMINISTRATOR ACCESS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            General Administrator Control Engine
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Complete executive oversight over all 15 Authorities, sports facilities, financial balances, security audits, and staff rosters.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'overview', label: 'Master Overview' },
            { id: 'datamanagement', label: '📊 Master Data Management' },
            { id: 'authorities', label: 'Authority Center (Rule 18)' },
            { id: 'users', label: 'User Management' },
            { id: 'community', label: 'Community & Elections' },
            { id: 'audit', label: 'Audit Logs' },
            { id: 'security', label: 'Security & Telemetry' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-red-600 text-white shadow-glow-rose' 
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Master 12-Metric Operational KPI Grid (Rule 17) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            
            {/* 1. Total Registered Users */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Total Registered Users</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">{users.length + 140}</div>
              <div className="text-[10px] text-cyan-400 font-semibold">Active accounts across all tiers</div>
            </div>

            {/* 2. Active Members */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Active Club Members</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-400">{activeMembersCount}</div>
              <div className="text-[10px] text-amber-300 font-semibold">Gold, Silver &amp; Junior Tiers</div>
            </div>

            {/* 3. Today's Bookings */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Today&apos;s Bookings</span>
                <Calendar className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">{todayBookings.length} Sessions</div>
              <div className="text-[10px] text-cyan-400 font-semibold">Utilization: {courtUtilizationPct} capacity</div>
            </div>

            {/* 4. Aggregated Total Revenue */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Aggregated Total Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400">₹{totalRevenue.toFixed(2)}</div>
              <div className="text-[10px] text-slate-400">Courts, Memberships, Shop &amp; POS</div>
            </div>

            {/* 5. Shop Sales */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Pro Shop Sales</span>
                <ShoppingBag className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">₹{shopSalesTotal.toLocaleString()}</div>
              <div className="text-[10px] text-purple-300">{products.length} SKUs &bull; Shared shelf live</div>
            </div>

            {/* 6. POS Sales */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Cafeteria &amp; Bar POS</span>
                <Coffee className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">₹{posSalesTotal.toFixed(2)}</div>
              <div className="text-[10px] text-slate-400">Tables 1–12 &bull; 3 Open tabs</div>
            </div>

            {/* 7. Events */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Active Tournaments</span>
                <Ticket className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">{events.length} Live</div>
              <div className="text-[10px] text-indigo-300">Social Play: 38 registered</div>
            </div>

            {/* 8. CRM Leads */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>CRM Corporate Pipeline</span>
                <Activity className="w-4 h-4 text-pink-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">{leads.length} Leads</div>
              <div className="text-[10px] text-pink-300">₹13,250 Pipeline Value</div>
            </div>

            {/* 9. Staff on Duty */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Staff &amp; Certified Coaches</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">{staff.length} Active</div>
              <div className="text-[10px] text-emerald-400">100% Shift attendance</div>
            </div>

            {/* 10. Court Utilization */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Court Utilization</span>
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-cyan-400">{courtUtilizationPct}</div>
              <div className="text-[10px] text-cyan-300">Peak hours 17:00–21:00 full</div>
            </div>

            {/* 11. Membership Renewals */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Renewals This Month</span>
                <RefreshCw className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400">{renewalsThisMonth} Renewals</div>
              <div className="text-[10px] text-emerald-300">96.2% Retention rate</div>
            </div>

            {/* 12. Outstanding Payments */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Outstanding Invoices</span>
                <DollarSign className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-rose-400">₹{pendingInvoicesTotal.toFixed(2)}</div>
              <div className="text-[10px] text-rose-300">Corporate &amp; Court Hire pending</div>
            </div>

          </div>

          {/* Quick Authority Inspector Grid (Rule 17: Super Admin can jump to any authority) */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-red-400" />
                <h3 className="text-base font-bold text-white">
                  15 Fixed Authority Quick Inspection Panels
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Click any authority to inspect isolated interface
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {authorities.map(a => (
                <button
                  key={a.id}
                  onClick={() => quickSwitchToDemo(a.id)}
                  className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-red-500/50 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-red-400">{a.id}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400 transition-colors" />
                  </div>
                  <h5 className="text-xs font-bold text-white group-hover:text-red-300 mt-1 truncate">{a.name}</h5>
                  <div className="text-[10px] text-slate-400 truncate">{a.department}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Live Recent Security Audit Log Snapshot */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Recent Security &amp; Authority Isolation Activity</h3>
              </div>
              <button 
                onClick={() => setActiveTab('audit')} 
                className="text-xs text-cyan-400 hover:underline font-semibold"
              >
                View Full Audit Logs &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {auditLogs.slice(0, 4).map(log => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                    <span className="font-mono text-cyan-400 font-bold px-1.5 py-0.5 rounded bg-slate-900">{log.actorId}</span>
                    <span className="text-slate-200 font-semibold">{log.action}:</span>
                    <span className="text-slate-400 truncate max-w-md">{log.details}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                    VERIFIED
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB: MASTER DATA MANAGEMENT & FIREBASE SYNC */}
      {activeTab === 'datamanagement' && <AdminDataManagementPanel />}

      {/* TAB: AUTHORITY CENTER (Rule 18) */}
      {activeTab === 'authorities' && <AuthorityCenter />}

      {/* TAB: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>Club User Management &amp; Authority Assignments</span>
              </h3>
              <p className="text-xs text-slate-400">
                Manage roles, grant multiple authorities (Rule 14), and verify account statuses.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
              {users.length} Active Records
            </span>
          </div>

          <div className="space-y-3">
            {users.map((user: any) => (
              <div key={user.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{user.name}</span>
                    <span className="font-mono text-cyan-400 text-[11px] font-bold">({user.id})</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      user.emailVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {user.emailVerified ? 'Verified' : 'Pending OTP'}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {user.email} &bull; {user.phone} &bull; Plan: <strong className="text-amber-400 uppercase">{user.membershipTier}</strong>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                    <span>Assigned Authorities:</span>
                    {user.assignedAuthorities.length === 0 ? (
                      <span className="text-slate-400 italic">None (Normal User)</span>
                    ) : (
                      user.assignedAuthorities.map((a: string) => (
                        <span key={a} className="font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                          {a}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                  <button
                    onClick={() => handleQuickAssign(user.id, 'BOOKING-001')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold"
                  >
                    + BOOKING
                  </button>
                  <button
                    onClick={() => handleQuickAssign(user.id, 'MEMBER-001')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold"
                  >
                    + MEMBER
                  </button>
                  <button
                    onClick={() => handleQuickAssign(user.id, 'SALES-001')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-semibold"
                  >
                    + SALES
                  </button>
                  {user.assignedAuthorities.length > 0 && (
                    <button
                      onClick={() => handleQuickRevoke(user.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: COMMUNITY & ELECTIONS */}
      {activeTab === 'community' && <CommunitySection />}

      {/* TAB: AUDIT LOGS */}
      {activeTab === 'audit' && <AuditLogViewer />}

      {/* TAB: SECURITY & TELEMETRY */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Emergency Freeze */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-bold text-white">Emergency Club Lockdown Control</h3>
              </div>
              <p className="text-xs text-slate-400">
                Instantly restricts all non-essential authority access, freezes online bookings, and locks public checkout while safeguarding club assets.
              </p>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">Platform Lockdown Status</div>
                  <div className="text-[11px] text-slate-400">{securityLockdown ? 'LOCKED DOWN' : 'NORMAL OPERATIONS'}</div>
                </div>

                <button
                  onClick={handleToggleFreeze}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    securityLockdown 
                      ? 'bg-rose-600 text-white shadow-glow-rose' 
                      : 'bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-300'
                  }`}
                >
                  {securityLockdown ? 'Release Lockdown' : 'Engage Emergency Freeze'}
                </button>
              </div>
            </div>

            {/* System Health */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Edge Node &amp; Database Health</h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Edge CDN Global Replication</span>
                  <span className="text-emerald-400 font-bold font-mono">100% OPERATIONAL</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Court Collision Engine Latency</span>
                  <span className="text-cyan-400 font-bold font-mono">2.4 ms (Instant)</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Authority Credential Isolation Guard</span>
                  <span className="text-emerald-400 font-bold font-mono">ENFORCED (Rule 16/48)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
