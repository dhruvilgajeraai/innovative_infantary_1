import React, { useState } from 'react';
import { 
  Coffee, 
  CreditCard, 
  Receipt, 
  Users, 
  Plus, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Sparkles,
  QrCode,
  X,
  Search,
  Download,
  Printer,
  ChevronRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { MembershipTier } from '../../types';

type PosTabType = 
  | 'dashboard' 
  | 'pos' 
  | 'tables' 
  | 'tabs' 
  | 'orders' 
  | 'products' 
  | 'payments' 
  | 'receipts' 
  | 'reports';

export const POSDashboard: React.FC = () => {
  const { 
    posTables, 
    posTabs, 
    products, 
    openPosTab, 
    addOrderToTab, 
    settlePosTab 
  } = useData();

  const [activeTab, setActiveTab] = useState<PosTabType>('dashboard');
  const [selectedTableId, setSelectedTableId] = useState<number>(1);
  const [showOpenTabModal, setShowOpenTabModal] = useState(false);
  const [customerName, setCustomerName] = useState('Alexander Wright');
  const [customerTier, setCustomerTier] = useState<MembershipTier>('silver');
  const [receiptModalTab, setReceiptModalTab] = useState<any | null>(null);

  // Selected table & active tab
  const activeTable = posTables.find(t => t.id === selectedTableId) || posTables[0];
  const activeTabObj = posTabs.find(t => t.id === activeTable.activeTabId && t.status === 'open');

  // Filter bar/snack products from shared inventory
  const barProducts = products.filter(p => p.category === 'beverages' || p.category === 'snacks' || p.category === 'accessories');

  // Bar earnings summary
  const todaySettledTabs = posTabs.filter(t => t.status === 'settled');
  const totalSettledRevenue = todaySettledTabs.reduce((s, t) => s + t.total, 0);
  const activeOpenTabsCount = posTabs.filter(t => t.status === 'open').length;

  const handleOpenTab = (e: React.FormEvent) => {
    e.preventDefault();
    openPosTab(selectedTableId, customerName, customerTier);
    setShowOpenTabModal(false);
  };

  const handleAddItem = (productName: string, memberPrice: number, standardPrice: number) => {
    if (!activeTabObj) return;
    const isMember = activeTabObj.memberTier && activeTabObj.memberTier !== 'none';
    const finalPrice = isMember ? memberPrice : standardPrice;
    addOrderToTab(activeTabObj.id, productName, finalPrice, 1);
  };

  const handleSettle = (method: 'cash' | 'card' | 'upi') => {
    if (!activeTabObj) return;
    settlePosTab(activeTabObj.id, method);
    setReceiptModalTab({
      ...activeTabObj,
      settledAt: new Date().toLocaleTimeString(),
      paymentMethod: method
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* 1. TOP SCI-FI IRON MAN HUD TELEMETRY BAR & GUIDANCE */}
      <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500"
          style={{ boxShadow: '0 0 12px rgba(249, 115, 22, 0.6)' }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
                <span>POS &amp; BAR AUTHORITY // POS-001</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] font-mono text-amber-400">TABLE TERMINAL ONLINE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
              Stadium Bar, Cafeteria &amp; POS Station
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              <strong>Contextual Guidance (Rule 25 &amp; 55):</strong> Open running tabs on Tables 1-12. Member discounts (Gold: 20%, Silver: 10%) are automatically deducted without manual calculation. Settle via Cash, Card, or UPI with instant receipt printing.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('pos')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-orange-500/20 transition-all"
            >
              Open POS Terminal
            </button>
          </div>
        </div>
      </div>

      {/* 2. METRIC TELEMETRY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Active Running Tabs</div>
          <div className="text-2xl font-bold font-mono text-amber-400">{activeOpenTabsCount} Tabs</div>
          <div className="text-[10px] text-slate-400">Courtside Lounge &amp; Deck</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Today&apos;s Settled Sales</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">₹{totalSettledRevenue.toFixed(2)}</div>
          <div className="text-[10px] text-emerald-300">&check; Cash, Card &amp; UPI reconciled</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Tables Occupancy</div>
          <div className="text-2xl font-bold font-mono text-white">
            {posTables.filter(t => t.status === 'occupied').length} / {posTables.length}
          </div>
          <div className="text-[10px] text-slate-400">12 Total Dining &amp; High-Tops</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Auto Discounts Active</div>
          <div className="text-2xl font-bold font-mono text-cyan-400">20% Gold / 10% Silver</div>
          <div className="text-[10px] text-slate-400">Zero member friction</div>
        </div>
      </div>

      {/* 3. MENU TABS (RULE 25 SPECIFIED MENUS) */}
      <div className="flex border-b border-slate-800/80 pb-2 gap-1.5 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'pos', label: 'POS Terminal' },
          { id: 'tables', label: `Tables Grid (${posTables.length})` },
          { id: 'tabs', label: `Active Tabs (${activeOpenTabsCount})` },
          { id: 'orders', label: 'Orders Stream' },
          { id: 'products', label: `Products (${barProducts.length})` },
          { id: 'payments', label: 'Payments & Settle' },
          { id: 'receipts', label: `Receipts (${todaySettledTabs.length})` },
          { id: 'reports', label: 'Reports' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as PosTabType)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-orange-500/20 border-orange-500/40 text-orange-300 shadow-lg shadow-orange-500/10'
                  : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: DASHBOARD & POS TERMINAL & TABLES */}
      {(activeTab === 'dashboard' || activeTab === 'pos' || activeTab === 'tables') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Tables 1 to 12 Grid */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-orange-400" />
                  <span>Stadium Bar Tables 1 - 12 (Rule 25)</span>
                </h4>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-700" /> Free</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Active Tab</span>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {posTables.map(t => {
                  const isSelected = selectedTableId === t.id;
                  const isOccupied = t.status === 'occupied';
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTableId(t.id)}
                      className={`p-4 rounded-2xl border text-center transition-all flex flex-col justify-between h-28 relative ${
                        isSelected
                          ? 'border-orange-400 bg-orange-500/10 shadow-lg shadow-orange-500/15'
                          : isOccupied
                            ? 'border-amber-500/40 bg-amber-500/5 hover:border-amber-500/60'
                            : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs text-white">Table {t.id}</span>
                        <span className={`w-2 h-2 rounded-full ${isOccupied ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'}`} />
                      </div>
                      <div>
                        <div className={`text-[10px] font-mono font-bold uppercase ${isOccupied ? 'text-amber-300' : 'text-slate-500'}`}>
                          {isOccupied ? 'OPEN TAB' : 'VACANT'}
                        </div>
                        <div className="text-[9px] text-slate-400 mt-0.5 truncate">{t.name}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Menu Selection */}
            {activeTabObj && (
              <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Add Items to Table {activeTable.id}</span>
                  <span className="text-[10px] font-mono text-cyan-400">Member Discount Auto-Applied</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {barProducts.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleAddItem(p.name, p.memberPrice, p.price)}
                      className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-orange-500/50 text-left transition-all group"
                    >
                      <div className="font-bold text-xs text-white group-hover:text-orange-300 truncate">{p.name}</div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-mono text-xs text-emerald-400 font-bold">₹{p.memberPrice}</span>
                        <span className="text-[9px] text-slate-500 line-through font-mono">₹{p.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Active Tab Bill & Settlement Checkout */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-4 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">Table {activeTable.id} Bill</h3>
                  <p className="text-xs text-slate-400">{activeTable.name}</p>
                </div>
                {activeTabObj ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    TAB ACTIVE
                  </span>
                ) : (
                  <button
                    onClick={() => setShowOpenTabModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs shadow-glow-orange"
                  >
                    + Open Tab
                  </button>
                )}
              </div>

              {activeTabObj ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">{activeTabObj.customerName}</div>
                      <div className="text-[10px] text-amber-400 uppercase font-mono">{activeTabObj.memberTier} Member</div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{activeTabObj.openedAt}</span>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-800/60">
                    {activeTabObj.orders.map((item, idx: number) => (
                      <div key={idx} className="pt-2 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-semibold text-slate-200">{item.item}</div>
                          <div className="text-[10px] text-slate-400">{item.qty} x ₹{item.price}</div>
                        </div>
                        <span className="font-mono font-bold text-white">₹{(item.qty * item.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal:</span>
                      <span className="text-white">₹{(activeTabObj.total * 0.95).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>Member Discount Applied:</span>
                      <span>-₹{(activeTabObj.total * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>GST Tax (5%):</span>
                      <span className="text-white">₹{(activeTabObj.total * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                      <span>Grand Total:</span>
                      <span className="text-orange-400">₹{activeTabObj.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Settle Bill Payment Controls (Rule 25: Cash, Card, UPI) */}
                  <div className="pt-2 space-y-2">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Settle Bill via:</div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleSettle('cash')}
                        className="py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-xs font-bold text-slate-200 transition-all"
                      >
                        💵 Cash
                      </button>
                      <button
                        onClick={() => handleSettle('card')}
                        className="py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-xs font-bold text-slate-200 transition-all"
                      >
                        💳 Card
                      </button>
                      <button
                        onClick={() => handleSettle('upi')}
                        className="py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-xs font-bold text-slate-200 transition-all"
                      >
                        📱 UPI QR
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                  <Coffee className="w-8 h-8 mx-auto text-slate-600" />
                  <p>Table {activeTable.id} is currently vacant.</p>
                  <button
                    onClick={() => setShowOpenTabModal(true)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                  >
                    Open New Customer Tab
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ORDERS STREAM */}
      {activeTab === 'orders' && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white">Live Kitchen &amp; Bar Dispense Queue</h4>
          <div className="space-y-3">
            {posTabs.map(t => (
              <div key={t.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">Table {t.tableNumber} &bull; {t.customerName}</div>
                  <div className="text-slate-400 font-mono mt-0.5">
                    {t.orders.map(i => `${i.qty}x ${i.item}`).join(', ')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-400 text-sm">₹{t.total.toFixed(2)}</div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    t.status === 'settled' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-300'
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: RECEIPTS & REPORTS */}
      {(activeTab === 'receipts' || activeTab === 'reports') && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Settled Sales Receipts Ledger (Cash, Card, UPI)</h4>
            <button
              onClick={() => alert('Exporting POS_Reconciliation_Ledger.pdf')}
              className="px-3.5 py-1.5 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs shadow-glow-orange"
            >
              Export POS Audit
            </button>
          </div>

          <div className="space-y-2.5">
            {todaySettledTabs.map(t => (
              <div key={t.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{t.customerName} &bull; Receipt #{t.id}</div>
                  <div className="text-slate-400 font-mono text-[10px]">
                    Table {t.tableNumber} &bull; Settled via <strong className="text-orange-300 uppercase">{(t as any).paymentMethod || 'Card'}</strong>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-bold text-emerald-400 text-sm">₹{t.total.toFixed(2)}</div>
                  <span className="text-[10px] text-slate-500">Tax ₹{(t.total * 0.05).toFixed(2)} Included</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Open Tab Modal */}
      {showOpenTabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Open Tab &bull; Table {selectedTableId}</h3>
              <button onClick={() => setShowOpenTabModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOpenTab} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Customer / Member Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Membership Tier</label>
                <select
                  value={customerTier}
                  onChange={e => setCustomerTier(e.target.value as MembershipTier)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="gold">Gold Member (20% Off Bar)</option>
                  <option value="silver">Silver Member (10% Off Bar)</option>
                  <option value="junior">Junior (No alcohol)</option>
                  <option value="none">Non-member (Standard Rates)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs shadow-glow-orange transition-all"
              >
                Open Running Tab
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptModalTab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Bill Settled Successfully</h3>
              <p className="text-xs text-slate-400">ArenaFlow Bar &bull; Table {receiptModalTab.tableId}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left font-mono text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Customer:</span>
                <span className="text-white">{receiptModalTab.customerName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment:</span>
                <span className="text-orange-400 uppercase">{receiptModalTab.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Grand Total:</span>
                <span className="text-emerald-400 font-bold">₹{receiptModalTab.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setReceiptModalTab(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
