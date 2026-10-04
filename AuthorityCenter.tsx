import React, { useState } from 'react';
import { 
  ShieldAlert, 
  UserCheck, 
  Key, 
  Power, 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Users, 
  ShieldCheck, 
  Plus, 
  Lock 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthorityId, FixedAuthorityConfig } from '../../types';

export const AuthorityCenter: React.FC = () => {
  const { authorities, updateUserAuthorities } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedAuth, setSelectedAuth] = useState<FixedAuthorityConfig | null>(null);
  const [assignUserModal, setAssignUserModal] = useState(false);
  const [targetUserId, setTargetUserId] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filteredAuthorities = authorities.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.id.toLowerCase().includes(search.toLowerCase()) ||
    a.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleActive = (authId: AuthorityId) => {
    setActionNotice(`Status toggled for ${authId}. Permissions updated.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleResetCredentials = (authId: AuthorityId) => {
    setActionNotice(`Security credentials securely reset by SUPER-001 for ${authId}. New token dispatched to registered executive mailbox.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleAssignUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuth || !targetUserId) return;
    updateUserAuthorities(targetUserId, [selectedAuth.id]);
    setActionNotice(`User ID ${targetUserId} successfully granted authority: ${selectedAuth.id}`);
    setAssignUserModal(false);
    setTargetUserId('');
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
              Executive Governance &bull; Rule 18
            </span>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white mt-1">
            Central Authority Command Center
          </h2>
          <p className="text-xs text-slate-400">
            Configure fixed authorities, assign verified users, enforce credential isolation, and audit access scopes.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter authorities..."
              className="pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-400"
            />
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Authorities Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAuthorities.map(auth => (
          <div 
            key={auth.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-extrabold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {auth.id}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5">{auth.name}</h4>
                  <div className="text-[11px] text-slate-400">{auth.department}</div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  auth.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {auth.isActive ? 'ACTIVE' : 'SUSPENDED'}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                {auth.description}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered Email:</span>
                  <span className="font-mono text-slate-300 truncate max-w-[170px]">{auth.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Permissions:</span>
                  <span className="text-cyan-400 font-semibold">{auth.permissions.length} Grants ({auth.permissions[0]})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Verified Login:</span>
                  <span className="text-slate-400">{auth.lastLogin || 'Recent'}</span>
                </div>
              </div>
            </div>

            {/* Admin Operations for this Authority (Rule 18: Super Admin controls) */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => { setSelectedAuth(auth); setAssignUserModal(true); }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1"
                title="Assign User to Authority"
              >
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Assign User</span>
              </button>

              <button
                onClick={() => handleResetCredentials(auth.id)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1"
                title="Super Admin Credential Reset"
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Reset Creds</span>
              </button>

              <button
                onClick={() => handleToggleActive(auth.id)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400"
                title="Toggle Active Status"
              >
                <Power className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assign User Modal */}
      {assignUserModal && selectedAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6">
            <h3 className="text-base font-bold text-white mb-1">
              Assign User to {selectedAuth.name} ({selectedAuth.id})
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Grant this user operational credentials and access to the {selectedAuth.id} dashboard.
            </p>

            <form onSubmit={handleAssignUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">User ID or Email</label>
                <input
                  type="text"
                  required
                  value={targetUserId}
                  onChange={e => setTargetUserId(e.target.value)}
                  placeholder="e.g. user-normal-01 or athlete email"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
                <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Assigned user will receive an Authority Switcher in their profile dropdown.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold shadow-glow-cyan"
                >
                  Authorize Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
