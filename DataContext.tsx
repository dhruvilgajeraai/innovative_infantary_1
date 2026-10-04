import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Court, 
  Booking, 
  Product, 
  Order, 
  POSTable, 
  POSTab, 
  ClubEvent, 
  EventTicket, 
  Lead, 
  BusinessClient, 
  Invoice, 
  Expense, 
  StaffMember, 
  StaffTask, 
  AuditLog, 
  AppNotification, 
  Volunteer, 
  Fundraiser, 
  Election, 
  ReimbursementRequest,
  MembershipTier,
  SportType,
  TransactionRecord
} from '../types';
import { 
  INITIAL_COURTS, 
  INITIAL_PRODUCTS, 
  INITIAL_POS_TABLES, 
  INITIAL_EVENTS, 
  INITIAL_LEADS, 
  INITIAL_BUSINESS_CLIENTS, 
  INITIAL_STAFF, 
  INITIAL_TASKS, 
  INITIAL_INVOICES, 
  INITIAL_EXPENSES, 
  INITIAL_VOLUNTEERS, 
  INITIAL_FUNDRAISERS, 
  INITIAL_ELECTIONS, 
  INITIAL_REIMBURSEMENTS, 
  INITIAL_BOOKINGS,
  INITIAL_TRANSACTIONS
} from '../data/seedData';
import { 
  syncCollectionToFirestore, 
  syncAllSportsDataToFirestore,
  isConnectedToLiveFirestore 
} from '../services/firebase';

interface DataContextType {
  courts: Court[];
  bookings: Booking[];
  products: Product[];
  orders: Order[];
  transactions: TransactionRecord[];
  posTables: POSTable[];
  posTabs: POSTab[];
  events: ClubEvent[];
  eventTickets: EventTicket[];
  leads: Lead[];
  businessClients: BusinessClient[];
  invoices: Invoice[];
  expenses: Expense[];
  staff: StaffMember[];
  tasks: StaffTask[];
  auditLogs: AuditLog[];
  notifications: AppNotification[];
  volunteers: Volunteer[];
  fundraisers: Fundraiser[];
  elections: Election[];
  reimbursements: ReimbursementRequest[];
  firebaseConnected: boolean;
  
  // Actions
  recordTransaction: (txn: Omit<TransactionRecord, 'id' | 'timestamp'>) => TransactionRecord;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => { success: boolean; message: string; bookingId?: string };
  cancelBooking: (bookingId: string) => void;
  checkInBooking: (bookingId: string) => void;
  adjustProductStock: (productId: string, delta: number) => void;
  updateProduct: (product: Product) => void;
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Order;
  openPosTab: (tableNumber: number, customerName: string, memberTier?: MembershipTier) => string;
  addOrderToTab: (tabId: string, item: string, price: number, qty: number) => void;
  settlePosTab: (tabId: string, paymentMethod: 'cash' | 'card' | 'upi') => void;
  createLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'lastContact'>) => void;
  updateLeadStatus: (leadId: string, status: Lead['status']) => void;
  checkInEventTicket: (ticketIdOrQr: string) => { success: boolean; message: string; ticket?: EventTicket };
  registerForEvent: (eventId: string, userId: string, userName: string, userEmail: string, userTier: MembershipTier) => { success: boolean; message: string; ticketId?: string };
  recordAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  voteInElection: (electionId: string, candidateId: string) => void;
  createInvoice: (inv: Omit<Invoice, 'id' | 'createdAt'>) => void;
  markInvoicePaid: (id: string) => void;
  createExpense: (exp: Omit<Expense, 'id'>) => void;
  createTask: (tsk: Omit<StaffTask, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: StaffTask['status']) => void;
  
  // Master Data Management Actions
  addCourt: (court: Omit<Court, 'id'>) => Court;
  updateCourt: (court: Court) => void;
  deleteCourt: (courtId: string) => void;
  toggleCourtMaintenance: (courtId: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  deleteProduct: (productId: string) => void;
  syncToCloudFirebase: () => Promise<{ success: boolean; syncedCount: number; message: string }>;
  syncToServerDisk: () => Promise<{ success: boolean; message: string; counts?: any }>;
  exportDataBackup: () => string;
  importDataBackup: (jsonStr: string) => { success: boolean; message: string };
  resetAllDataToDefaults: () => void;
}

