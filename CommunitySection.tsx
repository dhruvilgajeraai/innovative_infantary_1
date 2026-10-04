import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Vote, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  Award, 
  Plus, 
  Sparkles 
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const CommunitySection: React.FC = () => {
  const { 
    volunteers, 
    fundraisers, 
    elections, 
    reimbursements, 
    voteInElection 
  } = useData();

  const [activeTab, setActiveTab] = useState<'elections' | 'fundraisers' | 'volunteers' | 'reimbursements'>('elections');
  const [voteNotice, setVoteNotice] = useState<string | null>(null);

  const handleVote = (electionId: string, candidateId: string, candidateName: string) => {
    voteInElection(electionId, candidateId);
    setVoteNotice(`Your ballot has been securely cast for ${candidateName}. Thank you for participating!`);
    setTimeout(() => setVoteNotice(null), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <HeartHandshake className="w-5 h-5 text-pink-400" />
            <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">
              Rule 40 &bull; Community &amp; Governance
            </span>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white mt-1">
            Community, Elections &amp; Club Initiatives
          </h2>
          <p className="text-xs text-slate-400">
            Democratic club board elections, volunteer rosters, grassroots youth scholarship fundraisers, and expense reimbursements.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'elections', label: 'Elections & Voting' },
            { id: 'fundraisers', label: 'Club Fundraisers' },
            { id: 'volunteers', label: 'Volunteers' },
            { id: 'reimbursements', label: 'Reimbursements' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-pink-600 text-white shadow-glow-rose'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {voteNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{voteNotice}</span>
        </div>
      )}

      {/* Tab: Elections */}
      {activeTab === 'elections' && (
        <div className="space-y-4">
          {elections.map(el => (
            <div key={el.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase">
                    ACTIVE BALLOT &bull; ENDS {el.endDate}
                  </span>
                  <h4 className="text-lg font-bold text-white mt-2">{el.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Position: <strong className="text-cyan-400">{el.role}</strong> &bull; Total Ballots Cast: {el.totalVotes}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {el.candidates.map(cand => {
                  const pct = el.totalVotes > 0 ? Math.round((cand.votes / el.totalVotes) * 100) : 0;
                  return (
                    <div key={cand.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-baseline">
                          <h5 className="font-bold text-white text-sm">{cand.name}</h5>
                          <span className="font-mono text-xs font-bold text-cyan-400">{cand.votes} Votes ({pct}%)</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{cand.bio}</p>
                      </div>

                      <div className="space-y-2 pt-2">
                        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                          <div className="h-full bg-pink-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <button
                          onClick={() => handleVote(el.id, cand.id, cand.name)}
                          className="w-full py-2 rounded-xl bg-pink-600/30 hover:bg-pink-600 text-pink-200 hover:text-white text-xs font-bold border border-pink-500/40 transition-colors"
                        >
                          Cast Ballot for {cand.name}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Fundraisers */}
      {activeTab === 'fundraisers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fundraisers.map(f => {
            const pct = Math.min(100, Math.round((f.currentAmount / f.targetAmount) * 100));
            return (
              <div key={f.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                <div>
                  <h4 className="text-base font-bold text-white">{f.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{f.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-emerald-400 font-mono text-base">₹{f.currentAmount.toLocaleString()} Raised</span>
                    <span className="text-slate-400">Goal: ₹{f.targetAmount.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{f.donorCount} Community Donors</span>
                    <span>Deadline: {f.deadline}</span>
                  </div>
                </div>

                <button 
                  onClick={() => alert(`Thank you for pledging support towards ${f.title}!`)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-glow-emerald"
                >
                  Contribute Donation (₹25)
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Volunteers */}
      {activeTab === 'volunteers' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white">Registered Club Community Volunteers</h4>
          <div className="space-y-2">
            {volunteers.map(v => (
              <div key={v.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <h5 className="font-bold text-white text-sm">{v.name}</h5>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Assigned: <strong className="text-cyan-400">{v.eventAssigned || 'General Operations'}</strong> &bull; Skills: {v.skills.join(', ')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-emerald-400 font-bold">{v.hoursLogged} Hours Logged</div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 uppercase">
                    {v.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Reimbursements */}
      {activeTab === 'reimbursements' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white">Staff Operational Expense Reimbursements</h4>
          <div className="space-y-2">
            {reimbursements.map(r => (
              <div key={r.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <h5 className="font-bold text-white">{r.title}</h5>
                  <div className="text-[11px] text-slate-400 mt-0.5">Staff: {r.staffName} &bull; {r.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-white text-sm">₹{r.amount.toFixed(2)}</div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    r.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
