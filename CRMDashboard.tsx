import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Briefcase, 
  Plus, 
  ChevronRight, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Clock, 
  DollarSign,
  ArrowRight,
  Filter,
  Search,
  Building,
  FileText,
  Calendar,
  Sparkles,
  Download
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { LeadStatus, Lead } from '../../types';

type CRMTab = 
  | 'dashboard' 
  | 'leads' 
  | 'prospects' 
  | 'trials' 
  | 'followups' 
  | 'business_clients' 
  | 'quotes' 
  | 'pipeline' 
  | 'reports';

const PIPELINE_STAGES: { id: LeadStatus; label: string; color: string; bg: string }[] = [
  { id: 'NEW', label: '1. New Lead', color: 'border-slate-600 text-slate-300', bg: 'bg-slate-800/40' },
  { id: 'CONTACTED', label: '2. Contacted', color: 'border-cyan-500/50 text-cyan-300', bg: 'bg-cyan-500/10' },
  { id: 'TRIAL', label: '3. Court Trial Booked', color: 'border-amber-500/50 text-amber-300', bg: 'bg-amber-500/10' },
  { id: 'PROPOSAL', label: '4. Proposal Sent', color: 'border-indigo-500/50 text-indigo-300', bg: 'bg-indigo-500/10' },
  { id: 'CONVERTED', label: '5. Converted to Member', color: 'border-emerald-500/50 text-emerald-300', bg: 'bg-emerald-500/10' },
];