const DB_VERSION_KEY = 'arenaflow_data_version';
const CURRENT_DB_VERSION = 'v2_clean_real_ledger';

// Automatically purge legacy dummy data from browser cache for clean real-world state
if (typeof window !== 'undefined' && localStorage.getItem(DB_VERSION_KEY) !== CURRENT_DB_VERSION) {
  localStorage.removeItem('af_transactions');
  localStorage.removeItem('af_bookings');
  localStorage.removeItem('af_orders');
  localStorage.removeItem('af_pos_tabs');
  localStorage.removeItem('af_tickets');
  localStorage.removeItem('af_invoices');
  localStorage.removeItem('af_expenses');
  localStorage.removeItem('af_leads');
  localStorage.removeItem('af_clients');
  localStorage.setItem(DB_VERSION_KEY, CURRENT_DB_VERSION);
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courts, setCourts] = useState<Court[]>(() => {
    const saved = localStorage.getItem('af_courts');
    return saved ? JSON.parse(saved) : INITIAL_COURTS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('af_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('af_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('af_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    const saved = localStorage.getItem('af_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [posTables, setPosTables] = useState<POSTable[]>(() => {
    const saved = localStorage.getItem('af_pos_tables');
    return saved ? JSON.parse(saved) : INITIAL_POS_TABLES;
  });

  const [posTabs, setPosTabs] = useState<POSTab[]>(() => {
    const saved = localStorage.getItem('af_pos_tabs');
    return saved ? JSON.parse(saved) : [];
  });

  const [events, setEvents] = useState<ClubEvent[]>(() => {
    const saved = localStorage.getItem('af_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [eventTickets, setEventTickets] = useState<EventTicket[]>(() => {
    const saved = localStorage.getItem('af_tickets');
    return saved ? JSON.parse(saved) : [];
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('af_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [businessClients, setBusinessClients] = useState<BusinessClient[]>(() => {
    const saved = localStorage.getItem('af_clients');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS_CLIENTS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('af_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('af_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('af_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [tasks, setTasks] = useState<StaffTask[]>(() => {
    const saved = localStorage.getItem('af_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('af_audit_logs');
    return saved ? JSON.parse(saved) : [
      { id: 'log-1', timestamp: '2026-10-03 12:40', actorId: 'STAFF-001', actorName: 'Marcus Bennett', actorType: 'authority', action: 'Order Created', category: 'inventory', details: 'POS Order billed on Table 1 for ₹26.00' },
      { id: 'log-2', timestamp: '2026-10-03 12:30', actorId: 'BOOKING-001', actorName: 'Sarah Jenkins', actorType: 'authority', action: 'Court Check-in', category: 'booking', details: 'Alexander Wright checked into Panoramic Glass Padel Court 1' },
      { id: 'log-3', timestamp: '2026-10-03 12:15', actorId: 'SUPER-001', actorName: 'Chief Administrator', actorType: 'superadmin', action: 'System Audit', category: 'security', details: 'Automated authority isolation & permission integrity check completed' }
    ];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('af_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 'notif-1', title: 'Low Stock Alert', message: 'Yonex Aerosensa 30 Shuttlecocks stock reached 3 units (Threshold: 6)', type: 'warning', authorityScope: 'SHOP-001', read: false, createdAt: '2026-10-03 12:00' },
      { id: 'notif-2', title: 'Court Check-in Complete', message: 'Alexander Wright checked into Padel Court 1', type: 'info', authorityScope: 'BOOKING-001', read: false, createdAt: '2026-10-03 12:30' },
      { id: 'notif-3', title: 'New Corporate Lead', message: 'Vikram Patel enquired for Box Cricket Corporate Tournament', type: 'success', authorityScope: 'CRM-001', read: false, createdAt: '2026-10-03 12:10' }
    ];
  });

  const [volunteers, setVolunteers] = useState<Volunteer[]>(() => {
    const saved = localStorage.getItem('af_volunteers');
    return saved ? JSON.parse(saved) : INITIAL_VOLUNTEERS;
  });

  const [fundraisers, setFundraisers] = useState<Fundraiser[]>(() => {
    const saved = localStorage.getItem('af_fundraisers');
    return saved ? JSON.parse(saved) : INITIAL_FUNDRAISERS;
  });

  const [elections, setElections] = useState<Election[]>(() => {
    const saved = localStorage.getItem('af_elections');
    return saved ? JSON.parse(saved) : INITIAL_ELECTIONS;
  });

  const [reimbursements, setReimbursements] = useState<ReimbursementRequest[]>(() => {
    const saved = localStorage.getItem('af_reimbursements');
    return saved ? JSON.parse(saved) : INITIAL_REIMBURSEMENTS;
  });

  // Local storage persistence
  useEffect(() => { localStorage.setItem('af_courts', JSON.stringify(courts)); }, [courts]);
  useEffect(() => { localStorage.setItem('af_bookings', JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem('af_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('af_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('af_pos_tables', JSON.stringify(posTables)); }, [posTables]);
  useEffect(() => { localStorage.setItem('af_pos_tabs', JSON.stringify(posTabs)); }, [posTabs]);
  useEffect(() => { localStorage.setItem('af_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('af_tickets', JSON.stringify(eventTickets)); }, [eventTickets]);
  useEffect(() => { localStorage.setItem('af_leads', JSON.stringify(leads)); }, [leads]);
  useEffect(() => { localStorage.setItem('af_clients', JSON.stringify(businessClients)); }, [businessClients]);
  useEffect(() => { localStorage.setItem('af_invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem('af_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('af_staff', JSON.stringify(staff)); }, [staff]);
  useEffect(() => { localStorage.setItem('af_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('af_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('af_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('af_volunteers', JSON.stringify(volunteers)); }, [volunteers]);
  useEffect(() => { localStorage.setItem('af_fundraisers', JSON.stringify(fundraisers)); }, [fundraisers]);
  useEffect(() => { localStorage.setItem('af_elections', JSON.stringify(elections)); }, [elections]);
  useEffect(() => { localStorage.setItem('af_reimbursements', JSON.stringify(reimbursements)); }, [reimbursements]);
  useEffect(() => { localStorage.setItem('af_transactions', JSON.stringify(transactions)); }, [transactions]);

  // Continuous background auto-sync to Server Disk DB
  useEffect(() => {
    const timer = setTimeout(() => {
      fetch('/api/data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courts,
          bookings,
          products,
          orders,
          transactions,
          posTabs,
          invoices,
          staff,
          leads,
          auditLogs
        })
      }).catch(() => {});
    }, 1000);
    return () => clearTimeout(timer);
  }, [courts, bookings, products, orders, transactions, posTabs, invoices, staff, leads, auditLogs.length]);

  // Sync to Firestore in background
  useEffect(() => {
    if (isConnectedToLiveFirestore) {
      syncCollectionToFirestore('courts', courts);
      syncCollectionToFirestore('bookings', bookings);
      syncCollectionToFirestore('products', products);
      syncCollectionToFirestore('orders', orders);
      syncCollectionToFirestore('posTabs', posTabs);
      syncCollectionToFirestore('invoices', invoices);
      syncCollectionToFirestore('leads', leads);
      syncCollectionToFirestore('staff', staff);
      syncCollectionToFirestore('transactions', transactions);
    }
  }, [courts.length, bookings.length, products.length, orders.length, posTabs.length, invoices.length, leads.length, transactions.length]);

  // Audit log recorder
  const recordAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: `log-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now().toString(36)}`,
      read: false,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const recordTransaction = (txnData: Omit<TransactionRecord, 'id' | 'timestamp'>): TransactionRecord => {
    const newTxn: TransactionRecord = {
      ...txnData,
      id: `TXN-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setTransactions(prev => [newTxn, ...prev]);
    return newTxn;
  };

  // 1-HOUR SESSIONS, 30-MIN SLOT ENGINE, MAX 2 PLAYS/MEMBER/DAY, DOUBLE-BOOKING PREVENTION
  const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    // 1. Double-booking check: No two bookings for same court, date, overlapping time
    const startMins = parseInt(bookingData.startTime.split(':')[0]) * 60 + parseInt(bookingData.startTime.split(':')[1]);
    const endMins = startMins + bookingData.durationMinutes;

    const overlap = bookings.find(b => {
      if (b.status === 'CANCELLED') return false;
      if (b.courtId !== bookingData.courtId || b.date !== bookingData.date) return false;
      const bStart = parseInt(b.startTime.split(':')[0]) * 60 + parseInt(b.startTime.split(':')[1]);
      const bEnd = bStart + b.durationMinutes;
      return (startMins < bEnd && endMins > bStart);
    });

    if (overlap) {
      return { success: false, message: `Conflict detected: Court is already booked by ${overlap.userName} (${overlap.startTime} - ${overlap.endTime}). Double-booking is strictly prohibited.` };
    }

    // 2. Max 2 plays per member per day check
    if (bookingData.userId) {
      const memberTodayBookings = bookings.filter(b => 
        b.userId === bookingData.userId && 
        b.date === bookingData.date && 
        b.status !== 'CANCELLED'
      );
      if (memberTodayBookings.length >= 2) {
        return { success: false, message: 'Policy Limit Reached: Members are allowed a maximum of 2 court sessions per day.' };
      }
    }

    const newBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setBookings(prev => [newBooking, ...prev]);

    // Automatically record transaction in financial ledger if paid or booking has positive amount
    if (bookingData.amount > 0) {
      recordTransaction({
        source: 'court_booking',
        customerName: bookingData.userName,
        customerEmail: bookingData.userEmail,
        customerPhone: bookingData.userPhone,
        itemName: `${bookingData.courtName} (${bookingData.date} ${bookingData.startTime}-${bookingData.endTime})`,
        amount: bookingData.amount,
        paymentMethod: 'upi_qr',
        upiId: 'anjanabajaniya@okicici',
        referenceId: bookingData.razorpayPaymentId || `UPI-${newBooking.id.toUpperCase()}`,
        status: 'COMPLETED',
        notes: `Court Slot: ${bookingData.sport.toUpperCase()}`
      });
    }

    recordAuditLog({
      actorId: bookingData.userId || 'BOOKING-001',
      actorName: bookingData.userName,
      actorType: 'normal',
      action: 'Court Booking Created',
      category: 'booking',
      details: `${bookingData.courtName} reserved for ${bookingData.date} at ${bookingData.startTime} (₹${bookingData.amount})`
    });

    addNotification({
      title: 'New Booking Confirmed',
      message: `${bookingData.userName} reserved ${bookingData.courtName} on ${bookingData.date} (${bookingData.startTime})`,
      type: 'success',
      authorityScope: 'BOOKING-001'
    });

    return { success: true, message: 'Booking confirmed successfully!', bookingId: newBooking.id };
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b));
    recordAuditLog({
      actorId: 'BOOKING-001',
      actorName: 'Court Desk Officer',
      actorType: 'authority',
      action: 'Booking Cancelled',
      category: 'booking',
      details: `Booking ID ${bookingId} cancelled`
    });
  };

  const checkInBooking = (bookingId: string) => {
    const now = new Date().toTimeString().slice(0, 5);
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CHECKED-IN', checkInTime: now } : b));
    recordAuditLog({
      actorId: 'BOOKING-001',
      actorName: 'Front Desk Attendant',
      actorType: 'authority',
      action: 'Player Checked In',
      category: 'booking',
      details: `Booking ID ${bookingId} checked in at ${now}`
    });
  };

  // Shared Inventory adjustments between Shop & POS
  const adjustProductStock = (productId: string, delta: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newStock = Math.max(0, p.stock + delta);
        if (newStock <= p.lowStockThreshold) {
          addNotification({
            title: 'Critical Low Stock Warning',
            message: `${p.name} remaining stock is now ${newStock} units!`,
            type: 'warning',
            authorityScope: 'SHOP-001'
          });
        }
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  const updateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    // Deduct stock for all items
    orderData.items.forEach(item => {
      adjustProductStock(item.productId, -item.quantity);
    });

    setOrders(prev => [newOrder, ...prev]);

    // Record in transaction audit ledger
    recordTransaction({
      source: 'pro_shop',
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      itemName: orderData.items.map(i => `${i.productName} (x${i.quantity})`).join(', ') || 'Pro Shop Gear Purchase',
      amount: orderData.total,
      paymentMethod: (orderData.paymentMethod === 'card' || orderData.paymentMethod === 'cash') ? orderData.paymentMethod : 'upi_qr',
      upiId: 'anjanabajaniya@okicici',
      referenceId: `ORD-${newOrder.id.toUpperCase()}`,
      status: 'COMPLETED',
      notes: `Pro Shop Merchandise (${orderData.type})`
    });

    recordAuditLog({
      actorId: orderData.userId || 'SHOP-001',
      actorName: orderData.customerName,
      actorType: 'normal',
      action: 'Product Order Placed',
      category: 'inventory',
      details: `Order #${newOrder.id} (${orderData.type}) totaling ₹${orderData.total.toFixed(2)}`
    });

    return newOrder;
  };

  // POS / Bar Tab & Table Management
  const openPosTab = (tableNumber: number, customerName: string, memberTier?: MembershipTier) => {
    const tabId = `tab-${Date.now().toString(36)}`;
    const newTab: POSTab = {
      id: tabId,
      tableNumber,
      customerName,
      memberTier,
      openedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      orders: [],
      total: 0,
      status: 'open'
    };
    setPosTabs(prev => [...prev, newTab]);
    setPosTables(prev => prev.map(t => t.id === tableNumber ? { ...t, status: 'occupied', activeTabId: tabId, guestCount: 2, currentTotal: 0 } : t));
    return tabId;
  };

  const addOrderToTab = (tabId: string, item: string, price: number, qty: number) => {
    const time = new Date().toTimeString().slice(0, 5);
    setPosTabs(prev => prev.map(tab => {
      if (tab.id === tabId) {
        const newOrders = [...tab.orders, { time, item, price, qty }];
        const newTotal = newOrders.reduce((sum, o) => sum + o.price * o.qty, 0);
        return { ...tab, orders: newOrders, total: newTotal };
      }
      return tab;
    }));

    // Also update table current total
    const tab = posTabs.find(t => t.id === tabId);
    if (tab) {
      setPosTables(prev => prev.map(t => t.id === tab.tableNumber ? { ...t, currentTotal: (t.currentTotal || 0) + price * qty } : t));
    }
  };

  const settlePosTab = (tabId: string, paymentMethod: 'cash' | 'card' | 'upi') => {
    const tab = posTabs.find(t => t.id === tabId);
    if (!tab) return;

    setPosTabs(prev => prev.map(t => t.id === tabId ? { ...t, status: 'settled' } : t));
    setPosTables(prev => prev.map(t => t.id === tab.tableNumber ? { ...t, status: 'vacant', activeTabId: undefined, currentTotal: 0 } : t));

    // Record in transaction audit ledger
    recordTransaction({
      source: 'pos_cafe',
      customerName: tab.customerName,
      itemName: `Courtside Café Tab #${tab.tableNumber} (${tab.orders.map(o => `${o.item} x${o.qty}`).join(', ')})`,
      amount: tab.total,
      paymentMethod: paymentMethod === 'card' ? 'card' : paymentMethod === 'cash' ? 'cash' : 'upi_qr',
      upiId: 'anjanabajaniya@okicici',
      referenceId: `TAB-${tab.id.toUpperCase()}`,
      status: 'COMPLETED',
      notes: `Courtside Café / Nutrition Bar Tab Settled`
    });

    // Record invoice/order in system
    recordAuditLog({
      actorId: 'POS-001',
      actorName: 'Barista / F&B Staff',
      actorType: 'authority',
      action: 'POS Tab Settled',
      category: 'finance',
      details: `Table ${tab.tableNumber} (${tab.customerName}) settled ₹${tab.total.toFixed(2)} via ${paymentMethod.toUpperCase()}`
    });
  };

  // CRM
  const createLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'lastContact'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0]
    };
    setLeads(prev => [newLead, ...prev]);
    recordAuditLog({
      actorId: 'CRM-001',
      actorName: 'Lead Generation Agent',
      actorType: 'authority',
      action: 'New Lead Recorded',
      category: 'auth',
      details: `Lead created for ${leadData.name} (${leadData.interest}) value ₹${leadData.value}`
    });
  };

  const updateLeadStatus = (leadId: string, status: Lead['status']) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status, lastContact: new Date().toISOString().split('T')[0] } : l));
  };

  // Events & QR Check-in
  const registerForEvent = (eventId: string, userId: string, userName: string, userEmail: string, userTier: MembershipTier) => {
    const evt = events.find(e => e.id === eventId);
    if (!evt) return { success: false, message: 'Event not found' };
    if (evt.registeredCount >= evt.capacity) return { success: false, message: 'Event has reached full capacity!' };

    const ticketPrice = (userTier === 'gold' || userTier === 'silver') ? evt.ticketPriceMember : evt.ticketPriceRegular;
    const ticketId = `tkt-${Date.now().toString(36)}`;
    const newTicket: EventTicket = {
      id: ticketId,
      eventId: evt.id,
      eventTitle: evt.title,
      userId,
      userName,
      userEmail,
      qrCode: `QR-AF-${evt.id.toUpperCase()}-${ticketId.slice(-6).toUpperCase()}`,
      checkedIn: false,
      paidAmount: ticketPrice,
      purchasedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setEventTickets(prev => [...prev, newTicket]);
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e));

    if (ticketPrice > 0) {
      recordTransaction({
        source: 'event_ticket',
        customerName: userName,
        customerEmail: userEmail,
        itemName: `${evt.title} Event Entry Pass`,
        amount: ticketPrice,
        paymentMethod: 'upi_qr',
        upiId: 'anjanabajaniya@okicici',
        referenceId: ticketId,
        status: 'COMPLETED',
        notes: `Club Tournament / Event Ticket Registration`
      });
    }

    return { success: true, message: `Ticket confirmed for ${evt.title}!`, ticketId };
  };

  const checkInEventTicket = (ticketIdOrQr: string) => {
    const ticket = eventTickets.find(t => t.id === ticketIdOrQr || t.qrCode.toUpperCase() === ticketIdOrQr.toUpperCase());
    if (!ticket) {
      return { success: false, message: 'Invalid QR Ticket: Ticket record not found in system database.' };
    }
    if (ticket.checkedIn) {
      return { success: false, message: `Already Checked In at ${ticket.checkedInAt} for ${ticket.userName}.` };
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setEventTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, checkedIn: true, checkedInAt: now } : t));

    recordAuditLog({
      actorId: 'EVENT-001',
      actorName: 'Event Check-in Scanner',
      actorType: 'authority',
      action: 'QR Ticket Verified & Checked In',
      category: 'security',
      details: `${ticket.userName} checked into ${ticket.eventTitle} (${ticket.qrCode})`
    });

    return { success: true, message: `Check-in verified: Welcome ${ticket.userName}!`, ticket };
  };

  // Invoices & Expenses
  const createInvoice = (inv: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInv: Invoice = {
      ...inv,
      id: `inv-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setInvoices(prev => [newInv, ...prev]);
  };

  const markInvoicePaid = (id: string) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'paid', paidAt: new Date().toISOString().split('T')[0] } : i));
  };

  const createExpense = (exp: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...exp,
      id: `exp-${Date.now().toString(36)}`
    };
    setExpenses(prev => [newExp, ...prev]);
  };

  // Staff Tasks
  const createTask = (tsk: Omit<StaffTask, 'id'>) => {
    const newTask: StaffTask = {
      ...tsk,
      id: `tsk-${Date.now().toString(36)}`
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTaskStatus = (taskId: string, status: StaffTask['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  // Community Elections
  const voteInElection = (electionId: string, candidateId: string) => {
    setElections(prev => prev.map(el => {
      if (el.id === electionId) {
        return {
          ...el,
          totalVotes: el.totalVotes + 1,
          candidates: el.candidates.map(c => c.id === candidateId ? { ...c, votes: c.votes + 1 } : c)
        };
      }
      return el;
    }));
  };

  // =========================================================================
  // MASTER DATA MANAGEMENT FUNCTIONS (CRUD + FIREBASE SYNC + BACKUP)
  // =========================================================================
  const addCourt = (newCourt: Omit<Court, 'id'>) => {
    const id = `crt-${Date.now()}`;
    const court: Court = { ...newCourt, id };
    setCourts(prev => [...prev, court]);
    recordAuditLog({
      actorId: 'ADMIN-001',
      actorName: 'Administrator',
      actorType: 'authority',
      action: `Created new arena court ${court.name} (${court.sport})`,
      category: 'authority',
      details: `Rate: ₹${court.hourlyRate}/hr, Court #${court.courtNumber}`
    });
    return court;
  };

  const updateCourt = (updated: Court) => {
    setCourts(prev => prev.map(c => c.id === updated.id ? updated : c));
    recordAuditLog({
      actorId: 'ADMIN-001',
      actorName: 'Administrator',
      actorType: 'authority',
      action: `Updated court ${updated.name}`,
      category: 'authority',
      details: `Rate: ₹${updated.hourlyRate}, Status: ${updated.status}`
    });
  };

  const deleteCourt = (courtId: string) => {
    setCourts(prev => prev.filter(c => c.id !== courtId));
    recordAuditLog({
      actorId: 'ADMIN-001',
      actorName: 'Administrator',
      actorType: 'authority',
      action: `Removed court arena ${courtId}`,
      category: 'authority',
      details: 'Deleted from sports scheduling engine'
    });
  };

  const toggleCourtMaintenance = (courtId: string) => {
    setCourts(prev => prev.map(c => {
      if (c.id === courtId) {
        const nextStatus = c.status === 'active' ? 'maintenance' : 'active';
        recordAuditLog({
          actorId: 'ADMIN-001',
          actorName: 'Administrator',
          actorType: 'authority',
          action: `Set court ${c.name} to ${nextStatus}`,
          category: 'authority',
          details: 'Court operational status toggled'
        });
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const prod: Product = { ...newProd, id };
    setProducts(prev => [...prev, prod]);
    recordAuditLog({
      actorId: 'SHOP-001',
      actorName: 'Shop Manager',
      actorType: 'authority',
      action: `Added product ${prod.name}`,
      category: 'inventory',
      details: `Stock: ${prod.stock}, Price: ₹${prod.price}`
    });
    return prod;
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const syncToCloudFirebase = async () => {
    return await syncAllSportsDataToFirestore({
      courts,
      bookings,
      products,
      orders,
      posTabs,
      invoices,
      staff,
      leads,
      transactions
    });
  };

  const syncToServerDisk = async () => {
    try {
      const res = await fetch('/api/data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courts,
          bookings,
          products,
          orders,
          transactions,
          posTabs,
          invoices,
          staff,
          leads,
          auditLogs
        })
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, message: data.message, counts: data.counts };
      }
    } catch (err: any) {
      console.warn('Server sync offline, safe local fallback active');
    }
    return { success: false, message: 'Server sync offline, all data preserved in local storage.' };
  };

  const exportDataBackup = () => {
    const backupObj = {
      version: '2026.2',
      exportedAt: new Date().toISOString(),
      courts,
      bookings,
      products,
      orders,
      transactions,
      posTabs,
      invoices,
      expenses,
      leads,
      staff,
      auditLogs
    };
    return JSON.stringify(backupObj, null, 2);
  };

  const importDataBackup = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.courts && Array.isArray(parsed.courts)) setCourts(parsed.courts);
      if (parsed.bookings && Array.isArray(parsed.bookings)) setBookings(parsed.bookings);
      if (parsed.products && Array.isArray(parsed.products)) setProducts(parsed.products);
      if (parsed.orders && Array.isArray(parsed.orders)) setOrders(parsed.orders);
      if (parsed.transactions && Array.isArray(parsed.transactions)) setTransactions(parsed.transactions);
      if (parsed.posTabs && Array.isArray(parsed.posTabs)) setPosTabs(parsed.posTabs);
      if (parsed.invoices && Array.isArray(parsed.invoices)) setInvoices(parsed.invoices);
      if (parsed.expenses && Array.isArray(parsed.expenses)) setExpenses(parsed.expenses);
      if (parsed.leads && Array.isArray(parsed.leads)) setLeads(parsed.leads);
      if (parsed.staff && Array.isArray(parsed.staff)) setStaff(parsed.staff);
      return { success: true, message: 'All sports complex datasets restored successfully from backup!' };
    } catch (err: any) {
      return { success: false, message: `Backup restoration failed: ${err.message}` };
    }
  };

  const resetAllDataToDefaults = () => {
    setCourts(INITIAL_COURTS);
    setBookings(INITIAL_BOOKINGS);
    setProducts(INITIAL_PRODUCTS);
    setOrders([]);
    setTransactions(INITIAL_TRANSACTIONS);
    setPosTables(INITIAL_POS_TABLES);
    setPosTabs([
      {
        id: 'tab-101',
        tableNumber: 1,
        customerName: 'Alexander Wright',
        memberTier: 'silver',
        openedAt: '2026-10-03 12:10',
        orders: [
          { time: '12:12', item: 'Optimum Nutrition Gold Standard Whey Shake', qty: 2, price: 180 },
          { time: '12:25', item: 'Artisan Grilled Chicken High-Protein Sub', qty: 2, price: 220 }
        ],
        total: 800,
        status: 'open'
      },
      {
        id: 'tab-102',
        tableNumber: 3,
        customerName: 'Jonathan Reed',
        memberTier: 'gold',
        openedAt: '2026-10-03 12:20',
        orders: [
          { time: '12:22', item: 'Gatorade Blue Bolt Electrolyte Drink 500ml', qty: 2, price: 50 },
          { time: '12:23', item: 'Yonex Super Grap Overgrip 3-Pack', qty: 1, price: 349 }
        ],
        total: 449,
        status: 'open'
      },
      {
        id: 'tab-103',
        tableNumber: 4,
        customerName: 'Corporate Padel Team (Finova)',
        memberTier: 'none',
        openedAt: '2026-10-03 12:05',
        orders: [
          { time: '12:08', item: 'Gatorade Blue Bolt Electrolyte Drink 500ml', qty: 4, price: 50 },
          { time: '12:15', item: 'Artisan Grilled Paneer & Veggie High-Protein Sub', qty: 4, price: 180 }
        ],
        total: 920,
        status: 'open'
      }
    ]);
    setInvoices(INITIAL_INVOICES);
    setExpenses(INITIAL_EXPENSES);
    setLeads(INITIAL_LEADS);
    setStaff(INITIAL_STAFF);
    localStorage.clear();
  };

  return (
    <DataContext.Provider value={{
      courts,
      bookings,
      products,
      orders,
      transactions,
      posTables,
      posTabs,
      events,
      eventTickets,
      leads,
      businessClients,
      invoices,
      expenses,
      staff,
      tasks,
      auditLogs,
      notifications,
      volunteers,
      fundraisers,
      elections,
      reimbursements,
      firebaseConnected: isConnectedToLiveFirestore,
      recordTransaction,
      createBooking,
      cancelBooking,
      checkInBooking,
      adjustProductStock,
      updateProduct,
      createOrder,
      openPosTab,
      addOrderToTab,
      settlePosTab,
      createLead,
      updateLeadStatus,
      registerForEvent,
      checkInEventTicket,
      recordAuditLog,
      markNotificationRead,
      addNotification,
      voteInElection,
      createInvoice,
      markInvoicePaid,
      createExpense,
      createTask,
      updateTaskStatus,
      addCourt,
      updateCourt,
      deleteCourt,
      toggleCourtMaintenance,
      addProduct,
      deleteProduct,
      syncToCloudFirebase,
      syncToServerDisk,
      exportDataBackup,
      importDataBackup,
      resetAllDataToDefaults
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
