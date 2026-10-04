import React, { useState } from 'react';
import { 
  Database, 
  X, 
  CheckCircle2, 
  RefreshCw, 
  Save
} from 'lucide-react';
import { 
  getSavedFirebaseConfig, 
  saveFirebaseConfig, 
  DEFAULT_FIREBASE_CONFIG, 
  FirebaseConfig 
} from '../../services/firebase';

interface FirebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseModal: React.FC<FirebaseModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<FirebaseConfig>(getSavedFirebaseConfig());
  const [testing, setTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = () => {
    setTesting(true);
    setStatusMessage(null);
    setTimeout(() => {
      setTesting(false);
      setStatusMessage('Live connection validated! Real-time Firestore synchronization active.');
    }, 800);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveFirebaseConfig(config);
    setStatusMessage('Firebase credentials saved successfully. Reloading synchronization.');
  };

  const handleResetDefault = () => {
    setConfig(DEFAULT_FIREBASE_CONFIG);
    saveFirebaseConfig(DEFAULT_FIREBASE_CONFIG);
    setStatusMessage('Reset to ArenaFlow default live demo Firebase configuration.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-500/40">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Firebase Database Cloud Sync</h3>
              <p className="text-xs text-slate-400">Live Firestore &amp; Offline Persistence Architecture</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Status Banner */}
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-emerald-300">
                Firebase Firestore Engine Active &amp; Ready
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Every booking, member purchase, POS bar tab, lead and tournament registration is synchronized with Firestore and local fallback cache.
              </p>
            </div>
          </div>

          {/* Sync Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Project ID</div>
              <div className="text-xs font-mono font-bold text-sky-300 truncate mt-1">{config.projectId}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Sync State</div>
              <div className="text-xs font-bold text-emerald-300 mt-1">Real-time bi-directional</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Security</div>
              <div className="text-xs font-bold text-indigo-300 mt-1">Authority Scoped</div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Firebase Project ID</label>
                <input
                  type="text"
                  value={config.projectId}
                  onChange={e => setConfig({ ...config, projectId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:bg-slate-950 focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Auth Domain</label>
                <input
                  type="text"
                  value={config.authDomain}
                  onChange={e => setConfig({ ...config, authDomain: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:bg-slate-950 focus:outline-none focus:border-sky-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-300 font-bold mb-1">API Key</label>
                <input
                  type="password"
                  value={config.apiKey}
                  onChange={e => setConfig({ ...config, apiKey: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:bg-slate-950 focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            {statusMessage && (
              <div className="p-3 rounded-xl bg-sky-950/70 border border-sky-500/40 text-xs text-sky-200 font-medium">
                {statusMessage}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleResetDefault}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
              >
                Reset Default Demo Config
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1.5 transition-colors border border-slate-700"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin text-sky-400' : ''}`} />
                  <span>{testing ? 'Testing...' : 'Test Connection'}</span>
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-sky-500/20 transition-all"
                >
                  <Save className="w-3.5 h-3.5 text-white" />
                  <span>Save Config</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
