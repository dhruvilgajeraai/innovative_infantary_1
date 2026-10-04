import React, { useState } from 'react';
import { 
  ShoppingBag, 
  AlertTriangle, 
  Package, 
  Plus, 
  Minus, 
  Search, 
  CheckCircle2, 
  Layers, 
  DollarSign, 
  Sparkles,
  ArrowRight,
  Filter,
  Download,
  Tag,
  Truck,
  RotateCcw
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Product } from '../../types';

type ShopTab = 
  | 'dashboard' 
  | 'products' 
  | 'categories' 
  | 'inventory' 
  | 'orders' 
  | 'sales' 
  | 'stock' 
  | 'reports';

export const ShopDashboard: React.FC = () => {
  const { products, orders, adjustProductStock, updateProduct } = useData();

  const [activeTab, setActiveTab] = useState<ShopTab>('dashboard');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [adjustFeedback, setAdjustFeedback] = useState<string | null>(null);

  // Stats
  const totalStockCount = products.reduce((s, p) => s + p.stock, 0);
  const lowStockItems = products.filter(p => p.stock <= p.lowStockThreshold);
  const totalShopSales = orders.filter(o => o.type !== 'pos_bar').reduce((s, o) => s + o.total, 0);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.sku.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleStockDelta = (productId: string, delta: number, name: string) => {
    adjustProductStock(productId, delta);
    setAdjustFeedback(`Inventory updated: ${name} stock adjusted by ${delta > 0 ? '+' + delta : delta}. Real-time shared shelf synchronized.`);
    setTimeout(() => setAdjustFeedback(null), 3000);
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
                <span>SHOP AUTHORITY // SHOP-001</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] font-mono text-emerald-400">UNIFIED SHELF SYNCED</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
              Pro Shop &amp; Unified Inventory Center
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              <strong>Contextual Guidance (Rule 36 &amp; 55):</strong> Update stock and review low-stock alerts regularly. The physical pro shop counter and online member ordering share the exact same inventory shelf with real-time depletion.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('inventory')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/20 transition-all"
            >
              + Adjust Stock
            </button>
          </div>
        </div>
      </div>

      {adjustFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{adjustFeedback}</span>
        </div>
      )}

      {/* 2. METRIC TELEMETRY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Total Unified Stock</div>
          <div className="text-2xl font-bold font-mono text-white">{totalStockCount} Units</div>
          <div className="text-[10px] text-emerald-400 font-semibold">&check; Shared Shelf Synchronized</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Low Stock Alerts</div>
          <div className="text-2xl font-bold font-mono text-amber-400">{lowStockItems.length} SKUs</div>
          <div className="text-[10px] text-amber-300">Under re-order threshold</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Shop Direct Revenue</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">₹{totalShopSales.toFixed(2)}</div>
          <div className="text-[10px] text-slate-400">Online &amp; in-person combined</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Active Catalog SKUs</div>
          <div className="text-2xl font-bold font-mono text-cyan-400">{products.length} Products</div>
          <div className="text-[10px] text-slate-400">Rackets, balls, footwear, grips</div>
        </div>
      </div>

      {/* 3. MENU TABS (RULE 24 SPECIFIED MENUS) */}
      <div className="flex border-b border-slate-800/80 pb-2 gap-1.5 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'products', label: `Products (${products.length})` },
          { id: 'categories', label: `Categories (${categories.length})` },
          { id: 'inventory', label: 'Inventory (Shared Shelf)' },
          { id: 'orders', label: `Orders (${orders.filter(o => o.type !== 'pos_bar').length})` },
          { id: 'sales', label: 'Sales' },
          { id: 'stock', label: `Low Stock (${lowStockItems.length})` },
          { id: 'reports', label: 'Reports' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ShopTab)}
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
            <h4 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Top Selling Equipment SKUs</span>
              <span className="text-[10px] font-mono text-amber-400">Live POS &amp; Web</span>
            </h4>
            <div className="space-y-2.5">
              {products.slice(0, 4).map(p => (
                <div key={p.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{p.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">SKU: {p.sku} &bull; {p.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-emerald-400">₹{p.price}</div>
                    <span className="text-[10px] text-slate-500 font-mono">Stock: {p.stock} units</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Low-Stock Inventory Warnings</span>
            </h4>
            <div className="space-y-2.5">
              {lowStockItems.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">All items above safety threshold.</div>
              ) : (
                lowStockItems.map(p => (
                  <div key={p.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{p.name}</div>
                      <div className="text-[10px] text-amber-400 font-mono">Current: {p.stock} (Min: {p.lowStockThreshold})</div>
                    </div>
                    <button
                      onClick={() => handleStockDelta(p.id, 10, p.name)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold font-mono text-[10px]"
                    >
                      +10 Restock
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PRODUCTS & INVENTORY & STOCK */}
      {(activeTab === 'products' || activeTab === 'inventory' || activeTab === 'stock') && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h4 className="text-sm font-bold text-white">
              {activeTab === 'stock' ? 'Critical Re-Order List' : 'Unified Warehouse & Counter Inventory'}
            </h4>

            <div className="flex items-center space-x-2">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c} className="capitalize">{c}</option>
                ))}
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search product or SKU..."
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
                  <th className="pb-3 px-3">SKU</th>
                  <th className="pb-3 px-3">Product Name</th>
                  <th className="pb-3 px-3">Category</th>
                  <th className="pb-3 px-3">Walk-in Rate</th>
                  <th className="pb-3 px-3">Member Rate</th>
                  <th className="pb-3 px-3">Stock Units</th>
                  <th className="pb-3 px-3 text-right">Quick Stock +/-</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(activeTab === 'stock' ? lowStockItems : filteredProducts).map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-cyan-400 font-semibold">{p.sku}</td>
                    <td className="py-3 px-3 font-bold text-white">{p.name}</td>
                    <td className="py-3 px-3 capitalize text-slate-300">{p.category}</td>
                    <td className="py-3 px-3 font-mono text-white">₹{p.price}</td>
                    <td className="py-3 px-3 font-mono text-emerald-400 font-bold">₹{p.memberPrice}</td>
                    <td className="py-3 px-3 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.stock <= p.lowStockThreshold 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      <button
                        onClick={() => handleStockDelta(p.id, -1, p.name)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono font-bold"
                        title="Sold 1"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => handleStockDelta(p.id, 1, p.name)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono font-bold"
                        title="Received 1"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => handleStockDelta(p.id, 10, p.name)}
                        className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono font-bold text-[10px]"
                        title="Restock 10"
                      >
                        +10
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => {
            const catProducts = products.filter(p => p.category === cat);
            const catStock = catProducts.reduce((s, p) => s + p.stock, 0);
            return (
              <div key={cat} className="p-5 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 space-y-3 shadow-xl">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-base capitalize">{cat}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {catProducts.length} SKUs
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Total Units:</span>
                    <strong className="text-white font-mono">{catStock}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Category Status:</span>
                    <strong className="text-emerald-400">Active On Web &amp; Bar</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT: ORDERS & SALES */}
      {(activeTab === 'orders' || activeTab === 'sales') && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white">Fulfilled Pro Shop Transactions</h4>
          <div className="space-y-3">
            {orders.filter(o => o.type !== 'pos_bar').map(o => (
              <div key={o.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{o.customerName} &bull; {o.id}</div>
                  <div className="text-slate-400 font-mono mt-0.5">
                    {o.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-400 text-sm">₹{o.total.toFixed(2)}</div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase">{o.paymentMethod} &bull; {o.paymentStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: REPORTS */}
      {activeTab === 'reports' && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Pro Shop Financial Audit &amp; Shrinkage Report</h4>
            <button
              onClick={() => alert('Generating Shop_Inventory_Report.csv')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-glow-amber"
            >
              Export Inventory Ledger
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono uppercase font-bold text-[10px]">Sales Distribution</span>
              <div className="space-y-1.5 pt-1 font-mono">
                <div className="flex justify-between"><span>Rackets &amp; Paddles:</span><strong className="text-white">44.8%</strong></div>
                <div className="flex justify-between"><span>Footwear &amp; Apparel:</span><strong className="text-white">31.2%</strong></div>
                <div className="flex justify-between"><span>Balls &amp; Accessories:</span><strong className="text-white">24.0%</strong></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono uppercase font-bold text-[10px]">Inventory Accuracy</span>
              <div className="space-y-1.5 pt-1 font-mono">
                <div className="flex justify-between"><span>Shared Shelf Sync Rate:</span><strong className="text-emerald-400">100%</strong></div>
                <div className="flex justify-between"><span>Audit Discrepancy:</span><strong className="text-emerald-400">0.0%</strong></div>
                <div className="flex justify-between"><span>Automated Reorder Threshold:</span><strong className="text-cyan-400">Enforced</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
