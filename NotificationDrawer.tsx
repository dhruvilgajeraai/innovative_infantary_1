import React from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Flame 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const { currentAuthority, accountType } = useAuth();
  const { notifications, markNotificationRead } = useData();

  if (!isOpen) return null;

  // Filter notifications according to Authority Scope (Rule 42)
  const scopedNotifications = notifications.filter(n => {
    if (accountType === 'superadmin') return true;
    if (currentAuthority) {
      return n.authorityScope === currentAuthority.id || n.authorityScope === 'all';
    }
    return n.authorityScope === 'user' || n.authorityScope === 'all';
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-sky-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Notification Center</h2>
                <p className="text-[11px] text-slate-400">
                  Scope: {currentAuthority ? currentAuthority.id : 'Personal Account'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {scopedNotifications.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-xs">
                <CheckCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                All caught up! No notifications for your authority.
              </div>
            ) : (
              scopedNotifications.map(n => {
                const getIcon = () => {
                  switch (n.type) {
                    case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
                    case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
                    case 'error': return <Flame className="w-4 h-4 text-rose-400" />;
                    default: return <Info className="w-4 h-4 text-sky-400" />;
                  }
                };

                return (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      n.read 
                        ? 'bg-slate-900/60 border-slate-800/80 opacity-70' 
                        : 'bg-slate-900 border-sky-500/50 shadow-md hover:border-sky-400'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-1.5 rounded-lg bg-slate-800/90 shrink-0">
                        {getIcon()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-white truncate">{n.title}</h4>
                          <span className="text-[10px] text-slate-500 shrink-0">{n.createdAt.slice(11)}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                        {n.authorityScope && (
                          <span className="inline-block mt-2 text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-950 text-sky-300 border border-slate-800">
                            {n.authorityScope}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/90 text-[11px] text-slate-500 text-center">
            Security Isolation Active &bull; No Cross-Authority Data Leakage
          </div>
        </div>
      </div>
    </div>
  );
};
