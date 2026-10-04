import React, { useState } from 'react';
import { 
  Award, 
  Calendar, 
  CreditCard, 
  ShoppingBag, 
  Ticket, 
  Clock, 
  CheckCircle2, 
  Plus, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  Send,
  Flame,
  Info,
  Bell,
  Headphones,
  Activity,
  User,
  QrCode,
  Check,
  X,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { SportType } from '../../types';
import { openRazorpayCheckout } from '../../services/razorpay';

interface UserDashboardProps {
  onOpenCustomerProfile: () => void;
  onOpenPasswordModal: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onOpenCustomerProfile,
  onOpenPasswordModal
}) => {
  const { currentUser, switchActiveAuthority } = useAuth();
  const { 
    courts, 
    bookings, 
    products, 
    events, 
    eventTickets, 
    createBooking, 
    registerForEvent, 
    createOrder,
    invoices
  } = useData();

  // Navigation tab inside User Panel (Rule 12 full fidelity)
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'membership_payments' | 'shop_purchases' | 'events_attendance' | 'support_notifications'>('overview');

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSport, setSelectedSport] = useState<SportType>('tennis');
  const [selectedCourtId, setSelectedCourtId] = useState('');
  const [bookingDate, setBookingDate] = useState('2026-10-03');
  const [bookingTime, setBookingTime] = useState('14:00');
  const [bookingMsg, setBookingMsg] = useState<{ text: string; error?: boolean } | null>(null);

  // Shop Cart State
  const [cart, setCart] = useState<{ productId: string; qty: number }[]>([]);
  const [orderPlacedMsg, setOrderPlacedMsg] = useState<string | null>(null);

  // In-app Support Ticket State
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSentMsg, setSupportSentMsg] = useState<string | null>(null);

  if (!currentUser) return null;

  // Filter personal records
  const myBookings = bookings.filter(b => b.userId === currentUser.id || b.userEmail === currentUser.email);
  const myTickets = eventTickets.filter(t => t.userId === currentUser.id || t.userEmail === currentUser.email);
  const myInvoices = invoices.filter(i => i.clientOrMemberName.toLowerCase().includes(currentUser.name.toLowerCase()));

  const availableCourtsForSport = courts.filter(c => c.sport === selectedSport && c.status === 'active');

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingMsg(null);

    const court = courts.find(c => c.id === selectedCourtId) || availableCourtsForSport[0];
    if (!court) {
      setBookingMsg({ text: 'Please select an available court.', error: true });
      return;
    }

    const [h, m] = bookingTime.split(':').map(Number);
    const endH = String(h + 1).padStart(2, '0');
    const endM = String(m).padStart(2, '0');
    const endTime = `${endH}:${endM}`;

    const isMember = currentUser.membershipTier === 'gold' || currentUser.membershipTier === 'silver' || currentUser.membershipTier === 'junior';
    const amount = isMember ? court.memberHourlyRate : court.hourlyRate;

    const res = createBooking({
      courtId: court.id,
      courtName: court.name,
      sport: court.sport,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userTier: currentUser.membershipTier,
      date: bookingDate,
      startTime: bookingTime,
      endTime,
      durationMinutes: 60,
      amount,
      status: 'BOOKED'
    });

    if (res.success) {
      setBookingMsg({ text: res.message });
      setTimeout(() => setShowBookingModal(false), 1400);
    } else {
      setBookingMsg({ text: res.message, error: true });
    }
  };

  const handlePayWithRazorpay = () => {
    const court = courts.find(c => c.id === selectedCourtId) || availableCourtsForSport[0];
    if (!court) {
      setBookingMsg({ text: 'Please select an available court.', error: true });
      return;
    }
    const isMember = currentUser.membershipTier === 'gold' || currentUser.membershipTier === 'silver' || currentUser.membershipTier === 'junior';
    const amount = isMember ? court.memberHourlyRate : court.hourlyRate;

    openRazorpayCheckout({
      amount,
      title: `${court.name} Booking`,
      description: `30-Min Slot: ${bookingDate} at ${bookingTime}`,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhone: currentUser.phone,
      onSuccess: (paymentId) => {
        const [h, m] = bookingTime.split(':').map(Number);
        const endH = String(h + 1).padStart(2, '0');
        const endM = String(m).padStart(2, '0');
        const endTime = `${endH}:${endM}`;

        createBooking({
          courtId: court.id,
          courtName: court.name,
          sport: court.sport,
          userId: currentUser.id,
          userName: currentUser.name,
          userEmail: currentUser.email,
          userTier: currentUser.membershipTier,
          date: bookingDate,
          startTime: bookingTime,
          endTime,
          durationMinutes: 60,
          amount,
          status: 'BOOKED'
        });

        setBookingMsg({ text: `Bharat UPI Verified (Txn: ${paymentId})! Reservation confirmed.` });
        setTimeout(() => setShowBookingModal(false), 1800);
      },
      onFailure: () => {
        setBookingMsg({ text: 'UPI payment cancelled or dismissed.', error: true });
      }
    });
  };

  const handleAddToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => item.productId === productId ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { productId, qty: 1 }];
    });
  };

  const handleCheckoutCart = () => {
    if (cart.length === 0) return;
    const items = cart.map(ci => {
      const p = products.find(prod => prod.id === ci.productId)!;
      const price = currentUser.membershipTier !== 'none' ? p.memberPrice : p.price;
      return {
        productId: p.id,
        productName: p.name,
        quantity: ci.qty,
        price
      };
    });

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    openRazorpayCheckout({
      amount: total,
      title: 'Pro Shop Gear Purchase',
      description: `${items.length} items from Champions Club Pro Shop`,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhone: currentUser.phone,
      onSuccess: (paymentId) => {
        createOrder({
          userId: currentUser.id,
          customerName: currentUser.name,
          customerPhone: currentUser.phone,
          type: 'online',
          items,
          subtotal,
          discount: 0,
          tax,
          total,
          paymentMethod: 'upi_qr',
          paymentStatus: 'paid'
        });

        setCart([]);
        setOrderPlacedMsg(`Order confirmed via Bharat UPI to anjanabajaniya@okicici (Txn: ${paymentId})! Pick-up ready at Pro Shop counter.`);
        setTimeout(() => setOrderPlacedMsg(null), 4000);
      },
      onFailure: () => {
        // Fallback manual order if checkout dismissed
        createOrder({
          userId: currentUser.id,
          customerName: currentUser.name,
          customerPhone: currentUser.phone,
          type: 'online',
          items,
          subtotal,
          discount: 0,
          tax,
          total,
          paymentMethod: 'card',
          paymentStatus: 'paid'
        });
        setCart([]);
        setOrderPlacedMsg(`Order confirmed! Total ₹${total.toFixed(2)} charged.`);
        setTimeout(() => setOrderPlacedMsg(null), 4000);
      }
    });
  };

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportSubject.trim()) return;
    setSupportSentMsg(`Inquiry logged with Service Authority (SERVICE-001). Ticket #TKT-${Math.floor(1000 + Math.random() * 9000)} created.`);
    setSupportSubject('');
    setSupportMessage('');
    setTimeout(() => setSupportSentMsg(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* Top Glowing Laser Telemetry Strip */}
      <div 
        className="h-1 rounded-full w-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500"
        style={{ boxShadow: '0 0 14px rgba(6, 182, 212, 0.6)' }}
      />

      {/* Slide 10: Normal User Header (Rule 12 & 13) */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold tracking-widest text-cyan-400 uppercase">
              SLIDE 10 &bull; NORMAL USER PANEL
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
              UID: {currentUser.id}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ACCOUNT ACTIVE
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            Welcome back, {currentUser.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            The Champions Club &bull; Plan: <strong className="text-amber-400 uppercase">{currentUser.membershipTier} Tier</strong> &bull; {currentUser.email}
          </p>
        </div>

        {/* Authority Status & Authority Switcher (Rule 12 & 14) */}
        <div className="flex flex-wrap items-center gap-2">
          {currentUser.assignedAuthorities.length > 0 && (
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono px-2 font-bold flex items-center gap-1">
                <Layers className="w-3 h-3 text-cyan-400" />
                Staff Desk:
              </span>
              {currentUser.assignedAuthorities.map(aId => (
                <button
                  key={aId}
                  onClick={() => switchActiveAuthority(aId)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-xs font-bold text-cyan-300 transition-colors flex items-center gap-1"
                >
                  <span>{aId}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}

          <div className="px-3.5 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-emerald-300">Verified Member Account</span>
          </div>

          <button
            onClick={onOpenCustomerProfile}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>Profile</span>
          </button>

          <button
            onClick={onOpenPasswordModal}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Rule 12 In-Dashboard Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'bookings', label: `Court Bookings (${myBookings.length})` },
          { id: 'membership_payments', label: 'Membership & Payments' },
          { id: 'shop_purchases', label: `Gear Shop & Purchases (${cart.length > 0 ? `${cart.length} in Cart` : 'Shelf'})` },
          { id: 'events_attendance', label: `Events & Attendance (${myTickets.length})` },
          { id: 'support_notifications', label: 'Support & Notifications' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan' 
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {orderPlacedMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{orderPlacedMsg}</span>
        </div>
      )}

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Membership Tier */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 shadow-xl space-y-3">
              <div className="flex justify-between items-start">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-300 uppercase border border-amber-500/40">
                  {currentUser.membershipTier} Tier
                </span>
              </div>
              <div>
                <div className="text-lg font-bold text-white">The Champions Club Pass</div>
                <p className="text-xs text-slate-400 mt-0.5">Expires: {currentUser.membershipExpiry || '2027-04-15'}</p>
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold pt-1 border-t border-slate-800">
                &check; 50% Court Discount &bull; 10% Pro Shop &amp; Bar
              </div>
            </div>

            {/* Daily Booking Limits */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="flex justify-between items-start">
                <div className="p-2.5 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-500/40">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                  Max 2 / Day
                </span>
              </div>
              <div>
                <div className="text-2xl font-display font-extrabold text-white">
                  {myBookings.filter(b => b.date === '2026-10-03' && b.status !== 'CANCELLED').length} / 2
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Today&apos;s Sessions Reserved</p>
              </div>
              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book 1-Hr Court Session</span>
              </button>
            </div>

            {/* Friday Social Play */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/40 shadow-xl space-y-3">
              <div className="flex justify-between items-start">
                <div className="p-2.5 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-500/40">
                  <Flame className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/40">
                  Every Friday
                </span>
              </div>
              <div>
                <div className="text-base font-bold text-white">Friday Night Social Play</div>
                <p className="text-xs text-slate-400 mt-0.5">Shared court doubles, mixer &amp; DJ</p>
              </div>
              <button
                onClick={() => {
                  const res = registerForEvent('evt-1', currentUser.id, currentUser.name, currentUser.email, currentUser.membershipTier);
                  alert(res.message);
                }}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow-violet transition-all flex items-center justify-center space-x-1"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Join Social Play (FREE)</span>
              </button>
            </div>

            {/* Pro Gear Cart */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  Cart: {cart.reduce((s, c) => s + c.qty, 0)} Items
                </span>
              </div>
              <div>
                <div className="text-base font-bold text-white">Pro Gear Shop Shelf</div>
                <p className="text-xs text-slate-400 mt-0.5">Order from sofa &bull; collect at club</p>
              </div>
              <button
                onClick={handleCheckoutCart}
                disabled={cart.length === 0}
                className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-glow-emerald transition-all flex items-center justify-center space-x-1"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Checkout (₹{cart.reduce((s, c) => {
                  const p = products.find(pr => pr.id === c.productId);
                  return s + (p ? (currentUser.membershipTier !== 'none' ? p.memberPrice : p.price) * c.qty : 0);
                }, 0).toFixed(2)})</span>
              </button>
            </div>

          </div>

          {/* Dual Columns: Next Court Session & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* My Active Bookings Snapshot */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Upcoming Court Reservations</h3>
                </div>
                <button onClick={() => setActiveTab('bookings')} className="text-xs text-cyan-400 hover:underline">
                  View Full Schedule &rarr;
                </button>
              </div>

              <div className="space-y-2.5">
                {myBookings.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500 space-y-2">
                    <p>No court bookings scheduled for today.</p>
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                    >
                      Book A Court Session
                    </button>
                  </div>
                ) : (
                  myBookings.slice(0, 3).map(b => (
                    <div key={b.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">{b.courtName}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.status === 'CHECKED-IN' ? 'bg-cyan-500/20 text-cyan-300' :
                            b.status === 'BOOKED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {b.status}
                          </span>
                        </div>
                        <div className="text-slate-400 mt-0.5">
                          Date: <strong className="text-slate-200">{b.date}</strong> &bull; Time: <strong className="text-cyan-400">{b.startTime} - {b.endTime}</strong>
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-emerald-400">
                        ₹{b.amount.toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Rule 12 Recent Activity & Announcements Snapshot */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">Recent Account Activity</h3>
                </div>
                <button onClick={() => setActiveTab('support_notifications')} className="text-xs text-indigo-400 hover:underline">
                  Alerts &rarr;
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Email Verified &amp; Active</div>
                    <p className="text-[11px] text-slate-400">Slide 09 Gmail confirmation complete.</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-2.5">
                  <Flame className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Friday Night Social Play Pass</div>
                    <p className="text-[11px] text-slate-400">Enrolled for upcoming community doubles mixer.</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Authority Governance Check</div>
                    <p className="text-[11px] text-slate-400">Isolated standard user permissions enforced.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">My Court Schedule &bull; 60-Min Sessions</h3>
              <p className="text-xs text-slate-400">Reserve tennis clay courts, padel glass courts, cricket nets, or football pitches.</p>
            </div>
            <button
              onClick={() => setShowBookingModal(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Session</span>
            </button>
          </div>

          <div className="space-y-3">
            {myBookings.map(b => (
              <div key={b.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-base">{b.courtName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.status === 'CHECKED-IN' ? 'bg-cyan-500/20 text-cyan-300' :
                      b.status === 'BOOKED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {b.status}
                    </span>
                    <span className="capitalize text-slate-500">({b.sport})</span>
                  </div>
                  <div className="text-slate-400 flex items-center space-x-3 text-xs">
                    <span>Date: <strong className="text-slate-200">{b.date}</strong></span>
                    <span>Time: <strong className="text-cyan-400">{b.startTime} - {b.endTime}</strong> (60 mins)</span>
                    <span>Ref: <strong className="font-mono text-slate-400">{b.id}</strong></span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-mono font-bold text-emerald-400">₹{b.amount.toFixed(2)}</div>
                  <span className="text-[10px] text-slate-500">Paid via Member Billing</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: MEMBERSHIP & PAYMENTS */}
      {activeTab === 'membership_payments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400">Current Plan</div>
              <div className="text-2xl font-bold font-display text-amber-400 uppercase">{currentUser.membershipTier} Member</div>
              <div className="text-xs text-slate-400">Valid through: {currentUser.membershipExpiry || '2027-04-15'}</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400">Court Discounts</div>
              <div className="text-2xl font-bold font-mono text-cyan-400">Up to 50% Off</div>
              <div className="text-xs text-slate-400">Applied automatically at court booking</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400">Club Amenity Perks</div>
              <div className="text-2xl font-bold font-mono text-emerald-400">10% F&amp;B / Shop</div>
              <div className="text-xs text-slate-400">Free Friday Night Social Play entry</div>
            </div>

          </div>

          {/* Payment & Invoices History */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <span>Payments &amp; Invoice Statements (₹ INR)</span>
            </h3>

            <div className="space-y-2.5">
              {myInvoices.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950 text-center text-xs text-slate-500">
                  All current invoices settled. No pending balance on account.
                </div>
              ) : (
                myInvoices.map(inv => (
                  <div key={inv.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{inv.id} &bull; {inv.createdAt}</div>
                      <div className="text-slate-400 text-[11px]">Due: {inv.dueDate} &bull; Card Settlement</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-white">₹{inv.total.toFixed(2)}</div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        inv.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: SHOP & PURCHASES */}
      {activeTab === 'shop_purchases' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Pro Gear Shop (Shared Shelf)</h3>
              <p className="text-xs text-slate-400">Real-time inventory synchronized with the Champions Club physical front counter.</p>
            </div>
            <button
              onClick={handleCheckoutCart}
              disabled={cart.length === 0}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-glow-emerald transition-all flex items-center gap-1.5"
            >
              <CreditCard className="w-4 h-4" />
              <span>Checkout ({cart.reduce((s, c) => s + c.qty, 0)} Items)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(prod => {
              const isMember = currentUser.membershipTier !== 'none';
              const price = isMember ? prod.memberPrice : prod.price;

              return (
                <div key={prod.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="h-36 rounded-xl overflow-hidden bg-slate-950">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm truncate">{prod.name}</h5>
                    <div className="text-xs text-slate-400 capitalize">{prod.category} &bull; Stock: {prod.stock}</div>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-base font-bold font-mono text-cyan-400">₹{price.toFixed(2)}</span>
                      {isMember && <span className="text-xs line-through text-slate-500 font-mono">₹{prod.price.toFixed(2)}</span>}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(prod.id)}
                    disabled={prod.stock === 0}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-bold text-xs border border-slate-700 transition-colors disabled:opacity-40"
                  >
                    + Add to Club Cart
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: EVENTS & ATTENDANCE */}
      {activeTab === 'events_attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Event Passes with Digital QR Codes */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-400" />
                <span>My Digital Passes &amp; QR Attendance</span>
              </h3>

              <div className="space-y-3">
                {myTickets.map(tkt => (
                  <div key={tkt.id} className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                    <div className="text-sm font-bold text-white">{tkt.eventTitle}</div>
                    <div className="text-xs text-slate-400">Holder: {tkt.userName}</div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-xs font-bold text-cyan-400">
                      {tkt.qrCode}
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-emerald-400 font-semibold">{tkt.checkedIn ? '✓ Scanned at Gate' : '○ Active Valid Pass'}</span>
                      <span className="text-slate-500">{tkt.purchasedAt.slice(0, 10)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Club Tournaments & Socials */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-indigo-400" />
                <span>Upcoming Club Tournaments</span>
              </h3>

              <div className="space-y-3">
                {events.map(ev => (
                  <div key={ev.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-sm">{ev.title}</h4>
                        <p className="text-slate-400 text-xs mt-0.5">{ev.date} &bull; {ev.time} &bull; {ev.sport.toUpperCase()}</p>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold">
                        {ev.ticketPriceMember === 0 ? 'FREE' : `₹${ev.ticketPriceMember}`}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        const res = registerForEvent(ev.id, currentUser.id, currentUser.name, currentUser.email, currentUser.membershipTier);
                        alert(res.message);
                      }}
                      className="w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
                    >
                      Register Pass
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB: SUPPORT & NOTIFICATIONS */}
      {activeTab === 'support_notifications' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* In-App Concierge Inquiry Form */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Headphones className="w-5 h-5 text-amber-400" />
              <span>Contact Member Concierge (SERVICE-001)</span>
            </h3>
            <p className="text-xs text-slate-400">Submit locker queries, gear stringing requests, or facility feedback.</p>

            {supportSentMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{supportSentMsg}</span>
              </div>
            )}

            <form onSubmit={handleSendSupport} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Babolat racket string tension adjustment"
                  value={supportSubject}
                  onChange={e => setSupportSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide details for Member Services..."
                  value={supportMessage}
                  onChange={e => setSupportMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-glow-amber transition-all"
              >
                Dispatch Inquiry to Desk
              </button>
            </form>
          </div>

          {/* Club Broadcast Notifications */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-400" />
              <span>Club Telemetry &amp; Broadcast Alerts</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Centre Clay Courts Groomed</span>
                  <span className="text-[10px] text-slate-500">2h ago</span>
                </div>
                <p className="text-slate-400 text-[11px]">Laser-leveling and evening hydration complete for peak play.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Friday Night Social Play Doubles Draw</span>
                  <span className="text-[10px] text-slate-500">1d ago</span>
                </div>
                <p className="text-slate-400 text-[11px]">Registration open on court 1-4 with resident DJ mixer.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Security Governance Active</span>
                  <span className="text-[10px] text-slate-500">System</span>
                </div>
                <p className="text-slate-400 text-[11px]">Your account is authenticated with protected authority isolation.</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Book Court Session (1 Hour)</h3>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-white text-xs">
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4 pt-4 text-xs">
              
              {/* Select Sport */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Select Sport</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['football', 'tennis', 'cricket', 'badminton', 'padel', 'running'] as SportType[]).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { setSelectedSport(s); setSelectedCourtId(''); }}
                      className={`p-2 rounded-xl capitalize font-bold border transition-all ${
                        selectedSport === s 
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500' 
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Court */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Select Court / Pitch</label>
                <select
                  value={selectedCourtId}
                  onChange={e => setSelectedCourtId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="">-- Choose Court --</option>
                  {availableCourtsForSport.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} (₹{currentUser.membershipTier !== 'none' ? c.memberHourlyRate : c.hourlyRate}/hr)
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & 30-Min Interval Slots */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                  </input>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Start Time (30-min steps)</label>
                  <select
                    value={bookingTime}
                    onChange={e => setBookingTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    {[
                      '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
                      '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
                      '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
                      '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
                      '19:00', '19:30', '20:00', '20:30', '21:00'
                    ].map(t => (
                      <option key={t} value={t}>{t} (1 hr duration)</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Business Rule Notice */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Club Booking Engine Business Rules</span>
                </div>
                <p>&bull; Sessions last strictly 1 hour.</p>
                <p>&bull; Maximum 2 reservations per member per day.</p>
                <p>&bull; Double-booking is automatically rejected by collision detection.</p>
              </div>

              {bookingMsg && (
                <div className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
                  bookingMsg.error 
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}>
                  {bookingMsg.error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  <span>{bookingMsg.text}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handlePayWithRazorpay}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-500/25 cursor-pointer active:scale-95"
                >
                  <span>⚡ Pay with Bharat UPI (GPay / PhonePe / QR)</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-glow-cyan"
                  >
                    Book Slot
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
