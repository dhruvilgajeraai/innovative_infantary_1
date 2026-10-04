export type AccountType = 'normal' | 'staff' | 'authority' | 'superadmin';

export type AuthorityId = 
  | 'SUPER-001'
  | 'ADMIN-001'
  | 'SALES-001'
  | 'BOOKING-001'
  | 'MEMBER-001'
  | 'SPORT-001'
  | 'SHOP-001'
  | 'POS-001'
  | 'EVENT-001'
  | 'FINANCE-001'
  | 'CRM-001'
  | 'STAFF-001'
  | 'MARKETING-001'
  | 'SERVICE-001'
  | 'CONTENT-001';

export type SportType = 'football' | 'tennis' | 'cricket' | 'badminton' | 'padel' | 'running' | 'pool' | 'volleyball';

export type MembershipTier = 'gold' | 'silver' | 'junior' | 'none';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization?: string;
  accountType: AccountType;
  emailVerified: boolean;
  assignedAuthorities: AuthorityId[];
  activeAuthority?: AuthorityId;
  membershipTier: MembershipTier;
  membershipExpiry?: string;
  avatar?: string;
  createdAt: string;
}

export interface FixedAuthorityConfig {
  id: AuthorityId;
  name: string;
  description: string;
  department: string;
  email: string;
  color: string;
  icon: string;
  defaultRoute: string;
  permissions: string[];
  assignedUserIds: string[];
  isActive: boolean;
  lastLogin?: string;
}

export type BookingStatus = 'AVAILABLE' | 'HELD' | 'BOOKED' | 'CHECKED-IN' | 'COMPLETED' | 'CANCELLED' | 'NO-SHOW';

export interface Court {
  id: string;
  name: string;
  sport: SportType;
  courtNumber: number;
  indoor: boolean;
  hourlyRate: number;
  memberHourlyRate: number;
  status: 'active' | 'maintenance';
}

export interface Booking {
  id: string;
  courtId: string;
  courtName: string;
  sport: SportType;
  userId: string;
  userName: string;
  userEmail: string;
  userTier: MembershipTier;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number; // 60
  amount: number;
  status: BookingStatus;
  paymentStatus?: 'UNPAID' | 'PAID';
  razorpayPaymentId?: string;
  userPhone?: string;
  isSocialPlay?: boolean;
  checkInTime?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'rackets' | 'balls' | 'shoes' | 'accessories' | 'apparel' | 'beverages' | 'snacks';
  price: number;
  memberPrice: number;
  stock: number;
  lowStockThreshold: number;
  image: string;
  sport?: SportType;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  memberTier?: MembershipTier;
  fulfillmentType?: 'pickup' | 'delivery';
  deliveryAddress?: string;
  type: 'online' | 'counter' | 'pos_bar';
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'upi_qr' | 'upi_gpay' | 'upi_phonepe' | 'upi_paytm' | 'upi_bhim' | 'tab' | 'razorpay';
  paymentStatus: 'paid' | 'completed' | 'pending' | 'tab_open';
  tableNumber?: number;
  tabId?: string;
  createdAt: string;
}

export interface TransactionRecord {
  id: string;
  source: 'court_booking' | 'pro_shop' | 'pos_cafe' | 'membership' | 'event_ticket' | 'invoice';
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  itemName: string;
  amount: number;
  paymentMethod: 'upi_qr' | 'upi_id' | 'upi_gpay' | 'upi_phonepe' | 'upi_paytm' | 'upi_bhim' | 'card' | 'cash';
  upiId?: string;
  referenceId: string;
  status: 'COMPLETED' | 'PENDING' | 'REFUNDED';
  timestamp: string;
  notes?: string;
}

export interface POSTable {
  id: number;
  name: string;
  capacity: number;
  status: 'vacant' | 'occupied' | 'reserved';
  activeTabId?: string;
  guestCount?: number;
  currentTotal?: number;
}

export interface POSTab {
  id: string;
  tableNumber: number;
  customerName: string;
  memberTier?: MembershipTier;
  openedAt: string;
  orders: {
    time: string;
    item: string;
    qty: number;
    price: number;
  }[];
  total: number;
  status: 'open' | 'settled';
}

export interface ClubEvent {
  id: string;
  title: string;
  description: string;
  sport: SportType | 'all';
  date: string;
  time: string;
  location: string;
  capacity: number;
  registeredCount: number;
  ticketPriceRegular: number;
  ticketPriceMember: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  organizer: string;
}

export interface EventTicket {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  qrCode: string;
  checkedIn: boolean;
  checkedInAt?: string;
  paidAmount: number;
  purchasedAt: string;
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'TRIAL' | 'PROPOSAL' | 'CONVERTED' | 'LOST';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: SportType | 'membership' | 'corporate' | 'trial';
  status: LeadStatus;
  notes: string;
  value: number;
  assignedStaff: string;
  createdAt: string;
  lastContact: string;
}

export interface BusinessClient {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  contractType: 'Corporate Tournaments' | 'Annual Court Booking' | 'Employee Wellness' | 'Sponsorship';
  annualValue: number;
  status: 'Active' | 'Under Review' | 'Proposal Sent';
  startDate: string;
  endDate: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientOrMemberName: string;
  type: 'membership' | 'court_hire' | 'corporate' | 'shop_bulk' | 'event_sponsorship';
  amount: number;
  tax: number;
  total: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidAt?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  category: 'maintenance' | 'utilities' | 'equipment' | 'payroll' | 'marketing' | 'hospitality';
  title: string;
  amount: number;
  recordedBy: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Head Coach' | 'Assistant Coach' | 'Front Desk Officer' | 'Barista & F&B' | 'Groundskeeper' | 'Fitness Trainer';
  sport?: SportType;
  email: string;
  phone: string;
  shift: 'Morning (06:00 - 14:00)' | 'Evening (14:00 - 22:00)' | 'Full Day';
  status: 'on_duty' | 'off_duty' | 'leave';
  attendanceRate: number;
}

export interface StaffTask {
  id: string;
  title: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'completed';
  dueDate: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  category: 'booking' | 'membership' | 'facilities' | 'billing' | 'gear_shop';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  message: string;
  response?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorType: AccountType;
  action: string;
  category: 'auth' | 'booking' | 'membership' | 'finance' | 'authority' | 'inventory' | 'security';
  details: string;
  ipAddress?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  authorityScope?: AuthorityId | 'all' | 'user';
  userId?: string;
  read: boolean;
  createdAt: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  eventAssigned?: string;
  status: 'active' | 'available' | 'inactive';
  hoursLogged: number;
}

export interface Fundraiser {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  donorCount: number;
  deadline: string;
}

export interface Election {
  id: string;
  title: string;
  role: string;
  candidates: {
    id: string;
    name: string;
    votes: number;
    bio: string;
  }[];
  totalVotes: number;
  status: 'active' | 'closed';
  endDate: string;
}

export interface ReimbursementRequest {
  id: string;
  staffName: string;
  title: string;
  amount: number;
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}
