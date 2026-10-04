import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  X, 
  Calendar, 
  Users, 
  ShoppingBag, 
  Receipt, 
  Award, 
  Briefcase, 
  TrendingUp, 
  Ticket,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (category: string, item: any) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  isOpen,
  onClose,
  onSelectResult
}) => {
  const { currentAuthority, accountType } = useAuth();
  const { 
    bookings, 
    products, 
    leads, 
    businessClients, 
    invoices, 
    events, 
    staff 
  } = useData();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Toggle or open handled by parent
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // STRICT AUTHORITY DATA FILTERING (Rule 41 & 47)
  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const results: { category: string; icon: any; title: string; subtitle: string; raw: any }[] = [];

    const isSuper = accountType === 'superadmin' || currentAuthority?.id === 'SUPER-001' || currentAuthority?.id === 'ADMIN-001';
    const authId = currentAuthority?.id;

    // Bookings (Allowed: Super, Booking Authority, Sports Authority)
    if (isSuper || authId === 'BOOKING-001' || authId === 'SPORT-001') {
      bookings.forEach(b => {
        if (b.courtName.toLowerCase().includes(q) || b.userName.toLowerCase().includes(q) || b.id.toLowerCase().includes(q)) {
          results.push({
            category: 'Booking',
            icon: Calendar,
            title: `${b.courtName} — ${b.userName}`,
            subtitle: `${b.date} at ${b.startTime} (${b.status})`,
            raw: b
          });
        }
      });
    }

    // Products / Gear Shop (Allowed: Super, Shop Authority, POS Authority)
    if (isSuper || authId === 'SHOP-001' || authId === 'POS-001') {
      products.forEach(p => {
        if (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) {
          results.push({
            category: 'Shop Inventory',
            icon: ShoppingBag,
            title: p.name,
            subtitle: `SKU: ${p.sku} | ₹${p.price} (Stock: ${p.stock})`,
            raw: p
          });
        }
      });
    }

    // CRM Leads & Clients (Allowed: Super, Sales Authority, CRM Authority)
    if (isSuper || authId === 'SALES-001' || authId === 'CRM-001') {
      leads.forEach(l => {
        if (l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.interest.toLowerCase().includes(q)) {
          results.push({
            category: 'CRM Lead',
            icon: TrendingUp,
            title: `${l.name} (${l.interest.toUpperCase()})`,
            subtitle: `Stage: ${l.status} | Value: ₹${l.value} | ${l.email}`,
            raw: l
          });
        }
      });

      businessClients.forEach(c => {
        if (c.companyName.toLowerCase().includes(q) || c.contactPerson.toLowerCase().includes(q)) {
          results.push({
            category: 'Business Client',
            icon: Briefcase,
            title: c.companyName,
            subtitle: `${c.contactPerson} | ${c.contractType} (₹${c.annualValue}/yr)`,
            raw: c
          });
        }
      });
    }

    // Invoices / Finance (Allowed: Super, Finance Authority)
    if (isSuper || authId === 'FINANCE-001') {
      invoices.forEach(inv => {
        if (inv.invoiceNumber.toLowerCase().includes(q) || inv.clientOrMemberName.toLowerCase().includes(q)) {
          results.push({
            category: 'Invoice',
            icon: Receipt,
            title: `${inv.invoiceNumber} — ${inv.clientOrMemberName}`,
            subtitle: `Total: ₹${inv.total.toFixed(2)} (${inv.status.toUpperCase()}) Due: ${inv.dueDate}`,
            raw: inv
          });
        }
      });
    }

    // Events (Allowed: Super, Event Authority, Normal user)
    if (isSuper || authId === 'EVENT-001' || !authId) {
      events.forEach(e => {
        if (e.title.toLowerCase().includes(q) || e.sport.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)) {
          results.push({
            category: 'Club Event',
            icon: Ticket,
            title: e.title,
            subtitle: `${e.date} (${e.time}) - Registered: ${e.registeredCount}/${e.capacity}`,
            raw: e
          });
        }
      });
    }

    // Staff (Allowed: Super, Staff Authority)
    if (isSuper || authId === 'STAFF-001') {
      staff.forEach(s => {
        if (s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q)) {
          results.push({
            category: 'Staff & Coach',
            icon: Users,
            title: `${s.name} — ${s.role}`,
            subtitle: `Shift: ${s.shift} | Status: ${s.status}`,
            raw: s
          });
        }
      });
    }

    return results;
  }, [query, bookings, products, leads, businessClients, invoices, events, staff, accountType, currentAuthority]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type to search authorized records (members, bookings, shop, leads, invoices)..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] text-slate-400 bg-slate-950 rounded border border-slate-800 font-mono">
            ESC
          </kbd>
        </div>

        {/* Isolation Badge Indicator */}
        <div className="bg-slate-950 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800">
          <span>Security Scope: <strong className="text-sky-400 font-semibold">{currentAuthority ? currentAuthority.id : 'Normal User (Restricted)'}</strong></span>
          <span className="text-[10px] text-slate-500 font-medium">Cross-authority leakage prevention active</span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/60">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              Search for permitted club data across your authorized authority scope
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No authorized records found for &ldquo;<span className="text-white font-bold">{query}</span>&rdquo;.
              <p className="text-[11px] text-slate-500 mt-1">If this record exists under a different authority, it is shielded by data isolation.</p>
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectResult(item.category, item.raw);
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800/70 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3 truncate pr-2">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/60 text-sky-400 group-hover:bg-slate-700 transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-sky-300 truncate">
                          {item.title}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-sky-300 uppercase tracking-wide">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 shrink-0" />
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
