import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Award, 
  Calendar, 
  CreditCard, 
  ShoppingBag, 
  Coffee, 
  Ticket, 
  CheckCircle, 
  FileText, 
  Headphones 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  isOpen,
  onClose,
  userEmail = 'alex.wright@gmail.com'
}) => {
  const { currentAuthority, accountType } = useAuth();
  const { bookings, orders, posTabs, eventTickets, invoices, leads } = useData();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'membership' | 'bookings' | 'payments' | 'purchases' | 'pos' | 'events' | 'crm' | 'support'
  >('profile');

  if (!isOpen) return null;

  // Find user data
  const userBookings = bookings.filter(b => b.userEmail === userEmail);
  const userOrders = orders.filter(o => o.customerName.toLowerCase().includes('alex') || o.userId?.includes('normal'));
  const userTickets = eventTickets.filter(t => t.userEmail === userEmail);
  const userInvoices = invoices.filter(i => i.clientOrMemberName.toLowerCase().includes('alex') || i.clientOrMemberName.toLowerCase().includes('reed'));
  const userLeads = leads.filter(l => l.email === userEmail);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-display font-extrabold text-xl text-white shadow-md shadow-sky-500/20">
              AW
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-white">Alexander Wright</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  SILVER MEMBER
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                alex.wright@gmail.com &bull; +44 7700 900111 &bull; Member since Aug 2026
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Rule 44) */}
        <div className="flex items-center border-b border-slate-800 px-6 bg-slate-950 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'profile', label: 'Profile', icon: UserIcon },
            { id: 'membership', label: 'Membership', icon: Award },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'payments', label: 'Payments', icon: CreditCard },
            { id: 'purchases', label: 'Shop Purchases', icon: ShoppingBag },
            { id: 'pos', label: 'Bar & Tabs', icon: Coffee },
            { id: 'events', label: 'Events & Tickets', icon: Ticket },
            { id: 'crm', label: 'CRM & Activity', icon: FileText },
            { id: 'support', label: 'Support', icon: Headphones },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-3 border-b-2 transition-all whitespace-nowrap ${
                  isActive 
                    ? 'border-sky-500 text-sky-300 font-bold bg-slate-900' 
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Contact Information</h4>
                <div className="text-xs text-slate-200 space-y-1">
                  <p><strong>Full Name:</strong> Alexander Wright</p>
                  <p><strong>Email:</strong> alex.wright@gmail.com</p>
                  <p><strong>Phone:</strong> +44 7700 900111</p>
                  <p><strong>Primary Sports:</strong> Padel, Tennis</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Security &amp; Account</h4>
                <div className="text-xs text-slate-200 space-y-1">
                  <p><strong>Email Verification:</strong> Verified (OTP Completed)</p>
                  <p><strong>Account Role:</strong> Normal User</p>
                  <p><strong>Authority Status:</strong> Active — Member Access</p>
                  <p><strong>Max Plays/Day:</strong> 2 Sessions (Enforced)</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'membership' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 border border-amber-500/40 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-amber-400">Current Tier</span>
                  <h4 className="text-lg font-bold text-white mt-0.5">Silver Standard Annual Pass</h4>
                  <p className="text-xs text-slate-400 mt-1">Renewal Due: April 15, 2027 &bull; 10% Pro Shop &amp; Bar Discount</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-mono font-bold text-amber-400">₹45/mo</div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/40">Active &bull; Good Standing</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Court Bookings History</h4>
              {userBookings.length === 0 ? (
                <div className="text-xs text-slate-500 py-6 text-center">No bookings recorded yet.</div>
              ) : (
                <div className="space-y-2">
                  {userBookings.map(b => (
                    <div key={b.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">{b.courtName}</div>
                        <div className="text-slate-400 text-[11px]">{b.date} &bull; {b.startTime} - {b.endTime} (60 min)</div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.status === 'CHECKED-IN' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {b.status}
                        </span>
                        <div className="text-slate-300 font-mono mt-1">₹{b.amount.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Invoices &amp; Transactions</h4>
              <div className="space-y-2">
                {userInvoices.map(inv => (
                  <div key={inv.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{inv.invoiceNumber} — {inv.type.toUpperCase()}</div>
                      <div className="text-slate-400 text-[11px]">Due: {inv.dueDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-mono font-bold">₹{inv.total.toFixed(2)}</div>
                      <span className="text-[10px] text-slate-400 font-semibold">{inv.status.toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Pro Shop Online &amp; Counter Purchases</h4>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs space-y-2">
                <div className="flex justify-between font-semibold text-white">
                  <span>Bullpadel Vertex 03 Comfort Racket</span>
                  <span>₹155.00 (Member Rate)</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Purchased online &bull; Collected at Pro Shop Counter</span>
                  <span className="text-emerald-400">Fulfilled</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pos' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Bar &amp; Cafeteria Open Tabs</h4>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Table 1: Courtside Terrace</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">TAB ACTIVE</span>
                </div>
                <div className="text-slate-400 text-[11px] space-y-1">
                  <p>2x Peanut Butter Blast Whey Shake (₹11.00)</p>
                  <p>2x Artisan Grilled Chicken Panini (₹15.00)</p>
                </div>
                <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-slate-200">
                  <span>Current Tab Total</span>
                  <span className="text-cyan-400 font-mono">₹26.00</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Event Tickets &amp; QR Attendance</h4>
              {userTickets.map(tkt => (
                <div key={tkt.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-white">{tkt.eventTitle}</h5>
                    <p className="text-slate-400 text-[11px] mt-0.5">QR Code: <span className="font-mono text-cyan-400">{tkt.qrCode}</span></p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                    {tkt.checkedIn ? 'CHECKED IN' : 'VALID PASS'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'crm' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase">CRM Activity &amp; Interaction Log</h4>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs space-y-1">
                <div className="font-semibold text-slate-200">Trial to Silver Membership Conversion</div>
                <p className="text-slate-400 text-[11px]">Converted on Sep 28 by Alex Hunter after 1-hour coaching trial.</p>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Support Inquiries</h4>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs space-y-1">
                <div className="flex justify-between font-semibold text-slate-200">
                  <span>Locker #14 Combination Reset</span>
                  <span className="text-emerald-400">Resolved</span>
                </div>
                <p className="text-slate-400 text-[11px]">Combination reset provided at Front Desk by Sarah Jenkins.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
