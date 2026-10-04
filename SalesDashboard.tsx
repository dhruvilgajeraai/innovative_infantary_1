import React, { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  Users, 
  Award, 
  PhoneCall, 
  CheckCircle2, 
  Sparkles, 
  DollarSign, 
  ArrowUpRight,
  Filter,
  Search,
  Calendar,
  ShoppingBag,
  Download,
  ShieldCheck,
  ChevronRight,
  Clock,
  Briefcase
} from 'lucide-react';
import { useData } from '../../context/DataContext';

type SalesTab = 
  | 'dashboard' 
  | 'leads' 
  | 'prospects' 
  | 'trials' 
  | 'customers' 
  | 'membership_sales' 
  | 'product_sales' 
  | 'followups' 
  | 'reports';

export const SalesDashboard: React.FC = () => {
  const { leads, businessClients } = useData();

  const [activeTab, setActiveTab] = useState<SalesTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [reportExportMsg, setReportExportMsg] = useState<string | null>(null);

  const monthlyTarget = 250000;
  const currentSalesAchieved = 184500;
  const targetPct = Math.round((currentSalesAchieved / monthlyTarget) * 100);

  const newLeads = leads.filter(l => l.status === 'NEW');
  const contactedLeads = leads.filter(l => l.status === 'CONTACTED');
  const trialLeads = leads.filter(l => l.status === 'TRIAL');
  const proposalLeads = leads.filter(l => l.status === 'PROPOSAL');
  const convertedLeads = leads.filter(l => l.status === 'CONVERTED');

  const handleExport = (format: string) => {
    setReportExportMsg(`Generating secure Sales_Revenue_Report_${format.toUpperCase()}. Authorized for SALES-001.`);
    setTimeout(() => setReportExportMsg(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* 1. TOP SCI-FI IRON MAN HUD TELEMETRY BAR & GUIDANCE */}
      <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500"
          style={{ boxShadow: '0 0 12px rgba(245, 158, 11, 0.6)' }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>SALES AUTHORITY // SALES-001</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] font-mono text-slate-400">DATA ISOLATION ACTIVE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
              Sales Command &amp; Revenue Conversion
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              <strong>Contextual Guidance:</strong> Move leads through the pipeline from New Lead to Converted. Track trial evaluations, membership package upgrades, and sales targets without cross-authority leakage.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport('csv')}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/20 transition-all"
            >
              + Quick Lead
            </button>
          </div>
        </div>
      </div>

      {reportExportMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{reportExportMsg}</span>
        </div>
      )}

      {/* 2. METRIC TELEMETRY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Monthly Sales Target</div>
          <div className="text-2xl font-bold font-mono text-cyan-400">₹{currentSalesAchieved.toLocaleString()}</div>
          <div className="text-[10px] text-cyan-300 font-semibold">{targetPct}% of ₹{monthlyTarget.toLocaleString()} quota</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Active Trials</div>
          <div className="text-2xl font-bold font-mono text-amber-400">{trialLeads.length} Scheduled</div>
          <div className="text-[10px] text-amber-300">Coached assessment slots</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Pending Follow-ups</div>
          <div className="text-2xl font-bold font-mono text-white">{contactedLeads.length + proposalLeads.length} Enquiries</div>
          <div className="text-[10px] text-slate-400">High-priority proposals</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Sales Conversion</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">32.8%</div>
          <div className="text-[10px] text-emerald-300 font-semibold">+4.2% MoM lift</div>
        </div>
      </div>

      {/* 3. MENU TABS (RULE 20 SPECIFIED MENUS) */}
      <div className="flex border-b border-slate-800/80 pb-2 gap-1.5 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'leads', label: `Leads (${leads.length})` },
          { id: 'prospects', label: 'Prospects' },
          { id: 'trials', label: `Trials (${trialLeads.length})` },
          { id: 'customers', label: `Customers (${convertedLeads.length})` },
          { id: 'membership_sales', label: 'Membership Sales' },
          { id: 'product_sales', label: 'Product Sales' },
          { id: 'followups', label: 'Follow-ups' },
          { id: 'reports', label: 'Sales Reports' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SalesTab)}
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

      {/* TAB CONTENT: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" />
              <span>Q4 Revenue Target Progress</span>
            </h4>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Target (₹{monthlyTarget.toLocaleString()})</span>
                <span className="text-amber-400 font-bold">{targetPct}% Complete</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 rounded-full transition-all duration-700" 
                  style={{ width: `${targetPct}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span>Gold Annual Membership Sales:</span>
                <span className="font-mono font-bold text-white">₹102,000</span>
              </div>
              <div className="flex justify-between">
                <span>Silver Standard Membership Sales:</span>
                <span className="font-mono font-bold text-white">₹58,500</span>
              </div>
              <div className="flex justify-between">
                <span>Pro Shop Equipment Upgrades:</span>
                <span className="font-mono font-bold text-white">₹24,000</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Priority Sales Follow-ups</span>
              <span className="text-[10px] font-mono text-cyan-400">{contactedLeads.length + proposalLeads.length} Active</span>
            </h4>
            <div className="space-y-2.5">
              {[...contactedLeads, ...proposalLeads].slice(0, 4).map(l => (
                <div key={l.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{l.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{l.email} &bull; Est. ₹{l.value}</div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase">
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: LEADS & PROSPECTS */}
      {(activeTab === 'leads' || activeTab === 'prospects') && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h4 className="text-sm font-bold text-white">
              {activeTab === 'leads' ? 'Active Lead Inquiries' : 'Qualified High-Probability Prospects'}
            </h4>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] font-mono">
                <tr>
                  <th className="pb-3 px-3">Lead ID</th>
                  <th className="pb-3 px-3">Name</th>
                  <th className="pb-3 px-3">Contact</th>
                  <th className="pb-3 px-3">Sport Interest</th>
                  <th className="pb-3 px-3">Deal Value</th>
                  <th className="pb-3 px-3">Pipeline Stage</th>
                  <th className="pb-3 px-3 text-right">Rep</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leads.map(l => (
                  <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-cyan-400 font-semibold">{l.id}</td>
                    <td className="py-3 px-3 font-bold text-white">{l.name}</td>
                    <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">{l.email}</td>
                    <td className="py-3 px-3 capitalize text-slate-200">{l.interest}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">₹{l.value}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400">{l.assignedStaff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TRIALS */}
      {activeTab === 'trials' && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white">Prospects Booked for Court Trial Sessions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trialLeads.map(l => (
              <div key={l.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white text-sm">{l.name}</div>
                  <div className="text-slate-400 mt-0.5">{l.notes}</div>
                  <div className="text-[10px] text-cyan-400 mt-1 font-mono">Assigned Trainer: {l.assignedStaff}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-400 text-sm">₹{l.value}</div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                    TRIAL CONFIRMED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white">Closed Customers &amp; Members</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {convertedLeads.map(c => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-white text-sm">{c.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    CONVERTED
                  </span>
                </div>
                <p className="text-slate-400 font-mono text-[11px]">{c.email}</p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                  <span className="text-slate-500 font-mono">LTV Value:</span>
                  <span className="font-mono font-bold text-emerald-400">₹{c.value * 12}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: MEMBERSHIP SALES */}
      {activeTab === 'membership_sales' && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white">Membership Package Sales Ledger</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase font-mono">Gold Annual</span>
              <div className="text-2xl font-bold font-mono text-white">₹102,000</div>
              <p className="text-[11px] text-slate-400">12 Packages Sold &bull; Unlimited Court Perks</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase font-mono">Silver Quarterly</span>
              <div className="text-2xl font-bold font-mono text-white">₹58,500</div>
              <p className="text-[11px] text-slate-400">18 Packages Sold &bull; Standard Off-peak Rate</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase font-mono">Junior Academy</span>
              <div className="text-2xl font-bold font-mono text-white">₹24,000</div>
              <p className="text-[11px] text-slate-400">8 Under-18 Training Subscriptions</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PRODUCT SALES */}
      {activeTab === 'product_sales' && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white">Pro Gear &amp; Equipment Sales (Attributed to Sales Desk)</h4>
          <div className="space-y-3">
            {[
              { item: 'Bullpadel Vertex 03 Comfort Racket', qty: 14, revenue: '₹39,200', rep: 'Alex Hunter' },
              { item: 'Adidas Predator Pro Turf Boots', qty: 9, revenue: '₹22,500', rep: 'Chloe Smith' },
              { item: 'Wilson US Open Extra Duty Cans (Box of 24)', qty: 26, revenue: '₹18,200', rep: 'Sarah Jenkins' }
            ].map((p, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{p.item}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Units: {p.qty} &bull; Sold by {p.rep}</div>
                </div>
                <div className="font-mono font-bold text-emerald-400 text-sm">{p.revenue}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: FOLLOW-UPS */}
      {activeTab === 'followups' && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white">Scheduled Follow-up Reminders</h4>
          <div className="space-y-3">
            {[
              { client: 'TechCorp UK Ltd (40 Members)', note: 'Send revised multi-sport corporate proposal for Q4 wellness tournament.', due: 'Today, 16:30' },
              { client: 'Elena Petrova', note: 'Call regarding tennis racket stringing trial and VIP court booking pass.', due: 'Tomorrow, 10:00' },
              { client: 'Marcus Bennet', note: 'Discuss renewal discount before Silver subscription expires.', due: '05 Oct 2026' }
            ].map((f, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{f.client}</div>
                  <div className="text-slate-400 mt-0.5">{f.note}</div>
                </div>
                <span className="font-mono text-cyan-400 font-semibold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                  {f.due}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SALES REPORTS */}
      {activeTab === 'reports' && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Executive Sales Reports &amp; Analytics</h4>
            <button
              onClick={() => handleExport('pdf')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-glow-amber"
            >
              Generate PDF Summary
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono uppercase font-bold text-[10px]">Conversion Funnel Analysis</span>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between font-mono"><span>Leads Inquired:</span><strong className="text-white">100% (42)</strong></div>
                <div className="flex justify-between font-mono"><span>Contacted:</span><strong className="text-white">78% (33)</strong></div>
                <div className="flex justify-between font-mono"><span>Trial Completed:</span><strong className="text-white">52% (22)</strong></div>
                <div className="flex justify-between font-mono"><span>Proposals Accepted:</span><strong className="text-emerald-400">32.8% (14)</strong></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono uppercase font-bold text-[10px]">Revenue Channels</span>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between font-mono"><span>Annual Memberships:</span><strong className="text-white">55.3%</strong></div>
                <div className="flex justify-between font-mono"><span>Corporate Retainers:</span><strong className="text-white">31.7%</strong></div>
                <div className="flex justify-between font-mono"><span>Pro Gear Equipment:</span><strong className="text-white">13.0%</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