export const CRMDashboard: React.FC = () => {
  const { leads, businessClients, updateLeadStatus, createLead } = useData();

  const [activeTab, setActiveTab] = useState<CRMTab>('pipeline');
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [search, setSearch] = useState('');

  // New Lead Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState<any>('membership');
  const [value, setValue] = useState(12000);
  const [notes, setNotes] = useState('');

  const totalPipelineValue = leads.reduce((s, l) => s + l.value, 0);
  const convertedLeadsCount = leads.filter(l => l.status === 'CONVERTED').length;

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    createLead({
      name,
      email,
      phone,
      interest,
      status: 'NEW',
      notes,
      value,
      assignedStaff: 'Alex Hunter'
    });
    setShowAddLeadModal(false);
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* 1. TOP SCI-FI IRON MAN HUD TELEMETRY BAR & GUIDANCE */}
      <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"
          style={{ boxShadow: '0 0 12px rgba(99, 102, 241, 0.6)' }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                <span>CRM &amp; PARTNERSHIPS // CRM-001</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] font-mono text-purple-400">5-STAGE FUNNEL ACTIVE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
              Customer Pipeline &amp; Corporate Relationships
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              <strong>Contextual Guidance (Rule 28, 37, 38 &amp; 55):</strong> Move leads through the 5-stage pipeline from NEW LEAD &rarr; CONTACTED &rarr; TRIAL &rarr; PROPOSAL &rarr; CONVERTED. Oversee business client wellness retainers.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddLeadModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Pipeline Lead</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. METRIC TELEMETRY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Total Pipeline Value</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">₹{totalPipelineValue.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-300 font-semibold">{leads.length} Active Opportunities</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Converted Members</div>
          <div className="text-2xl font-bold font-mono text-cyan-400">{convertedLeadsCount} Closed</div>
          <div className="text-[10px] text-slate-400">Gold &amp; Silver Memberships</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Corporate Accounts</div>
          <div className="text-2xl font-bold font-mono text-purple-400">{businessClients.length} Companies</div>
          <div className="text-[10px] text-purple-300">Annual Court Hire Retainers</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Pipeline Velocity</div>
          <div className="text-2xl font-bold font-mono text-amber-400">14 Days</div>
          <div className="text-[10px] text-amber-300">Trial to Converted average</div>
        </div>
      </div>

      {/* 3. MENU TABS (RULE 28 SPECIFIED MENUS) */}
      <div className="flex border-b border-slate-800/80 pb-2 gap-1.5 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'pipeline', label: 'Pipeline (5 Stages)' },
          { id: 'leads', label: `Leads (${leads.length})` },
          { id: 'prospects', label: 'Prospects' },
          { id: 'trials', label: `Trials (${leads.filter(l => l.status === 'TRIAL').length})` },
          { id: 'followups', label: 'Follow-ups' },
          { id: 'business_clients', label: `Business Clients (${businessClients.length})` },
          { id: 'quotes', label: 'Quotes & Proposals' },
          { id: 'reports', label: 'Reports' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CRMTab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: PIPELINE KANBAN (RULE 37) */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map(stage => {
            const stageLeads = leads.filter(l => l.status === stage.id);
            const stageSum = stageLeads.reduce((s, l) => s + l.value, 0);

            return (
              <div 
                key={stage.id} 
                className="rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800/80 p-4 flex flex-col justify-between min-h-[480px] shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                    <span className="font-bold text-xs text-white truncate">{stage.label}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 border border-slate-800 text-slate-300">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-cyan-400 mb-3 font-semibold">
                    Volume: ₹{stageSum.toLocaleString()}
                  </div>

                  <div className="space-y-2.5">
                    {stageLeads.map(lead => (
                      <div 
                        key={lead.id} 
                        className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2 text-xs shadow-md group"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">{lead.name}</span>
                          <span className="font-mono text-[10px] font-bold text-emerald-400">₹{lead.value}</span>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-2">{lead.notes}</p>

                        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                          <span className="text-[9px] font-mono text-slate-500 uppercase">{lead.interest}</span>

                          {/* Move forward in pipeline */}
                          {stage.id !== 'CONVERTED' && (
                            <button
                              onClick={() => {
                                const nextStageMap: Record<LeadStatus, LeadStatus> = {
                                  'NEW': 'CONTACTED',
                                  'CONTACTED': 'TRIAL',
                                  'TRIAL': 'PROPOSAL',
                                  'PROPOSAL': 'CONVERTED',
                                  'CONVERTED': 'CONVERTED',
                                  'LOST': 'LOST'
                                };
                                updateLeadStatus(lead.id, nextStageMap[lead.status]);
                              }}
                              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-0.5"
                              title="Advance to next pipeline stage"
                            >
                              <span>Next</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/60 text-center">
                  <span className="text-[10px] text-slate-500 font-mono">Stage #{stage.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT: BUSINESS CLIENTS (RULE 38) */}
      {activeTab === 'business_clients' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">Corporate Clients &amp; B2B Partnerships (Rule 38)</h3>
              <p className="text-xs text-slate-400">Manage multi-year court reservations, wellness programs, and retainer contracts</p>
            </div>
            <button
              onClick={() => alert('New Corporate Contract Builder')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
            >
              + New Corporate Contract
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {businessClients.map(client => (
              <div key={client.id} className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-white text-base">{client.companyName}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                      {client.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Lead Contact: <strong className="text-slate-200">{client.contactPerson}</strong></p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{client.email} &bull; {client.phone}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1 font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Agreement Type:</span>
                    <span className="text-white font-bold">{client.contractType}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Annual Contract Value:</span>
                    <span className="text-emerald-400 font-bold">₹{client.annualValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Term Expiry:</span>
                    <span className="text-cyan-400">{client.endDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: LEADS & PROSPECTS & TRIALS & FOLLOW-UPS */}
      {(['dashboard', 'leads', 'prospects', 'trials', 'followups', 'quotes', 'reports'].includes(activeTab)) && activeTab !== 'pipeline' && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h4 className="text-sm font-bold text-white capitalize">{activeTab.replace('_', ' ')} Directory</h4>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search leads..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] font-mono">
                <tr>
                  <th className="pb-3 px-3">Lead ID</th>
                  <th className="pb-3 px-3">Full Name</th>
                  <th className="pb-3 px-3">Email &bull; Phone</th>
                  <th className="pb-3 px-3">Interest</th>
                  <th className="pb-3 px-3">Stage</th>
                  <th className="pb-3 px-3">Value</th>
                  <th className="pb-3 px-3 text-right">Rep Assigned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeads.map(l => (
                  <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-cyan-400 font-semibold">{l.id}</td>
                    <td className="py-3 px-3 font-bold text-white">{l.name}</td>
                    <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">{l.email}</td>
                    <td className="py-3 px-3 capitalize text-slate-300">{l.interest}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">₹{l.value}</td>
                    <td className="py-3 px-3 text-right text-slate-400">{l.assignedStaff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Capture New Pipeline Lead</h3>
            
            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Primary Interest</label>
                  <select
                    value={interest}
                    onChange={e => setInterest(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 capitalize"
                  >
                    <option value="membership">Annual Membership</option>
                    <option value="padel">Padel Tournaments</option>
                    <option value="tennis">Tennis Coaching</option>
                    <option value="corporate">Corporate Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Estimated Value (₹)</label>
                  <input
                    type="number"
                    value={value}
                    onChange={e => setValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Notes &amp; Trial Preference</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-glow-violet"
                >
                  Add to Funnel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
