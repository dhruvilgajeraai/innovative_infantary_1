import React, { useState } from 'react';
import { 
  Megaphone, 
  TrendingUp, 
  Gift, 
  Users, 
  Send, 
  CheckCircle2, 
  Sparkles,
  BarChart3,
  Tag,
  Download,
  Percent,
  Search
} from 'lucide-react';

type MarketingTab = 
  | 'dashboard' 
  | 'campaigns' 
  | 'promotions' 
  | 'offers' 
  | 'customers' 
  | 'analytics' 
  | 'reports';

interface Campaign {
  id: string;
  title: string;
  channel: 'Instagram & Facebook Ads' | 'Email Newsletter' | 'SMS Blast' | 'In-Club Flyers';
  targetAudience: string;
  status: 'active' | 'scheduled' | 'ended';
  budget: number;
  clicks: number;
  conversions: number;
}

const SEED_CAMPAIGNS: Campaign[] = [
  { id: 'CMP-01', title: 'Autumn Padel Doubles Rush Promo', channel: 'Instagram & Facebook Ads', targetAudience: 'Local Padel players within 15 miles', status: 'active', budget: 45000, clicks: 1840, conversions: 28 },
  { id: 'CMP-02', title: 'Junior Tennis Weekend Masterclass Blast', channel: 'Email Newsletter', targetAudience: 'Existing member families with youth', status: 'active', budget: 12000, clicks: 680, conversions: 14 },
  { id: 'CMP-03', title: 'Corporate Wellness Q4 Early Bird', channel: 'SMS Blast', targetAudience: 'B2B Tech & Finance HR leaders', status: 'scheduled', budget: 30000, clicks: 0, conversions: 0 }
];

export const MarketingDashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(SEED_CAMPAIGNS);
  const [activeTab, setActiveTab] = useState<MarketingTab>('dashboard');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* 1. TOP SCI-FI IRON MAN HUD TELEMETRY BAR & GUIDANCE */}
      <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500"
          style={{ boxShadow: '0 0 12px rgba(14, 165, 233, 0.6)' }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                <span>MARKETING &amp; GROWTH // MARKETING-001</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] font-mono text-cyan-400">CAMPAIGN ROI 4.8X</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
              Campaign Acquisition, Promotions &amp; Member Offers
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              <strong>Contextual Guidance (Rule 30 &amp; 55):</strong> Drive membership signups and court occupancy through targeted sports promotion campaigns, coupon codes, and bundle offers.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => alert('New Campaign Builder')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition-all"
            >
              + Create Campaign
            </button>
          </div>
        </div>
      </div>

      {/* 2. METRIC TELEMETRY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Active Ad Campaigns</div>
          <div className="text-2xl font-bold font-mono text-sky-400">{campaigns.filter(c => c.status === 'active').length} Campaigns</div>
          <div className="text-[10px] text-slate-400">Instagram, Meta &amp; Email Blasts</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Total Audience Reach</div>
          <div className="text-2xl font-bold font-mono text-white">48,200 Reach</div>
          <div className="text-[10px] text-emerald-400 font-semibold">+34% Growth MoM</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Campaign Conversions</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">42 New Signups</div>
          <div className="text-[10px] text-emerald-300">Gold &amp; Silver Members acquired</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Return On Ad Spend (ROAS)</div>
          <div className="text-2xl font-bold font-mono text-amber-400">4.8x</div>
          <div className="text-[10px] text-amber-300">High efficiency acquisition</div>
        </div>
      </div>

      {/* 3. MENU TABS (RULE 30 SPECIFIED MENUS) */}
      <div className="flex border-b border-slate-800/80 pb-2 gap-1.5 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'campaigns', label: `Campaigns (${campaigns.length})` },
          { id: 'promotions', label: 'Promotions & Codes' },
          { id: 'offers', label: 'Offers & Bundles' },
          { id: 'customers', label: 'Audience Segments' },
          { id: 'analytics', label: 'Analytics' },
          { id: 'reports', label: 'Reports' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as MarketingTab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 shadow-lg shadow-sky-500/10'
                  : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: DASHBOARD & CAMPAIGNS */}
      {(activeTab === 'dashboard' || activeTab === 'campaigns') && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-sky-400" />
            <span>Active Promotional Campaigns</span>
          </h4>

          <div className="space-y-3">
            {campaigns.map(c => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{c.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      c.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Channel: <strong className="text-sky-400">{c.channel}</strong> &bull; Audience: {c.targetAudience}
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-right">
                  <div>
                    <div className="font-mono text-slate-200 font-bold">{c.clicks} Clicks</div>
                    <div className="text-[10px] text-emerald-400 font-mono">{c.conversions} Conversions</div>
                  </div>
                  <div className="font-mono font-bold text-white text-sm">
                    ₹{c.budget.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PROMOTIONS & OFFERS */}
      {(activeTab === 'promotions' || activeTab === 'offers') && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white">Active Promo Codes &amp; Member Referral Perks</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-slate-950/80 border border-sky-500/30 space-y-2 text-xs">
              <span className="font-mono text-xs font-bold text-sky-400 uppercase">CODE: ARENAFLOW20</span>
              <div className="text-sm font-bold text-white">20% Off First Month Gold Membership</div>
              <p className="text-slate-400">Used 38 times &bull; Valid until 31 Oct 2026</p>
            </div>
            <div className="p-5 rounded-3xl bg-slate-950/80 border border-emerald-500/30 space-y-2 text-xs">
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase">CODE: PADELRUSH</span>
              <div className="text-sm font-bold text-white">Buy 1 Court Hr Get 30-min Free</div>
              <p className="text-slate-400">Used 64 times &bull; Peak off-hours only</p>
            </div>
            <div className="p-5 rounded-3xl bg-slate-950/80 border border-purple-500/30 space-y-2 text-xs">
              <span className="font-mono text-xs font-bold text-purple-400 uppercase">CODE: B2BWELLNESS</span>
              <div className="text-sm font-bold text-white">Corporate Annual Pass 15% Rebate</div>
              <p className="text-slate-400">Used 6 times &bull; Minimum 20 employees</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: AUDIENCE & ANALYTICS & REPORTS */}
      {(['customers', 'analytics', 'reports'].includes(activeTab)) && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white capitalize">{activeTab} Breakdown &amp; Performance Summary</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Channel Attribution</span>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between"><span>Instagram &amp; Meta Ads:</span><strong className="text-sky-400">54%</strong></div>
                <div className="flex justify-between"><span>Member Word-Of-Mouth:</span><strong className="text-emerald-400">28%</strong></div>
                <div className="flex justify-between"><span>Local Corporate Outreach:</span><strong className="text-white">18%</strong></div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Cost Per Acquisition (CPA)</span>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between"><span>Blended CAC:</span><strong className="text-emerald-400">₹1,240 / member</strong></div>
                <div className="flex justify-between"><span>1st Month Payback:</span><strong className="text-white">Instant (₹4,500+)</strong></div>
                <div className="flex justify-between"><span>LTV to CAC Ratio:</span><strong className="text-cyan-400">67.7x</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
